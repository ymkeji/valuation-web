FROM node:16 as builder

WORKDIR /code

ADD package.json /code

RUN npm install

ADD . /code

RUN npm run build:test

FROM nginx:alpine

LABEL LittleSorce <Littley@outlook.ie>

COPY --from=builder /code/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /code/dist  /usr/share/nginx/html/

EXPOSE 80

ENTRYPOINT ["nginx"]
CMD ["-g","daemon off;"]