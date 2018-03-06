FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
EXPOSE 8080
ENV vidly_jwtPrivateKey=ProdKey
ENV PORT=8080
ENV NODE_ENV=production
ENV vidly_isHosted=true
ENV DEBUG=
CMD ["npm", "start"]