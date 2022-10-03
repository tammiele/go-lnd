# Deploy a simple PHP website with AWS

### Step 1: Create EC2 instance
Search for EC2 services and click on `Launch instances`. Use Ubuntu as the server OS, create your own key pair, use `t2.micro` as the instance type (free for new users), and leave all fields at their default settings.

![Search for ec2 service and launch instance](images/search-for-ec2.png?raw=true "Search for ec2 service and launch instance")

![Launch instance form](images/launch-instance.png?raw=true "Launch instance form")

### Step 2: Connect to the instance
After creating the instance successfully, go to the instance dashboard, choose your one, and click on `Actions` -> `Connect`.
![Connect to the instance](images/connect-to-instance.png?raw=true "Connect to the instance")

### Step 3: Install software
#### Install Apache
Use these commands to pull a simple PHP website repo
```
cd /var/www/
git clone https://github.com/banago/simple-php-website
```
#### Granting permissions
You’ve created the directory structure for your files, but they are owned by the root user. If you want your regular user to be able to modify files in these web directories, you can change the ownership with these commands:
```
sudo chown -R $USER:$USER /var/www/simple-php-website
```
The $USER variable will take the value of the user you are currently logged in as when you press ENTER. By doing this, the regular user now owns the public_html subdirectories where you will be storing your content.

You should also modify your permissions to ensure that read access is permitted to the general web directory and all of the files and folders it contains so that the pages can be served correctly:
```
sudo chmod -R 755 /var/www
```
#### Creating New Virtual Host Files
Virtual host files are the files that specify the actual configuration of your virtual hosts and dictates how the Apache web server will respond to various domain requests.

Apache comes with a default virtual host file called `000-default.conf`. You can copy this file to create virtual host files for each of your domains.

Copy the default configuration file over to your domain:
```
sudo cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/simple-php-website.conf
```
Be aware that the default Ubuntu configuration requires that each virtual host file end in .conf.

Open the new file in your preferred text editor with root privileges:
```
sudo nano /etc/apache2/sites-available/simple-php-website.conf
```
With comments removed, the file will be similar to this:
```
<VirtualHost *:80>
    ...
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/simple-php-website
    ...
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
    ...
</VirtualHost>
```
#### Enabling the New Virtual Host Files
Now that you have created your virtual host files, you must enable them. Apache includes some tools that allow you to do this.

You’ll be using the a2ensite tool to enable each of your sites. If you would like to read more about this script, you can refer to the a2ensite documentation.

Use the following commands to enable your virtual host sites:
```
sudo a2ensite simple-php-website.conf
```
There will be output for you site, similar to the example below, reminding you to reload your Apache server:
```
Enabling site example.com.
To activate the new configuration, you need to run:
  systemctl reload apache2
```
Before reloading your server, disable the default site defined in 000-default.conf by using the a2dissite command:
```
sudo a2dissite 000-default.conf
```
The output should be:
```
Site 000-default disabled.
To activate the new configuration, you need to run:
  systemctl reload apache2
```
Next, test for configuration errors:
```
sudo apache2ctl configtest
```
The should receive the following output:
```
. . .
Syntax OK
```
When you are finished, restart Apache to make these changes take effect.
```
sudo systemctl restart apache2
```
Optionally, you can check the status of the server after all these changes with this command:
```
sudo systemctl status apache2
```
#### Install PHP
Update the system
```
sudo apt update && sudo apt upgrade -y
```
Install Dependencies
```
sudo apt install software-properties-common apt-transport-https -y
```
Import PPA Repository of PHP
```
sudo add-apt-repository ppa:ondrej/php -y
```
Install Apache module
```
sudo apt install php8.1 libapache2-mod-php8.1
```
After this, you would require to start your Apache server again so that the new PHP module is loaded.
```
sudo systemctl restart apache2
```
To evaluate its status.
```
sudo systemctl status apache2
```
Verify the installation
```
php --version
```
### Step 4: Update security group rules
Select your instance, click on `Security` tab -> click on `your_security_group` -> add inbound rule `port 80`

![Edit inbound rule](images/edit-inbound-rule.png?raw=true "Edit inbound rule")
### Step 5: Check your deployment
Go to `http://your_public_ipv4_address`

![Check your deployment](images/check-your-deployment.png?raw=true "Check your deployment")


### References:
- [How To Install the Apache Web Server on Ubuntu 22.04](https://www.digitalocean.com/community/tutorials/how-to-install-the-apache-web-server-on-ubuntu-22-04)
- [Install the latest PHP on Ubuntu 22.04](https://linuxhint.com/install-latest-php-ubuntu22-04/)