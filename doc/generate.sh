yuidoc2md -t doc/template.hbs "**/[^'lib']**/*.js" | gawk '/^#[^#]/{match($0, /^#([^#]+)$/, k)} {print >"ifiske.wiki/"k[1]".md" }' -
tree > ifiske.wiki/tree.md

ls ifiske.wiki/Globals/ >> ifiske.wiki/Globals.md
sed -i '/^\* \[\[.*\]\]$/d' ifiske.wiki/Globals.md
sed -i 's/\(.*\)\.md$/* [[\1]]/' ifiske.wiki/Globals.md

ls ifiske.wiki/Pages/ >> ifiske.wiki/Pages.md
sed -i '/^\* \[\[.*\]\]$/d' ifiske.wiki/Pages.md
sed -i 's/\(.*\)\.md$/* [[\1]]/' ifiske.wiki/Pages.md
