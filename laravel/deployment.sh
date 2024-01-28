#!/bin/bash
root="/var/www/html"
cd $root
echo -e '\e[1m\e[34mPulling code from remote..\e[0m\n'
git pull origin master
echo -e '\e[1m\e[34m\nInstalling required packages..\e[0m\n'
# Install required packages
composer install
echo -e '\e[1m\e[34m\nAPI deployed\e[0m\n'
