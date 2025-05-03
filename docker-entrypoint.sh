#!/bin/sh

# Flag to track if we've loaded runtime secrets
RUNTIME_SECRETS_LOADED=false

# Load secrets into environment variables
if [ -d "/run/secrets" ]; then
  echo "Loading runtime secrets from /run/secrets/"
  RUNTIME_SECRETS_LOADED=true

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

# Verify proper configuration before starting
if [ "$RUNTIME_SECRETS_LOADED" = true ]; then
  echo "✅ Runtime secrets loaded successfully, these will override any build-time configuration"
else
  echo "⚠️ Warning: No runtime secrets found in /run/secrets/"
  echo "   The application will use build-time configuration values."
  echo "   If this is not a production environment, this may be expected."
fi

# Perform Auth0 configuration validation
if [ -z "$AUTH0_SECRET" ] || [ -z "$AUTH0_DOMAIN" ] || [ -z "$AUTH0_CLIENT_ID" ] || [ -z "$AUTH0_CLIENT_SECRET" ]; then
  echo "❌ Error: Missing required Auth0 configuration. Application may not function correctly."
  exit 1
else
  echo "✅ Auth0 configuration validated"
fi

# Print truncated environment variables for debugging (only first 5 chars)
echo "Environment variable check (showing first 5 chars only):"
echo "AUTH0_CLIENT_ID: ${AUTH0_SECRET:0:5}..."
echo "AUTH0_ISSUER_BASE_URL begins with: ${AUTH0_DOMAIN:0:5}..."
echo "AUTH0_CLIENT_ID: ${AUTH0_CLIENT_ID:0:5}..."
echo "AUTH0_ISSUER_BASE_URL begins with: ${AUTH0_CLIENT_SECRET:0:5}..."

# Start Next.js
echo "Starting Next.js application..."
exec "$@"
