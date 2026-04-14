const fs = require('fs');
let code = fs.readFileSync('/app/app/src/components/views.js', 'utf8');

const sanitizerStr = `function extractFirstSnippet(sections) {`;
const sanitizerReplacementStr = `function sanitizeImageUrl(url) {
  if (!url) return null;
  if (url.startsWith('/images/')) return url;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url;
    }
  } catch(e) {}
  return null;
}

function extractFirstSnippet(sections) {`;

code = code.replace(sanitizerStr, sanitizerReplacementStr);


const blockRendererStr = `  image: (b, container) => {
    const img = document.createElement('img');
    img.src = b.url;
    img.alt = b.alt || 'Projektbild';
    img.className = 'content-image';
    img.loading = 'lazy';
    container.appendChild(img);
  },`;

const blockRendererReplacementStr = `  image: (b, container) => {
    const safeUrl = sanitizeImageUrl(b.url);
    if (!safeUrl) {
       const fallback = document.createElement('p');
       fallback.className = 'meta';
       fallback.textContent = '[Bild konnte nicht geladen werden]';
       container.appendChild(fallback);
       return;
    }
    const img = document.createElement('img');
    img.src = safeUrl;
    img.alt = b.alt || 'Projektbild';
    img.className = 'content-image';
    img.loading = 'lazy';
    container.appendChild(img);
  },`;

code = code.replace(blockRendererStr, blockRendererReplacementStr);

const heroStr = `  const latestImage = getLatestDiaryImage();

  if (latestImage) {
    const resultSection = document.createElement('section');`;

const heroReplacementStr = `  const latestImage = getLatestDiaryImage();
  const safeHeroUrl = latestImage ? sanitizeImageUrl(latestImage.url) : null;

  if (safeHeroUrl) {
    const resultSection = document.createElement('section');`;

code = code.replace(heroStr, heroReplacementStr);

const heroImgStr = `    const img = document.createElement('img');
    img.src = latestImage.url;
    img.alt = latestImage.alt || 'Projektbild';`;

const heroImgReplacementStr = `    const img = document.createElement('img');
    img.src = safeHeroUrl;
    img.alt = latestImage.alt || 'Projektbild';`;

code = code.replace(heroImgStr, heroImgReplacementStr);

fs.writeFileSync('/app/app/src/components/views.js', code);
