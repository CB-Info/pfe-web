#!/usr/bin/env node

/**
 * Post-installation script
 * Optimizes the development environment and CI setup
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up development environment...\n');

// Vérifier et créer .env.example si il n'existe pas
const envExamplePath = path.join(process.cwd(), '.env.example');
if (!fs.existsSync(envExamplePath)) {
  const envExampleContent = `# Firebase Configuration
# Get these values from your Firebase project settings
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Optional
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
NODE_ENV=development
`;

  fs.writeFileSync(envExamplePath, envExampleContent);
  console.log('✅ Created .env.example template');
}

// Vérifier .gitignore
const gitignorePath = path.join(process.cwd(), '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  const requiredEntries = [
    '.env',
    '.env.local',
    '.env.development',
    '.env.test',
    '.env.production',
    'npm-debug.log*',
    'yarn-debug.log*',
    'yarn-error.log*',
    '.vscode/settings.json',
    '.idea/',
    '*.log'
  ];
  
  let needsUpdate = false;
  const missingEntries = [];
  
  requiredEntries.forEach(entry => {
    if (!gitignoreContent.includes(entry)) {
      missingEntries.push(entry);
      needsUpdate = true;
    }
  });
  
  if (needsUpdate) {
    fs.appendFileSync(gitignorePath, '\n# Environment and IDE files\n' + missingEntries.join('\n') + '\n');
    console.log('✅ Updated .gitignore with security entries');
  } else {
    console.log('✅ .gitignore is properly configured');
  }
}

// Créer le dossier .vscode avec les configurations recommandées
const vscodePath = path.join(process.cwd(), '.vscode');
if (!fs.existsSync(vscodePath)) {
  fs.mkdirSync(vscodePath);
}

// Configuration VSCode pour le projet
const vscodeSettingsPath = path.join(vscodePath, 'settings.json');
if (!fs.existsSync(vscodeSettingsPath)) {
  const vscodeSettings = {
    "typescript.preferences.importModuleSpecifier": "relative",
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    },
    "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
    "files.associations": {
      "*.css": "tailwindcss"
    },
    "emmet.includeLanguages": {
      "javascript": "javascriptreact",
      "typescript": "typescriptreact"
    }
  };
  
  fs.writeFileSync(vscodeSettingsPath, JSON.stringify(vscodeSettings, null, 2));
  console.log('✅ Created VSCode workspace settings');
}

// Extensions recommandées pour VSCode
const vscodeExtensionsPath = path.join(vscodePath, 'extensions.json');
if (!fs.existsSync(vscodeExtensionsPath)) {
  const recommendedExtensions = {
    "recommendations": [
      "esbenp.prettier-vscode",
      "dbaeumer.vscode-eslint",
      "bradlc.vscode-tailwindcss",
      "ms-vscode.vscode-typescript-next",
      "formulahendry.auto-rename-tag",
      "christian-kohler.path-intellisense",
      "ms-vscode.vscode-json"
    ]
  };
  
  fs.writeFileSync(vscodeExtensionsPath, JSON.stringify(recommendedExtensions, null, 2));
  console.log('✅ Created VSCode extensions recommendations');
}

// Vérifier la structure des dossiers
const requiredDirs = ['src/components', 'src/pages', 'src/hooks', 'src/utils', 'src/types', 'src/assets'];
requiredDirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Créer un fichier d'aide pour les développeurs
const devHelpPath = path.join(process.cwd(), 'DEVELOPMENT.md');
if (!fs.existsSync(devHelpPath)) {
  const devHelpContent = `# Guide de Développement - Web ERP

## 🚀 Démarrage rapide

1. **Installation**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configuration**
   \`\`\`bash
   cp .env.example .env
   # Remplir les valeurs dans .env
   \`\`\`

3. **Démarrage**
   \`\`\`bash
   npm run dev
   \`\`\`

## 🛠️ Scripts disponibles

- \`npm run dev\` - Serveur de développement
- \`npm run build\` - Build de production
- \`npm run preview\` - Prévisualisation du build
- \`npm run lint\` - Linting du code
- \`npm test\` - Tests unitaires
- \`npm run validate-env\` - Validation de l'environnement

## 📁 Structure du projet

\`\`\`
src/
├── components/     # Composants réutilisables
├── pages/         # Pages/vues de l'application
├── hooks/         # Hooks React personnalisés
├── utils/         # Utilitaires et helpers
├── types/         # Types TypeScript
└── assets/        # Assets statiques
\`\`\`

## 🎯 Conventions

- **Commits** : Utiliser le format conventional commits
- **Components** : PascalCase, un composant par fichier
- **Hooks** : Préfixe \`use\`, camelCase
- **Types** : PascalCase, suffixe \`Type\` ou \`Interface\`

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
`;

  fs.writeFileSync(devHelpPath, devHelpContent);
  console.log('✅ Created development guide');
}

console.log('\n🎉 Development environment setup complete!');
console.log('📖 Check DEVELOPMENT.md for detailed information');
console.log('🔧 Check .github/README.md for CI/CD documentation');

// Message final avec les prochaines étapes
console.log('\n📋 Next steps:');
console.log('1. Copy .env.example to .env and configure your Firebase settings');
console.log('2. Run npm run validate-env to verify your configuration');
console.log('3. Start development with npm run dev');
console.log('4. Open the project in VSCode for optimal experience');