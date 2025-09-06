#!/bin/bash -eu
#


# [START gke_recommendationservice_genproto]

# script to compile python protos
#
# requires gRPC tools:
#   pip install -r requirements.txt

python -m grpc_tools.protoc -I../../protos --python_out=. --grpc_python_out=. ../../protos/demo.proto

# [END gke_recommendationservice_genproto]