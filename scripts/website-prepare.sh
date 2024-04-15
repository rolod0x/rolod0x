#!/bin/sh

cp -a CONTRIBUTING.md SECURITY.md docs public website

grep -v 'auto-remove-line-for-jekyll' README.md | \
  sed 's,.*<!-- auto-replace-line-for-jekyll: \(.*\) -->.*,\1,' \
      > website/README.md
