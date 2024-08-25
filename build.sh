#!/bin/bash

cd src/plugins/strapi-plugin-ckeditor && npm install && \
cd ../../.. && \

rm -rf node_modules
npm install --platform=linuxmusl --arch=x64 sharp
npm run build
docker buildx build --no-cache --platform=linux/amd64 -t shiviraj/marketplace-backend:latest --push .

rm -rf node_modules
npm install --platform=linuxmusl --arch=arm64 sharp
npm run build
docker buildx build --no-cache --platform=linux/arm64 -t shiviraj/marketplace-backend:arm64 --push .
