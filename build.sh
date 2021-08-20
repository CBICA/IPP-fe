#!/bin/bash

set -eu

cd $(dirname $0)
npm run build
docker build -t terf/ipp-fe .
docker push terf/ipp-fe
# docker run -dit -p 8888:80 --name ipp-fe terf/ipp-fe
