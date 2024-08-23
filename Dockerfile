FROM node:19-alpine
WORKDIR /app
ENV NODE_ENV production
ENV PORT 1337
COPY dist ./dist
COPY node_modules ./node_modules
COPY package.json ./package.json
EXPOSE 1337
CMD ["npm", "start"]
