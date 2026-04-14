const fs = require('fs');
let code = fs.readFileSync('/app/app/src/lib/markdown.js', 'utf8');

const targetStr = `    if (/^!\\[(.*)\\]\\((.*)\\)$/.test(line)) {
      flushText();
      flushList();
      const match = line.match(/^!\\[(.*)\\]\\((.*)\\)$/);
      current.blocks.push({ type: 'image', alt: match[1], url: match[2] });
      continue;
    }
    if (line.startsWith('\`\`\`')) {
      flushText();
      flushList();
      if (inCodeBlock) {
        current.blocks.push({ type: 'code', text: codeContent.join('\\n') });
        inCodeBlock = false;
        codeContent = [];
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(rawLine);
      continue;
    }`;

const replacementStr = `    if (line.startsWith('\`\`\`')) {
      flushText();
      flushList();
      if (inCodeBlock) {
        current.blocks.push({ type: 'code', text: codeContent.join('\\n') });
        inCodeBlock = false;
        codeContent = [];
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(rawLine);
      continue;
    }

    const imgMatch = line.match(/^!\\[(.*)\\]\\((.*)\\)$/);
    if (imgMatch) {
      flushText();
      flushList();
      current.blocks.push({ type: 'image', alt: imgMatch[1], url: imgMatch[2] });
      continue;
    }`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('/app/app/src/lib/markdown.js', code);
