// client/src/config.js

// In development, hit your local Express server.
// In production (Netlify), fetch from the same origin under /api/…
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? ""                   // relative → Netlify Functions at /api/*
    : "http://localhost:4000";

export { BASE_URL };
