export const firebaseConfig = {
  apiKey: "AIzaSyC2uBMY69HSRyPlHol9EZcWYN6WP7nvRBY",
  authDomain: "house-system-c0a1f.firebaseapp.com",
  projectId: "house-system-c0a1f",
  storageBucket: "house-system-c0a1f.firebasestorage.app",
  messagingSenderId: "246023220873",
  appId: "1:246023220873:web:3abcb38b5e5056e6666058",
  measurementId: "G-V691MQB50R"
};

export const SCHOOL_NAME = "North Hill Education System";

export const HOUSES = [
  { id: "wolves", name: "Wolves", logo: "assets/logos/wolves.png" },
  { id: "falcons", name: "Falcons", logo: "assets/logos/falcons.png" },
  { id: "lions", name: "Lions", logo: "assets/logos/lions.png" },
  { id: "bears", name: "Bears", logo: "assets/logos/bears.png" }
];

export const HOUSE_BY_ID = Object.fromEntries(HOUSES.map((h) => [h.id, h]));
