#!/usr/bin/env bash
DOCKERTAG=${TRAVIS_TAG:-latest}

docker build \
    --build-arg VERSION=$VERSION \
    --build-arg MYGET_API_KEY=$MYGET_API_KEY \
    --tag sql-stream-store-browser:${DOCKERTAG} .

docker images --filter=reference="sql-stream-store-browser:${DOCKERTAG}"
