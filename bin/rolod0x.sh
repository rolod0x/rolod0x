#!/bin/bash

here="$(dirname $0)"

"$here/../node_modules/.bin/tsx" "$here/../src/cli/index.ts" "$@"
