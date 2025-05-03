#!/bin/bash

# Script to build Docker image with dummy/dev Auth0 secrets
# Use this for build time only - production will override these with real secrets

echo "Building Docker image with dummy Auth0 configuration for build time only"
echo "These values will be overridden at runtime in production by Docker secrets"

# Build the Docker image with dummy secrets passed as build args
docker build -t sighithappens/wishful .

echo "Docker image built successfully with dummy Auth0 configuration."
echo "Remember: In production, these values will be replaced with actual secrets from /run/secrets/"

docker push sighithappens/wishful
echo "Docker image pushed successfully."
