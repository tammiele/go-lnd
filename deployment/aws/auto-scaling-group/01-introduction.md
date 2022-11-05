# Auto Scaling Group (ASG)
## What's an Auto Scaling Group?
- In real-life, the load on your website and application can change
- In the cloud, you can create and get rid of servers very quickly
- The goal of an ASG is to:
    - Scale out (add EC2 instances) to match an increased load
    - Scale in (remove EC2 instances) to match a decreased load
    - Ensure we have a minimum and a maximum number of EC2 instances running
    - Automatically register new instances to load balancer
    - Re-create an EC2 instance in case a previous one is terminated (ex: if unhealthy)
- ASG are free (you only pay for the underlying EC2 instances)
## Auto Scaling Group in AWS
![ASG in AWS](assets/asg-in-aws.png?raw=true "ASG in AWS")
## Auto Scaling Group in AWS With Load Balancer
![ASG in AWS with Load Balancer](assets/asg-in-aws-with-lb.png?raw=true "ASG in AWS with Load Balancer")
## Auto Scaling Group Attributes
- A Launch Template
    - AMI + Instance Type
    - EC2 User Data
    - EBS Volumes
    - Security Groups
    - SSH Key Pair
    - AMI Roles for your EC2 Instances
    - Network + Subnets Information
    - Load Balancer Information
- Min Size / Max Size / Initial Capacity
- Scaling Policies
## Auto Scaling - CloudWatch Alarms & Scaling
- It is possible to scale an ASG based on CloudWatch alarms
- An alarm monitors a metric (such as Average CPU, or a custom metric)
- Metrics such as Average CPU are computed for the overall ASG instances
- Based on the alarm:
    - We can create scale-out policies (increase the number of instances)
    - We can create scale-in policies (decrease the number of instances)

![ASG in AWS with CloudWatch](assets/asg-in-aws-with-cloudwatch.png?raw=true "ASG in AWS with CloudWatch")