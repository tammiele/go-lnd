# 01 - Simple PHP Website

## Content
![Content](images/content.png?raw=true "Content")

### Create Instance
1. Login to AWS and search for ec2 service
    ![Search for ec2 service](images/search-for-ec2-service.png?raw=true "Search for ec2 service")

2. Launch instance
    > Notes: This demo uses Ubuntu image, create your own key pair to connect to server

    ![Launch instance button](images/launch-instance-button.png?raw=true "Launch instance button")

    ![Launch instance page](images/launch-instance-page.png?raw=true "Launch instance page")

    ![Launch instance success](images/launch-instance-success.png?raw=true "Launch instance success")

    ![Instance detail](images/instance-detail.png?raw=true "Instance detail")

3. Instance security group
    > Notes: Should open port 80(HTTP, inbound rules) to access webpage from browser

    ![Instance security group](images/instance-security-group.png?raw=true "Instance security group")

    ![Edit inbound rules](images/edit-inbound-rules.png?raw=true "Edit inbound rules")

4. Connect to instance
    ![Connect to instance page](images/connect-to-instance-using-ssh-client.png?raw=true "Connect to instance page")

    ![Connect to instance terminal](images/connect-to-instance-terminal.png?raw=true "Connect to instance terminal")

### Set up Apache and PHP
1. Set up Apache
    > Notes: [How To Set Up Apache Virtual Hosts on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-apache-virtual-hosts-on-ubuntu-20-04)

    ![Install Apache success](images/install-apache-success.png?raw=true "Install Apache success")

2. Set up PHP
    > Notes: [Install the latest PHP on Ubuntu 22.04](https://linuxhint.com/install-latest-php-ubuntu22-04/)

    ![Install PHP success](images/install-php-success.png?raw=true "Install PHP success")

### Pull sample php website and set up virtual host
1. Pull [sample php website](https://github.com/banago/simple-php-website)
    > Notes: Clone the repo in /var/www folder

2. Set up virtual host
    > Notes: Can follow the Apache setup document

    ![Set up virtual host](images/setup-virtual-host.png?raw=true "Set up virtual host")

3. Check your deployment
    ![Deploy application success](images/deploy-application-success.png?raw=true "Deploy application success")