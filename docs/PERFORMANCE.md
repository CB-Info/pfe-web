# Performance — C2.2.3

## Optimisations Implémentées

### 1. Code Splitting

#### Route-based Splitting
```typescript
// Lazy loading des pages
const DashboardPage = lazy(() => import("./UI/pages/dashboard/dashboard.page"));
const DishesPage = lazy(() => import("./UI/pages/dishes/dishes.page"));
const CardsPage = lazy(() => import("./UI/pages/cards/cards.page"));
const SettingsPage = lazy(() => import("./UI/pages/settings/settings.page"));
```

**Impact** :
- Bundle initial réduit
- Chargement à la demande
- Time to Interactive amélioré

#### Suspense Boundaries
```typescript
<Suspense
  fallback={
    <div className="flex items-center justify-center h-full">
      <Loading size="medium" text="Chargement de la page..." />
    </div>
  }
>
  <Routes>{/* Routes lazy loaded */}</Routes>
</Suspense>
```

### 2. Bundle Optimization

#### Vite Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true, filename: 'bundle-stats.html' })
  ],
  build: {
    // Optimisations par défaut Vite
    minify: 'terser',
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparation vendors automatique
        }
      }
    }
  }
})
```

### 3. React Optimizations

#### useCallback pour Event Handlers
```typescript
const toggleSidebar = useCallback(() => {
  setIsSidebarOpen((prev) => !prev);
}, []);

const closeSidebar = useCallback(() => {
  setIsSidebarOpen(false);
}, []);
```

#### État Local vs Global
- État global : Auth, Theme, Alerts uniquement
- État local : UI states, forms, toggles

### 4. Asset Optimization

#### Images
**État actuel** : Pas d'optimisation automatique

**Recommandations** :
```typescript
// Format moderne avec fallback
<picture>
  <source type="image/webp" srcSet="image.webp" />
  <img src="image.jpg" alt="Description" loading="lazy" />
</picture>
```

#### Fonts
```css
/* Configuration Tailwind */
fontFamily: {
  'lufga': ['Lufga', 'sans-serif'],
  'inter': ['Inter', 'sans-serif']
}
```

**Optimisations futures** :
- Font-display: swap
- Preload critical fonts
- Subset fonts

### 5. CSS Optimization

#### Tailwind Purge
```javascript
// tailwind.config.cjs
content: [
  "./src/**/*.{js,ts,jsx,tsx,mdx}"
]
```

**Impact** :
- CSS final purgé des classes non utilisées
- Bundle CSS minimal en production

#### Twin.macro
- CSS-in-JS optimisé
- Extraction statique possible
- Tree-shaking des styles

## Métriques de Performance

### Lighthouse Scores (Cibles)

| Métrique | Score Cible | État Actuel |
|----------|-------------|-------------|
| Performance | > 90 | À mesurer |
| First Contentful Paint | < 1.8s | À mesurer |
| Time to Interactive | < 3.8s | À mesurer |
| Speed Index | < 3.4s | À mesurer |
| Total Blocking Time | < 200ms | À mesurer |
| Cumulative Layout Shift | < 0.1 | À mesurer |

### Bundle Size

**Build Output** :
```bash
npm run build
# dist/assets/index-[hash].js    (~200KB gzipped estimé)
# dist/assets/vendor-[hash].js   (~150KB gzipped estimé)
```

**Analyse** :
```bash
# Visualizer pour analyser
npm run build
# Ouvre bundle-stats.html
```

## Monitoring Performance

### Web Vitals (À implémenter)
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Envoyer à Google Analytics ou autre
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Performance Observer
```typescript
// Observer pour long tasks
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('Long task detected:', entry);
  }
});

observer.observe({ entryTypes: ['longtask'] });
```

## Optimisations Réseau

### API Calls
- Pas de cache structuré actuellement
- Tokens Firebase auto-refresh
- Pas de retry automatique

### Recommandations
```typescript
// Cache avec stale-while-revalidate
const fetchWithCache = async (url: string) => {
  const cache = await caches.open('api-cache');
  const cached = await cache.match(url);
  
  if (cached) {
    // Return cached immediately
    return cached.json();
  }
  
  const response = await fetch(url);
  cache.put(url, response.clone());
  return response.json();
};
```

## Optimisations Futures

### Court Terme

1. **Mesures Initiales**
   ```bash
   # Lighthouse CI
   npm install -g @lhci/cli
   lhci autorun
   ```

2. **Image Optimization**
   - Plugin Vite pour optimisation
   - Lazy loading natif
   - Formats modernes (WebP)

3. **Font Loading**
   ```html
   <link rel="preload" href="/fonts/inter.woff2" as="font" crossorigin>
   ```

### Moyen Terme

1. **Service Worker**
   ```typescript
   // Cache stratégies
   - Cache First : Assets statiques
   - Network First : API calls
   - Stale While Revalidate : Images
   ```

2. **React Query / TanStack Query**
   - Cache automatique
   - Background refetch
   - Optimistic updates

3. **Virtual Scrolling**
   Pour listes longues (plats, commandes)

### Long Terme

1. **SSR/SSG avec Next.js**
   - Meilleur SEO
   - Faster initial load
   - Hydratation progressive

2. **Edge Functions**
   - API responses plus rapides
   - Géolocalisation CDN

3. **HTTP/3 et QUIC**
   Via hébergeur moderne

## Checklist Performance

### Avant Deploy
- [ ] Build production (`npm run build`)
- [ ] Analyser bundle size
- [ ] Vérifier lazy loading
- [ ] Tester sur connection lente

### Après Deploy
- [ ] Lighthouse audit
- [ ] Real User Monitoring
- [ ] Core Web Vitals
- [ ] Mobile performance

## Scripts Utiles

```bash
# Build avec stats
npm run build -- --mode analyze

# Servir build local
npm run preview

# Mesurer performance
lighthouse https://localhost:4173 --view

# Bundle analysis
npx vite-bundle-visualizer
```

## Ressources

### Outils
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [Bundle Analyzer](https://bundlejs.com/)

### Documentation
- [Web.dev Performance](https://web.dev/performance/)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Vite Performance](https://vitejs.dev/guide/performance.html)

## KPIs à Suivre

1. **Page Load Time** : < 3s sur 3G
2. **Time to Interactive** : < 5s
3. **Bundle Size** : < 400KB gzipped
4. **Lighthouse Score** : > 90
5. **Core Web Vitals** : Tous verts