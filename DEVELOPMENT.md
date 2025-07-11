# Guide de Développement - Web ERP

## 🚀 Démarrage rapide

1. **Installation**
   ```bash
   npm install
   ```

2. **Configuration**
   ```bash
   cp .env.example .env
   # Remplir les valeurs dans .env
   ```

3. **Démarrage**
   ```bash
   npm run dev
   ```

## 🛠️ Scripts disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run preview` - Prévisualisation du build
- `npm run lint` - Linting du code
- `npm test` - Tests unitaires
- `npm run validate-env` - Validation de l'environnement

## 📁 Structure du projet

```
src/
├── components/     # Composants réutilisables
├── pages/         # Pages/vues de l'application
├── hooks/         # Hooks React personnalisés
├── utils/         # Utilitaires et helpers
├── types/         # Types TypeScript
└── assets/        # Assets statiques
```

## 🎯 Conventions

- **Commits** : Utiliser le format conventional commits
- **Components** : PascalCase, un composant par fichier
- **Hooks** : Préfixe `use`, camelCase
- **Types** : PascalCase, suffixe `Type` ou `Interface`

## 🔧 Configuration IDE

Les configurations VSCode sont automatiquement créées pour :
- Formatage automatique avec Prettier
- Correction ESLint au save
- Suggestions Tailwind CSS
- IntelliSense pour les chemins

## 📖 Ressources

- [Documentation React](https://react.dev/)
- [Documentation Vite](https://vitejs.dev/)
- [Documentation Tailwind CSS](https://tailwindcss.com/)
- [Documentation Firebase](https://firebase.google.com/docs/)
