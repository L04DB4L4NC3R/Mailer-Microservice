FROM node

RUN mkdir -p /src/app

WORKDIR /src/app

COPY package.json . 

RUN npm i 

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
