import { seedListings, seedMessages, seedUsers } from "./data.js";

const STORAGE_KEY = "vantadrive";

const defaultData = {
  users: seedUsers,
  listings: seedListings,
  messages: seedMessages,
  subscriptions: [],
  boosts: [],
  currentUserId: null,
};

export const Storage = {
  seed() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    }
  },
  reset() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
  },
  getAll() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { ...defaultData };
  },
  setAll(payload) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  },
  update(partial) {
    const data = Storage.getAll();
    Storage.setAll({ ...data, ...partial });
  },
  getCurrentUser() {
    const data = Storage.getAll();
    return data.users.find((user) => user.id === data.currentUserId) || null;
  },
  setCurrentUser(id) {
    Storage.update({ currentUserId: id });
  },
  addUser(user) {
    const data = Storage.getAll();
    data.users.push(user);
    Storage.setAll(data);
  },
  addListing(listing) {
    const data = Storage.getAll();
    data.listings.unshift(listing);
    Storage.setAll(data);
  },
  updateListing(listing) {
    const data = Storage.getAll();
    data.listings = data.listings.map((item) =>
      item.id === listing.id ? listing : item
    );
    Storage.setAll(data);
  },
  addMessage(message) {
    const data = Storage.getAll();
    data.messages.unshift(message);
    Storage.setAll(data);
  },
  addSubscription(subscription) {
    const data = Storage.getAll();
    data.subscriptions = [
      ...data.subscriptions.filter((item) => item.userId !== subscription.userId),
      subscription,
    ];
    Storage.setAll(data);
  },
  addBoost(boost) {
    const data = Storage.getAll();
    data.boosts = data.boosts.filter((item) => item.listingId !== boost.listingId);
    data.boosts.unshift(boost);
    Storage.setAll(data);
  },
};

export const getActiveBoost = (listingId) => {
  const data = Storage.getAll();
  const boost = data.boosts.find((item) => item.listingId === listingId);
  if (!boost) return null;
  if (new Date(boost.endsAt) < new Date()) return null;
  return boost;
};

export const getSubscriptionForUser = (userId) => {
  const data = Storage.getAll();
  return data.subscriptions.find((item) => item.userId === userId) || null;
};

export const getQuotaForPlan = (plan) => {
  switch (plan) {
    case "Starter":
      return 1;
    case "Grow":
      return 3;
    case "Scale":
      return 6;
    case "Unlimited":
      return Infinity;
    default:
      return 0;
  }
};
