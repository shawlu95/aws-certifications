# Demonstration - Creating a NodeJS Server and Custom AMI

Start an EC2 instance

- allow SSH from anywhere
- choose existing key pair `clf-01.pem`
- allow HTTP traffic from internet (port 80)

SSH into the instance and set up software

Instead of messing with iptables, we use `sudo su -` which allows us to start the app on port 80.

install nvm, clone code, and start server

```bash
sudo su -

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
git clone https://github.com/shawlu95/aws-certifications.git
cd aws-certifications/lab_nodejs_ami
npm install

# listening on 80
npm start
kill -9 $(lsof -t -i:80)

```

Go to public IP and access the app

## Debug

```bash
# Ensure that your Node.js application is running and listening on port 80:
netstat -tuln | grep 80

# test app is running, from SSH shell
curl http://localhost:80

curl http://34.228.71.12:80
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
