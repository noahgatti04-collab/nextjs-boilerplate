import { Storage, getActiveBoost, getQuotaForPlan, getSubscriptionForUser } from "./storage.js";

const navItems = [
  { label: "Map", href: "map.html" },
  { label: "Rechercher", href: "list.html" },
  { label: "Publier", href: "create-listing.html" },
  { label: "Dashboard", href: "dashboard.html" },
  { label: "Plus", href: "pricing.html" },
];

Storage.seed();

export const initNav = () => {
  const nav = document.querySelector("nav.bottom-nav");
  if (!nav) return;
  const current = window.location.pathname.split("/").pop();
  nav.innerHTML = navItems
    .map((item) => {
      const active = current === item.href || (!current && item.href === "index.html");
      return `<a href="${item.href}" class="${active ? "active" : ""}">${item.label}</a>`;
    })
    .join("");
};

export const initDisclaimer = () => {
  const disclaimer = document.querySelector(".disclaimer");
  if (!disclaimer) return;
  disclaimer.innerHTML =
    "Vantadrive est un intermédiaire. Aucun paiement de location, contrat ou assurance n'est géré par la plateforme.";
};

export const initAuthBanner = () => {
  const userLabel = document.querySelector("[data-current-user]");
  if (!userLabel) return;
  const currentUser = Storage.getCurrentUser();
  userLabel.textContent = currentUser
    ? `Connecté: ${currentUser.name}`
    : "Invité — connectez-vous pour publier";
};

export const getListingBadges = (listing) => {
  const badges = [];
  const boost = getActiveBoost(listing.id);
  if (boost) {
    badges.push("<span class=\"badge boost\">Boost</span>");
  }
  if (listing.responseSpeed === "Rapide") {
    badges.push("<span class=\"badge fast\">Réponse rapide</span>");
  }
  return badges.join(" ");
};

export const formatPrice = (price) => `${price} CHF / jour`;

export const formatDate = (value) => new Date(value).toLocaleDateString("fr-CH");

export const ensureAuth = () => {
  const currentUser = Storage.getCurrentUser();
  if (!currentUser) {
    window.location.href = "login.html";
  }
  return currentUser;
};

export const canCreateListing = (userId) => {
  const subscription = getSubscriptionForUser(userId);
  if (!subscription) return { ok: false, reason: "Aucun abonnement actif." };
  const quota = getQuotaForPlan(subscription.plan);
  const data = Storage.getAll();
  const count = data.listings.filter((listing) => listing.ownerId === userId).length;
  if (count >= quota) {
    return { ok: false, reason: "Quota atteint pour votre plan." };
  }
  return { ok: true };
};

export const hydrateBoosts = () => {
  const data = Storage.getAll();
  data.listings = data.listings.map((listing) => {
    const boost = getActiveBoost(listing.id);
    return {
      ...listing,
      boostedUntil: boost ? boost.endsAt : null,
    };
  });
  Storage.setAll(data);
};
