#!/bin/bash

echo heroku build starting

cd common
npm install
npm run build
cd ..


cd ui
npm install
npm run build
cd ..


cd server
npm install
npm run build
cd ..


mv ui/build server/public






