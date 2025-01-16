FROM node:23-alpine3.20

EXPOSE 3000/tcp
ENV MONGO_URI=mongodb://localhost:27017/svatba

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY makeAccessCodes.ts ./
COPY src src

CMD [ "npm", "run", "dev" ]
