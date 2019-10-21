FROM node:10.15.1   
RUN apt-get update
RUN apt-get install golang-go -y
RUN wget https://dist.ipfs.io/go-ipfs/v0.4.10/go-ipfs_v0.4.10_linux-386.tar.gz
RUN tar xvfz go-ipfs_v0.4.10_linux-386.tar.gz
RUN mv go-ipfs/ipfs /usr/local/bin/ipfs
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
WORKDIR /home/node/app
COPY package.json .
RUN ipfs init
RUN ipfs config Addresses.API /ip4/0.0.0.0/tcp/5001
RUN npm install --save ipfsd-ctl
RUN npm install --save ipfs
RUN npm i go-ipfs-dep
RUN npm install
COPY . .
CMD [ "npm", "start" ] 