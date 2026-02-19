FROM node:18-alpine

WORKDIR /app

# install curl for ECS health check
RUN apk add --no-cache curl

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npx", "serve", "-s", "build", "-l", "3000"]
