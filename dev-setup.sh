#!/bin/bash

echo Which package manager do you want to use? \(npm\/yarn\)
read pmname

if [[ $pmname = "npm" ]]; then
    echo "Using npm as package manager..."
    (cd blockchain && npm install)
    (cd server && npm install && npm run link-contracts)
    (cd client && npm install && npm run link-contracts)
elif [[ $pmname = "yarn" ]]; then
    echo "Using yarn as package manager..."
    (cd blockchain && yarn)
    (cd server && yarn && yarn link-contracts)
    (cd client && yarn && yarn link-contracts)
else
    echo "Not valid!"
fi
echo "Pulling the right redis docker image, and starting it..."
docker run --name insig-redis -p 6379:6379 --rm -d redis:5.0.5