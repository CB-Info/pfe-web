### Bugs/Anomalies connues (frontend)

État à date de l'analyse:

- Aucune anomalie bloquante explicitement documentée dans le code. Les erreurs réseau sont gérées par alertes.

Problèmes potentiels à surveiller:
- `test:coverage` peut prendre du temps/échouer dans certains environnements sans configuration adaptée (timeout constaté ici). Action: exécuter localement/CI et archiver les rapports.

Hors périmètre MVP (non implémenté, pas des bugs):
- Page 404 dédiée et routage d'erreurs (401/403) non présents.
- Garde par rôles (RBAC) côté UI non exposée.

