FROM mcr.microsoft.com/dotnet/core/sdk:2.2.401-stretch as version

WORKDIR /src

COPY .git ./

RUN dotnet tool install -g minver-cli --version 1.0.0 && \
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
