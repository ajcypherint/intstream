set -x
set -e
#!/usr/bin/env bash

#todo create system instream user

RELEASE=unknown

version=$( lsb_release -r | grep -oP "[0-9]+" | head -1 )
if lsb_release -d | grep -q "CentOS"; then
    RELEASE=centos$version
elif lsb_release -d | grep -q "Ubuntu"; then
    RELEASE=ubuntu$version
fi

echo $RELEASE

if [ -z "$1" ]
  then
    echo "No dns_name"
    exit 1
fi

dns_name="$1"
cd ../..
#standalone installation script
base_dir=$(pwd)
echo "------"
echo "create media dir"
mkdir "$base_dir/intstream/media"

# prep
echo "------"
echo " updating"
sudo apt-get update

#python
echo "------"
echo " install pipenv"
if [ $RELEASE == "ubuntu20" ]; then
  sudo add-apt-repository ppa:deadsnakes/ppa
  sudo apt-get update
  sudo apt-get install python3.6
  sudo apt-get install python3.6-dev
  sudo pip3 install pipenv
elif [ $RELEASE == "ubuntu18" ]; then
  sudo apt-get update
  sudo apt-get install python3
  sudo apt-get install python3-dev
  sudo pip3 install pipenv 
else
  echo "invalid os"
  exit 1
fi

echo "------"
echo " install dependencies"
cd "$base_dir/intstream/"
pipenv --python /usr/bin/python3.6 
pipenv install
venvpath="$(pipenv --venv)"

echo "------"
echo " redis setup"
sudo apt-get install -y redis-server
sudo systemctl enable redis-server


echo "------"
echo " postgres setup"
#postgres
sudo apt-get -qq install postgresql
sudo systemctl restart postgresql 
password=$(trap - PIPE ; cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1) 
#todo(aj) dump password to environment file;

# Don't change if user exists will break packaging
# if user exists just change the password
res=`sudo -u postgres psql -U postgres -d postgres -tc "SELECT 1 FROM pg_user WHERE usename = 'intstream'" | grep -q 1;echo $?`
if [ "$res" -eq "0" ]; then
    echo "updating intstream user password"
    sudo -u postgres psql -U postgres -d postgres -c "alter user intstream with password '$password';"
else
# ONLY create first time. 
    echo "creating intstream user"
    sudo -u postgres psql -U postgres -d postgres -c "CREATE ROLE intstream LOGIN PASSWORD '$password';"
fi

resdb=`sudo -u postgres psql -U postgres -c "SELECT FROM pg_database WHERE datname = 'intstream'" | grep -q 1;echo $?`
if [ "$resdb" -eq "0" ]; then
    echo "database intstream exists"
else
    echo "create database intstream"
    sudo -u postgres psql -U postgres -c "create database intstream";
fi

# conf file in deb; to avoid rewriting
echo "------"
echo " gunicorn setup"
#gunicorn
curdir=$(pwd) #base dir + intstream

email_host=${EMAIL_HOST:=""}
email_port=${EMAIL_PORT:=""}
email_host_user=${EMAIL_HOST_USER:=""}
email_host_password=${EMAIL_HOST_PASSWORD:=""}
#change to use a single environment file instead; that way this won't get stomped.
#change $USER to a specific user we create; like intstream
sed -e "s/\${postgres_pw}/$password/g" \
    -e "s/\${user}/$USER/g" \
    -e "s/\${email_host}/$email_host/g"  \
    -e "s/\${email_port}/$email_port/g"  \
    -e "s/\${email_user}/$email_user/g"  \
    -e "s/\${email_host_password}/$email_host_password/g"  \
    -e "s/\${cwd}/${curdir//\//\\/}\/backend\//g" \
    -e "s/\${venvpath}/${venvpath//\//\\/}/g" ./utility/gunicorn > ./utility/gunicorn_new
sudo cp ./utility/gunicorn_new /etc/systemd/system/gunicorn.service
sudo systemctl daemon-reload
sudo systemctl restart gunicorn
sudo systemctl enable gunicorn

#change to use an configuration file instead; that way this won't get stomped.
#change cwd to a static dir
#change $USER to a specific user we create; like intstream
echo "------"
echo " celery beat setup"
sed -e  "s/\${postgres_pw}/$password/g" -e "s/\${user}/$USER/g" -e "s/\${cwd}/${curdir//\//\\/}\/backend\//g" -e "s/\${venvpath}/${venvpath//\//\\/}/g" ./utility/celerybeat > ./utility/celerybeat_new
sudo cp ./utility/celerybeat_new /etc/systemd/system/celerybeat.service
sudo systemctl daemon-reload
sudo systemctl restart celerybeat
sudo systemctl enable celerybeat

#change to use an configuration file instead; that way this won't get stomped.
#change cwd to a static dir
#change $USER to a specific user we create; like intstream
echo "------"
echo " celery worker setup"
sed -e  "s/\${postgres_pw}/$password/g" -e "s/\${user}/$USER/g" -e "s/\${cwd}/${curdir//\//\\/}\/backend\//g" -e "s/\${venvpath}/${venvpath//\//\\/}/g" ./utility/celeryworker > ./utility/celeryworker_new
sudo cp ./utility/celeryworker_new /etc/systemd/system/celeryworker.service
sudo systemctl daemon-reload
sudo systemctl restart celeryworker
sudo systemctl enable celeryworker

#change to use an configuration file instead; that way this won't get stomped.
#change cwd to a static dir
#change $USER to a specific user we create; like intstream
echo "------"
echo " nginx setup"
#nginx
sudo apt-get -qq install nginx
sed -e "s/\${server_name}/server_name $dns_name/g" -e "s/\${cwd}/${curdir//\//\\/}/g" ./utility/intstream > ./utility/intstream_new
sudo cp ./utility/intstream_new /etc/nginx/sites-available/$dns_name
sudo ln -sf /etc/nginx/sites-available/$dns_name /etc/nginx/sites-enabled/$dns_name
sudo systemctl restart nginx


echo "------"
echo " create database"
export PASSWORD="$password"
cd "$base_dir/intstream/backend/"
pipenv run python manage.py migrate
echo "------"
echo " create celery cache backend"
pipenv run python manage.py migrate django_celery_results
pipenv run python manage.py createcachetable

echo "------"
echo " create secret key"
pipenv run python manage.py generate_secret_key --replace 

echo "------"
echo " collect static for backend to $base_dir/intstream/backend/"
pipenv run python manage.py collectstatic

echo "------"
echo " nvm install"
sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" 
nvm install 11.6.0

echo "------"
echo " npm install"
cd "$base_dir/intstream/frontend/"
npm install

echo "------"
echo " npm build"
npm run build

#todo move file to /etc/rc.local
sudo bash -c 'cat "$0/intstream/utility/rc.local" >> /etc/rc.local' $base_dir

# pyspark requires java 1.8 
sudo apt -qq install  openjdk-8-jdk
#https://stackoverflow.com/questions/53583199/pyspark-error-unsupported-class-file-major-version-55
sudo update-alternatives --set java /usr/lib/jvm/java-8-openjdk-amd64/jre/bin/java
