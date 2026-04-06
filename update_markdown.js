const fs = require('fs');

const path = '/app/app/src/lib/markdown.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /function createDecisionBlock\(heading = 'Entscheidung', implicit = true\) \{\n  return \{\n    heading,\n    implicit,\n    massnahme: \[\],\n    begruendung: \[\],\n    ziel: \[\],\n    pruefhinweis: \[\]\n  \};\n\}/,
  `function createDecisionBlock(heading = 'Entscheidung', implicit = true) {
  return {
    heading,
    implicit,
    massnahme: [],
    begruendung: [],
    ziel: [],
    pruefhinweis: [],
    bezugZurHypothese: []
  };
}`
);

content = content.replace(
  /if \(labeled\.label\.startsWith\('prüfhinweis'\) \|\| labeled\.label\.startsWith\('pruefhinweis'\)\) \{\n    block\.pruefhinweis\.push\(labeled\.value\);\n  \}/,
  `if (labeled.label.startsWith('prüfhinweis') || labeled.label.startsWith('pruefhinweis') || labeled.label.startsWith('messkriterien')) {
    block.pruefhinweis.push(labeled.value);
    return;
  }

  if (labeled.label.startsWith('bezug zur hypothese')) {
    block.bezugZurHypothese.push(labeled.value);
    return;
  }`
);

content = content.replace(
  /export function parseDecisionBlocks\(markdown\) {([\s\S]*?)return blocks\.length > 0 \? blocks : \[createDecisionBlock\(\)\];\n}/,
  `export function parseDecisionBlocks(markdown) {
  const rawLines = lines(markdown);
  const blocks = [];
  let current = createDecisionBlock();
  let activeSection = null;

  rawLines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (/^##\\s+/.test(line)) {
      const headingText = line.replace(/^##\\s+/, '').trim().toLowerCase();

      if (headingText === 'maßnahme' || headingText === 'massnahme') {
        activeSection = 'massnahme';
        return;
      } else if (headingText === 'begründung' || headingText === 'begruendung') {
        activeSection = 'begruendung';
        return;
      } else if (headingText === 'ziel') {
        activeSection = 'ziel';
        return;
      } else if (headingText === 'messkriterien' || headingText === 'prüfhinweis' || headingText === 'pruefhinweis') {
        activeSection = 'pruefhinweis';
        return;
      } else if (headingText === 'bezug zur hypothese') {
        activeSection = 'bezugZurHypothese';
        return;
      } else if (headingText === 'konkrete umsetzung' || headingText.startsWith('konkrete umsetzung')) {
        activeSection = 'massnahme';
        return;
      }

      if (current.massnahme.length || current.begruendung.length || current.ziel.length || current.pruefhinweis.length || current.bezugZurHypothese.length) {
        blocks.push(current);
      }
      current = createDecisionBlock(line.replace(/^##\\s+/, '').trim(), false);
      activeSection = null;
      return;
    }

    const labeled = extractLabeledBullet(line);
    if (labeled) {
      applyLabeledValue(current, labeled);
      return;
    }

    if (activeSection && line) {
        let textToAdd = rawLine;

        if (textToAdd.trim().startsWith('- ')) {
            textToAdd = textToAdd.trim().substring(2);
        } else if (textToAdd.trim().match(/^\\d+\\.\\s+/)) {
            textToAdd = textToAdd.trim().replace(/^\\d+\\.\\s+/, '');
        } else {
            textToAdd = textToAdd.trim();
        }

        if (textToAdd) {
            current[activeSection].push(textToAdd);
        }
    }
  });

  if (current.massnahme.length || current.begruendung.length || current.ziel.length || current.pruefhinweis.length || current.bezugZurHypothese.length) {
    blocks.push(current);
  }

  return blocks.length > 0 ? blocks : [createDecisionBlock()];
}`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Update successful');
