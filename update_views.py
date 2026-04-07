import re

with open('app/src/components/views.js', 'r') as f:
    content = f.read()

search_text = """        // Very simple mapping for the most critical view: "intervention" tools
        // So ../intervention/pause_protokoll.md points realistically to a blank Github/raw
        // or hash navigation. Since hash routing isn't fully aware of individual docs in all categories,
        // we will link relative Markdown URLs nicely to a target.

        if (url.endsWith('.md')) {
           // Just keep the url as an href so it looks clickable but doesn't break the app
           a.href = url;
           a.target = '_blank';
        } else {
           a.href = url;
        }"""

replace_text = """        if (url.endsWith('.md')) {
           // Provide a stable fallback hash target for internal .md files
           // to avoid breaking the SPA or opening raw file paths.
           a.href = '#entscheidungen';
           a.title = url;
        } else {
           a.href = url;
           if (url.startsWith('http')) {
               a.target = '_blank';
               a.rel = 'noopener noreferrer';
           }
        }"""

if search_text in content:
    content = content.replace(search_text, replace_text)
    with open('app/src/components/views.js', 'w') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Could not find text to replace")
