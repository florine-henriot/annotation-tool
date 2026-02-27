#!/bin/sh

set -e

echo "Waiting for postgresql to be ready"

until pg_isready -h db -p 5432 -U "$POSTGRES_USER"; do
    sleep 1
done

echo "Postgresql ready"

exec "$@"