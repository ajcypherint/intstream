set -x
set -e

#standalone installation script

# prep
sudo apt-get update

#python
sudo apt-get install python3-pip
sudo pip3 install pipenv

#clone python code
git clone git@gitlab.com:cypherint/intstream.git
cd intstream/
pipenv install
venvpath="$(pipenv --venv)"

#postgres
sudo apt-get install postgresql
sudo systemctl restart postgresql 
password=$(trap - PIPE ; cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1) 
sudo -u postgres psql -U postgres -d postgres -c "alter user unshorten with password '$password';" 
echo "postres user password set to password: $password"


#gunicorn
sed -e  "s/\${postgres_pw}/$password/" -e "s/\${cwd}/$(cwd)/" -e "s/\${venv_path}/$venvpath/" ./utility/gunicorn > ./utility/gunicorn_new
sudo cp ./utility/gunicorn_new /etc/system/systemd/
sudo systemctl daemon-reload
sudo systemctl start gunicorn

#nginx
sudo apt-get install nginx
echo "Enter your registered DNS name: " 
read dns_name 
sed -e "s/{server_name}/server_name $dns_name/g" ./utility/intstream > ./utility/intstream_new
sudo cp ./utility/intstream_new /etc/nginx/sites-available/$dns_name
sudo ln -s /etc/nginx/sites-available/$dns_name /etc/nginx/sites-enabled/$dns_name
sudo systemctl restart nginx


sudo apt-get install software-properties-common
sudo add-apt-repository universe
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install certbot python-certbot-nginx
sudo certbot --nginx -D $dns_name

cd backend/
pipenv run python manage.py generate_secret_key --replace 
pipenv run python manage.py createsuperuser 




