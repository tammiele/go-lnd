# Multiple databases in Rails
As an application grows in popularity and usage you’ll need to scale the application to support your new users and their data. One way in which your application may need to scale is on the database level. Rails now has support for multiple databases so you don’t have to store your data all in one place.
Rails 6.0 recently shared its amazing enhancements although most would consider these as feature upgrades. In my opinion, both are correct, as the actual state of multiple databases before rails 6.0 was not even considered it a completed feature.
### Table of content
1. Setting up your application
2. Migrations
3. Connection switching
4. Sharding
### Setting up your application
While Rails tries to do most of the work for you there are still some steps you’ll need to do to get your application ready for multiple databases.
The `database.yml` looks like this:
```
production:
  database: my_primary_database
  user: root
  adapter: mysql
 ```
Moreover, to add replica we need to change our `database.yml` to become like this
```
production:
  primary:
    database: my_primary_database
    user: root
    adapter: mysql
  primary_replica:
    database: my_primary_database
    user: root_readonly
    adapter: mysql
    replica: true
  animals:
    database: my_animals_database
    user: animals_root
    adapter: mysql
    migrations_paths: db/animals_migrate
  animals_replica:
    database: my_animals_database
    user: animals_readonly
    adapter: mysql
    replica: true
```
There are some notes that you need to be concerned on when setting up multiple databases:
- The database name for the primary and replica should be the same because they contain the same data
- The username for the primary and replica should be different, and the replica user’s permissions should be to read and not write.
- When using a replica database you need to add a replica: true entry to the replica in the `database.yml`
- For new primary databases you need to set the `migrations_paths` to the directory where you will store migrations for that database
Now that we have a new database, let’s set up the model. In order to use the new database we need to create a new abstract class and connect to the animals databases.
```
class AnimalsBase < ApplicationRecord
  self.abstract_class = true
  connects_to database: { writing: :animals, reading: :animals_replica }
end
```
Then we need to update ApplicationRecord to be aware of our new replica.
```
class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true
  connects_to database: { writing: :primary, reading: :primary_replica }
end
```
Running a command like `rails db:create` will create both the primary and animals databases. If you want to create just the animals database you can run `rails db:create:animals`.
### Migrations
Migrations for multiple databases should live in their own folders prefixed with the name of the `database` key in the configuration.
In case you want to store the migrations in another folder, you will need to set the `migrations_paths` in the database configurations to tell Rails where to find the migrations.
For example the animals database would look in the `db/animals_migrate` directory and primary would look in `db/migrate`. Rails generators now take a `--database option` so that the file is generated in the correct directory. The command can be run like so:
```
$ rails g migration CreateDogs name:string --database animals
```
### Connection switching
Finally, in order to use the read-only replica in your application you’ll need to activate the middleware for automatic switching.
Automatic switching allows the application to switch from the primary to replica or replica to primary based on the HTTP verb and whether there was a recent write.
If the application is receiving a POST, PUT, DELETE, or PATCH request the application will automatically write to the primary. For the specified time after the write the application will read from the primary. For a GET or HEAD request the application will read from the replica unless there was a recent write.
To activate the automatic connection switching middleware, add or uncomment the following lines in your application config.
```
config.active_record.database_selector = { delay: 2.seconds }
config.active_record.database_resolver = ActiveRecord::Middleware::DatabaseSelector::Resolver
config.active_record.database_resolver_context = ActiveRecord::Middleware::DatabaseSelector::Resolver::Session
```
Or you can do it manually by
```
ActiveRecord::Base.connected_to(role: :reading) do
  # all code in this block will be connected to the reading role
end
```
### Sharding
Rails 6.0 doesn’t (yet) support sharding. But from version 7.0 and beyond, you can use `Horizontal sharding` with multiple databases.
> Horizontal sharding is when you split up your database to reduce the number of rows on each database server, but maintain the same schema across “shards”. This is commonly called “multi-tenant” sharding.
Shards are declared in the three-tier config like this:
```
production:
  primary:
    database: my_primary_database
    adapter: mysql2
  primary_replica:
    database: my_primary_database
    adapter: mysql2
    replica: true
  primary_shard_one:
    database: my_primary_shard_one
    adapter: mysql2
  primary_shard_one_replica:
    database: my_primary_shard_one
    adapter: mysql2
    replica: true
```
Models are then connected with the connects_to API via the shards key:
```
class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true
  connects_to shards: {
    default: { writing: :primary, reading: :primary_replica },
    shard_one: { writing: :primary_shard_one, reading: :primary_shard_one_replica }
  }
end
```
Applications are able to automatically switch shards per request using the provided middleware.
`The ShardSelector Middleware` provides a framework for automatically swapping shards. Rails provides a basic framework to determine which shard to switch to and allows for applications to write custom strategies for swapping if needed.  
