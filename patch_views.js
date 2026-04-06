--- /app/app/src/components/views.js
+++ /app/app/src/components/views.js
@@ -274,7 +274,8 @@
         Maßnahme: decisionBlock.massnahme,
         Begründung: decisionBlock.begruendung,
         Ziel: decisionBlock.ziel,
-        Prüfhinweis: decisionBlock.pruefhinweis
+        'Bezug zur Hypothese': decisionBlock.bezugZurHypothese,
+        Messkriterien: decisionBlock.pruefhinweis
       };

       Object.entries(details).forEach(([label, values]) => {
