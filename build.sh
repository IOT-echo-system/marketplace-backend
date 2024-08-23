#!/bin/bash
rm -rf node_modules
npm install && \
cd src/plugins/strapi-plugin-ckeditor && npm install && \
cd ../../.. && \
npm run build --omit=dev && \
rm -rf node_modules && \
npm install --omit=dev --ignore-scripts --prefer-offline && \
docker buildx build --no-cache --platform=linux/arm64,linux/amd64 -t shiviraj/marketplace-backend:latest --push .
