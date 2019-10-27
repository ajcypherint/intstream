set -x
set -e

#standalone installation script

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
cd intstream/
pipenv install
venvpath="$(pipenv --venv)"

echo "------"
echo " postgres setup"
#postgres
sudo apt-get install postgresql
sudo systemctl restart postgresql 
password=$(trap - PIPE ; cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1) 
sudo -u postgres psql -U postgres -d postgres -tc "SELECT 1 FROM pg_user WHERE usename = 'intstream'" | grep -q 1 || psql -h localhost -U postgres -c "CREATE ROLE intstream LOGIN PASSWORD '$password';"

#sudo -u postgres psql -U postgres -d postgres -c "create user intstream with password '$password';"
echo "postres user password set to password: $password"

echo "------"
echo " gunicorn setup"
#gunicorn
curdir=$(pwd)
sed -e  "s/\${postgres_pw}/$password/" -e "s/\${user}/$USER/" -e "s/\${cwd}/${curdir//\//\\/}/" -e "s/\${venvpath}/${venvpath//\//\\/}/" ./utility/gunicorn > ./utility/gunicorn_new
sudo cp ./utility/gunicorn_new /etc/systemd/system/gunicorn.service
sudo systemctl daemon-reload
sudo systemctl start gunicorn

echo "------"
echo " nginx setup"
#nginx
sudo apt-get install nginx
echo "Enter your registered DNS name: " 
read dns_name 
sed -e "s/{server_name}/server_name $dns_name/g" ./utility/intstream > ./utility/intstream_new
sudo cp ./utility/intstream_new /etc/nginx/sites-available/$dns_name
sudo ln -s /etc/nginx/sites-available/$dns_name /etc/nginx/sites-enabled/$dns_name
sudo systemctl restart nginx


echo "------"
echo " ssl setup"
sudo apt-get install software-properties-common
sudo add-apt-repository universe
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install certbot python-certbot-nginx
sudo certbot --nginx -D $dns_name

echo "------"
echo " create super user"
cd backend/
pipenv run python manage.py generate_secret_key --replace 
pipenv run python manage.py createsuperuser 




