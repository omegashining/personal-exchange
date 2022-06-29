#!/bin/bash

if [ "$INITIALIZE" = 'true' ]
then
  echo "Initialize and Run Xoycoin Exchange Server."
  npm start
else
  echo "Run Xoycoin Exchange Server."
  npm start
fi

exit 1
