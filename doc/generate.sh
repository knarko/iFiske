yuidoc2md -t doc/template.hbs "**/[^'lib']**/*.js" | gawk '/^#[^#]/{match($0, /^#([^#]+)$/, k)} {print >"ifiske.wiki/"k[1]".md" }' -
tree > ifiske.wiki/tree.md
