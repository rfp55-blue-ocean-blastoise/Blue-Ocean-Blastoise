FROM node:14
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./
RUN npm run build:prod
EXPOSE 4000
# CMD ["node", "server/index.js"]
CMD ["npm", "run", "start:prod"]