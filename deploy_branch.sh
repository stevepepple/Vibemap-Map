#!/usr/bin/env bash

HOST=52.151.38.19

BRANCH=$1

if [[ -z $BRANCH ]]
then
    echo 'ERROR: you must specify a branch name'
    exit 1
fi

ssh -o ForwardAgent=yes -t vibemapper@$HOST "

function check_error_exit
{
    if [ \$? != 0 ]
    then
        echo '-------------------------------------------------------'
        echo 'ERROR: ABORTING DEPLOY' 1>&2
        exit 1
    fi
}

cd /home/vibemapper/vibemap-app

git fetch origin "$BRANCH"
check_error_exit

git reset --hard origin/"$BRANCH"
check_error_exit

yarn install
check_error_exit

yarn build
check_error_exit

sudo rm -r /usr/share/nginx/razzle/images
sudo rm -r /usr/share/nginx/razzle/static
check_error_exit

sudo cp -r /home/vibemapper/vibemap-app/build/public/* /usr/share/nginx/razzle/
check_error_exit

sudo systemctl restart vibemap-app-express
check_error_exit
"
