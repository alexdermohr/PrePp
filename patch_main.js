const fs = require('fs');
let code = fs.readFileSync('app/src/main.js', 'utf8');

// Remove getViewCount function
const getViewCountRegex = /function getViewCount\([\s\S]*?\}\n\n/;
code = code.replace(getViewCountRegex, '');

// Revert button logic
const renderButtonLogicOld = `
    group.views.forEach((view) => {
      const button = document.createElement('button');
      button.className = view.id === activeId ? 'active' : '';
      button.addEventListener('click', () => { location.hash = view.id; });
      if (view.id === activeId) button.setAttribute('aria-current', 'page');

      const labelSpan = document.createElement('span');
      labelSpan.textContent = view.label;
      button.appendChild(labelSpan);

      const count = getViewCount(view.id, data);
      if (count !== null) {
        const countSpan = document.createElement('span');
        countSpan.className = 'sidebar-counter';
        countSpan.textContent = count;
        button.appendChild(countSpan);
      }

      nav.appendChild(button);
    });
`;

const renderButtonLogicNew = `
    group.views.forEach((view) => {
      const button = document.createElement('button');
      button.textContent = view.label;
      button.className = view.id === activeId ? 'active' : '';
      button.addEventListener('click', () => { location.hash = view.id; });
      if (view.id === activeId) button.setAttribute('aria-current', 'page');
      nav.appendChild(button);
    });
`;

code = code.replace(renderButtonLogicOld, renderButtonLogicNew);
fs.writeFileSync('app/src/main.js', code, 'utf8');
