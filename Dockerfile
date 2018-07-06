FROM node:10.5.0-alpine AS build

RUN apk add --no-cache git

WORKDIR /app

COPY . .

RUN yarn

RUN yarn build

FROM nginx:1.15.0-alpine AS runtime

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/build/ /var/www/

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]