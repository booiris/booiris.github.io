#!/bin/bash
now_time=$(date)
cd $(dirname $0)

rsync -ah --delete --exclude-from=<(find ../knowledge/note/data/notes/pages/ -type f -name "*.md" -exec grep -l "published: false" {} \; | sed "s|^../knowledge/note/data/notes/pages/||") ../knowledge/note/data/notes/pages/ ./content/posts/
rsync -ah --delete ../knowledge/note/data/notes/wiki ./content

git pull
git add .
git commit -m "$now_time"
git push
