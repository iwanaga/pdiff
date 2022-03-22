FROM node:14.18.1

WORKDIR /pdiff
COPY package.json /pdiff/package.json
RUN npm install --legacy-peer-deps

COPY build /pdiff/build
COPY server /pdiff/server

CMD [ "node", "server/app.mjs" ]

EXPOSE 9000
