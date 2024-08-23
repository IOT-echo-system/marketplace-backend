#!/bin/bash
rm -rf node_modules
npm install && \
npm run build --omit=dev && \
rm -rf node_modules && \
npm install --omit=dev --ignore-scripts --prefer-offline && \
docker buildx build --no-cache --platform=linux/arm64,linux/amd64 -t shiviraj/marketplace-backend:latest --push .
