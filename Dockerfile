FROM node:10.15.1   

WORKDIR /
COPY package.json .
RUN npm install    
COPY . .

CMD [ "npm", "start" ] 