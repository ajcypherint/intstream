set -x
set -e

if [ -z "$1" ]
  then
    echo "No dns_name"
    exit 1
fi

dns_name="$1"
cd ../..
#standalone installation script
base_dir=$(pwd)

# prep
echo "------"
echo " updating"
sudo apt-get update

#python
echo "------"
echo " install pipenv"
sudo apt-get -qq install python
sudo apt-get -qq install python3-pip
sudo pip3 install pipenv

echo "------"
echo " install dependencies"
cd "$base_dir/intstream/"
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
# if user exists just change the password
res=`sudo -u postgres psql -U postgres -d postgres -tc "SELECT 1 FROM pg_user WHERE usename = 'intstream'" | grep -q 1;echo $?`
if [ "$res" -eq "0" ]; then
    echo "updating intstream user password"
    sudo -u postgres psql -U postgres -d postgres -c "alter user intstream with password '$password';"
else
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

echo "------"
echo " gunicorn setup"
#gunicorn
curdir=$(pwd) #base dir + intstream
sed -e  "s/\${postgres_pw}/$password/g" -e "s/\${user}/$USER/g" -e "s/\${cwd}/${curdir//\//\\/}\/backend\//g" -e "s/\${venvpath}/${venvpath//\//\\/}/g" ./utility/gunicorn > ./utility/gunicorn_new
sudo cp ./utility/gunicorn_new /etc/systemd/system/gunicorn.service
sudo systemctl daemon-reload
sudo systemctl restart gunicorn
sudo systemctl enable gunicorn

echo "------"
echo " celery beat setup"
sed -e  "s/\${postgres_pw}/$password/g" -e "s/\${user}/$USER/g" -e "s/\${cwd}/${curdir//\//\\/}\/backend\//g" -e "s/\${venvpath}/${venvpath//\//\\/}/g" ./utility/celerybeat > ./utility/celerybeat_new
sudo cp ./utility/celerybeat_new /etc/systemd/system/celerybeat.service
sudo systemctl daemon-reload
sudo systemctl restart celerybeat
sudo systemctl enable celerybeat

echo "------"
echo " celery worker setup"
sed -e  "s/\${postgres_pw}/$password/g" -e "s/\${user}/$USER/g" -e "s/\${cwd}/${curdir//\//\\/}\/backend\//g" -e "s/\${venvpath}/${venvpath//\//\\/}/g" ./utility/celeryworker > ./utility/celeryworker_new
sudo cp ./utility/celeryworker_new /etc/systemd/system/celeryworker.service
sudo systemctl daemon-reload
sudo systemctl restart celeryworker
sudo systemctl enable celeryworker

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
sudo bash -c 'cat "$base_dir/intstream/utility/rc.local" >> /etc/rc.local'

# pyspark requires java 1.8 
sudo apt -qq install  openjdk-8-jdk
#https://stackoverflow.com/questions/53583199/pyspark-error-unsupported-class-file-major-version-55
sudo update-alternatives --set java /usr/lib/jvm/java-8-openjdk-amd64/jre/bin/java
