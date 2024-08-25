FROM node:19-alpine
WORKDIR /app
ENV NODE_ENV production
ENV PORT 1337
COPY . .
EXPOSE 1337
CMD ["npm", "start"]
