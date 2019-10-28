set -x
set -e

#standalone installation script
base_dir=$(pwd)

# prep
echo "------"
echo " updating"
sudo apt-get update

#python
echo "------"
echo " install pipenv"
sudo apt-get install python3-pip
sudo pip3 install pipenv

echo "------"
echo " cloning into instream"
#clone python code
git clone git@gitlab.com:cypherint/intstream.git
cd "$base_dir/intstream/"
pipenv install
venvpath="$(pipenv --venv)"

echo "------"
echo " postgres setup"
#postgres
sudo apt-get install postgresql
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
curdir=$(pwd)
sed -e  "s/\${postgres_pw}/$password/g" -e "s/\${user}/$USER/g" -e "s/\${cwd}/${curdir//\//\\/}\/backend\//g" -e "s/\${venvpath}/${venvpath//\//\\/}/g" ./utility/gunicorn > ./utility/gunicorn_new
sudo cp ./utility/gunicorn_new /etc/systemd/system/gunicorn.service
sudo systemctl daemon-reload
sudo systemctl start gunicorn

echo "------"
echo " nginx setup"
#nginx
sudo apt-get install nginx
echo "Enter your registered DNS name: " 
read dns_name 
sed -e "s/\${server_name}/server_name $dns_name/g" -e "s/\${user}/$USER/g" ./utility/intstream > ./utility/intstream_new
sudo cp ./utility/intstream_new /etc/nginx/sites-available/$dns_name
sudo ln -sf /etc/nginx/sites-available/$dns_name /etc/nginx/sites-enabled/$dns_name
sudo systemctl restart nginx


echo "------"
echo " ssl setup"
sudo apt-get install software-properties-common
sudo add-apt-repository universe
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install certbot python-certbot-nginx
sudo certbot --nginx -d $dns_name

echo "------"
echo " create database"
export PASSWORD="$password"
cd "$basedir/intstream/backend/"
pipenv run python manage.py migrate
echo "------"
echo " create super user"
pipenv run python manage.py generate_secret_key --replace 
pipenv run python manage.py createsuperuser 

echo "------"
echo " collect static for backend"
pipenv run python manage.py collectstatic

echo "------"
echo " npm run build"
sudo apt-get install npm
cd "$basedir/intstream/frontend"
npm run build




