FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
# CMD ["node", "server/index.js"]
CMD ["npm", "run", "start:prod"]