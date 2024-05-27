# Demonstration - Creating a NodeJS Server and Custom AMI

Start an EC2 instance

- allow SSH from anywhere
- choose existing key pair `clf-01.pem`
- allow HTTP traffic from internet

SSH into the instance and set up software

```bash
ssh -i "clf-01.pem" ec2-user@ec2-3-80-81-206.compute-1.amazonaws.com

sudo yum update -y

# add rule to the PREROUTING chain
# nat table is used for Network Address Translation
# eth0 is the network interface where the rule will apply
# destination port 80 for HTTP traffic
# redirect to 8080
sudo yum install iptables -y
sudo iptables --version
sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080

sudo iptables -t nat -L PREROUTING -v -n

# accept input (source port) and output (destination port) on port 80
sudo iptables -A INPUT -p tcp -m tcp --sport 80 -j ACCEPT
sudo iptables -A OUTPUT -p tcp -m tcp --dport 80 -j ACCEPT
```

install nvm, clone code, and start server

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
export NVM_DIR="/home/ec2-user/.nvm"

# activate nvm
. ~/.nvm/nvm.sh

nvm install 8
node --version
npm install express -g
sudo yum install git -y
git --version

# pull sample code
git clone https://github.com/shawlu95/aws-certification.git
cd aws-certifications/lab_nodejs_ami
npm install

# listening on 8080
# npm start
# kill -9 $(lsof -t -i:8080)

# start server and print debug log
DEBUG=node-js-sample:* npm start
```

We have a nodejs app listening on 8080. But we are accepting traffic on port 80. The ip table redirects traffic from 80 to 8080.

Go to public IP and access the app

## Debug

```bash
# Ensure that your Node.js application is running and listening on port 8080:
netstat -tuln | grep 8080

# test app is running, from SSH shell
curl http://localhost:8080

curl http://3.95.59.134:8080

# Review all iptables rules to ensure they are set up correctly:
sudo iptables -t nat -L -v -n
sudo iptables -L -v -n
```

## Create AMI

1. select EC2 instance, click Action -> Image -> Create Image
2. name the image and click "Create Image" (not launch template)
3. click "view pending image"
4. wait for a while, and go to "AMIs" in EC2 dashboard
5. optional: modify image permission to public, which become searchable in community
6. click image, Actions -> Copy AMI -> select destination region
7. go to the new region and launch EC2 using t he image

```bash
# change permission to read/write for owner
chmod 600 clf-ohio.pem

# ssh into ec2 created from custom ami
ssh -i "clf-ohio.pem" ec2-user@ec2-18-191-193-233.us-east-2.compute.amazonaws.com

sudo su

# install dependencies
cd /root/aws-certifications/lab_nodejs_ami/

# not sure why still need this
nvm install 8

npm start
```
