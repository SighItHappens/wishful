#!/bin/sh

# Load secrets into environment variables
if [ -d "/run/secrets" ]; then
  for secret in /run/secrets/*; do
    if [ -f "$secret" ]; then
      filename=$(basename "$secret")
      envvar=$(echo "$filename" | tr '[:lower:]' '[:upper:]' | tr '-' '_')
      # Using printenv to check if the variable is already set
      if [ -z "$(printenv $envvar)" ]; then
        export "$envvar"=$(cat "$secret")
        echo "Loaded secret: $filename as $envvar"
      fi
    fi
  done
fi

# Start Next.js
exec "$@"
