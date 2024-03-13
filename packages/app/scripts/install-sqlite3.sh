#!/bin/bash

# Part of Pickestry. See LICENSE file for full copyright and licensing details.

echo $(pwd)
cd ../../node_modules/sqlite3
npx prebuild-install sqlite3 --verbose --runtime=napi --arch=x64 --libc=unknown --platform=win32
