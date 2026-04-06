--- /app/app/src/lib/markdown.js
+++ /app/app/src/lib/markdown.js
@@ -143,7 +143,8 @@
     massnahme: [],
     begruendung: [],
     ziel: [],
-    pruefhinweis: []
+    pruefhinweis: [],
+    bezugZurHypothese: []
   };
 }

@@ -162,35 +163,65 @@
     return;
   }

-  if (labeled.label.startsWith('prüfhinweis') || labeled.label.startsWith('pruefhinweis')) {
+  if (labeled.label.startsWith('prüfhinweis') || labeled.label.startsWith('pruefhinweis') || labeled.label.startsWith('messkriterien')) {
     block.pruefhinweis.push(labeled.value);
+    return;
+  }
+
+  if (labeled.label.startsWith('bezug zur hypothese')) {
+    block.bezugZurHypothese.push(labeled.value);
+    return;
   }
 }

 export function parseDecisionBlocks(markdown) {
   const rawLines = lines(markdown);
   const blocks = [];
   let current = createDecisionBlock();
+
+  let activeSection = null;

   rawLines.forEach((rawLine) => {
     const line = rawLine.trim();
     if (/^##\s+/.test(line)) {
-      if (current.massnahme.length || current.begruendung.length || current.ziel.length || current.pruefhinweis.length) {
+      const headingText = line.replace(/^##\s+/, '').trim().toLowerCase();
+
+      if (headingText === 'maßnahme' || headingText === 'massnahme') {
+        activeSection = 'massnahme';
+        return;
+      } else if (headingText === 'begründung' || headingText === 'begruendung') {
+        activeSection = 'begruendung';
+        return;
+      } else if (headingText === 'ziel') {
+        activeSection = 'ziel';
+        return;
+      } else if (headingText === 'messkriterien' || headingText === 'prüfhinweis' || headingText === 'pruefhinweis') {
+        activeSection = 'pruefhinweis';
+        return;
+      } else if (headingText === 'bezug zur hypothese') {
+        activeSection = 'bezugZurHypothese';
+        return;
+      } else if (headingText === 'konkrete umsetzung' || headingText.startsWith('konkrete umsetzung')) {
+        activeSection = 'massnahme';
+        return;
+      }
+
+      if (current.massnahme.length || current.begruendung.length || current.ziel.length || current.pruefhinweis.length || current.bezugZurHypothese.length) {
         blocks.push(current);
       }
       current = createDecisionBlock(line.replace(/^##\s+/, '').trim(), false);
+      activeSection = null;
       return;
     }

     const labeled = extractLabeledBullet(line);
-    if (!labeled) return;
-    applyLabeledValue(current, labeled);
-  });
-
-  if (current.massnahme.length || current.begruendung.length || current.ziel.length || current.pruefhinweis.length) {
-    blocks.push(current);
-  }
-
-  return blocks.length > 0 ? blocks : [createDecisionBlock()];
+    if (labeled) {
+      applyLabeledValue(current, labeled);
+      return;
+    }
+
+    if (activeSection && line) {
+        let textToAdd = rawLine;
+
+        if (textToAdd.trim().startsWith('- ')) {
+            textToAdd = textToAdd.trim().substring(2);
+        } else if (textToAdd.trim().match(/^\d+\.\s+/)) {
+            textToAdd = textToAdd.trim().replace(/^\d+\.\s+/, '');
+        } else {
+            textToAdd = textToAdd.trim();
+        }
+
+        if (textToAdd) {
+            current[activeSection].push(textToAdd);
+        }
+    }
+  });
+
+  if (current.massnahme.length || current.begruendung.length || current.ziel.length || current.pruefhinweis.length || current.bezugZurHypothese.length) {
+    blocks.push(current);
+  }
+
+  return blocks.length > 0 ? blocks : [createDecisionBlock()];
 }
