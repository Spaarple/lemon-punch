# Composant Breadcrumb

Un composant réutilisable pour créer des fils d'Ariane (breadcrumbs) avec génération automatique ou manuelle.

## Utilisation

### 1. Génération automatique (par défaut)

Le composant analyse automatiquement l'URL pour créer les breadcrumbs :

```astro
---
import Breadcrumb from "../components/ui/Breadcrumb.astro";
---

<!-- Génération automatique basée sur l'URL -->
<Breadcrumb />

<!-- Avec titre personnalisé pour la page actuelle -->
<Breadcrumb currentPageTitle="Mon Super Produit" />
```

### 2. Breadcrumbs manuels

Définissez vous-même les éléments du fil d'Ariane :

```astro
<Breadcrumb
    items={[
        { label: 'Accueil', href: '/' },
        { label: 'Boutique', href: '/produits' },
        { label: 'T-shirts', href: '/produits/t-shirts' },
        { label: 'T-shirt LemonPunch' } // Pas de href = page actuelle
    ]}
    autoGenerate={false}
/>
```

### 3. Personnalisation

```astro
<Breadcrumb
    separator="→"
    showHome={false}
    currentPageTitle="Page Actuelle"
/>
```

## Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `items` | `Array<{label: string, href?: string}>` | `[]` | Éléments du breadcrumb (manuel) |
| `autoGenerate` | `boolean` | `true` | Génération automatique basée sur l'URL |
| `separator` | `string` | `'/'` | Séparateur entre les éléments |
| `showHome` | `boolean` | `true` | Afficher le lien "Accueil" |
| `currentPageTitle` | `string` | - | Titre personnalisé pour la page actuelle |

## Mapping automatique

Le composant map automatiquement les segments d'URL vers des labels lisibles :

- `/produits` → "Produits"
- `/albums` → "Albums"
- `/concerts` → "Concerts"
- `/videos` → "Vidéos"
- `/contact` → "Contact"
- `/panier` → "Panier"
- `/mon-compte` → "Mon Compte"

## Exemples d'usage

### Page produit
```astro
<!-- URL: /produits/t-shirt-lemonpunch -->
<Breadcrumb currentPageTitle={product.name} />
<!-- Résultat: Accueil / Produits / T-shirt LemonPunch -->
```

### Page album
```astro
<!-- URL: /albums/mon-album -->
<Breadcrumb currentPageTitle={album.title} />
<!-- Résultat: Accueil / Albums / Mon Album -->
```

### Breadcrumb personnalisé
```astro
<Breadcrumb
    items={[
        { label: 'Boutique', href: '/produits' },
        { label: 'Catégorie', href: '/produits/t-shirts' },
        { label: 'Produit' }
    ]}
    separator="→"
    showHome={true}
/>
<!-- Résultat: Accueil → Boutique → Catégorie → Produit -->
```

## Variantes de style

Le composant supporte différentes variantes CSS :

```astro
<!-- Breadcrumb minimal (sans fond) -->
<Breadcrumb class="minimal" />

<!-- Breadcrumb sombre -->
<Breadcrumb class="dark" />
```

## Responsive

Le composant est entièrement responsive :
- **Desktop** : Affichage complet
- **Tablette** : Taille de police réduite
- **Mobile** : Espacement réduit, troncature des longs labels

## Accessibilité

- Utilise `aria-label="Fil d'Ariane"`
- Marque la page actuelle avec `aria-current="page"`
- Sépare les éléments avec `aria-hidden="true"`
- Compatible lecteurs d'écran