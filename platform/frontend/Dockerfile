FROM node:latest

RUN mkdir -p /usr/src/frontend
WORKDIR /usr/src/frontend

COPY ./package.json .

RUN npm install --legacy-peer-deps

COPY . .
RUN ["sed", "-i", "s/\r//", "start.sh"]
RUN ["chmod", "+x", "start.sh"]
