## EBS Lab

- add EBS storage when spinning up EC2,
- in production do not check "delete on termination", but for this lab, check it to avoid getting billed

```bash
ssh -i "clf-01.pem" ec2-user@ec2-54-91-155-41.compute-1.amazonaws.com

# check all volume (not yet mounted)
lsblk

# there's no file system on xvdb
sudo file -s /dev/xvdb

# create file system
sudo mkfs -t ext4 /dev/xvdb

# check again, note down UUID (to be used later)
sudo file -s /dev/xvdb

# make a directory to use as mount point
sudo mkdir /data

# mount volume to /data
sudo mount /dev/xvdb /data

# auto-mount when instance start

# backup a file
sudo cp /etc/fstab /etc/fstab.orig

sudo nano /etc/fstab

# add this line to fstab
UUID=cbe5f720-2831-4fa5-9077-3d8c8e21acb0       /data   ext4    defaults,nofail 0       2

# mount
sudo mount -a

cd /data

sudo touch test.txt
ls
```

Next, create a snapshot of EBS, and use the snapshot to launch another instance

- go to the instance detail, click storage, and fine the ID of the attached volume
- click into the volume, check the volume, Action -> Create Snapshot
- DEPRECATED: go to Snapshots tab, click the snapshot, Action -> Create Volume from Snapshot
- create another EC2 instance, using the **SNAPSHOT** to attach a volume

```bash
ssh -i "clf-01.pem" ec2-user@ec2-52-91-58-58.compute-1.amazonaws.com

# should see xvdb
lsblk

# should see existing file system, with same UUID as before
sudo file -s /dev/xvdb

# backup a file
sudo cp /etc/fstab /etc/fstab.orig

sudo nano /etc/fstab

# add this line to fstab
UUID=cbe5f720-2831-4fa5-9077-3d8c8e21acb0       /data   ext4    defaults,nofail 0       2

sudo mkdir /data

# mount
sudo mount -a

cd /data

# should see test.txt
ls
```
