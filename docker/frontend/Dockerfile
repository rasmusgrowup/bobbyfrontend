FROM node:18-alpine

RUN mkdir /app
WORKDIR /app
COPY package.json /app
COPY next.config.js /app
COPY next-env.d.ts /app

COPY src/ /app/src
COPY public/ /app/public
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start", "--port 3000"]