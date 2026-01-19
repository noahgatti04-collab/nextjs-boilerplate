import { Storage } from "./storage.js";
import { renderListingPreview } from "./ui.js";
import { hydrateBoosts } from "./app.js";

const DEFAULT_COORDS = [46.5197, 6.6323];
const DEFAULT_ZOOM = 12;
const TYPES = ["Voiture", "Van", "Utilitaire", "Luxe"];

const state = {
  map: null,
  markers: [],
  currentPosition: null,
};

const markerIcons = {
  Particulier: L.divIcon({
    className: "marker-personal",
    html: "<div style='background:#ffffff;width:14px;height:14px;border-radius:50%;border:2px solid #0b0c0f'></div>",
  }),
  Professionnel: L.divIcon({
    className: "marker-pro",
    html: "<div style='background:#ffb020;width:14px;height:14px;border-radius:50%;border:2px solid #0b0c0f'></div>",
  }),
  Boost: L.divIcon({
    className: "marker-boost",
    html: "<div style='background:#37d27f;width:16px;height:16px;border-radius:50%;border:2px solid #0b0c0f'></div>",
  }),
};

const setSelectOptions = (select, values) => {
  select.innerHTML = ["", ...values]
    .map((value) => `<option value="${value}">${value || "Tous"}</option>`)
    .join("");
};

const getDistanceKm = (a, b) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
};

const getFilteredListings = () => {
  const data = Storage.getAll();
  const city = document.querySelector("#filter-city").value;
  const type = document.querySelector("#filter-type").value;
  const ownerType = document.querySelector("#filter-owner").value;
  const availability = document.querySelector("#filter-availability").value;
  const minBudget = parseInt(document.querySelector("#filter-min").value || "0", 10);
  const maxBudget = parseInt(document.querySelector("#filter-max").value || "9999", 10);
  const urgentOnly = document.querySelector("#filter-urgent").checked;
  const radius = document.querySelector("#filter-radius").value;

  return data.listings.filter((listing) => {
    if (city && listing.city !== city) return false;
    if (type && listing.type !== type) return false;
    if (ownerType && listing.ownerType !== ownerType) return false;
    if (availability && listing.availabilityTag !== availability) return false;
    if (listing.indicativePricePerDay < minBudget) return false;
    if (listing.indicativePricePerDay > maxBudget) return false;
    if (urgentOnly && listing.responseSpeed !== "Rapide") return false;
    if (radius && state.currentPosition) {
      const distance = getDistanceKm(state.currentPosition, listing);
      if (distance > Number(radius)) return false;
    }
    return true;
  });
};

const renderMarkers = () => {
  state.markers.forEach((marker) => marker.remove());
  state.markers = [];
  const listings = getFilteredListings();
  const preview = document.querySelector("#map-preview");
  preview.innerHTML = listings.length
    ? ""
    : "<p class='tag'>Aucune annonce correspondante.</p>";

  listings.forEach((listing) => {
    const isBoosted = listing.boostedUntil && new Date(listing.boostedUntil) > new Date();
    const icon = isBoosted ? markerIcons.Boost : markerIcons[listing.ownerType];
    const marker = L.marker([listing.lat, listing.lng], { icon }).addTo(state.map);
    marker.on("click", () => {
      preview.innerHTML = renderListingPreview(listing);
    });
    state.markers.push(marker);
  });
};

const setupFilters = () => {
  const data = Storage.getAll();
  const citySelect = document.querySelector("#filter-city");
  const typeSelect = document.querySelector("#filter-type");
  setSelectOptions(citySelect, [...new Set(data.listings.map((item) => item.city))]);
  setSelectOptions(typeSelect, TYPES);

  document.querySelectorAll("select, input").forEach((input) => {
    input.addEventListener("change", renderMarkers);
  });

  document.querySelector("#locate-me").addEventListener("click", () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      state.currentPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      state.map.setView([state.currentPosition.lat, state.currentPosition.lng], 13);
      renderMarkers();
    });
  });
};

export const initMap = () => {
  hydrateBoosts();
  const mapContainer = document.querySelector("#map");
  if (!mapContainer) return;
  state.map = L.map("map").setView(DEFAULT_COORDS, DEFAULT_ZOOM);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(state.map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        state.currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        state.map.setView([state.currentPosition.lat, state.currentPosition.lng], 12);
        renderMarkers();
      },
      () => renderMarkers()
    );
  } else {
    renderMarkers();
  }

  setupFilters();
};
