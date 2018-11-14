FROM node:10.12.0-alpine AS build
ARG MYGET_API_KEY
ARG VERSION

RUN apk add --no-cache git

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY . .

RUN yarn build && \
    yarn build:dist && \
    yarn cache clean

RUN echo "https://www.myget.org/F/sqlstreamstore/npm/:_authToken=${MYGET_API_KEY}" > .npmrc && \
    echo "@sql-stream-store:registry=https://www.myget.org/F/sqlstreamstore/npm/" >> .npmrc

RUN test -z "$MYGET_API_KEY" || \
    yarn publish --new-version $VERSION && \
    echo "No API key found, skipping publishing..."

FROM nginx:1.15.5-alpine AS runtime

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY ./nginx/mime.types /etc/nginx/mime.types

COPY --from=build /app/build/ /var/www/

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]