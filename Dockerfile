FROM mcr.microsoft.com/dotnet/core/sdk:2.2.402-alpine3.9 as version

RUN apk add git

WORKDIR /src

COPY .git ./.git

RUN dotnet tool install --global minver-cli --version 2.0.0-alpha.1 && \
    /root/.dotnet/tools/minver > .version

FROM node:10.12.0-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY . .

COPY --from=version /src/.version ./

RUN REACT_APP_CLIENT_VERSION=$(cat .version) \
    yarn build:dist && \
    yarn cache clean && \
    cp .version ./dist

FROM build AS publish
ARG MYGET_API_KEY

RUN \
    if [ -n "$MYGET_API_KEY" ] ;\
        then echo "https://www.myget.org/F/sqlstreamstore/npm/:_authToken=${MYGET_API_KEY}" > .npmrc && \
            echo "@sqlstreamstore:registry=https://www.myget.org/F/sqlstreamstore/npm/" >> .npmrc && \
            yarn publish --new-version $(cat .version) --no-git-tag-version ;\
        else echo "No API key found, skipping publishing..." ;\
    fi
