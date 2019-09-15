FROM node:boron
WORKDIR /usr/app
COPY api/package.json /usr/app
RUN npm install
COPY api /usr/app
CMD npm start
EXPOSE 3000
