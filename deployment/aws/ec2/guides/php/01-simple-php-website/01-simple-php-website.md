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
Apache is available within Ubuntu’s default software repositories, making it possible to install it using conventional package management tools.

Begin by updating the local package index to reflect the latest upstream changes:
```
sudo apt update
```
Then, install the apache2 package:
```
sudo apt install apache2
```
#### Adjusting the Firewall
Before testing Apache, it’s necessary to modify the firewall settings to allow outside access to the default web ports. If you followed the instructions in the prerequisites, you should have a UFW firewall configured to restrict access to your server.

During installation, Apache registers itself with UFW to provide a few application profiles that can be used to enable or disable access to Apache through the firewall.

List the ufw application profiles by running the following:
```
sudo ufw app list
```
Your output will be a list of the application profiles:
```
Available applications:
  Apache
  Apache Full
  Apache Secure
  OpenSSH
```
As indicated by the output, there are three profiles available for Apache:
- `Apache`: This profile opens only port `80` (normal, unencrypted web traffic)
- `Apache Full`: This profile opens both port `80` (normal, unencrypted web traffic) and port 443 (TLS/SSL encrypted traffic)
- `Apache Secure`: This profile opens only port `443` (TLS/SSL encrypted traffic)

It is recommended that you enable the most restrictive profile that will still allow the traffic you’ve configured. Since you haven’t configured SSL for your server yet in this guide, you’ll only need to allow traffic on port 80:
```
sudo ufw allow 'Apache'
```
You can verify the change by checking the status:
```
sudo ufw status
```
The output will provide a list of allowed HTTP traffic:
```
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere                  
Apache                     ALLOW       Anywhere                
OpenSSH (v6)               ALLOW       Anywhere (v6)             
Apache (v6)                ALLOW       Anywhere (v6)
```
#### Checking your Web Server
At the end of the installation process, Ubuntu 22.04 starts Apache. The web server will already be up and running.

Make sure the service is active by running the command for the `systemd` init system:
```
sudo systemctl status apache2
```
The output should be similar to this:
```
 apache2.service - The Apache HTTP Server
     Loaded: loaded (/lib/systemd/system/apache2.service; enabled; vendor preset: enabled)
     Active: active (running) since Thu 2022-09-22 07:44:05 UTC; 1 week 4 days ago
       Docs: https://httpd.apache.org/docs/2.4/
    Process: 86966 ExecReload=/usr/sbin/apachectl graceful (code=exited, status=0/SUCCESS)
   Main PID: 17957 (apache2)
      Tasks: 9 (limit: 1143)
     Memory: 24.7M
        CPU: 1min 1.104s
     CGroup: /system.slice/apache2.service
             ├─17957 /usr/sbin/apache2 -k start
             ├─86972 /usr/sbin/apache2 -k start
             ├─86973 /usr/sbin/apache2 -k start
             ├─86974 /usr/sbin/apache2 -k start
             ├─86975 /usr/sbin/apache2 -k start
             ├─86976 /usr/sbin/apache2 -k start
             ├─86977 /usr/sbin/apache2 -k start
             ├─87185 /usr/sbin/apache2 -k start
             └─88180 /usr/sbin/apache2 -k start
```
#### Clone sample PHP website
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
- [Sample PHP website repo](https://github.com/banago/simple-php-website)