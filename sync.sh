#!/bin/bash
now_time=$(date)
cd $(dirname $0)
rm -rf ./source/_posts/
rm -rf ./source/wiki/
# rm -rf ./source/game/
rm -rf ./source/about/
# rm -rf ./source/pic/
\cp -a ../knowledge/note/data/notes/pages/ ~/hexo/source/_posts/
\cp -a ../knowledge/note/data/notes/wiki ~/hexo/source
# \cp -a ../knowledge/note/data/notes/game ~/hexo/source
\cp -a ../knowledge/note/data/notes/about ~/hexo/source
# \cp -a ../knowledge/note/data/notes/pic ~/hexo/source
git pull
git add .
git commit -m "$now_time"
git push
