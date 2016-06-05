#!/bin/sh
echo "Downloading csv data..."
curl https://docs.google.com/spreadsheets/d/13wjQS8ZfO7rA30p16btGJEaGitxJBjJMCLMYirhH8RA/pub?output=csv > data/gardens.csv
echo "Syncing with github..."
#git add data/gardens.csv
#git commit -m "Adding gardens.csv via automatic update"
#git push origin master

