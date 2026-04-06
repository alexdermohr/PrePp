const fs = require('fs');
let code = fs.readFileSync('app/src/styles.css', 'utf8');

// Remove counter styles
code = code.replace(/.*?\.sidebar-counter \{[\s\S]*?\}\n/, '');
code = code.replace(/.*?\.sidebar button\.active \.sidebar-counter \{[\s\S]*?\}\n/, '');

// Clean up sidebar button flex layout
code = code.replace('  display: flex;\n', '');
code = code.replace('  justify-content: space-between;\n', '');
code = code.replace('  align-items: center;\n', '');

fs.writeFileSync('app/src/styles.css', code, 'utf8');
