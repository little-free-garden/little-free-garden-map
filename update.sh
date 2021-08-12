#!/bin/sh
echo "Downloading csv data..."
#curl https://docs.google.com/spreadsheets/d/13wjQS8ZfO7rA30p16btGJEaGitxJBjJMCLMYirhH8RA/pub?output=csv > data/gardens.csv
#curl https://doc-0c-9c-sheets.googleusercontent.com/export/l5l039s6ni5uumqbsj9o11lmdc/uvuqmb1s5jb9m5nvh3n5ntq29k/1617920450000/104151212979487901196/*/19DtK8BtamgFz7QtDUB4FvcOMgMLr7jd3vZWKgBhdcPg?format=csv > data/gardens.csv
curl -L https://docs.google.com/spreadsheets/d/19DtK8BtamgFz7QtDUB4FvcOMgMLr7jd3vZWKgBhdcPg/export?format=csv > data/gardens.csv
echo "Syncing with github..."
echo "Done! Run the following to push to the web:"
echo "git add data/gardens.csv"
echo "git commit -m \"Adding gardens.csv via automatic update\""
echo "git push lfg gh-pages"

