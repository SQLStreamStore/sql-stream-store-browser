#!/usr/bin/env bash
DOCKERTAG=${TRAVIS_TAG:-latest}

docker build --build-arg semver=TRAVIS_TAG --tag sql-stream-store-browser:${DOCKERTAG} .

docker images --filter=reference="sql-stream-store-browser:${DOCKERTAG}"
