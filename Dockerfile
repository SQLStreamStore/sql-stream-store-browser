FROM node:10.12.0-alpine AS build

RUN apk add --no-cache git

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY . .

RUN yarn build && \
    yarn cache clean

FROM nginx:1.15.0-alpine AS runtime

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY ./mime.types /etc/nginx/mime.types

COPY --from=build /app/build/ /var/www/

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]