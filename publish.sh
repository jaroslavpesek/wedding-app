#!/bin/bash
set -euxo pipefail

tag="${1:-latest}"
ssh_server="${2:-kulich}"

docker save svatba-backend:"$tag" | ssh -C "$ssh_server" docker load
docker save svatba-frontend:"$tag" | ssh -C "$ssh_server" docker load
