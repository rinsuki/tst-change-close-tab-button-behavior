#!/bin/sh
mkdir -p dist
zip dist/$(date '+%Y%m%d_%H%M%S').zip manifest.json *.js