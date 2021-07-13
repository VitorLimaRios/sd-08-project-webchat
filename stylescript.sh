#!/bin/bash

CONTENT=$(cat ./styles/index.css)

cat > ./styles/index.css << EOF
/* stylelint-disable */
$CONTENT
EOF