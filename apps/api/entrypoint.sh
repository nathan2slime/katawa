#!/bin/sh

set -e

echo "running database default migration"
pnpm db:migrate:deploy

exec pnpm start
