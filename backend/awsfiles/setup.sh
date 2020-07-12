#!/bin/bash
set -x

# Parse arguments
s3_bucket="$1"
s3_bucket_script="$s3_bucket/script.tar.gz"

# Download compressed script tar file from S3
aws s3 cp $s3_bucket_script /home/hadoop/script.tar.gz

# Untar file
tar zxvf "/home/hadoop/script.tar.gz" -C /home/hadoop/
python --version
# Install requirements for Python script
sudo /usr/bin/python3 -m pip install cython
echo "finished cython"
sudo /usr/bin/python3 -m pip install -r /home/hadoop/requirements.txt
echo "cat requirements"
cat /home/hadoop/requirements.txt
echo "finished requirements"
