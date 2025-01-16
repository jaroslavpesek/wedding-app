FROM node:23-alpine3.20

EXPOSE 3000/tcp
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.app.json tsconfig.json tsconfig.node.json vite.config.ts index.html ./
COPY src src

CMD [ "npm", "run", "dev" ]
