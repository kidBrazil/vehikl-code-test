FROM node:10
WORKDIR /app
COPY api/package.json /app
RUN npm install
COPY ./api /app
CMD npm run start
EXPOSE 3000
