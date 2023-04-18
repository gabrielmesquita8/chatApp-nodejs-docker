FROM arm64v8/node

WORKDIR /usr/src/app

#Instalando dependências
COPY package.json ./
COPY tsconfig.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm","run","dev"]