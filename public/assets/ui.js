import { formatPrice, getListingBadges } from "./app.js";

export const renderListingCard = (listing) => {
  return `
    <article class="card listing-card">
      <img src="${listing.images[0]}" alt="${listing.title}" loading="lazy" />
      <div class="stack">
        <div>
          <h3>${listing.title}</h3>
          <div class="listing-meta">${listing.city} · ${listing.type}</div>
        </div>
        <div class="listing-meta">${formatPrice(listing.indicativePricePerDay)}</div>
        <div>${getListingBadges(listing)}</div>
        <a class="button secondary" href="listing.html?id=${listing.id}">Voir détail</a>
      </div>
    </article>
  `;
};

export const renderListingPreview = (listing) => {
  return `
    <div class="card">
      <h4>${listing.title}</h4>
      <div class="listing-meta">${listing.city} · ${listing.type}</div>
      <div>${getListingBadges(listing)}</div>
      <a class="button secondary" href="listing.html?id=${listing.id}">Ouvrir l'annonce</a>
    </div>
  `;
};
