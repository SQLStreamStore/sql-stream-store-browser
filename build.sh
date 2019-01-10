#!/usr/bin/env bash

set -e

docker build \
    --build-arg MYGET_API_KEY=$MYGET_API_KEY \
    .
