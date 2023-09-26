How to revert to specific commit in github?
1. make a backup
   create a tag: git tag [tagname] [commit#]
   git push orgin [tagname]
2. create a working branch from dev, ex, dev-Aug30
3. checkout dev-Aug30 in local
4. note down the commits to revert,
   git log --oneline
5. for each above commit: 
   git revert [commit] --no-edit
6. verify and test local
7. git push
8. pull request merge to dev
 
 