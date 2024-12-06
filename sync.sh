#!/bin/bash
now_time=$(date)
cd $(dirname $0)
rm -rf ./source/_posts/
rm -rf ./source/wiki/
# rm -rf ./source/game/
# rm -rf ./source/about/
# rm -rf ./source/pic/
# \cp -a ../knowledge/note/data/notes/pages/ ./source/_posts/
find ../knowledge/note/data/notes/pages/ -type f -name "*.md" | while read file; do
    if ! grep -q "published: false" "$file"; then
        relative_path=${file#../knowledge/note/data/notes/pages/}
        mkdir -p "./source/_posts/$(dirname "$relative_path")"
        cp "$file" "./source/_posts/$relative_path"
    fi
done
\cp -a ../knowledge/note/data/notes/wiki ./source
# \cp -a ../knowledge/note/data/notes/game ./source
# \cp -a ../knowledge/note/data/notes/about ./source
# \cp -a ../knowledge/note/data/notes/pic ./source

git pull
git add .
git commit -m "$now_time"
git push
