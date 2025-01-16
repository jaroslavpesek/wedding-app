#!/bin/bash
set -euxo pipefail

tag="${1:-latest}"

docker build --platform=linux/amd64 backend -t svatba-backend:"$tag"
docker build --platform=linux/amd64 frontend -t svatba-frontend:"$tag"
