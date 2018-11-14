#!/usr/bin/env bash

SEMVER_REGEX="^(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)(\\-[0-9A-Za-z-]+(\\.[0-9A-Za-z-]+)*)?(\\+[0-9A-Za-z-]+(\\.[0-9A-Za-z-]+)*)?$"

[[ $VERSION =~ $SEMVER_REGEX ]]

IMAGE="sql-stream-store-browser"
MAJOR="${IMAGE}.${BASH_REMATCH[1]}"
MAJOR_MINOR="${IMAGE}.${BASH_REMATCH[1]}.${BASH_REMATCH[2]}"
MAJOR_MINOR_PATCH="${IMAGE}.${BASH_REMATCH[1]}.${BASH_REMATCH[2]}.${BASH_REMATCH[3]}"
MAJOR_MINOR_PATCH_PRE="${IMAGE}.${BASH_REMATCH[1]}.${BASH_REMATCH[2]}.${BASH_REMATCH[3]}${BASH_REMATCH[4]}"
LATEST="${IMAGE}:latest"
if [[ -z $VERSION ]]
then
    echo "Detected no version information, assuming local build."
    docker build \
        --tag ${LATEST} \
        .

elif [[ $TRAVIS_TAG && -z ${BASH_REMATCH[4]} ]]
then
    echo "Detected a tag with no prerelease."
    docker build \
        --build-arg VERSION=$VERSION \
        --build-arg MYGET_API_KEY=$MYGET_API_KEY \
        --tag ${MAJOR} \
        --tag ${MAJOR_MINOR} \
        --tag ${MAJOR_MINOR_PATCH} \
        --tag ${LATEST} \
        .
else
    echo "Detected a prerelease."
    docker build \
        --build-arg VERSION=$VERSION \
        --build-arg MYGET_API_KEY=$MYGET_API_KEY \
        --tag ${MAJOR_MINOR_PATCH_PRE} \
        --tag ${LATEST} \
        .
fi

docker images --filter=reference="${LATEST}"
