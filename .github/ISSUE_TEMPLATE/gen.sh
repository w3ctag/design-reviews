#! /bin/sh

NPX=${NPX:-npx}

$NPX ejs intake.yaml.ejs -i '{"type": "incubation"}' -o 000-incubation-review.yaml
$NPX ejs intake.yaml.ejs -i '{"type": "wg-new"}' -o 005-wg-new-spec-review.yaml
$NPX ejs intake.yaml.ejs -i '{"type": "wg-revision"}' -o 010-wg-revision-review.yaml
$NPX ejs intake.yaml.ejs -i '{"type": "browser"}' -o 015-browser-review.yaml
