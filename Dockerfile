FROM microsoft/dotnet:2.1.500-sdk-alpine3.7 as version

WORKDIR /src

COPY .git ./

RUN apk add libcurl --no-cache && \
    dotnet tool install -g minver-cli --version 1.0.0-beta.1 && \
    /root/.dotnet/tools/minver > .version

FROM node:10.12.0-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY . .

COPY --from=version /src/.version ./

RUN REACT_APP_CLIENT_VERSION=$(cat .version) \
    yarn build:dist && \
    yarn cache clean

FROM build AS publish
ARG MYGET_API_KEY

RUN \
    if [ -n "$MYGET_API_KEY" ] ;\
        then echo "https://www.myget.org/F/sqlstreamstore/npm/:_authToken=${MYGET_API_KEY}" > .npmrc && \
            echo "@sqlstreamstore:registry=https://www.myget.org/F/sqlstreamstore/npm/" >> .npmrc && \
            yarn publish --new-version $(cat .version) --no-git-tag-version ;\
        else echo "No API key found, skipping publishing..." ;\
    fi

FROM nginx:1.15.5-alpine AS runtime

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY ./nginx/mime.types /etc/nginx/mime.types

COPY --from=build /app/build/ /var/www/
COPY --from=version /src/.version /var/www

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
