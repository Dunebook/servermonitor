#!/usr/bin/env bash

apt-get update
curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
bash nodesource_setup.sh
sudo apt-get install nodejs -y
sudo apt-get install build-essential -y
npm install forever -g
