#!/bin/sh
echo "Downloading csv data..."
curl https://docs.google.com/spreadsheets/d/13wjQS8ZfO7rA30p16btGJEaGitxJBjJMCLMYirhH8RA/pub?output=csv > data/gardens.csv
echo "Syncing with github..."
echo "Done! Run the following to push to the web:"
echo "git add data/gardens.csv"
echo "git commit -m \"Adding gardens.csv via automatic update\""
echo "git push lfg gh-pages"

