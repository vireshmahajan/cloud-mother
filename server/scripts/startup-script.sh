#!/usr/bin/env bash
echo "Start Up script started"
# [START logging]
sudo curl -s "https://storage.googleapis.com/signals-agents/logging/google-fluentd-install.sh" |  sudo bash
sudo service google-fluentd restart &
# [END logging]
echo "Do apt update"
sudo apt-get update
echo "Install Required packages"
sudo apt-get install -yq ca-certificates git build-essential supervisor
sudo mkdir /opt/nodejs
sudo curl https://nodejs.org/dist/v14.0.0/node-v14.0.0-linux-x64.tar.gz | sudo tar xvzf - -C /opt/nodejs --strip-components=1
sudo ln -s /opt/nodejs/bin/node /usr/bin/node
sudo ln -s /opt/nodejs/bin/npm /usr/bin/npm
## Get the application source code from the git lab.
## git requires $HOME and it's not set during the startup script.
export HOME=/root
sudo git clone https://deployer-apibucket:Ss_Wxovk295xs7ysHvLn@gitlab.com/quasardev/apibucket.git /opt/apibucket
cd opt/apibucket/ && sudo npm install

# Create a nodeapp user. The application will run as this user.
sudo useradd -m -d /home/nodeapp nodeapp
sudo chown -R nodeapp:nodeapp /opt/apibucket
#sudo chown -R mahajanviresh:mahajanviresh /home/mahajanviresh

# Configure supervisor to run the node app.
#directory=/opt/app/7-gce
sudo cat >/etc/supervisor/conf.d/node-app.conf << EOF
[program:nodeapp]
directory=/opt/apibucket
command=sudo npm start
autostart=true
autorestart=true
user=root
password=dummy
environment=HOME="/home/nodeapp",USER="nodeapp",NODE_ENV="production",PORT="80"
stdout_logfile=syslog
stderr_logfile=syslog
stopasgroup=true
stopsignal=QUIT
EOF
#Below Commands Kill port process as well
#stopsignal=QUIT
#stopasgroup=true

sudo supervisorctl reread
sudo supervisorctl update
