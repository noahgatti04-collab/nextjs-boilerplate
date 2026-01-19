# Vantadrive — rent a ride

MVP mobile-first pour la Suisse. Application web statique en HTML/CSS/JS vanilla avec carte Leaflet, annonces mockées et stockage LocalStorage.

## Structure

Fichiers principaux disponibles dans `public/` :

- `index.html` (home)
- `map.html` (carte + filtres)
- `list.html` (liste annonces)
- `listing.html?id=...` (détail annonce)
- `login.html`, `register.html`
- `dashboard.html` (propriétaire)
- `create-listing.html` (création annonce)
- `pricing.html` (abonnements)
- `boosts.html` (acheter boost)
- `legal.html` (mentions légales + CGU + disclaimer)
- `public/assets/` (styles, logique JS, seed data)

## Lancer en local

Vous pouvez utiliser un serveur statique simple :

```bash
npx serve public
```

Puis ouvrir `http://localhost:3000/index.html` (ou l’URL affichée par le serveur).

## Reset des données LocalStorage

Dans la console du navigateur :

```js
localStorage.removeItem("vantadrive");
```

Rechargez la page pour reseeder les données.

## Ajouter des annonces

1. Ouvrez `public/assets/data.js`.
2. Ajoutez un objet dans `seedListings` avec les champs :
   - `id`, `title`, `type`, `ownerType`, `city`, `lat`, `lng`,
   - `indicativePricePerDay`, `availabilityTag`, `responseSpeed`,
   - `images`, `boostedUntil`, `createdAt`.
3. Sauvegardez et rechargez la page.
