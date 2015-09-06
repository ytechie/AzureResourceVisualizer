#!/bin/bash

cd dist
git init

git config user.name "Travis CI"
git config user.email "jason@ytechie.com"

git add .
git commit -m "Deploy"

# We redirect any output to
# /dev/null to hide any sensitive credential data that might otherwise be exposed.
git push --force --quiet "https://${git_user}:${git_password}@${git_target}" master:master > /dev/null 2>&1
