
#!/usr/bin/env bash
set -x
set -e
#########################
# Edit the changelog in intstream-X.X/debian/changelog first
#########################
if [ -z "$1" ]
  then
    echo "No version X.X"
    exit 1
fi

VERSION="$1"

cd ../..

tar -czf intstream.tar.gz --exclude=*.pyc

git clone intstreamdeb 

cd intstreamdeb

cp -r intstreamdeb/intstream-X.X intstreamdeb/intstream-$VERSION

tar -xzf intstream.tar.gz --directory ./intstreamdeb/intstream-$version/opt

cd intstreamdeb/intstream-$VERSION

dpkg-buildpackage -uc -us
