/* =========================================================
   Why Travels? — script.js
   Vanilla JS. Stages: lang → intro → quest → reveal → result
   ========================================================= */
(() => {
'use strict';

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const RM = window.matchMedia('(prefers-reduced-motion: reduce)');
const reduced = () => RM.matches;
const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let _uid = 0; const uid = () => 'u' + (++_uid);
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} }
};


/* =========================================================
   ICON LIBRARY — inline SVG line icons (24×24, currentColor)
   ========================================================= */
const ICONS = {
  mute: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6M21 9l-5 6"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M17 14c2.6 0 4.6 2 4.6 4.6"/>',
  waves: '<path d="M2 8c2.5-2 4.5-2 7 0s4.5 2 7 0 4-1.5 6-.5"/><path d="M2 13c2.5-2 4.5-2 7 0s4.5 2 7 0 4-1.5 6-.5"/><path d="M2 18c2.5-2 4.5-2 7 0s4.5 2 7 0 4-1.5 6-.5"/>',
  mountain: '<path d="M2 20 9.5 5l4.5 8 2.5-3.5L22 20z"/><path d="m7.5 9.5 2 1.5 2-1.5"/>',
  moonstar: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/><path d="M17 3v4M15 5h4"/>',
  sunrise: '<path d="M3 19h18"/><path d="M7 19a5 5 0 0 1 10 0"/><path d="M12 3v5M10 5l2-2 2 2M4.5 11l1.8 1.8M19.5 11l-1.8 1.8M2 16h2M20 16h2"/>',
  sunset: '<path d="M3 20h18"/><path d="M7 20a5 5 0 0 1 10 0"/><path d="M12 3v5M10 6l2 2 2-2M4.5 12l1.8 1.8M19.5 12l-1.8 1.8M2 17h2M20 17h2"/>',
  snow: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7"/><path d="m9 4 3 2 3-2M9 20l3-2 3 2"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4.1 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  tent: '<path d="m12 3-9 17h18z"/><path d="M12 3v17"/><path d="m9.5 20 2.5-5 2.5 5"/>',
  bell: '<path d="M5 18a7 7 0 0 1 14 0z"/><path d="M12 8V6m-2 0h4"/><path d="M3 21h18"/>',
  summit: '<path d="m3 20 7-13 4 7 2-3 5 9z"/><path d="M10 7V2.5l4 1.5-4 1.5"/>',
  bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  coffee: '<path d="M4 9h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16 11h2a2.5 2.5 0 0 1 0 5h-2"/><path d="M8 3v3M12 3v3"/>',
  droplet: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  droplets: '<path d="M8 3s4 4.5 4 7.5a4 4 0 0 1-8 0C4 7.5 8 3 8 3z"/><path d="M17 12s3.2 3.5 3.2 5.8a3.2 3.2 0 0 1-6.4 0C13.8 15.5 17 12 17 12z"/>',
  door: '<path d="M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17"/><path d="M3 21h18"/><circle cx="15.5" cy="12.5" r=".8" fill="currentColor"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.3 1 2.1h5c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  palm: '<path d="M12 22c0-5 .5-9 2-12"/><path d="M14 10c-1-3-4-4.5-8-3.5 2 .2 4 1 5.5 3"/><path d="M14 10c0-3.5 2-5.5 6-6-1.5 1.2-2.5 3-2.5 5"/><path d="M14 10c2.5-1 5.5 0 7 3-2-1-4-1.2-5.5-.5"/><path d="M14 10c-2 .5-4 2.5-4.5 5 1.2-1.7 2.8-2.7 4.5-3"/>',
  pine: '<path d="m12 2-5 7h3l-4.5 6h4L7 19h10l-3.5-4h4L14 9h3z"/><path d="M12 19v3"/>',
  backpack: '<path d="M9 5V4a3 3 0 0 1 6 0v1"/><rect x="5" y="5" width="14" height="16" rx="4"/><path d="M9 14h6v3H9z"/>',
  scale: '<path d="M12 3v17M7 20h10M5 7h14"/><path d="m5 7-3 7a3.5 3.5 0 0 0 6 0zM19 7l-3 7a3.5 3.5 0 0 0 6 0z"/>',
  gem: '<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M9 3l-2 6 5 12M15 3l2 6-5 12"/>',
  trail: '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h6a3.5 3.5 0 0 0 0-7h-4a3.5 3.5 0 0 1 0-7h6"/>',
  column: '<path d="M4 8h16L12 3z"/><path d="M8 8v10M12 8v10M16 8v10M6 18h12M4 21h16"/>',
  umbrella: '<path d="M3 12a9 9 0 0 1 18 0z"/><path d="M12 3v18"/><path d="M5 21h14"/>',
  sailboat: '<path d="M12 3v14M12 4c4 2 6.5 6 7 11h-7M12 7c-3 2-5 5-5 8h5"/><path d="M3 19h18l-2.5 3h-13z"/>',
  wine: '<path d="M8 3h8l1 6a5 5 0 0 1-10 0z"/><path d="M12 14v7M8 21h8"/>',
  mask: '<path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a4 4 0 0 1-4 4h-2.5a2 2 0 0 1-1.7-1l-.8-1.4-.8 1.4a2 2 0 0 1-1.7 1H7a4 4 0 0 1-4-4z"/><path d="M8 7v5M16 7v5"/>',
  chef: '<path d="M7 14a4 4 0 0 1-1-7.9A4.5 4.5 0 0 1 12 3a4.5 4.5 0 0 1 6 3.1A4 4 0 0 1 17 14z"/><path d="M7 14v6h10v-6M7 17h10"/>',
  torii: '<path d="M2 6c4 2 16 2 20 0"/><path d="M4 9.5h16"/><path d="M6 6.5V21M18 6.5V21M12 9.5V13"/>',
  bamboo: '<path d="M8 3v18M16 3v18M6 8h4M6 15h4M14 6h4M14 13h4M14 19h4"/>',
  pagoda: '<path d="M12 2v3"/><path d="M6 8c3 0 4-3 6-3s3 3 6 3z"/><path d="M8 8v4M16 8v4M4 15c3 0 5-3 8-3s5 3 8 3z"/><path d="M7 15v3M17 15v3M3 21h18M12 18v3"/>',
  lantern: '<path d="M10 2h4M12 2v3"/><ellipse cx="12" cy="12" rx="6" ry="7"/><path d="M6.5 10h11M6.5 14h11M10 19v3M14 19v3"/>',
  teacup: '<path d="M4 10h13v3a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z"/><path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M3 21h15"/><path d="M8 3c-1 1 1 2 0 4M12 3c-1 1 1 2 0 4"/>',
  shirt: '<path d="m8 3-5 4 3 3 2-1.5V21h8V8.5L18 10l3-3-5-4a4 4 0 0 1-8 0z"/>',
  lotus: '<path d="M12 4c2.5 2.5 3.5 5 3.5 8s-1.5 5-3.5 7c-2-2-3.5-4-3.5-7S9.5 6.5 12 4z"/><path d="M12 19c-4 0-8-3-9-8 3 0 6 1 7.5 3.5M12 19c4 0 8-3 9-8-3 0-6 1-7.5 3.5"/>',
  utensils: '<path d="M5 3v7a2.5 2.5 0 0 0 5 0V3M7.5 3v18"/><path d="M17 21V3c-2.5 1.5-4 4-4 8h4"/>',
  train: '<rect x="5" y="3" width="14" height="15" rx="3"/><path d="M5 11h14M9 14.5h.01M15 14.5h.01M8 21l2-3M16 21l-2-3"/>',
  canoe: '<path d="M2 14c3 5 17 5 20 0z"/><path d="M6 6l12 10M4 8l4-4"/>',
  parachute: '<path d="M3 11a9 9 0 0 1 18 0c-1.5-1.5-3-1.5-4.5 0-1.5-1.5-3-1.5-4.5 0-1.5-1.5-3-1.5-4.5 0C6 9.5 4.5 9.5 3 11z"/><path d="m3 11 9 9 9-9M12 11v9"/><circle cx="12" cy="21.5" r=".8" fill="currentColor"/>',
  cheese: '<path d="M3 17v-7l18-6v13z"/><path d="M3 10l18 3"/><circle cx="8" cy="14.5" r=".8" fill="currentColor"/><circle cx="14" cy="13.5" r=".8" fill="currentColor"/><circle cx="17" cy="8.5" r=".8" fill="currentColor"/>',
  wheat: '<path d="M12 22V8"/><path d="M12 8c-2-.5-3-2-3-4 2 .5 3 2 3 4zM12 8c2-.5 3-2 3-4-2 .5-3 2-3 4zM12 14c-2-.5-3.5-2-3.5-4 2 .5 3.5 2 3.5 4zM12 14c2-.5 3.5-2 3.5-4-2 .5-3.5 2-3.5 4zM12 20c-2-.5-3.5-2-3.5-4 2 .5 3.5 2 3.5 4zM12 20c2-.5 3.5-2 3.5-4-2 .5-3.5 2-3.5 4z"/>',
  paw: '<circle cx="6" cy="11" r="2"/><circle cx="10" cy="6" r="2"/><circle cx="15" cy="6" r="2"/><circle cx="19" cy="11" r="2"/><path d="M12 12c3 0 6 3.5 6 6 0 2-2 2.5-3.5 2-1-.4-1.5-.6-2.5-.6s-1.5.2-2.5.6C8 20.5 6 20 6 18c0-2.5 3-6 6-6z"/>',
  volcano: '<path d="M2 21 9 9h6l7 12z"/><path d="M9 9 8 5M12 7V3M15 9l1-4"/>',
  bowl: '<path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M8 21h8M9 4c-1 1 1 2 0 4M13 4c-1 1 1 2 0 4"/>',
  flower: '<circle cx="12" cy="12" r="2.5"/><path d="M12 9.5C10 8 10 4 12 3c2 1 2 5 0 6.5zM12 14.5c-2 1.5-2 5.5 0 6.5 2-1 2-5 0-6.5zM9.5 12C8 10 4 10 3 12c1 2 5 2 6.5 0zM14.5 12c1.5-2 5.5-2 6.5 0-1 2-5 2-6.5 0z"/>',
  mosque: '<path d="M12 3c-.5 2-3.5 3-3.5 6.5h7C15.5 6 12.5 5 12 3z"/><path d="M6 21v-8.5h12V21M3 21h18"/><path d="M10 21v-4a2 2 0 0 1 4 0v4"/><path d="M3 21V9m0 0 1-2 1 2"/><path d="M21 21V9m0 0-1-2-1 2"/>',
  balloon: '<path d="M12 2a7 7 0 0 0-7 7c0 4 3.5 7 7 9 3.5-2 7-5 7-9a7 7 0 0 0-7-7z"/><path d="M9 20h6v3H9zM10 18l-1 2M14 18l1 2"/>',
  bath: '<path d="M3 12h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z"/><path d="M6 12V6a2 2 0 0 1 4 0M6 20l-1 2M18 20l1 2"/>',
  tagine: '<path d="M3 20h18M5 20a7 6 0 0 1 14 0"/><path d="M12 14c-1.5 0-1.5-8 0-9 1.5 1 1.5 9 0 9z"/>',
  dune: '<circle cx="17" cy="7" r="3"/><path d="M2 20c3-7 7-8 10-3 3 4 6 1 10-3"/><path d="M2 20h20"/>',
  steam: '<path d="M8 4c-1.5 2 1.5 3 0 5.5M12 4c-1.5 2 1.5 3 0 5.5M16 4c-1.5 2 1.5 3 0 5.5"/><path d="M3 15h18M5 15c0 4 3 6 7 6s7-2 7-6"/>',
  aurora: '<path d="M3 20c2-8 5-12 9-16 0 6 2 10 9 16"/><path d="M8 20c1-4 2-6 4-9M15 20c0-3-1-5-3-9"/>',
  whale: '<path d="M3 13c0-4 3-7 8-7s8 3 8 7c0 3-3 5-8 5-3 0-5-1-6.5-2L3 17z"/><path d="M19 10c1-2 2-3 3-3.5-.2 2-.5 3 0 5"/><circle cx="8" cy="11" r=".8" fill="currentColor"/>',
  fish: '<path d="M2 12c3-5 9-6 14-2 1 1 2 2 2 2s-1 1-2 2c-5 4-11 3-14-2z"/><path d="M18 12l4-4v8z"/><circle cx="7" cy="11" r=".8" fill="currentColor"/>',
  home: '<path d="M3 11 12 4l9 7"/><path d="M5 10v6h14v-6"/><path d="M2 21c2-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0 2.5 1 3 .5"/>',
  tower: '<path d="M8 21 9 11h6l1 10z"/><path d="M7 11h10M8 11V8h8v3"/><path d="m8 8 4-5 4 5"/>',
  ship: '<path d="M4 11h16l-2.5 6h-11z"/><path d="M6 11V7h12v4M9 7V4h6v3"/><path d="M2 21c2.5-1.5 4.5-1.5 7 0s4.5 1.5 7 0 4-1.5 6 0"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>',
  pin: '<path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
  copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  printer: '<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="9" rx="2"/><path d="M6 14h12v7H6z"/>',
  plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
  rotate: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'
};
const icon = n => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[n] || ICONS.pin}</svg>`;

const state = {
  lang: 'en', stage: 'lang', q: 0, answers: [], lock: false,
  profile: {}, weights: {}, ranking: [], destIdx: 0,
  tier: 'mid', days: 5, people: 2, day: 0, unveiled: false
};
const L = o => o[state.lang];
const isRTL = () => state.lang === 'ar';
const loc = () => (isRTL() ? 'ar-EG' : 'en-US');
const num = n => new Intl.NumberFormat(loc()).format(n);
const usd = n => { const s = new Intl.NumberFormat(loc(), { maximumFractionDigits: 0 }).format(Math.round(n)); return isRTL() ? '\u200F' + s + ' $' : '$' + s; };

/* =========================================================
   UI DICTIONARY
   ========================================================= */
const UI = {
  en: {
    skip: 'Skip to content', brandHome: 'Why Travels? — start over',
    kicker: 'A cinematic experiment in wanderlust',
    introTitle: 'Where does your desire to escape take you?',
    introSub: 'Don’t pick a country. Answer eight honest questions and let the map choose you.',
    begin: 'Begin the escape',
    how1t: 'Answer', how1d: 'Eight small choices reveal who you become when you run away.',
    how2t: 'Unravel', how2d: 'Clues surface one by one, like pieces of a mystery.',
    how3t: 'Arrive', how3d: 'Sights, budget and a day-by-day itinerary unfold for you.',
    signal: 'Signal {n} of {m}', back: 'Back', next: 'Continue', last: 'Reveal my destination',
    duelHint: 'Choose the pull you can’t ignore', cardHint: 'Trust your first instinct', sliderHint: 'Slide to where it feels right',
    reading: 'Reading your signals…', narrowing: 'Narrowing the map…', gathering: 'Gathering clues…', ready: 'Your destination is ready.',
    clueAir: 'The air', clueLand: 'The land', clueRiddle: 'The riddle', clueCoords: 'Coordinates',
    holdTitle: 'Hold to unveil', holdHint: 'Press and hold the circle — or hold Space / Enter',
    instant: 'Can’t hold? Reveal instantly', skipSuspense: 'Skip the suspense',
    yourDest: 'Your destination', resonance: 'resonance', enter: 'Enter the journey', scroll: 'Scroll',
    navStory: 'Story', navWhy: 'Match', navSights: 'Sights', navDo: 'Do', navBudget: 'Budget', navPlan: 'Itinerary',
    storyTitle: 'Welcome to {name}', factSeason: 'Best time', factLang: 'Language', factCurrency: 'Currency', factStay: 'Ideal stay',
    greetings: 'Greetings from {name}',
    whyTitle: 'Why it chose you', whyLead: '{name} resonates with {pct} of the traveler you described.',
    whyAligned: 'Where you and {name} agree', you: 'You', place: 'The place',
    sightsTitle: 'Places that stop you mid-step', doTitle: 'What to do there',
    budgetTitle: 'What the escape will cost', budgetSub: 'Per-person estimates in US dollars. Flights not included.',
    tierLow: 'Lean', tierMid: 'Comfort', tierHigh: 'Indulgent',
    days: 'Days', travelers: 'Travelers', perDay: 'per person · per day', tripTotal: 'Estimated trip total',
    stay: 'Stay', food: 'Food', activities: 'Activities', transport: 'Transport',
    shareNote: 'Rooms are assumed shared when two or more travel. Prices shift with season — treat these as a compass, not a quote.',
    planTitle: 'Your day-by-day itinerary', day: 'Day', morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening',
    copy: 'Copy itinerary', copied: 'Itinerary copied to clipboard', copyFail: 'Could not copy automatically',
    print: 'Print or save as PDF',
    othersTitle: 'Other places that whispered your name', othersSub: 'Not your first match, but still calling.',
    explore: 'Explore', again: 'Begin again',
    footNote: 'Made for wanderers. Estimates are indicative — check entry rules, prices and weather before you go.',
    matchLabel: 'match', person: 'traveler', people: 'travelers'
  },
  ar: {
    skip: 'تخطَّ إلى المحتوى', brandHome: 'Why Travels? — ابدأ من جديد',
    kicker: 'تجربة سينمائية في عشق السفر',
    introTitle: 'إلى أين تأخذك رغبتك في الهروب؟',
    introSub: 'لا تختر بلداً. أجب عن ثمانية أسئلة صادقة ودع الخريطة تختارك.',
    begin: 'ابدأ الهروب',
    how1t: 'أجب', how1d: 'ثمانية خيارات صغيرة تكشف من تكون حين تهرب.',
    how2t: 'اكشف', how2d: 'تظهر الأدلة واحداً تلو الآخر كقطع لغز غامض.',
    how3t: 'وصلت', how3d: 'معالم وميزانية وبرنامج يوماً بيوم يتكشف أمامك.',
    signal: 'الإشارة {n} من {m}', back: 'رجوع', next: 'متابعة', last: 'اكشف وجهتي',
    duelHint: 'اختر الجذب الذي لا تستطيع تجاهله', cardHint: 'ثق بحدسك الأول', sliderHint: 'حرّك المؤشر إلى حيث ترتاح',
    reading: 'نقرأ إشاراتك…', narrowing: 'نضيّق الخريطة…', gathering: 'نجمع الأدلة…', ready: 'وجهتك جاهزة.',
    clueAir: 'الهواء', clueLand: 'الأرض', clueRiddle: 'اللغز', clueCoords: 'الإحداثيات',
    holdTitle: 'اضغط مطولاً للكشف', holdHint: 'اضغط مطولاً على الدائرة — أو اضغط مطولاً على Space / Enter',
    instant: 'لا تستطيع الضغط؟ اكشف فوراً', skipSuspense: 'تخطَّ التشويق',
    yourDest: 'وجهتك', resonance: 'تناغم', enter: 'ادخل الرحلة', scroll: 'مرّر',
    navStory: 'الحكاية', navWhy: 'التطابق', navSights: 'المعالم', navDo: 'الأنشطة', navBudget: 'الميزانية', navPlan: 'البرنامج',
    storyTitle: 'أهلاً بك في {name}', factSeason: 'أفضل وقت', factLang: 'اللغة', factCurrency: 'العملة', factStay: 'مدة الإقامة المثالية',
    greetings: 'تحية من {name}',
    whyTitle: 'لماذا اختارتك', whyLead: '{name} تتناغم مع {pct} من المسافر الذي وصفته.',
    whyAligned: 'حيث تتفقان أنت و{name}', you: 'أنت', place: 'الوجهة',
    sightsTitle: 'أماكن توقفك في منتصف الخطوة', doTitle: 'ماذا تفعل هناك',
    budgetTitle: 'كم ستكلفك رحلة الهروب', budgetSub: 'تقديرات للشخص الواحد بالدولار الأمريكي. تذاكر الطيران غير مشمولة.',
    tierLow: 'اقتصادي', tierMid: 'مريح', tierHigh: 'فاخر',
    days: 'الأيام', travelers: 'المسافرون', perDay: 'للشخص · يومياً', tripTotal: 'إجمالي الرحلة التقديري',
    stay: 'الإقامة', food: 'الطعام', activities: 'الأنشطة', transport: 'التنقل',
    shareNote: 'نفترض مشاركة الغرف عند سفر شخصين أو أكثر. تتغير الأسعار حسب الموسم — اعتبرها بوصلة لا عرض سعر.',
    planTitle: 'برنامجك يوماً بيوم', day: 'اليوم', morning: 'الصباح', afternoon: 'الظهيرة', evening: 'المساء',
    copy: 'انسخ البرنامج', copied: 'تم نسخ البرنامج', copyFail: 'تعذّر النسخ تلقائياً',
    print: 'اطبع أو احفظ كملف PDF',
    othersTitle: 'وجهات أخرى همست باسمك', othersSub: 'ليست الأولى، لكنها ما زالت تناديك.',
    explore: 'استكشف', again: 'ابدأ من جديد',
    footNote: 'صُنع للمتجولين. التقديرات إرشادية — تحقق من شروط الدخول والأسعار والطقس قبل السفر.',
    matchLabel: 'تطابق', person: 'مسافر', people: 'مسافرين'
  }
};
const t = (k, v) => {
  let s = (UI[state.lang] && UI[state.lang][k]) ?? UI.en[k] ?? k;
  if (v) for (const x in v) s = s.replaceAll('{' + x + '}', v[x]);
  return s;
};

/* =========================================================
   MATCHING MODEL
   Eight personality dimensions, each 0..1
   ========================================================= */
const DIMS = ['crowd', 'sea', 'night', 'warm', 'adventure', 'culture', 'luxury', 'cost'];
const DIM_LABELS = {
  en: { crowd: ['Solitude', 'Crowds'], sea: ['Mountains', 'Sea'], night: ['Dawn', 'Night'], warm: ['Cold', 'Heat'], adventure: ['Slow pace', 'Adrenaline'], culture: ['Wild nature', 'Culture'], luxury: ['Rugged', 'Luxe'], cost: ['Thrifty', 'Indulgent'] },
  ar: { crowd: ['العزلة', 'الزحام'], sea: ['الجبال', 'البحر'], night: ['الفجر', 'الليل'], warm: ['البرد', 'الحرارة'], adventure: ['الهدوء', 'الإثارة'], culture: ['الطبيعة البرية', 'الثقافة'], luxury: ['البساطة', 'الفخامة'], cost: ['التوفير', 'الإنفاق'] }
};
const TRAITS = {
  en: { crowd: ['Craves solitude', 'Feeds on crowds'], sea: ['Drawn to peaks', 'Drawn to the sea'], night: ['Dawn chaser', 'Night owl'], warm: ['Loves the cold', 'Sun seeker'], adventure: ['Slow-pace soul', 'Adrenaline heart'], culture: ['Wilderness lover', 'Story hunter'], luxury: ['Star sleeper', 'Silk-sheet soul'], cost: ['Smart spender', 'Ready to indulge'] },
  ar: { crowd: ['يتوق إلى العزلة', 'يتغذى على الزحام'], sea: ['تجذبه القمم', 'يجذبه البحر'], night: ['صائد الفجر', 'بومة الليل'], warm: ['يحب البرد', 'باحث عن الشمس'], adventure: ['روح هادئة', 'قلب مغامر'], culture: ['عاشق البرية', 'صائد الحكايات'], luxury: ['نائم تحت النجوم', 'روح الحرير'], cost: ['منفق ذكي', 'مستعد للتدليل'] }
};

const QUESTIONS = [
  { type: 'duel', mood: ['#25386f', '#0a0f24'],
    q: { en: 'When you escape, who is beside you?', ar: 'عندما تهرب، من يكون بجانبك؟' },
    opts: [
      { v: { crowd: 0 }, g: 'mute', c: ['#1d3b5a', '#0b1a2c'], t: { en: 'Only silence', ar: 'الصمت وحده' }, d: { en: 'An empty trail, a hush at the shore.', ar: 'درب خالٍ، وهدوء على الشاطئ.' } },
      { v: { crowd: 1 }, g: 'users', c: ['#6a2b5e', '#220f2b'], t: { en: 'A thousand strangers', ar: 'ألف غريب' }, d: { en: 'Markets, music, electricity in the air.', ar: 'أسواق وموسيقى وطاقة في الهواء.' } }
    ] },
  { type: 'duel', mood: ['#0f5b73', '#06161f'],
    q: { en: 'Which horizon calls you?', ar: 'أي أفق ينادي عليك؟' },
    opts: [
      { v: { sea: 1 }, g: 'waves', c: ['#0e6b8a', '#06232f'], t: { en: 'Salt & shoreline', ar: 'الملح والشاطئ' }, d: { en: 'Tides, turquoise water, bare feet.', ar: 'مدّ وجزر ومياه فيروزية وأقدام حافية.' } },
      { v: { sea: 0 }, g: 'mountain', c: ['#3a4a7a', '#0d1226'], t: { en: 'Peaks & thin air', ar: 'القمم والهواء الرقيق' }, d: { en: 'Ridgelines, snow, a sky you can touch.', ar: 'سلاسل جبال وثلج وسماء تكاد تلمسها.' } }
    ] },
  { type: 'duel', mood: ['#3a1d6e', '#0b0618'],
    q: { en: 'When does your best self wake?', ar: 'متى تستيقظ أفضل نسخة منك؟' },
    opts: [
      { v: { night: 1 }, g: 'moonstar', c: ['#4b2a8a', '#120a2a'], t: { en: 'Midnight', ar: 'منتصف الليل' }, d: { en: 'Neon, lanterns and a sky full of stars.', ar: 'نيون وفوانيس وسماء مليئة بالنجوم.' } },
      { v: { night: 0 }, g: 'sunrise', c: ['#c8643a', '#2a1210'], t: { en: 'First light', ar: 'أول ضوء' }, d: { en: 'Quiet streets, golden air, the world yours.', ar: 'شوارع هادئة وهواء ذهبي وعالم لك وحدك.' } }
    ] },
  { type: 'slider', dim: 'warm', mood: ['#7a3a1d', '#12090a'], c: ['#7fd0ff', '#ff6a3d'],
    q: { en: 'How warm should the air feel on your skin?', ar: 'كم يجب أن يكون دفء الهواء على بشرتك؟' },
    ends: [{ g: 'snow' }, { g: 'flame' }],
    steps: { en: ['Breath of frost', 'Crisp and cool', 'Gentle and mild', 'Sun-warmed', 'Desert fire'], ar: ['أنفاس الصقيع', 'منعش وبارد', 'لطيف ومعتدل', 'دافئ بالشمس', 'نار الصحراء'] } },
  { type: 'cards', mood: ['#1f5a4a', '#07140f'],
    q: { en: 'Your first free hour in a new place…', ar: 'أول ساعة فراغ في مكان جديد…' },
    opts: [
      { v: { adventure: 1, culture: 0.2 }, g: 'summit', t: { en: 'Chase a summit or sunrise', ar: 'أطارد قمة أو شروقاً' }, d: { en: 'Boots on, legs burning, view earned.', ar: 'حذاء المشي وساقان متعبتان ومنظر استحققته.' } },
      { v: { culture: 0.95, crowd: 0.75, adventure: 0.4 }, g: 'bag', t: { en: 'Get lost in markets and alleys', ar: 'أضيع في الأسواق والأزقة' }, d: { en: 'Follow the smell of spice and the sound of drums.', ar: 'أتبع رائحة التوابل وصوت الطبول.' } },
      { v: { adventure: 0, crowd: 0.3 }, g: 'coffee', t: { en: 'Sit still with a coffee', ar: 'أجلس بهدوء مع قهوتي' }, d: { en: 'Watch life move. No plan, no rush.', ar: 'أراقب الحياة تمر. بلا خطة ولا عجلة.' } },
      { v: { sea: 1, adventure: 0.6 }, g: 'droplet', t: { en: 'Dive into the nearest water', ar: 'أقفز في أقرب ماء' }, d: { en: 'Salt, sun and a splash.', ar: 'ملح وشمس ورذاذ.' } }
    ] },
  { type: 'cards', mood: ['#5a2250', '#12060f'],
    q: { en: 'Pick a door.', ar: 'اختر باباً.' },
    opts: [
      { v: { culture: 1, night: 0.3, adventure: 0.2 }, g: 'door', t: { en: 'A worn wooden door', ar: 'باب خشبي عتيق' }, d: { en: 'Incense and old stories wait behind it.', ar: 'خلفه بخور وحكايات قديمة.' } },
      { v: { night: 1, crowd: 1, culture: 0.6 }, g: 'bulb', t: { en: 'A humming neon sign', ar: 'لافتة نيون تطنّ' }, d: { en: 'Music, laughter, a city that never sleeps.', ar: 'موسيقى وضحك ومدينة لا تنام.' } },
      { v: { sea: 1, crowd: 0.2, adventure: 0.1 }, g: 'palm', t: { en: 'A curtain of waves', ar: 'ستارة من الأمواج' }, d: { en: 'Sand underfoot, nothing on the calendar.', ar: 'رمل تحت القدمين ولا شيء في الجدول.' } },
      { v: { crowd: 0, culture: 0.1, adventure: 0.6, warm: 0.3 }, g: 'pine', t: { en: 'A misty path into the trees', ar: 'ممر ضبابي بين الأشجار' }, d: { en: 'No signal, no crowd, just you and the wild.', ar: 'لا إشارة ولا زحام، أنت والبرية فقط.' } }
    ] },
  { type: 'slider', dim: 'luxury', mood: ['#6a5a1d', '#100d05'], c: ['#4aa57a', '#f2c46d'],
    q: { en: 'Where do you sleep?', ar: 'أين تنام؟' },
    ends: [{ g: 'tent' }, { g: 'bell' }],
    steps: { en: ['Under a canvas of stars', 'A simple, cozy bed', 'Comfort, please', 'Boutique charm', 'Silk sheets and room service'], ar: ['تحت لوحة من النجوم', 'سرير بسيط ودافئ', 'الراحة من فضلك', 'سحر الفنادق الصغيرة', 'ملاءات حرير وخدمة غرف'] } },
  { type: 'cards', mood: ['#1f3f6a', '#060b16'],
    q: { en: 'What should the escape cost?', ar: 'كم يجب أن تكلف رحلة الهروب؟' },
    opts: [
      { v: { cost: 0.15 }, g: 'backpack', t: { en: 'Pocket-light', ar: 'خفيفة على الجيب' }, d: { en: 'Every coin counts. I’d rather have the story.', ar: 'كل قرش مهم. أفضّل الحكاية.' } },
      { v: { cost: 0.5 }, g: 'scale', t: { en: 'Balanced', ar: 'متوازنة' }, d: { en: 'Good value with a few treats.', ar: 'قيمة جيدة مع بعض المتع.' } },
      { v: { cost: 0.92 }, g: 'gem', t: { en: 'Indulgent', ar: 'مدلّلة' }, d: { en: 'This escape deserves the best.', ar: 'هذه الرحلة تستحق الأفضل.' } }
    ] }
];

/* =========================================================
   DESTINATIONS (vec order = DIMS)
   ========================================================= */
const DEST = [
  { id: 'santorini', coords: [36.39, 25.46], vec: [.55, .9, .5, .75, .25, .55, .85, .8],
    theme: { a: '#ff9a6b', b: '#6fb1ff', bg: '#0b1230' }, sky: ['#121846', '#8a3f86', '#ffb56b'],
    icons: { att: ['sunset', 'trail', 'column', 'umbrella'], act: ['sailboat', 'wine', 'mask', 'chef'] },
    budget: { low: [45, 25, 12, 13], mid: [120, 55, 30, 25], high: [380, 120, 60, 60] },
    en: { name: 'Santorini', country: 'Greece', tag: 'A volcano’s last gift: sunsets that feel like applause.',
      story: 'A crescent of drowned volcano, white villages stacked on black cliffs, and an Aegean so blue it looks edited. Santorini is built for slow golden hours and long dinners facing the caldera.',
      season: 'May – early Oct', language: 'Greek', currency: 'Euro (€)', stay: '4–6 days',
      climate: 'Mediterranean warmth and salt on the breeze', land: 'Cliffs, domes, and a sea that fell into a volcano',
      riddle: 'I was born in fire, then crowned in white and blue. Every evening the whole world turns west to watch me burn.',
      att: [['Oia Sunset Point', 'Hundreds gather at the castle ruins for the most famous sunset in the Aegean.'], ['Fira to Oia Caldera Trail', 'A cliff-top walk of about ten kilometres with crater views the whole way.'], ['Akrotiri Archaeological Site', 'A Bronze Age town preserved under volcanic ash, often called the Greek Pompeii.'], ['Red Beach', 'Crimson cliffs and dark pebbles beneath a rust-coloured headland.']],
      act: [['Sunset catamaran cruise', 'Sail the caldera with a Greek dinner on deck.'], ['Volcanic vineyard tasting', 'Assyrtiko grown in ash soil.'], ['Hot-spring swim', 'Jump from a boat into warm mineral water.'], ['Cooking class in Pyrgos', 'Tomato fritters, fava and fresh fish.']],
      it: [
        { t: 'Arrival in Fira', m: 'Check in to a cave hotel and breathe in the caldera view.', a: 'Wander Fira’s marble alleys and browse the jewellery shops.', e: 'Dinner on a terrace: grilled octopus and local Assyrtiko.' },
        { t: 'Oia’s Golden Hour', m: 'Coffee at a cliffside café in Oia before the crowds.', a: 'Explore blue-domed churches and old captains’ houses.', e: 'Claim a spot at the castle for sunset, then a late taverna dinner.' },
        { t: 'The Caldera by Sea', m: 'Board a catamaran and swim at the Red and White beaches.', a: 'Anchor at the volcanic hot springs and snorkel.', e: 'Sunset on deck with a barbecue dinner.' },
        { t: 'Ancient & Vines', m: 'Walk the preserved streets of Akrotiri.', a: 'Taste volcanic wines at a hillside winery.', e: 'Farewell dinner in Pyrgos village under the stars.' }] },
    ar: { name: 'سانتوريني', country: 'اليونان', tag: 'هدية البركان الأخيرة: غروب يشبه التصفيق.',
      story: 'هلال من فوهة بركانية غارقة، وقرى بيضاء متراصة فوق جروف سوداء، وبحر إيجة بزرقة تكاد لا تُصدَّق. سانتوريني صُنعت للساعات الذهبية البطيئة والعشاء الطويل المطل على الكالديرا.',
      season: 'مايو – أوائل أكتوبر', language: 'اليونانية', currency: 'اليورو (€)', stay: '4–6 أيام',
      climate: 'دفء متوسطي ونسيم مالح', land: 'جروف وقباب وبحر سقط في فوهة بركان',
      riddle: 'وُلدتُ من النار، ثم تُوِّجتُ بالأبيض والأزرق. كل مساء يلتفت العالم نحو الغرب ليشاهدني أحترق.',
      att: [['غروب أويا', 'يتجمع المئات عند أطلال القلعة لمشاهدة أشهر غروب في بحر إيجة.'], ['مسار الكالديرا من فيرا إلى أويا', 'سير على حافة الجرف نحو عشرة كيلومترات مع إطلالة دائمة على الفوهة.'], ['موقع أكروتيري الأثري', 'مدينة من العصر البرونزي حفظها الرماد البركاني، تُسمى «بومبي اليونان».'], ['الشاطئ الأحمر', 'جروف قرمزية وحصى داكن تحت رأس بلون الصدأ.']],
      act: [['رحلة كاتاماران وقت الغروب', 'أبحر في الكالديرا مع عشاء يوناني على السطح.'], ['تذوق النبيذ في كروم بركانية', 'عنب أسيرتيكو ينمو في تربة من الرماد.'], ['السباحة عند الينابيع الساخنة', 'اقفز من القارب إلى مياه دافئة غنية بالمعادن.'], ['درس طبخ في بيرغوس', 'كرات الطماطم والفافا والسمك الطازج.']],
      it: [
        { t: 'الوصول إلى فيرا', m: 'سجّل دخولك في فندق كهفي واستمتع بإطلالة الكالديرا.', a: 'تجوّل في أزقة فيرا الرخامية وتصفّح محلات المجوهرات.', e: 'عشاء على شرفة مع أخطبوط مشوي ونبيذ أسيرتيكو المحلي.' },
        { t: 'ساعة أويا الذهبية', m: 'قهوة في مقهى على الجرف في أويا قبل وصول الزحام.', a: 'اكتشف الكنائس ذات القباب الزرقاء وبيوت القباطنة القديمة.', e: 'احجز مكانك عند القلعة لمشاهدة الغروب ثم عشاء متأخر في تافيرنا.' },
        { t: 'الكالديرا من البحر', m: 'اركب الكاتاماران للسباحة عند الشاطئين الأحمر والأبيض.', a: 'ارسُ عند الينابيع البركانية الساخنة وجرّب الغطس السطحي.', e: 'غروب على سطح القارب مع عشاء مشاوي.' },
        { t: 'التاريخ والكروم', m: 'امشِ في شوارع أكروتيري المحفوظة منذ آلاف السنين.', a: 'تذوّق النبيذ البركاني في معصرة على سفح التل.', e: 'عشاء الوداع في قرية بيرغوس تحت النجوم.' }] } },

  { id: 'kyoto', coords: [35.01, 135.77], vec: [.5, .05, .3, .5, .3, 1, .55, .55],
    theme: { a: '#ef5a4a', b: '#f3c969', bg: '#150b13' }, sky: ['#150d2c', '#5a2a5c', '#f7c47e'],
    icons: { att: ['torii', 'bamboo', 'pagoda', 'lantern'], act: ['teacup', 'shirt', 'lotus', 'utensils'] },
    budget: { low: [40, 22, 12, 11], mid: [110, 50, 30, 20], high: [350, 130, 70, 50] },
    en: { name: 'Kyoto', country: 'Japan', tag: 'A thousand years of stillness, folded into temple gardens.',
      story: 'Once the imperial capital, Kyoto keeps its soul in moss gardens, wooden machiya lanes and the ritual of tea. It rewards slow walkers, early risers and anyone who listens closely.',
      season: 'Mar – May, Oct – Nov', language: 'Japanese', currency: 'Yen (¥)', stay: '4–6 days',
      climate: 'Crisp four-season air, with blossoms or crimson leaves', land: 'Temples, bamboo, moss and mist',
      riddle: 'Ten thousand red gates lead me up the hill, and in autumn my maples set the mountains alight without any smoke.',
      att: [['Fushimi Inari Shrine', 'Thousands of vermilion torii gates wind up a forested mountain.'], ['Arashiyama Bamboo Grove', 'Walk beneath towering stalks that whisper in the wind.'], ['Kinkaku-ji', 'The Golden Pavilion, mirrored in its still pond.'], ['Gion District', 'Wooden teahouses where geiko still glide through the lanes at dusk.']],
      act: [['Tea ceremony', 'Learn the ritual of matcha in a traditional teahouse.'], ['Kimono stroll', 'Walk the old streets in seasonal silk.'], ['Temple Zen meditation', 'Sit with monks at dawn in a silent hall.'], ['Nishiki Market crawl', 'Taste pickles, tofu and grilled skewers.']],
      it: [
        { t: 'Gates at Dawn', m: 'Climb Fushimi Inari at sunrise, before the crowds arrive.', a: 'Soba noodles near the shrine, then visit Tofuku-ji.', e: 'Stroll Gion at dusk and dine on kaiseki.' },
        { t: 'Bamboo & River', m: 'Walk the Arashiyama bamboo grove, then Tenryu-ji’s garden.', a: 'Cross Togetsukyo Bridge and ride the Sagano scenic train.', e: 'Soak in a neighbourhood bathhouse, then ramen near your hotel.' },
        { t: 'Gold & Zen', m: 'See Kinkaku-ji in the morning light.', a: 'Meditate at Ryoan-ji’s rock garden and join a tea ceremony.', e: 'Snack your way through Nishiki Market and Pontocho alley.' },
        { t: 'Hills & Farewell', m: 'Follow the Philosopher’s Path to Ginkaku-ji.', a: 'Climb to Kiyomizu-dera for the view from its wooden stage.', e: 'A last sunset over the city, with sake and yakitori.' }] },
    ar: { name: 'كيوتو', country: 'اليابان', tag: 'ألف عام من السكون، مطوية في حدائق المعابد.',
      story: 'كانت العاصمة الإمبراطورية، وما زالت تحفظ روحها في حدائق الطحلب وأزقة البيوت الخشبية وطقوس الشاي. تكافئ المتمهلين والمبكّرين وكل من يُصغي جيداً.',
      season: 'مارس – مايو، أكتوبر – نوفمبر', language: 'اليابانية', currency: 'الين (¥)', stay: '4–6 أيام',
      climate: 'هواء منعش بفصول أربعة، وأزهار أو أوراق قرمزية', land: 'معابد وخيزران وطحالب وضباب',
      riddle: 'عشرة آلاف بوابة حمراء تقودني إلى أعلى التل، وفي الخريف تُشعل أشجار القيقب الجبال بلا دخان.',
      att: [['معبد فوشيمي إناري', 'آلاف بوابات التوري القرمزية تلتف صعوداً في جبل مكسو بالغابات.'], ['غابة الخيزران في أراشياما', 'امشِ تحت سيقان شاهقة تهمس مع الريح.'], ['كينكاكوجي', 'الجناح الذهبي ينعكس على بركته الساكنة.'], ['حي جيون', 'بيوت شاي خشبية ما زالت الجيكو تعبر أزقتها عند الغروب.']],
      act: [['حفل الشاي', 'تعلّم طقس الماتشا في بيت شاي تقليدي.'], ['جولة بالكيمونو', 'تجوّل في الأزقة القديمة بحرير موسمي.'], ['تأمل الزن في معبد', 'اجلس مع الرهبان فجراً في قاعة صامتة.'], ['جولة طعام في سوق نيشيكي', 'تذوّق المخللات والتوفو والأسياخ المشوية.']],
      it: [
        { t: 'بوابات الفجر', m: 'اصعد معبد فوشيمي إناري عند الشروق قبل وصول الزوار.', a: 'غداء نودلز سوبا قرب المعبد ثم زيارة توفوكوجي.', e: 'تمشَّ في جيون عند الغسق وتناول عشاء كايسيكي.' },
        { t: 'الخيزران والنهر', m: 'تجوّل في غابة الخيزران ثم حديقة معبد تنريوجي.', a: 'اعبر جسر توغتسوكيو واركب قطار ساغانو السياحي.', e: 'استرخِ في حمام ياباني تقليدي ثم رامن قرب الفندق.' },
        { t: 'الذهب والزن', m: 'شاهد كينكاكوجي في ضوء الصباح.', a: 'تأمّل في حديقة الصخور بمعبد ريوانجي وشارك في حفل شاي.', e: 'وجبات خفيفة في سوق نيشيكي وزقاق بونتوتشو.' },
        { t: 'التلال والوداع', m: 'امشِ في «درب الفيلسوف» حتى جينكاكوجي.', a: 'اصعد إلى معبد كيوميزو-ديرا لإطلالة المنصة الخشبية.', e: 'غروب أخير فوق المدينة مع الساكي والياكيتوري.' }] } },

  { id: 'interlaken', coords: [46.69, 7.86], vec: [.25, .05, .1, .25, .9, .3, .65, .85],
    theme: { a: '#7fd8ff', b: '#ffffff', bg: '#071220' }, sky: ['#0a1330', '#2b3d7a', '#f3a97c'],
    icons: { att: ['train', 'droplets', 'mountain', 'canoe'], act: ['parachute', 'trail', 'summit', 'cheese'] },
    budget: { low: [70, 35, 35, 20], mid: [190, 70, 80, 30], high: [450, 150, 150, 60] },
    en: { name: 'Interlaken', country: 'Switzerland', tag: 'Between two lakes and a wall of snow-capped giants.',
      story: 'A small town wedged between turquoise Lake Thun and Lake Brienz, with the Eiger, Mönch and Jungfrau looming above. Adrenaline by day, fondue by night.',
      season: 'Jun – Sep (hiking), Dec – Mar (snow)', language: 'German', currency: 'Swiss franc (CHF)', stay: '4–5 days',
      climate: 'Cool, crisp air and snow on the summits', land: 'Alpine peaks, glacial lakes and green meadows',
      riddle: 'I sit between two waters while three giants watch from above. Cheese melts for me and cable cars climb.',
      att: [['Jungfraujoch', 'Ride Europe’s highest railway station, at 3,454 m, to a glacier plateau.'], ['Lauterbrunnen Valley', 'A valley of dozens of waterfalls beneath sheer cliffs.'], ['Harder Kulm', 'A viewpoint above town between both lakes.'], ['Lake Brienz & Iseltwald', 'Emerald water and a quiet lakeside village.']],
      act: [['Paragliding', 'Glide from Beatenberg over the two lakes.'], ['Hike Schynige Platte', 'Alpine meadows and lake views.'], ['Canyoning', 'Rappel through gorges and rushing water.'], ['Fondue night', 'Melted cheese in a warm chalet.']],
      it: [
        { t: 'Lakeside Arrival', m: 'Arrive by train and stroll along the Aare river.', a: 'Ride the funicular up to Harder Kulm.', e: 'Fondue dinner with a view of both lakes.' },
        { t: 'Valley of Waterfalls', m: 'Train to Lauterbrunnen and see Staubbach Falls.', a: 'Hike to Wengen on a panoramic trail.', e: 'Sunset drinks on your chalet balcony.' },
        { t: 'Top of Europe', m: 'Early train toward Jungfraujoch via Kleine Scheidegg.', a: 'Explore the ice palace and glacier plateau.', e: 'Rest, then a relaxed rösti dinner.' },
        { t: 'Sky & Lake', m: 'Tandem paragliding over the lakes.', a: 'Boat across Lake Brienz to Iseltwald.', e: 'Farewell stroll and Swiss chocolate tasting.' }] },
    ar: { name: 'إنترلاكن', country: 'سويسرا', tag: 'بين بحيرتين وجدار من العمالقة المكسوّة بالثلج.',
      story: 'بلدة صغيرة بين بحيرة تون وبحيرة برينتس بلونهما الفيروزي، وفوقها تتعالى قمم أيغر ومونش ويونغفراو. مغامرات في النهار وفوندي في المساء.',
      season: 'يونيو – سبتمبر (المشي)، ديسمبر – مارس (الثلج)', language: 'الألمانية', currency: 'الفرنك السويسري (CHF)', stay: '4–5 أيام',
      climate: 'هواء بارد منعش وثلوج على القمم', land: 'قمم ألبية وبحيرات جليدية ومروج خضراء',
      riddle: 'أجلس بين مائين، وثلاثة عمالقة يراقبونني من الأعلى. الجبن يذوب من أجلي وتتسلق التلفريكات.',
      att: [['يونغفراوجوخ', 'أعلى محطة قطار في أوروبا على ارتفاع 3454 متراً، تقودك إلى هضبة جليدية.'], ['وادي لاوتربرونن', 'وادٍ فيه عشرات الشلالات تحت جروف شاهقة.'], ['هاردر كولم', 'نقطة مشاهدة فوق البلدة تطل على البحيرتين.'], ['بحيرة برينتس وإيزلتفالد', 'مياه زمردية وقرية هادئة على الشاطئ.']],
      act: [['الطيران الشراعي', 'حلّق من بيتنبرغ فوق البحيرتين.'], ['المشي في شينيغه بلاته', 'مروج ألبية وإطلالات على البحيرة.'], ['تسلق الأخاديد', 'تدلَّ بالحبال عبر الأخاديد والمياه المتدفقة.'], ['ليلة فوندي', 'جبن مذاب في شاليه دافئ.']],
      it: [
        { t: 'وصول على ضفاف البحيرة', m: 'استقل القطار إلى البلدة وامشِ على ضفة نهر آره.', a: 'اصعد بالقطار الجبلي إلى هاردر كولم.', e: 'عشاء فوندي مع إطلالة على البحيرتين.' },
        { t: 'وادي الشلالات', m: 'قطار إلى لاوتربرونن ومشاهدة شلال شتاوباخ.', a: 'امشِ نحو فينغن على مسار بانورامي.', e: 'مشروبات الغروب على شرفة الشاليه.' },
        { t: 'سقف أوروبا', m: 'قطار مبكر نحو يونغفراوجوخ عبر كلاينه شايديغ.', a: 'استكشف قصر الجليد وهضبة النهر الجليدي.', e: 'استراحة وعشاء روشتي هادئ.' },
        { t: 'السماء والبحيرة', m: 'طيران شراعي ثنائي فوق البحيرتين.', a: 'رحلة قارب عبر بحيرة برينتس إلى إيزلتفالد.', e: 'نزهة وداع وتذوق الشوكولاتة السويسرية.' }] } },

  { id: 'bali', coords: [-8.41, 115.19], vec: [.45, .8, .45, .95, .55, .75, .5, .3],
    theme: { a: '#7fe08e', b: '#ffcc66', bg: '#07170e' }, sky: ['#ffe29a', '#ffb56b', '#ff7e5f'],
    icons: { att: ['wheat', 'pagoda', 'paw', 'palm'], act: ['volcano', 'waves', 'bowl', 'lotus'] },
    budget: { low: [18, 12, 8, 7], mid: [70, 30, 25, 15], high: [300, 90, 80, 50] },
    en: { name: 'Bali', country: 'Indonesia', tag: 'An island where every morning begins with an offering.',
      story: 'Terraced rice fields, jungle temples, surf breaks and sunset beach clubs. Bali pairs spiritual calm with easy adventure, at a gentler price.',
      season: 'Apr – Oct (dry season)', language: 'Indonesian, Balinese', currency: 'Rupiah (IDR)', stay: '5–8 days',
      climate: 'Tropical heat, humid jungle and warm sea', land: 'Rice terraces, temples and surf',
      riddle: 'Incense drifts at dawn, green steps climb the hills, and the gods are said to live in every doorway.',
      att: [['Tegallalang Rice Terraces', 'Emerald steps carved into the hillside near Ubud.'], ['Uluwatu Temple', 'A sea temple on a cliff about 70 m high, with a kecak dance at sunset.'], ['Ubud Monkey Forest', 'A sacred forest of ancient shrines and playful macaques.'], ['Nusa Penida', 'Dramatic cliffs and turquoise bays a boat ride away.']],
      act: [['Sunrise trek up Mount Batur', 'Watch the sun rise above the volcano.'], ['Surf lesson in Canggu', 'Gentle waves for beginners.'], ['Balinese cooking class', 'Fresh herbs, spices and local recipes.'], ['Spa & yoga in Ubud', 'Unwind among jungle and rice fields.']],
      it: [
        { t: 'Ubud Awakening', m: 'Walk the Campuhan Ridge at sunrise.', a: 'Visit the Monkey Forest and the art markets.', e: 'Balinese dinner and a legong dance performance.' },
        { t: 'Terraces & Waterfalls', m: 'Photograph the Tegallalang terraces and try the swing.', a: 'Swim at Tegenungan Waterfall.', e: 'Cooking class followed by a spa massage.' },
        { t: 'Volcano & Springs', m: 'Pre-dawn Mount Batur hike with a steam-cooked breakfast.', a: 'Soak in hot springs by Lake Batur.', e: 'Rest, then sunset at a café among the rice fields.' },
        { t: 'Coast & Cliff', m: 'Move to Uluwatu; surf or swim at Padang Padang.', a: 'Explore the cliff-top Uluwatu Temple.', e: 'Kecak fire dance at sunset, then seafood in Jimbaran.' }] },
    ar: { name: 'بالي', country: 'إندونيسيا', tag: 'جزيرة يبدأ كل صباح فيها بقربان.',
      story: 'مدرّجات أرز، ومعابد في الغابة، وأمواج للركوب، ونوادٍ شاطئية عند الغروب. تجمع بالي بين الهدوء الروحي والمغامرة السهلة بسعر ألطف.',
      season: 'أبريل – أكتوبر (موسم الجفاف)', language: 'الإندونيسية والبالينية', currency: 'الروبية (IDR)', stay: '5–8 أيام',
      climate: 'حرارة استوائية وغابات رطبة وبحر دافئ', land: 'مدرجات أرز ومعابد وأمواج',
      riddle: 'البخور يتصاعد عند الفجر، والدرجات الخضراء تتسلق التلال، ويقال إن الآلهة تسكن كل عتبة.',
      att: [['مدرجات تيغالالانغ', 'درجات زمردية منحوتة في سفح التل قرب أوبود.'], ['معبد أولوواتو', 'معبد بحري على جرف ارتفاعه نحو 70 متراً مع رقصة الكيتشاك عند الغروب.'], ['غابة القرود في أوبود', 'غابة مقدسة فيها مزارات قديمة وقرود لعوب.'], ['نوسا بينيدا', 'جروف مدهشة وخلجان فيروزية على بُعد رحلة بالقارب.']],
      act: [['تسلق جبل باتور فجراً', 'شاهد الشروق من فوق البركان.'], ['درس ركوب الأمواج في كانغو', 'أمواج لطيفة للمبتدئين.'], ['درس طبخ بالي', 'أعشاب وتوابل وأطباق محلية.'], ['سبا ويوغا في أوبود', 'استرخاء وسط الغابة والأرز.']],
      it: [
        { t: 'يقظة أوبود', m: 'امشِ على حافة كامبوهان عند الشروق.', a: 'زر غابة القرود وأسواق الفنون.', e: 'عشاء بالي تقليدي وعرض رقصة ليغونغ.' },
        { t: 'المدرجات والشلالات', m: 'صوّر مدرجات تيغالالانغ وجرّب الأرجوحة.', a: 'اسبح في شلال تيغينونغان.', e: 'درس طبخ ثم جلسة تدليك.' },
        { t: 'البركان والينابيع', m: 'تسلق باتور قبل الفجر مع إفطار مطبوخ بالبخار.', a: 'انقع جسدك في ينابيع ساخنة قرب بحيرة باتور.', e: 'استراحة ثم غروب في مقهى وسط حقول الأرز.' },
        { t: 'الساحل والجرف', m: 'انتقل إلى أولووات وجرّب الأمواج أو السباحة في بادانغ بادانغ.', a: 'استكشف معبد أولووات فوق الجرف.', e: 'رقصة الكيتشاك النارية عند الغروب وعشاء بحري في جيمباران.' }] } },

  { id: 'marrakech', coords: [31.63, -7.99], vec: [.9, 0, .7, .85, .35, .95, .45, .35],
    theme: { a: '#ff9a3c', b: '#e8506a', bg: '#190b11' }, sky: ['#2b1240', '#a23b6b', '#ff9a3c'],
    icons: { att: ['flame', 'flower', 'mosque', 'bag'], act: ['balloon', 'bath', 'tagine', 'dune'] },
    budget: { low: [20, 12, 8, 6], mid: [75, 30, 20, 15], high: [280, 90, 60, 50] },
    en: { name: 'Marrakech', country: 'Morocco', tag: 'A labyrinth of spice, lantern light and rose-coloured walls.',
      story: 'The Red City thrums with storytellers, drummers and the aroma of grilling meat. Its medina lanes get you lost, then reward you with a quiet riad and a rooftop facing the Atlas.',
      season: 'Mar – May, Sep – Nov', language: 'Arabic, Amazigh, French', currency: 'Dirham (MAD)', stay: '3–5 days',
      climate: 'Hot, dry desert air with cool evenings', land: 'Medina labyrinth, minarets and palm groves',
      riddle: 'At night a whole square becomes a stage of smoke, drums and a thousand stories. Walls of rose clay hide gardens of blue.',
      att: [['Jemaa el-Fnaa', 'The great square that erupts at dusk with food stalls and music.'], ['Jardin Majorelle', 'A cobalt-blue villa and cactus garden once owned by Yves Saint Laurent.'], ['Bahia Palace', 'Painted ceilings and tiled courtyards from the 19th century.'], ['The Medina Souks', 'Winding lanes of leather, lanterns, spices and rugs.']],
      act: [['Sunrise hot-air balloon', 'Float above palm groves with the Atlas behind you.'], ['Hammam & argan massage', 'A ritual scrub and massage in a traditional bathhouse.'], ['Tagine cooking class', 'Shop the market, then cook what you bought.'], ['Agafay Desert day trip', 'Camel ride and sunset dinner among stony dunes.']],
      it: [
        { t: 'Into the Medina', m: 'Get lost in the souks and bargain for a lantern.', a: 'Mint tea on a riad rooftop, then tour Bahia Palace.', e: 'Jemaa el-Fnaa at dusk: grilled skewers and music.' },
        { t: 'Gardens & Calm', m: 'Visit Jardin Majorelle early, before the crowds.', a: 'Unwind in a traditional hammam.', e: 'Rooftop dinner of tagine with the Koutoubia in view.' },
        { t: 'Desert Edge', m: 'Drive out to the Agafay Desert.', a: 'Camel ride and a Berber lunch.', e: 'Sunset dinner under lanterns and stars, then back to the city.' },
        { t: 'Slow Farewell', m: 'Sunrise hot-air balloon (optional).', a: 'Cooking class, then last-minute shopping.', e: 'Farewell dinner in the medina.' }] },
    ar: { name: 'مراكش', country: 'المغرب', tag: 'متاهة من التوابل وضوء الفوانيس وأسوار وردية.',
      story: 'المدينة الحمراء تنبض بالحكّائين والطبول ورائحة الشواء. أزقة المدينة القديمة تضيعك ثم تدلّك على رياض هادئ وسطح يطل على جبال الأطلس.',
      season: 'مارس – مايو، سبتمبر – نوفمبر', language: 'العربية والأمازيغية والفرنسية', currency: 'الدرهم (MAD)', stay: '3–5 أيام',
      climate: 'حار جاف بهواء صحراوي وأمسيات منعشة', land: 'متاهة المدينة القديمة ومآذن وبساتين نخيل',
      riddle: 'في الليل تتحول ساحة كاملة إلى مسرح من الدخان والطبول وألف حكاية. جدران من طين وردي تخفي حدائق زرقاء.',
      att: [['ساحة جامع الفنا', 'الساحة الكبرى التي تنفجر حياة عند الغروب بأكشاك الطعام والموسيقى.'], ['حديقة ماجوريل', 'فيلا زرقاء كوبالتية وحديقة صبار كان يملكها إيف سان لوران.'], ['قصر الباهية', 'أسقف مزخرفة وباحات مبلّطة من القرن التاسع عشر.'], ['أسواق المدينة', 'أزقة متعرجة من الجلود والفوانيس والتوابل والسجاد.']],
      act: [['منطاد عند الشروق', 'حلّق فوق بساتين النخيل وخلفك جبال الأطلس.'], ['حمّام مغربي وتدليك بزيت الأركان', 'طقس تنظيف وتدليك في حمام تقليدي.'], ['درس طبخ الطاجين', 'اشترِ المكونات من السوق ثم اطبخها بنفسك.'], ['رحلة إلى صحراء أغافاي', 'ركوب الجمال وعشاء عند الغروب بين الكثبان الصخرية.']],
      it: [
        { t: 'إلى قلب المدينة القديمة', m: 'تُه في الأسواق وفاصل في شراء الفوانيس.', a: 'شاي بالنعناع على سطح رياض وجولة في قصر الباهية.', e: 'ساحة جامع الفنا عند الغسق: أسياخ مشوية وموسيقى.' },
        { t: 'حدائق وهدوء', m: 'زر حديقة ماجوريل مبكراً لتتجنب الزحام.', a: 'استرخِ في حمّام تقليدي.', e: 'عشاء على سطح مع طاجين وإطلالة على مئذنة الكتبية.' },
        { t: 'حافة الصحراء', m: 'انطلق إلى صحراء أغافاي.', a: 'ركوب الجمال وغداء أمازيغي.', e: 'عشاء الغروب تحت الفوانيس والنجوم ثم العودة إلى المدينة.' },
        { t: 'وداع هادئ', m: 'منطاد عند الشروق (اختياري).', a: 'درس طبخ ثم تسوّق أخير.', e: 'عشاء الوداع في المدينة القديمة.' }] } },

  { id: 'iceland', coords: [64.15, -21.94], vec: [.1, .3, .4, .05, .85, .25, .6, .85],
    theme: { a: '#5cffc1', b: '#9a7bff', bg: '#050b17' }, sky: ['#030818', '#0b2a3d', '#16465a'],
    icons: { att: ['volcano', 'waves', 'snow', 'steam'], act: ['aurora', 'summit', 'whale', 'gem'] },
    budget: { low: [75, 40, 35, 40], mid: [170, 70, 90, 60], high: [420, 150, 200, 100] },
    en: { name: 'Iceland', country: 'Iceland', tag: 'Fire, ice and green ribbons of northern lights.',
      story: 'A young island still being shaped by glaciers and volcanoes: waterfalls, black sand beaches, geothermal lagoons and winter skies painted by the aurora.',
      season: 'Jun – Aug (midnight sun), Sep – Mar (aurora)', language: 'Icelandic', currency: 'Króna (ISK)', stay: '5–7 days',
      climate: 'Cold and windy, bright in summer, magical in winter', land: 'Glaciers, waterfalls, black sand and geysers',
      riddle: 'I am a land of fire and ice, where the night sky dances in green and the earth steams beneath your boots.',
      att: [['The Golden Circle', 'Þingvellir, Geysir and Gullfoss on one classic loop.'], ['Reynisfjara Black Sand Beach', 'Basalt columns and roaring Atlantic waves.'], ['Jökulsárlón Glacier Lagoon', 'Icebergs drifting slowly toward the sea.'], ['Blue Lagoon', 'Soak in geothermal water among lava fields.']],
      act: [['Northern lights hunt', 'Chase the aurora on clear winter nights.'], ['Glacier hike', 'Walk on blue ice with a certified guide.'], ['Whale watching', 'Humpbacks from Reykjavík harbour.'], ['Ice cave tour', 'Winter-only trips into blue ice caves.']],
      it: [
        { t: 'Reykjavík Arrival', m: 'Pick up your car; walk Hallgrímskirkja and the old harbour.', a: 'Try an Icelandic hot dog and visit the Harpa concert hall.', e: 'Soak in a neighbourhood geothermal pool.' },
        { t: 'The Golden Circle', m: 'Walk the rift valley at Þingvellir.', a: 'Geysir geothermal area and Gullfoss waterfall.', e: 'Lamb soup for dinner, and watch for the aurora in season.' },
        { t: 'South Coast', m: 'Seljalandsfoss and Skógafoss waterfalls.', a: 'Reynisfjara black sand beach (stay well back from the waves).', e: 'Overnight in Vík.' },
        { t: 'Ice & Fire', m: 'Drive to the Jökulsárlón glacier lagoon.', a: 'Diamond Beach and a guided glacier walk.', e: 'Return to Reykjavík and soak in a lagoon.' }] },
    ar: { name: 'آيسلندا', country: 'آيسلندا', tag: 'نار وجليد وشرائط خضراء من الشفق القطبي.',
      story: 'جزيرة فتية ما زالت الأنهار الجليدية والبراكين تنحتها: شلالات وشواطئ رمل أسود ومياه جوفية دافئة، وسماء شتوية ترسمها الأضواء الشمالية.',
      season: 'يونيو – أغسطس (شمس منتصف الليل)، سبتمبر – مارس (الشفق)', language: 'الآيسلندية', currency: 'الكرونا (ISK)', stay: '5–7 أيام',
      climate: 'بارد وعاصف، ساطع في الصيف وساحر في الشتاء', land: 'أنهار جليدية وشلالات ورمل أسود وينابيع حارة',
      riddle: 'أنا أرض النار والجليد، حيث ترقص السماء بالأخضر وتتصاعد الأرض بخاراً تحت قدميك.',
      att: [['الدائرة الذهبية', 'ثينغفيلير وغيسير وغولفوس في جولة واحدة كلاسيكية.'], ['شاطئ رينيسفيارا الأسود', 'أعمدة بازلتية وأمواج الأطلسي الهادرة.'], ['بحيرة يوكولسارلون الجليدية', 'جبال جليد طافية تنجرف ببطء نحو البحر.'], ['البحيرة الزرقاء', 'استحمام في مياه جوفية دافئة وسط حقول الحمم.']],
      act: [['صيد الشفق القطبي', 'طارد الأضواء الشمالية في ليالي الشتاء الصافية.'], ['المشي على النهر الجليدي', 'امشِ على الجليد الأزرق مع مرشد معتمد.'], ['مراقبة الحيتان', 'حيتان الحدباء من ميناء ريكيافيك.'], ['كهوف الجليد', 'جولات شتوية داخل كهوف الجليد الزرقاء.']],
      it: [
        { t: 'الوصول إلى ريكيافيك', m: 'استلم سيارتك وامشِ بين كنيسة هالغريمور والميناء القديم.', a: 'جرّب النقانق الآيسلندية وزر قاعة هاربا للحفلات.', e: 'استرخِ في مسبح حراري قريب.' },
        { t: 'الدائرة الذهبية', m: 'وادي الصدع في ثينغفيلير.', a: 'منطقة غيسير الحرارية وشلال غولفوس.', e: 'حساء لحم الضأن وراقب الشفق في موسمه.' },
        { t: 'الساحل الجنوبي', m: 'شلالا سيلجالاندسفوس وسكوغافوس.', a: 'شاطئ رينيسفيارا الأسود (ابتعد عن الأمواج).', e: 'المبيت في فيك.' },
        { t: 'الجليد والنار', m: 'قُد إلى بحيرة يوكولسارلون.', a: 'شاطئ الألماس ومسار مع مرشد على النهر الجليدي.', e: 'العودة إلى ريكيافيك والاسترخاء في بحيرة حرارية.' }] } },

  { id: 'maldives', coords: [3.2, 73.22], vec: [.1, 1, .3, 1, .2, .05, 1, 1],
    theme: { a: '#3ee6e0', b: '#ffd27a', bg: '#041f29' }, sky: ['#58c9e8', '#a8ecf0', '#fff1d0'],
    icons: { att: ['home', 'fish', 'mosque', 'palm'], act: ['mask', 'fish', 'utensils', 'lotus'] },
    budget: { low: [90, 30, 25, 35], mid: [260, 70, 50, 70], high: [1100, 250, 150, 200] },
    en: { name: 'Maldives', country: 'Maldives', tag: 'A thousand shades of blue, and nothing else to do.',
      story: 'Nearly twelve hundred coral islands scattered across the Indian Ocean. Overwater villas, house reefs bursting with life, and a pace so slow that time forgets you.',
      season: 'Nov – Apr (dry season)', language: 'Dhivehi', currency: 'Rufiyaa (MVR)', stay: '4–7 days',
      climate: 'Hot, humid and sunny with gentle sea breezes', land: 'Atolls, turquoise lagoons and coral reefs',
      riddle: 'I am a necklace of sand dropped in the ocean. My floors are glass, and my neighbours are turtles.',
      att: [['Overwater villa', 'Sleep above the lagoon with steps leading straight into the sea.'], ['Hanifaru Bay', 'A protected bay where manta rays gather to feed in season.'], ['Old Friday Mosque, Malé', 'A coral-stone mosque dating to the 17th century.'], ['A private sandbank', 'A strip of sand with turquoise water on every side.']],
      act: [['Snorkel & dive', 'Reefs rich with turtles, rays and colourful fish.'], ['Sunset dolphin cruise', 'A quiet boat following dolphins into the golden horizon.'], ['Private beach dinner', 'A table on the sand under lanterns.'], ['Overwater spa', 'A massage above the lagoon to the sound of waves.']],
      it: [
        { t: 'Seaplane Arrival', m: 'Fly by seaplane to your resort island.', a: 'Settle into your villa and swim off the deck.', e: 'Sunset drinks and a barefoot dinner.' },
        { t: 'Under the Surface', m: 'Snorkel the house reef before breakfast.', a: 'A guided dive or snorkel safari with rays and turtles.', e: 'Stargaze from the beach.' },
        { t: 'Sandbank & Dolphins', m: 'Boat to a secluded sandbank for a picnic.', a: 'Paddleboard across the lagoon.', e: 'Dolphin cruise at sunset.' },
        { t: 'Slow Farewell', m: 'A spa morning.', a: 'Visit Malé for the old mosque and fish market, if time allows.', e: 'Private candlelit beach dinner.' }] },
    ar: { name: 'جزر المالديف', country: 'المالديف', tag: 'ألف درجة من الأزرق، ولا شيء آخر لتفعله.',
      story: 'نحو ألف ومئتي جزيرة مرجانية متناثرة في المحيط الهندي: فلل فوق الماء وشعاب غنية بالحياة وإيقاع بطيء ينسى فيه الزمن أمرك.',
      season: 'نوفمبر – أبريل (موسم الجفاف)', language: 'الديفيهية', currency: 'الروفيا (MVR)', stay: '4–7 أيام',
      climate: 'حار رطب مشمس مع نسيم بحري لطيف', land: 'جزر مرجانية وبحيرات فيروزية وشعاب',
      riddle: 'أنا عقد من الرمل سقط في المحيط. أرضياتي من زجاج وجيراني سلاحف.',
      att: [['فيلا فوق الماء', 'نَم فوق البحيرة مع درج ينزل مباشرة إلى البحر.'], ['خليج هانيفارو', 'خليج محمي تتجمع فيه أسماك المانتا للتغذي في مواسم معينة.'], ['مسجد الجمعة القديم في ماليه', 'مسجد من الحجر المرجاني يعود إلى القرن السابع عشر.'], ['جزيرة رمال خاصة', 'شريط رمل تحيط به المياه الفيروزية من كل جانب.']],
      act: [['الغطس والسباحة', 'شعاب غنية بالسلاحف والراي والأسماك الملونة.'], ['رحلة الدلافين عند الغروب', 'قارب هادئ يتبع الدلافين نحو الأفق الذهبي.'], ['عشاء خاص على الشاطئ', 'طاولة على الرمل تحت الفوانيس.'], ['سبا فوق الماء', 'تدليك فوق البحيرة على صوت الأمواج.']],
      it: [
        { t: 'وصول بالطائرة المائية', m: 'طائرة مائية إلى جزيرة المنتجع.', a: 'استقر في فيلتك واسبح من الشرفة.', e: 'مشروبات الغروب وعشاء حافي القدمين.' },
        { t: 'تحت السطح', m: 'غطس سطحي في الشعاب القريبة قبل الإفطار.', a: 'رحلة غطس مع الراي والسلاحف بصحبة مرشد.', e: 'تأمل النجوم من الشاطئ.' },
        { t: 'جزيرة الرمال والدلافين', m: 'قارب إلى جزيرة رمال معزولة لنزهة.', a: 'ركوب لوح التجديف في البحيرة.', e: 'رحلة الدلافين عند الغروب.' },
        { t: 'وداع بطيء', m: 'صباح سبا.', a: 'زيارة ماليه للمسجد القديم وسوق السمك إن سمح الوقت.', e: 'عشاء خاص على الشاطئ تحت الشموع.' }] } },

  { id: 'istanbul', coords: [41.01, 28.98], vec: [.95, .5, .85, .6, .3, 1, .5, .4],
    theme: { a: '#ff6b81', b: '#ffb84d', bg: '#140819' }, sky: ['#2a1050', '#b83d7a', '#ff9a5a'],
    icons: { att: ['mosque', 'bag', 'tower', 'ship'], act: ['bath', 'utensils', 'ship', 'music'] },
    budget: { low: [25, 15, 8, 7], mid: [90, 35, 25, 15], high: [320, 100, 60, 40] },
    en: { name: 'Istanbul', country: 'Türkiye', tag: 'A city on two continents that never quite sleeps.',
      story: 'Where Europe meets Asia across the Bosphorus, Byzantine domes meet Ottoman minarets and spice bazaars meet rooftop bars. Istanbul is for people who want history and nightlife in the same breath.',
      season: 'Apr – Jun, Sep – Nov', language: 'Turkish', currency: 'Lira (TRY)', stay: '4–6 days',
      climate: 'Mild and breezy with four seasons', land: 'Domes, minarets, bridges and ferries',
      riddle: 'I straddle two continents, and my skyline is made of domes and minarets. Ferries and the call to prayer share my sky.',
      att: [['Hagia Sophia', 'A sixth-century marvel whose dome seems to float.'], ['The Grand Bazaar', 'One of the world’s oldest covered markets, with thousands of shops.'], ['Galata Tower', 'Panoramic views across the Golden Horn.'], ['A Bosphorus ferry', 'Cross between Europe and Asia past palaces and bridges.']],
      act: [['Turkish bath', 'Steam and scrub in a historic hammam.'], ['Street food walk', 'Simit, fish sandwiches, baklava and Turkish tea.'], ['Sunset ferry to Kadıköy', 'Watch the city change colour from the water.'], ['Nightlife in Beyoğlu', 'Rooftop bars and live music.']],
      it: [
        { t: 'The Old City', m: 'Visit Hagia Sophia and the Sultanahmet Mosque.', a: 'Explore Topkapı Palace.', e: 'Kebab dinner, then a Turkish bath.' },
        { t: 'Bazaars & Bosphorus', m: 'The Spice Bazaar, then the Grand Bazaar.', a: 'Take a Bosphorus ferry.', e: 'Sunset on the Galata Bridge and a seafood dinner.' },
        { t: 'The Asian Side', m: 'Ferry to Kadıköy and wander its markets.', a: 'Stroll the Moda seafront with coffee.', e: 'Back across for rooftop bars in Karaköy.' },
        { t: 'Neighbourhoods', m: 'Climb Galata Tower and walk İstiklal Avenue.', a: 'Wander the colourful streets of Balat.', e: 'Farewell meze dinner with live music.' }] },
    ar: { name: 'إسطنبول', country: 'تركيا', tag: 'مدينة على قارتين لا تنام أبداً.',
      story: 'حيث تلتقي أوروبا بآسيا عبر البوسفور، وتعانق القباب البيزنطية المآذن العثمانية، وتجاور أسواق التوابل الحانات على الأسطح. إسطنبول لمن يريد التاريخ والسهر في نَفَس واحد.',
      season: 'أبريل – يونيو، سبتمبر – نوفمبر', language: 'التركية', currency: 'الليرة (TRY)', stay: '4–6 أيام',
      climate: 'معتدل ونسيم بحري، فصول أربعة', land: 'قباب ومآذن وجسور وعبّارات',
      riddle: 'أمتد على قارتين، وأفقي مصنوع من قباب ومآذن. تتقاسم العبّارات سمائي مع صوت الأذان.',
      att: [['آيا صوفيا', 'تحفة من القرن السادس بقبة تبدو معلّقة في الهواء.'], ['البازار الكبير', 'من أقدم الأسواق المغطاة في العالم، وفيه آلاف المحلات.'], ['برج غلطة', 'إطلالة بانورامية على القرن الذهبي.'], ['رحلة البوسفور', 'عبّارة بين أوروبا وآسيا وسط القصور والجسور.']],
      act: [['حمّام تركي', 'بخار وتدليك في حمّام تاريخي.'], ['جولة طعام الشارع', 'سميط وسمك خبز وبقلاوة وشاي تركي.'], ['عبّارة الغروب إلى كاديكوي', 'شاهد المدينة تتلون من على الماء.'], ['سهر في بيوغلو', 'حانات على الأسطح وموسيقى حيّة.']],
      it: [
        { t: 'المدينة القديمة', m: 'زر آيا صوفيا وجامع السلطان أحمد.', a: 'استكشف قصر توب كابي.', e: 'عشاء كباب ثم حمّام تركي.' },
        { t: 'الأسواق والبوسفور', m: 'سوق التوابل ثم البازار الكبير.', a: 'رحلة عبّارة في البوسفور.', e: 'غروب على جسر غلطة وعشاء بحري.' },
        { t: 'الجانب الآسيوي', m: 'عبّارة إلى كاديكوي وجولة في أسواقها.', a: 'تمشَّ على كورنيش مودا واشرب قهوة.', e: 'عُد لسهرة على أسطح كاراكوي.' },
        { t: 'الأحياء والوداع', m: 'اصعد برج غلطة وامشِ في شارع الاستقلال.', a: 'تجوّل في أزقة بالاط الملونة.', e: 'عشاء مزة وداع مع موسيقى حيّة.' }] } }
];

/* =========================================================
   SCENES — layered SVG illustrations (parallax)
   ========================================================= */
const W = 1600, H = 900;
const rng = a => () => { let t = a += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const S = (inner, defs = '') => `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${defs ? `<defs>${defs}</defs>` : ''}${inner}</svg>`;
const LG = (id, stops) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(s => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ''}/>`).join('')}</linearGradient>`;
const RG = (id, stops) => `<radialGradient id="${id}">${stops.map(s => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ''}/>`).join('')}</radialGradient>`;
const stars = (seed, n, ymax, col = '#fff') => { const r = rng(seed); let o = ''; for (let i = 0; i < n; i++) o += `<circle class="tw" cx="${(r() * W).toFixed(0)}" cy="${(r() * ymax).toFixed(0)}" r="${(r() * 1.5 + .4).toFixed(1)}" fill="${col}" style="animation-delay:${(r() * 4).toFixed(1)}s"/>`; return o; };
const ridge = (seed, base, amp, fill, op = 1) => { const r = rng(seed); let d = `M0 ${H} L0 ${base}`; for (let x = 0; x <= W + 40; x += 40) { const y = base + Math.sin(x * .004 + seed) * amp * .6 + (r() - .5) * amp * .8 + Math.sin(x * .011 + seed * 2) * amp * .4; d += ` L${x} ${y.toFixed(1)}`; } return `<path d="${d} L${W} ${H}Z" fill="${fill}" opacity="${op}"/>`; };
const peaks = (seed, n, base, minH, maxH, body, snow) => {
  const r = rng(seed); let o = '';
  for (let i = 0; i < n; i++) {
    const cx = (i + .5) * W / n + (r() - .5) * W / n * .6, h = minH + r() * (maxH - minH), w = h * (1.1 + r() * .6), top = base - h;
    o += `<path d="M${cx - w} ${base} L${cx - w * .35} ${top + h * .25 + (r() - .5) * 20} L${cx} ${top} L${cx + w * .3} ${top + h * .3 + (r() - .5) * 20} L${cx + w} ${base}Z" fill="${body}"/>`;
    if (snow) { const sh = h * .32; o += `<path d="M${cx - w * .22} ${top + sh} L${cx - w * .12} ${top + sh * .7} L${cx - w * .06} ${top + sh * .95} L${cx} ${top + sh * .6} L${cx + w * .07} ${top + sh} L${cx + w * .14} ${top + sh * .72} L${cx + w * .24} ${top + sh} L${cx} ${top}Z" fill="${snow}"/>`; }
  }
  return o;
};
const pine = (x, base, h, c) => { let o = `<rect x="${x - 4}" y="${base - h * .1}" width="8" height="${h * .1}" fill="${c}"/>`; for (let i = 0; i < 5; i++) { const w = h * (.34 - i * .05), y = base - h * .1 - i * h * .17; o += `<path d="M${x - w} ${y} L${x} ${y - h * .3} L${x + w} ${y}Z" fill="${c}"/>`; } return o; };
const palm = (x, base, h, lean, c) => { const tx = x + lean, ty = base - h; let o = `<path d="M${x - 9} ${base} Q${x + lean * .2} ${base - h * .5} ${tx - 4} ${ty} L${tx + 4} ${ty} Q${x + lean * .2 + 12} ${base - h * .5} ${x + 9} ${base}Z" fill="${c}"/>`; for (let i = 0; i < 8; i++) o += `<path d="M0 0 Q60 -50 140 -10 Q70 -30 0 0Z" fill="${c}" transform="translate(${tx} ${ty}) rotate(${-160 + i * 40}) scale(${1 + (i % 2) * .25})"/>`; return o; };
const dome = (cx, base, r, c) => `<path d="M${cx - r} ${base} A${r} ${r * .95} 0 0 1 ${cx + r} ${base}Z" fill="${c}"/>`;
const minaret = (x, base, h, c) => `<rect x="${x - 7}" y="${base - h}" width="14" height="${h}" fill="${c}"/><rect x="${x - 12}" y="${base - h * .72}" width="24" height="7" fill="${c}"/><path d="M${x - 9} ${base - h} L${x} ${base - h - 58} L${x + 9} ${base - h}Z" fill="${c}"/>`;
const crescent = (x, y, c) => `<path d="M${x} ${y - 44} A44 44 0 1 0 ${x} ${y + 44} A34 34 0 1 1 ${x} ${y - 44}Z" fill="${c}"/>`;

const SCENES = {
  santorini() {
    const u = uid(), r = rng(5);
    const sky = S(`<rect width="${W}" height="${H}" fill="url(#${u}a)"/>${stars(3, 46, 320)}<circle cx="470" cy="560" r="300" fill="url(#${u}b)"/><circle cx="470" cy="560" r="84" fill="#ffe6b8"/>`,
      LG(u + 'a', [[0, '#121846'], [.4, '#6b3a86'], [.72, '#e8647e'], [1, '#ffb56b']]) + RG(u + 'b', [[0, '#ffd59a', .95], [1, '#ff8a65', 0]]));
    let st = ''; for (let i = 0; i < 14; i++) { const w = 300 - i * 14 + r() * 60; st += `<rect x="${470 - w / 2 + (r() - .5) * 40}" y="${575 + i * i * 1.6 + i * 8}" width="${w}" height="${3 + i * .5}" rx="3" fill="#ffd9a0" opacity="${.5 - i * .03}"/>`; }
    const sea = S(`<rect y="560" width="${W}" height="${H - 560}" fill="url(#${u}c)"/>${st}<path d="M60 560 Q200 506 330 538 Q400 552 470 560Z" fill="#2a2150" opacity=".9"/>`, LG(u + 'c', [[0, '#7b4a8c'], [.18, '#2c3f86'], [1, '#0a1238']]));
    const pts = [[620, 900], [800, 800], [980, 700], [1160, 610], [1340, 540], [1480, 470], [1600, 430]];
    const cy = x => { for (let i = 0; i < pts.length - 1; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[i + 1]; if (x >= x1 && x <= x2) return y1 + (y2 - y1) * (x - x1) / (x2 - x1); } return 900; };
    let hs = `<path d="M620 900 ${pts.map(p => 'L' + p.join(' ')).join(' ')} L1600 900Z" fill="#2b1a38"/>`;
    for (let row = 0; row < 3; row++) for (let x = 690 + row * 25; x < 1620; x += 52 + r() * 26) {
      const w = 44 + r() * 46, ht = 34 + r() * 40, by = cy(x) + row * 58 + 30, y0 = by - ht;
      hs += `<rect x="${x}" y="${y0}" width="${w}" height="${ht}" fill="#f7f2ea"/><rect x="${x + w * .72}" y="${y0}" width="${w * .28}" height="${ht}" fill="#d9cfc2"/><rect x="${x}" y="${y0}" width="${w}" height="5" fill="#fff"/><rect x="${x + w * .18}" y="${by - ht * .62}" width="8" height="12" rx="3" fill="#2c4f9a"/>`;
      if (r() < .24) hs += `<rect x="${x + w * .3}" y="${y0 - 10}" width="${w * .4}" height="10" fill="#f7f2ea"/><path d="M${x + w * .28} ${y0 - 10} a${w * .22} ${w * .22} 0 0 1 ${w * .44} 0Z" fill="#2c66c9"/>`;
      if (r() < .3) hs += `<circle cx="${x + r() * w}" cy="${y0 + 4}" r="7" fill="#d6336c" opacity=".9"/>`;
    }
    const near = S(`<path d="M0 900 L0 770 Q120 700 240 760 Q330 800 420 780 L520 900Z" fill="#150c1f"/><circle cx="90" cy="742" r="10" fill="#d6336c"/><circle cx="130" cy="730" r="8" fill="#e8508a"/><circle cx="180" cy="742" r="9" fill="#d6336c"/>`);
    return { layers: [{ d: .02, h: sky }, { d: .05, h: sea }, { d: .12, h: S(hs) }, { d: .24, h: near }], particles: { n: 22, kind: 'float', color: '#ffd9a0', size: [2, 5], dur: [6, 12] } };
  },
  kyoto() {
    const u = uid(), r = rng(21);
    const sky = S(`<rect width="${W}" height="${H}" fill="url(#${u}a)"/>${stars(4, 40, 300)}<circle cx="1130" cy="250" r="190" fill="url(#${u}b)"/><circle cx="1130" cy="250" r="110" fill="#fff0d6"/>`,
      LG(u + 'a', [[0, '#150d2c'], [.5, '#5a2a5c'], [.8, '#d9695f'], [1, '#f7c47e']]) + RG(u + 'b', [[0, '#fff0d6', .6], [1, '#fff0d6', 0]]));
    const far = S(`${ridge(31, 540, 50, '#4a2f63', .55)}${ridge(32, 610, 50, '#3a2556', .8)}<rect y="560" width="${W}" height="140" fill="url(#${u}m)" opacity=".5"/>`, LG(u + 'm', [[0, '#f6b7a0', 0], [.6, '#f6b7a0', .6], [1, '#f6b7a0', 0]]));
    const pag = (x, base, s, f) => { let o = ''; for (let i = 0; i < 5; i++) { const w = (150 - i * 20) * s, y = base - i * 58 * s; o += `<rect x="${x - w * .34}" y="${y - 48 * s}" width="${w * .68}" height="${48 * s}" fill="${f}"/><path d="M${x - w * .62} ${y - 44 * s} Q${x - w * .3} ${y - 50 * s} ${x} ${y - 66 * s} Q${x + w * .3} ${y - 50 * s} ${x + w * .62} ${y - 44 * s} L${x + w * .5} ${y - 36 * s} L${x - w * .5} ${y - 36 * s}Z" fill="${f}"/>`; } return o + `<rect x="${x - 3 * s}" y="${base - 4 * 58 * s - 126 * s}" width="${6 * s}" height="${64 * s}" fill="${f}"/>`; };
    let trees = ''; for (let i = 0; i < 14; i++) { const x = r() * W; if (Math.abs(x - 800) < 260) continue; trees += pine(x, 760, 160 + r() * 120, '#1b1222'); }
    for (let i = 0; i < 9; i++) trees += `<circle cx="${r() * W}" cy="${700 + r() * 60}" r="${30 + r() * 40}" fill="#c8453f" opacity=".85"/>`;
    const mid = S(`<rect y="740" width="${W}" height="160" fill="#1a1020"/>${pag(330, 740, 1.3, '#1a0f1f')}${trees}`);
    const torii = (cx, base, s) => { const pw = 18 * s, gap = 150 * s, hg = 210 * s, L = cx - gap, R = cx + gap; return `<rect x="${L - pw / 2}" y="${base - hg}" width="${pw}" height="${hg}" fill="#d6392c"/><rect x="${R - pw / 2}" y="${base - hg}" width="${pw}" height="${hg}" fill="#d6392c"/><rect x="${L - pw * .8}" y="${base - hg * .72}" width="${2 * gap + pw * 1.6}" height="${pw * .8}" fill="#b92d24"/><path d="M${L - gap * .5} ${base - hg - pw * .2} Q${cx} ${base - hg - pw * 2} ${R + gap * .5} ${base - hg - pw * .2} L${R + gap * .45} ${base - hg + pw} Q${cx} ${base - hg - pw * .4} ${L - gap * .45} ${base - hg + pw}Z" fill="#1d1217"/>`; };
    let g = ''; [[.58, 630], [.78, 654], [1.05, 688], [1.45, 736], [2.0, 803], [2.8, 900]].forEach(([s, b]) => { g += torii(800, b, s); });
    let leaves = ''; for (let i = 0; i < 16; i++) leaves += `<circle cx="${(i < 8 ? 40 : 1560) + (r() - .5) * 240}" cy="${40 + r() * 160}" r="${40 + r() * 70}" fill="${i % 3 ? '#c93d34' : '#e07a2c'}" opacity=".9"/>`;
    const near = S(`<rect y="880" width="${W}" height="20" fill="#120a14"/>${g}${leaves}`);
    return { layers: [{ d: .02, h: sky }, { d: .05, h: far }, { d: .12, h: mid }, { d: .24, h: near }], particles: { n: 30, kind: 'fall', color: '#d9503f', shape: 'leaf', size: [8, 16], dur: [9, 18] } };
  },
  interlaken() {
    const u = uid(), r = rng(41);
    const sky = S(`<rect width="${W}" height="${H}" fill="url(#${u}a)"/>${stars(6, 110, 420)}`, LG(u + 'a', [[0, '#0a1330'], [.5, '#2b3d7a'], [.8, '#c97c8a'], [1, '#f3a97c']]));
    const far = S(peaks(11, 4, 620, 280, 440, '#4c5a96', '#eef4ff'));
    let refl = ''; for (let i = 0; i < 18; i++) refl += `<rect x="${200 + r() * 1200}" y="${670 + i * 12}" width="${80 + r() * 200}" height="2" fill="#fff" opacity=".25"/>`;
    const mid = S(peaks(12, 6, 650, 150, 290, '#2e3a6e', '#cfe0ff') + `<rect y="640" width="${W}" height="260" fill="url(#${u}l)"/>` + refl, LG(u + 'l', [[0, '#2fb5c6'], [.4, '#17789a'], [1, '#0a2f4a']]));
    let trees = ''; for (let i = 0; i < 12; i++) trees += pine(r() < .5 ? r() * 420 : 1180 + r() * 420, 900, 240 + r() * 200, '#071a17');
    const chalet = `<g transform="translate(1250 760)"><rect x="0" y="0" width="120" height="80" fill="#3a2418"/><path d="M-14 4 L60 -44 L134 4Z" fill="#1d120c"/><rect x="18" y="22" width="22" height="26" fill="#ffc96b"/><rect x="80" y="22" width="22" height="26" fill="#ffc96b"/></g>`;
    return { layers: [{ d: .02, h: sky }, { d: .06, h: far }, { d: .1, h: mid }, { d: .24, h: S(trees + chalet) }], particles: { n: 34, kind: 'fall', color: '#ffffff', size: [2, 5], dur: [10, 20] } };
  },
  bali() {
    const u = uid();
    const sky = S(`<rect width="${W}" height="${H}" fill="url(#${u}a)"/><circle cx="800" cy="340" r="260" fill="url(#${u}b)"/><circle cx="800" cy="340" r="118" fill="#fff3c8"/>`,
      LG(u + 'a', [[0, '#ffe29a'], [.5, '#ffb56b'], [1, '#ff7e5f']]) + RG(u + 'b', [[0, '#fff3c8', .8], [1, '#fff3c8', 0]]));
    const far = S(`<path d="M300 560 L560 330 L640 360 L760 440 L900 560Z" fill="#d97a5b" opacity=".6"/>${ridge(51, 520, 40, '#b96a4e', .55)}`);
    const cols = ['#6fb552', '#4a9a43', '#86cb62', '#3a8a3a', '#5fae4c', '#2f7a35']; let ter = '';
    for (let i = 0; i < 7; i++) { const y = 500 + i * 58, a = 26 + i * 8; ter += `<path d="M0 ${y} Q${W * .25} ${y - a} ${W * .5} ${y} T${W} ${y} V${H} H0Z" fill="${cols[i % 6]}"/><path d="M0 ${y + 6} Q${W * .25} ${y - a + 6} ${W * .5} ${y + 6} T${W} ${y + 6}" stroke="#ffe3a0" stroke-opacity=".4" stroke-width="3" fill="none"/>`; }
    const gate = (cx, base) => { let o = ''; const ws = [100, 92, 82, 70, 58, 44, 30]; ws.forEach((w, i) => { o += `<rect x="${cx - 24 - w}" y="${base - (i + 1) * 26}" width="${w}" height="26" fill="#4a2a22"/><rect x="${cx + 24}" y="${base - (i + 1) * 26}" width="${w}" height="26" fill="#4a2a22"/>`; }); return o; };
    const mid = S(ter + gate(1180, 620));
    const near = S(palm(120, 900, 560, 90, '#14301a') + palm(1500, 900, 600, -110, '#14301a') + palm(300, 900, 380, 40, '#1c3d20'));
    return { layers: [{ d: .02, h: sky }, { d: .05, h: far }, { d: .12, h: mid }, { d: .28, h: near }], particles: { n: 26, kind: 'float', color: '#fff3c8', size: [2, 5], dur: [6, 12] } };
  },
  marrakech() {
    const u = uid(), r = rng(9);
    const sky = S(`<rect width="${W}" height="${H}" fill="url(#${u}a)"/>${stars(8, 60, 260)}${crescent(1180, 230, '#ffe9c4')}`, LG(u + 'a', [[0, '#2b1240'], [.5, '#a23b6b'], [1, '#ff9a3c']]));
    let sk = ''; for (let x = 0; x < W; x += 60 + r() * 50) { const w = 50 + r() * 60, h = 60 + r() * 110; sk += `<rect x="${x}" y="${660 - h}" width="${w}" height="${h + 240}" fill="#4a1f4a"/>`; if (r() < .4) sk += dome(x + w / 2, 660 - h, w * .4, '#4a1f4a'); if (r() < .5) sk += `<rect x="${x + 10}" y="${660 - h + 20}" width="8" height="14" fill="#ffcf70" opacity=".8"/>`; }
    const kout = `<rect x="1015" y="330" width="70" height="330" fill="#3a1640"/><rect x="1025" y="296" width="50" height="34" fill="#3a1640"/><rect x="1040" y="270" width="20" height="26" fill="#3a1640"/><circle cx="1050" cy="262" r="9" fill="#3a1640"/>${[380, 440, 500, 560].map(y => `<rect x="1038" y="${y}" width="24" height="30" rx="12" fill="#ffcf70" opacity=".55"/>`).join('')}`;
    const mid = S(`${sk}${kout}<rect y="660" width="${W}" height="240" fill="#2a1030"/>${palm(240, 700, 300, 30, '#2a1030')}${palm(1390, 700, 340, -30, '#2a1030')}`);
    let lan = ''; [[560, 150], [800, 230], [1040, 170], [680, 310], [920, 330]].forEach(([x, len]) => { lan += `<line x1="${x}" y1="0" x2="${x}" y2="${len}" stroke="#d9a441" stroke-width="2"/><circle cx="${x}" cy="${len + 22}" r="42" fill="url(#${u}g)"/><ellipse cx="${x}" cy="${len + 22}" rx="15" ry="22" fill="#ffb347"/><rect x="${x - 6}" y="${len - 2}" width="12" height="6" fill="#d9a441"/>`; });
    const arch = `<path fill-rule="evenodd" d="M0 0H${W}V${H}H0Z M370 ${H}V520 A440 440 0 1 1 1230 520 V${H}Z" fill="#1a0a14"/><path d="M370 ${H}V520 A440 440 0 1 1 1230 520 V${H}" fill="none" stroke="#d9a441" stroke-width="5" opacity=".7"/><path d="M392 ${H}V520 A418 418 0 1 1 1208 520 V${H}" fill="none" stroke="#d9a441" stroke-width="2" opacity=".5"/>`;
    const near = S(arch + lan, RG(u + 'g', [[0, '#ffb347', .8], [1, '#ffb347', 0]]));
    return { layers: [{ d: .02, h: sky }, { d: .08, h: mid }, { d: .26, h: near }], particles: { n: 26, kind: 'rise', color: '#ffb347', size: [2, 4], dur: [8, 16] } };
  },
  iceland() {
    const u = uid(), r = rng(71);
    const band = (y, c1, c2, off) => `<path class="aur" style="animation-delay:${off}s" d="M0 ${y} C300 ${y - 150} 500 ${y + 80} 800 ${y - 80} S1300 ${y - 180} 1600 ${y - 40} L1600 ${y + 160} C1300 ${y + 40} 1100 ${y + 200} 800 ${y + 100} S300 ${y + 220} 0 ${y + 140}Z" fill="url(#${u}${c1})" filter="url(#${u}f)"/>`;
    const sky = S(`<rect width="${W}" height="${H}" fill="url(#${u}a)"/>${stars(12, 150, 480)}${band(300, 'g', 'g', 0)}${band(250, 'p', 'p', -4)}`,
      LG(u + 'a', [[0, '#030818'], [.6, '#0b2a3d'], [1, '#16465a']]) + LG(u + 'g', [[0, '#5cffc1', 0], [.4, '#5cffc1', .75], [1, '#2cbf9a', 0]]) + LG(u + 'p', [[0, '#9a7bff', 0], [.5, '#c06bff', .5], [1, '#9a7bff', 0]]) + `<filter id="${u}f" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="18"/></filter>`);
    const far = S(peaks(21, 5, 640, 120, 280, '#10283a', '#9fd8e8'));
    let ib = ''; for (let i = 0; i < 7; i++) { const x = 200 + r() * 1200, y = 700 + r() * 90, w = 40 + r() * 90; ib += `<path d="M${x - w} ${y} L${x - w * .4} ${y - w * .8} L${x} ${y - w * .4} L${x + w * .5} ${y - w * .9} L${x + w} ${y}Z" fill="#bfe9ff" opacity=".9"/><path d="M${x - w} ${y} L${x + w} ${y} L${x + w * .6} ${y + w * .3} L${x - w * .6} ${y + w * .3}Z" fill="#6fb8d8" opacity=".7"/>`; }
    const mid = S(`<rect y="650" width="${W}" height="250" fill="url(#${u}w)"/><rect y="650" width="${W}" height="250" fill="#5cffc1" opacity=".08"/>${ib}`, LG(u + 'w', [[0, '#0f3a4c'], [1, '#050f1c']]));
    const near = S(`<path d="M0 900 L0 780 L90 740 L200 790 L300 760 L420 900Z" fill="#04080f"/><path d="M1600 900 L1600 760 L1480 730 L1380 780 L1270 750 L1180 900Z" fill="#04080f"/><ellipse cx="1000" cy="860" rx="120" ry="40" fill="#fff" opacity=".07"/>`);
    return { layers: [{ d: .02, h: sky }, { d: .06, h: far }, { d: .12, h: mid }, { d: .26, h: near }], particles: { n: 24, kind: 'float', color: '#9fffe0', size: [2, 4], dur: [8, 14] } };
  },
  maldives() {
    const u = uid(), r = rng(91);
    const sky = S(`<rect width="${W}" height="${H}" fill="url(#${u}a)"/><circle cx="1100" cy="300" r="260" fill="url(#${u}b)"/><circle cx="1100" cy="300" r="70" fill="#fffbe6"/>${[[300, 180, 120], [620, 130, 90], [1300, 210, 110]].map(([x, y, w]) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${w * .2}" fill="#fff" opacity=".75"/>`).join('')}`,
      LG(u + 'a', [[0, '#58c9e8'], [.6, '#a8ecf0'], [1, '#fff1d0']]) + RG(u + 'b', [[0, '#fffbe6', .8], [1, '#fffbe6', 0]]));
    let patches = ''; for (let i = 0; i < 9; i++) patches += `<ellipse cx="${r() * W}" cy="${600 + r() * 280}" rx="${120 + r() * 200}" ry="${14 + r() * 24}" fill="#7ff0e0" opacity=".35"/>`;
    const sea = S(`<rect y="540" width="${W}" height="${H - 540}" fill="url(#${u}c)"/>${patches}<path d="M0 548 Q160 520 340 548Z" fill="#2f8f6a"/><path d="M1200 548 Q1380 510 1600 548Z" fill="#2f8f6a"/>`, LG(u + 'c', [[0, '#7ff0e0'], [.3, '#2fd6d0'], [1, '#0a5f86']]));
    const bg = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-70" y="0" width="140" height="8" fill="#6b4a2f"/>${[-60, -30, 0, 30, 60].map(p => `<rect x="${p - 2}" y="8" width="4" height="40" fill="#5a3d28" opacity=".8"/>`).join('')}<rect x="-48" y="-44" width="96" height="44" fill="#efe1c7"/><path d="M-66 -40 L0 -96 L66 -40Z" fill="#8b5a33"/><rect x="-12" y="-30" width="24" height="30" fill="#7a5638"/><rect x="-40" y="-30" width="16" height="16" fill="#8fe3ef"/><rect x="24" y="-30" width="16" height="16" fill="#8fe3ef"/></g>`;
    const mid = S(`<path d="M720 900 L880 900 L812 580 L788 580Z" fill="#8a6a46"/>${[0, 1, 2, 3, 4, 5].map(i => `<line x1="${760 + i * 4}" y1="${880 - i * 56}" x2="${840 - i * 4}" y2="${880 - i * 56}" stroke="#6b4a2f" stroke-width="2"/>`).join('')}${bg(990, 580, .48)}${bg(1130, 605, .65)}${bg(1290, 650, .9)}${bg(640, 575, .45)}${bg(480, 600, .6)}${bg(300, 640, .8)}`);
    const near = S(`<path d="M0 900 L0 820 Q200 780 420 840 L520 900Z" fill="#f3e2b8"/>${palm(1480, 900, 560, -90, '#14402a')}<polygon points="900,0 1100,0 700,900 400,900" fill="#fff" opacity=".05"/>`);
    return { layers: [{ d: .02, h: sky }, { d: .05, h: sea }, { d: .12, h: mid }, { d: .26, h: near }], particles: { n: 24, kind: 'rise', color: '#ffffff', size: [3, 8], dur: [8, 16], bubble: true } };
  },
  istanbul() {
    const u = uid(), r = rng(111);
    const sky = S(`<rect width="${W}" height="${H}" fill="url(#${u}a)"/>${stars(14, 50, 280)}${crescent(1250, 200, '#ffe9c4')}${[[300, 220], [420, 180], [1000, 150]].map(([x, y]) => `<path d="M${x} ${y} Q${x + 8} ${y - 8} ${x + 16} ${y} Q${x + 24} ${y - 8} ${x + 32} ${y}" stroke="#2a1038" stroke-width="2" fill="none"/>`).join('')}`, LG(u + 'a', [[0, '#2a1050'], [.55, '#b83d7a'], [1, '#ff9a5a']]));
    const c = '#2a1034';
    const city = S(`<rect y="660" width="${W}" height="30" fill="${c}"/><rect x="640" y="580" width="320" height="82" fill="${c}"/>${dome(800, 585, 120, c)}${dome(680, 610, 70, c)}${dome(920, 610, 70, c)}${minaret(600, 662, 300, c)}${minaret(1000, 662, 300, c)}${dome(330, 650, 90, c)}${dome(240, 662, 50, c)}${dome(420, 662, 50, c)}<rect x="240" y="650" width="180" height="14" fill="${c}"/>${minaret(180, 662, 250, c)}${minaret(480, 662, 250, c)}<rect x="1310" y="450" width="52" height="212" fill="${c}"/><rect x="1300" y="440" width="72" height="14" fill="${c}"/><path d="M1306 440 L1336 380 L1366 440Z" fill="${c}"/>${[1, 2, 3, 4, 5].map(i => `<rect x="${600 + i * 60}" y="${600 + (i % 2) * 10}" width="10" height="16" rx="5" fill="#ffc96b" opacity=".7"/>`).join('')}`);
    let wr = ''; for (let i = 0; i < 16; i++) wr += `<rect x="${760 + (r() - .5) * 320}" y="${680 + i * 13}" width="${30 + r() * 100}" height="3" fill="#ff9a5a" opacity="${.5 - i * .02}"/>`;
    const water = S(`<rect y="662" width="${W}" height="238" fill="url(#${u}w)"/>${wr}<g transform="translate(1000 700)"><path d="M0 0 H150 L135 22 H15Z" fill="${c}"/><rect x="30" y="-18" width="70" height="18" fill="${c}"/><rect x="95" y="-34" width="10" height="34" fill="${c}"/></g>`, LG(u + 'w', [[0, '#5a2a6e'], [1, '#0f0620']]));
    let post = ''; for (let x = 0; x < W; x += 70) post += `<rect x="${x}" y="810" width="6" height="40" fill="#0d0516"/>`;
    let rods = ''; [200, 520, 900, 1260].forEach((x, i) => { const dir = i % 2 ? -1 : 1; rods += `<line x1="${x}" y1="810" x2="${x + dir * 150}" y2="690" stroke="#0d0516" stroke-width="3"/><line x1="${x + dir * 150}" y1="690" x2="${x + dir * 150}" y2="780" stroke="#0d0516" stroke-width="1"/>`; });
    const near = S(`<rect y="806" width="${W}" height="10" fill="#0d0516"/>${post}<rect y="850" width="${W}" height="50" fill="#0d0516"/>${rods}`);
    return { layers: [{ d: .02, h: sky }, { d: .06, h: city }, { d: .12, h: water }, { d: .26, h: near }], particles: { n: 22, kind: 'float', color: '#ffc96b', size: [2, 4], dur: [6, 12] } };
  }
};

/* =========================================================
   STARS CANVAS, GLOBE, POINTER FX
   ========================================================= */
function initStars() {
  const c = $('#stars'); if (!c) return; const ctx = c.getContext('2d'); let w = 0, h = 0, dpr = 1, list = [];
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2); w = c.width = innerWidth * dpr; h = c.height = innerHeight * dpr;
    c.style.width = innerWidth + 'px'; c.style.height = innerHeight + 'px';
    list = Array.from({ length: Math.round(innerWidth * innerHeight / 10000) }, () => ({ x: Math.random() * w, y: Math.random() * h, r: (Math.random() * 1.2 + .3) * dpr, p: Math.random() * 6.28, s: Math.random() * .0012 + .0004, z: Math.random() }));
  };
  const px = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--px')) || 0;
  const draw = tm => {
    ctx.clearRect(0, 0, w, h); const off = px() * 14 * dpr; ctx.fillStyle = '#fff';
    for (const s of list) { ctx.globalAlpha = (.3 + .7 * (.5 + .5 * Math.sin(tm * s.s * 6 + s.p))) * (.3 + .7 * s.z); ctx.beginPath(); ctx.arc(s.x + off * s.z, s.y, s.r, 0, 6.283); ctx.fill(); }
    if (!reduced() && !document.hidden) requestAnimationFrame(draw);
  };
  resize(); addEventListener('resize', resize); requestAnimationFrame(draw);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) requestAnimationFrame(draw); });
}

function buildGlobe(el) {
  const mer = Array.from({ length: 8 }, (_, k) => `<i class="m" style="--k:${k}"></i>`).join('');
  const lat = [-60, -30, 0, 30, 60].map(a => `<i class="l" style="--c:${Math.cos(a * Math.PI / 180).toFixed(3)};--y:${(Math.sin(a * Math.PI / 180) / 2).toFixed(3)}"></i>`).join('');
  const pins = DEST.map(d => `<b class="pin" style="--la:${-d.coords[0]}deg;--lo:${d.coords[1]}deg"></b>`).join('');
  el.innerHTML = `<div class="globe-tilt"><div class="globe"><i class="core"></i>${mer}${lat}${pins}</div><i class="orbit"><b class="plane">${icon('plane')}</b></i></div>`;
}

function bindTilt(el) {
  if (el._tilt) return; el._tilt = true;
  const max = +el.dataset.tilt || 10;
  el.addEventListener('pointermove', e => {
    if (!fine.matches || reduced()) return;
    const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', ((px - .5) * 2 * max).toFixed(2) + 'deg'); el.style.setProperty('--rx', ((.5 - py) * 2 * max).toFixed(2) + 'deg');
    el.style.setProperty('--gx', (px * 100).toFixed(0) + '%'); el.style.setProperty('--gy', (py * 100).toFixed(0) + '%');
  });
  el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
}

const par = { mx: 0, my: 0, cx: 0, cy: 0, layers: [], copy: null, raf: 0 };
function initPointer() {
  let lx = innerWidth / 2, ly = innerHeight / 2, busy = false, target = null;
  addEventListener('pointermove', e => {
    lx = e.clientX; ly = e.clientY; target = e.target;
    if (busy) return; busy = true;
    requestAnimationFrame(() => {
      busy = false; const s = document.documentElement.style;
      s.setProperty('--cx', lx + 'px'); s.setProperty('--cy', ly + 'px');
      const nx = (lx / innerWidth - .5) * 2, ny = (ly / innerHeight - .5) * 2;
      s.setProperty('--px', nx.toFixed(3)); s.setProperty('--py', ny.toFixed(3)); par.mx = nx; par.my = ny;
      const b = target && target.closest && target.closest('.btn');
      if (b) { const r = b.getBoundingClientRect(); b.style.setProperty('--rx', (lx - r.left) + 'px'); b.style.setProperty('--ry', (ly - r.top) + 'px'); }
    });
  }, { passive: true });
}

function startParallax(root) {
  cancelAnimationFrame(par.raf);
  par.layers = $$('.layer', root).map(el => ({ el, d: +el.dataset.d })); par.copy = $('.hero-copy', root);
  const tick = tm => {
    par.raf = requestAnimationFrame(tick);
    if (state.stage !== 'result' || reduced()) return;
    const y = window.scrollY, vh = innerHeight; if (y > vh * 1.25) return;
    if (!fine.matches) { par.mx = Math.sin(tm / 3800) * .5; par.my = Math.cos(tm / 5200) * .3; }
    par.cx = lerp(par.cx, par.mx, .06); par.cy = lerp(par.cy, par.my, .06);
    par.layers.forEach(({ el, d }) => { el.style.transform = `translate3d(${(par.cx * d * -140).toFixed(1)}px,${(par.cy * d * -90 + y * d * .85).toFixed(1)}px,0) scale(1.02)`; });
    if (par.copy) { par.copy.style.transform = `translate3d(0,${(y * .22).toFixed(1)}px,0)`; par.copy.style.opacity = clamp(1 - y / (vh * .7), 0, 1); }
  };
  par.raf = requestAnimationFrame(tick);
}

/* =========================================================
   STAGE MANAGEMENT
   ========================================================= */
const stages = {};
function show(name) {
  state.stage = name; document.body.dataset.stage = name;
  Object.entries(stages).forEach(([k, el]) => { const on = k === name; el.hidden = !on; el.classList.toggle('is-active', on); });
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  const f = $('[data-focus]', stages[name]); if (f) f.focus({ preventScroll: true });
  if (name !== 'result') { const s = document.body.style; s.removeProperty('--bg'); s.removeProperty('--a'); s.removeProperty('--b'); }
}
function go(name, before, after) {
  const veil = $('#veil');
  const run = () => { if (before) before(); show(name); requestAnimationFrame(() => { veil.classList.remove('on'); if (after) setTimeout(after, reduced() ? 0 : 500); }); };
  if (reduced()) { run(); return; }
  veil.classList.add('on'); setTimeout(run, 560);
}

/* =========================================================
   LANGUAGE
   ========================================================= */
function applyStatic() {
  $$('[data-i18n]').forEach(el => {
    const txt = t(el.dataset.i18n);
    if (el.hasAttribute('data-split')) el.innerHTML = txt.split(' ').map((w, i) => `<span class="w" style="--i:${i}"><span>${esc(w)}</span></span>`).join(' ');
    else el.textContent = txt;
  });
  $$('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
  document.title = isRTL() ? 'Why Travels? — دع الخريطة تختارك' : 'Why Travels? — Let the map choose you';
}
function setLang(l) {
  state.lang = l; store.set('wt-lang', l);
  const h = document.documentElement; h.lang = l; h.dir = l === 'ar' ? 'rtl' : 'ltr';
  $$('.lang-switch button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === l)));
  applyStatic();
  if (state.stage === 'quest') renderQuestion();
  else if (state.stage === 'reveal') { if (state.unveiled) renderName(); else { rvTok++; renderRevealShell(); showHold(); } }
  else if (state.stage === 'result') { const y = window.scrollY; renderResult(state.destIdx, { keep: true }); window.scrollTo({ top: y, behavior: 'instant' }); }
}

/* =========================================================
   QUESTIONS
   ========================================================= */
function renderQuestion() {
  const q = QUESTIONS[state.q], body = $('#qBody'), n = QUESTIONS.length;
  $('#qCount').textContent = t('signal', { n: num(state.q + 1), m: num(n) });
  $('#qDots').innerHTML = QUESTIONS.map((_, i) => `<i class="${i < state.q ? 'done' : i === state.q ? 'now' : ''}"></i>`).join('');
  $('#qTitle').textContent = L(q.q);
  $('#qHint').textContent = q.type === 'duel' ? t('duelHint') : q.type === 'cards' ? t('cardHint') : t('sliderHint');
  const st = stages.quest.style; st.setProperty('--m1', q.mood[0]); st.setProperty('--m2', q.mood[1]);
  $('#qBack').hidden = false;
  const sel = state.answers[state.q];
  if (q.type === 'duel') {
    body.innerHTML = `<div class="duel" role="group" aria-label="${esc(L(q.q))}">${q.opts.map((o, i) => `<button type="button" class="duel-opt${sel === i ? ' chosen' : ''}" data-i="${i}" style="--c1:${o.c[0]};--c2:${o.c[1]}" aria-pressed="${sel === i}"><span class="d-glyph" aria-hidden="true">${icon(o.g)}</span><span class="d-title">${esc(L(o.t))}</span><span class="d-desc">${esc(L(o.d))}</span><span class="d-key" aria-hidden="true">${i + 1}</span></button>${i === 0 ? '<span class="duel-vs" aria-hidden="true"><span>' + (isRTL() ? 'أم' : 'or') + '</span></span>' : ''}`).join('')}</div>`;
    $$('.duel-opt', body).forEach(b => {
      b.addEventListener('click', () => choose(+b.dataset.i, b));
      b.addEventListener('pointermove', e => { if (!fine.matches) return; const r = b.getBoundingClientRect(); b.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5) * 30 + 'px'); b.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5) * 20 + 'px'); });
    });
  } else if (q.type === 'cards') {
    body.innerHTML = `<div class="cards c${q.opts.length}" role="group" aria-label="${esc(L(q.q))}">${q.opts.map((o, i) => `<div class="c-wrap"><button type="button" class="c-opt${sel === i ? ' chosen' : ''}" data-i="${i}" data-tilt="12" aria-pressed="${sel === i}"><span class="c-orb" aria-hidden="true">${icon(o.g)}</span><span class="c-title">${esc(L(o.t))}</span><span class="c-desc">${esc(L(o.d))}</span><span class="d-key" aria-hidden="true">${i + 1}</span></button></div>`).join('')}</div>`;
    $$('.c-opt', body).forEach(b => { bindTilt(b); b.addEventListener('click', () => choose(+b.dataset.i, b)); });
  } else {
    const val = sel === undefined ? .5 : sel, last = state.q === n - 1;
    body.innerHTML = `<div class="slider-box" style="--c1:${q.c[0]};--c2:${q.c[1]};--v:${val}"><div class="s-orb" aria-hidden="true"><span></span></div><p class="s-read" id="sRead" aria-live="polite"></p><div class="s-row"><span class="s-end" aria-hidden="true">${icon(q.ends[0].g)}</span><input type="range" id="sRange" min="0" max="1" step="0.01" value="${val}" aria-label="${esc(L(q.q))}"><span class="s-end" aria-hidden="true">${icon(q.ends[1].g)}</span></div><button type="button" class="btn primary big" id="sNext"><span>${last ? t('last') : t('next')}</span><span class="arrow" aria-hidden="true">→</span></button></div>`;
    const rng_ = $('#sRange', body), read = $('#sRead', body), box = $('.slider-box', body);
    const upd = () => { const v = +rng_.value, steps = L(q.steps), txt = steps[Math.min(steps.length - 1, Math.floor(v * steps.length))]; box.style.setProperty('--v', v); read.textContent = txt; rng_.setAttribute('aria-valuetext', txt); state.answers[state.q] = v; };
    rng_.addEventListener('input', upd); upd(); delete state.answers[state.q]; if (sel !== undefined) state.answers[state.q] = sel;
    $('#sNext', body).addEventListener('click', () => { if (state.lock) return; state.answers[state.q] = +rng_.value; advance(); });
  }
}
function choose(i, el) {
  if (state.lock) return; state.lock = true; state.answers[state.q] = i;
  const group = el.parentElement.classList.contains('c-wrap') ? el.parentElement.parentElement : el.parentElement;
  $$('.duel-opt,.c-opt', group).forEach(b => { b.classList.toggle('chosen', b === el); b.classList.toggle('not-chosen', b !== el); b.setAttribute('aria-pressed', String(b === el)); });
  if (navigator.vibrate) try { navigator.vibrate(12); } catch (_) {}
  setTimeout(() => { state.lock = false; advance(); }, reduced() ? 60 : 780);
}
function swapQuestion(dir) {
  const wrap = $('#qWrap'); state.lock = true;
  if (reduced()) { renderQuestion(); state.lock = false; return; }
  wrap.style.setProperty('--dir', dir * (isRTL() ? -1 : 1)); wrap.classList.add('is-out');
  setTimeout(() => { renderQuestion(); wrap.classList.remove('is-out'); wrap.classList.add('is-in'); state.lock = false; setTimeout(() => wrap.classList.remove('is-in'), 750); }, 360);
}
function advance() { if (state.q < QUESTIONS.length - 1) { state.q++; swapQuestion(1); } else startReveal(); }
function back() {
  if (state.lock) return;
  if (state.q > 0) { state.q--; swapQuestion(-1); } else go('intro');
}

/* =========================================================
   MATCHING
   ========================================================= */
function computeMatches() {
  const acc = {}; DIMS.forEach(d => acc[d] = { s: 0, n: 0 });
  QUESTIONS.forEach((q, i) => {
    const a = state.answers[i]; if (a === undefined) return;
    const eff = q.type === 'slider' ? { [q.dim]: a } : q.opts[a].v;
    for (const d in eff) { acc[d].s += eff[d]; acc[d].n++; }
  });
  DIMS.forEach(d => {
    if (acc[d].n) { const v = acc[d].s / acc[d].n; state.profile[d] = v; state.weights[d] = .35 + Math.abs(v - .5) * 1.3 + Math.min(acc[d].n, 3) * .1; }
    else { state.profile[d] = .5; state.weights[d] = .1; }
  });
  state.ranking = DEST.map((D, i) => {
    let s = 0, ws = 0; DIMS.forEach((d, k) => { const w = state.weights[d]; s += w * (state.profile[d] - D.vec[k]) ** 2; ws += w; });
    const rms = Math.sqrt(s / ws); return { i, rms, pct: Math.round(clamp(100 - rms * 118, 38, 99)) };
  }).sort((a, b) => a.rms - b.rms);
}
const pctFor = i => (state.ranking.find(r => r.i === i) || { pct: 80 }).pct;
function traitList() {
  return DIMS.map(d => ({ d, dev: Math.abs(state.profile[d] - .5) })).filter(x => x.dev >= .15).sort((a, b) => b.dev - a.dev).slice(0, 5)
    .map(x => TRAITS[state.lang][x.d][state.profile[x.d] > .5 ? 1 : 0]);
}

/* =========================================================
   REVEAL — suspense sequence
   ========================================================= */
let rvTok = 0;
const wait = (ms, tok) => new Promise(r => setTimeout(() => r(tok === rvTok), reduced() ? Math.min(ms, 50) : ms));
function startReveal() {
  go('reveal', () => { computeMatches(); state.unveiled = false; renderRevealShell(); }, () => runReveal());
}
function renderRevealShell() {
  stages.reveal.innerHTML = `<div class="rv"><button type="button" class="link-btn rv-skip" id="rvSkip">${t('skipSuspense')}</button><div class="rv-core" id="rvCore"><p class="rv-status" id="rvStatus" aria-live="polite"></p><div class="rv-chips" id="rvChips"></div><div class="rv-orbs" id="rvOrbs" aria-hidden="true"></div><div class="rv-clues" id="rvClues"></div><div class="rv-hold" id="rvHold" hidden></div><div class="rv-name" id="rvName" hidden></div></div></div>`;
  $('#rvSkip').addEventListener('click', () => { rvTok++; $('#rvChips').classList.add('dock'); $('#rvOrbs').remove(); showHold(); });
}
function typeText(el, text, tok) {
  return new Promise(res => {
    if (reduced()) { el.textContent = text; res(true); return; }
    const ch = [...text]; let i = 0; el.classList.add('typing');
    const iv = setInterval(() => { if (tok !== rvTok) { clearInterval(iv); res(false); return; } i++; el.textContent = ch.slice(0, i).join(''); if (i >= ch.length) { clearInterval(iv); el.classList.remove('typing'); res(true); } }, 26);
  });
}
const coordStr = D => `${Math.abs(D.coords[0]).toFixed(2)}° ${D.coords[0] >= 0 ? 'N' : 'S'}   ${Math.abs(D.coords[1]).toFixed(2)}° ${D.coords[1] >= 0 ? 'E' : 'W'}`;
function rollCoords(el, str, tok) {
  return new Promise(res => {
    const chars = [...str]; el.innerHTML = chars.map(c => `<span>${c === ' ' ? '&nbsp;' : c}</span>`).join(''); const sp = $$('span', el);
    if (reduced()) { res(true); return; }
    const start = performance.now(), total = 1500;
    const iv = setInterval(() => {
      if (tok !== rvTok) { clearInterval(iv); res(false); return; }
      const p = (performance.now() - start) / total;
      chars.forEach((c, i) => { if (/\d/.test(c)) sp[i].textContent = p > i / chars.length ? c : Math.floor(Math.random() * 10); });
      if (p >= 1) { clearInterval(iv); res(true); }
    }, 45);
  });
}
async function runReveal() {
  const tok = ++rvTok; const best = state.ranking[0].i, D = DEST[best], d = L(D);
  const status = $('#rvStatus'), chips = $('#rvChips'), orbs = $('#rvOrbs'), clues = $('#rvClues');
  if (!status) return;
  status.textContent = t('reading');
  const traits = traitList();
  traits.forEach((txt, i) => { const c = document.createElement('span'); c.className = 'chip'; c.style.setProperty('--i', i); c.textContent = txt; chips.appendChild(c); });
  if (!await wait(1000 + traits.length * 420, tok)) return;
  status.textContent = t('narrowing'); chips.classList.add('dock');
  orbs.innerHTML = DEST.map((_, i) => `<span class="orb" data-i="${i}" style="--ang:${i * 360 / DEST.length}deg"><b>?</b></span>`).join(''); orbs.classList.add('show');
  if (!await wait(1000, tok)) return;
  for (const i of state.ranking.map(r => r.i).reverse().slice(0, -1)) { const o = $(`.orb[data-i="${i}"]`, orbs); if (o) o.classList.add('out'); if (!await wait(430, tok)) return; }
  const w = $(`.orb[data-i="${best}"]`, orbs); if (w) w.classList.add('win');
  if (!await wait(1300, tok)) return;
  orbs.classList.add('done'); status.textContent = t('gathering'); clues.classList.add('show');
  for (const [k, txt] of [['clueAir', d.climate], ['clueLand', d.land], ['clueRiddle', d.riddle]]) {
    const card = document.createElement('div'); card.className = 'clue'; card.innerHTML = `<span class="clue-k">${t(k)}</span><p class="clue-v"></p>`; clues.appendChild(card);
    if (!await wait(150, tok)) return; if (!await typeText($('.clue-v', card), txt, tok)) return; if (!await wait(380, tok)) return;
  }
  const cc = document.createElement('div'); cc.className = 'clue'; cc.innerHTML = `<span class="clue-k">${t('clueCoords')}</span><p class="clue-v coords" dir="ltr"></p>`; clues.appendChild(cc);
  if (!await rollCoords($('.coords', cc), coordStr(D), tok)) return;
  if (!await wait(900, tok)) return;
  showHold();
}
function showHold() {
  const hold = $('#rvHold'); if (!hold) return;
  const core = $('#rvCore'); core.classList.add('holding-stage');
  $('#rvStatus').textContent = t('ready');
  if (!$('#rvClues').children.length) $('#rvClues').remove();
  hold.hidden = false;
  hold.innerHTML = `<button type="button" class="hold" id="holdBtn" aria-label="${t('holdTitle')}"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="track" cx="50" cy="50" r="46"/><circle class="bar" id="holdBar" cx="50" cy="50" r="46"/></svg><span class="core"></span><span class="hold-label">${t('holdTitle')}</span></button><p class="hold-hint">${t('holdHint')}</p><button type="button" class="link-btn" id="holdInstant">${t('instant')}</button>`;
  const btn = $('#holdBtn'), bar = $('#holdBar'), CIRC = 2 * Math.PI * 46, DUR = 1400;
  bar.style.strokeDasharray = CIRC; bar.style.strokeDashoffset = CIRC;
  let holding = false, start = 0, raf = 0;
  const tick = now => {
    if (!holding) return; const p = clamp((now - start) / DUR, 0, 1);
    bar.style.strokeDashoffset = CIRC * (1 - p); btn.style.setProperty('--p', p.toFixed(3));
    if (p >= 1) { holding = false; unveil(); return; } raf = requestAnimationFrame(tick);
  };
  const begin = () => { if (holding) return; holding = true; start = performance.now(); btn.classList.add('holding'); raf = requestAnimationFrame(tick); };
  const end = () => { if (!holding) return; holding = false; cancelAnimationFrame(raf); btn.classList.remove('holding'); bar.style.strokeDashoffset = CIRC; btn.style.setProperty('--p', 0); };
  btn.addEventListener('pointerdown', e => { e.preventDefault(); begin(); });
  ['pointerup', 'pointercancel', 'pointerleave', 'blur'].forEach(ev => btn.addEventListener(ev, end));
  btn.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); begin(); } });
  btn.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') end(); });
  btn.addEventListener('contextmenu', e => e.preventDefault());
  $('#holdInstant').addEventListener('click', unveil);
  btn.focus({ preventScroll: true });
}
function renderName() {
  const best = state.ranking[0].i, D = DEST[best], d = L(D), box = $('#rvName'); if (!box) return;
  const title = isRTL() ? `<span class="rv-ch" style="--i:0">${esc(d.name)}</span>` : [...d.name].map((c, i) => `<span class="rv-ch" style="--i:${i}">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('');
  box.hidden = false;
  box.innerHTML = `<p class="rv-pre">${t('yourDest')}</p><h2 class="rv-title" aria-label="${esc(d.name)}"><span aria-hidden="true">${title}</span></h2><p class="rv-country">${icon('pin')}<span>${esc(d.country)}</span></p><p class="rv-match"><b>${num(pctFor(best))}${isRTL() ? '٪' : '%'}</b> ${t('resonance')}</p><button type="button" class="btn primary big" id="enterBtn"><span>${t('enter')}</span><span class="arrow" aria-hidden="true">→</span></button>`;
  $('#enterBtn').addEventListener('click', () => go('result', () => renderResult(best, {})));
  $('#enterBtn').focus({ preventScroll: true });
}
function unveil() {
  if (state.unveiled) return; state.unveiled = true; rvTok++;
  const root = $('.rv'); if (!root) return; root.classList.add('flash');
  $('#rvCore').classList.add('unveiled'); $('#rvSkip').hidden = true;
  ['#rvChips', '#rvOrbs', '#rvClues', '#rvHold'].forEach(s => { const e = $(s); if (e) e.hidden = true; });
  $('#rvStatus').textContent = '';
  setTimeout(() => { renderName(); root.classList.remove('flash'); }, reduced() ? 0 : 450);
}

/* =========================================================
   RESULT
   ========================================================= */
let resultIO = null, subIO = null;
const tpl = (arr, fn) => arr.map(fn).join('');
function particlesHTML(cfg) {
  if (!cfg) return ''; const r = rng(7); let o = '';
  for (let i = 0; i < cfg.n; i++) {
    const s = cfg.size[0] + r() * (cfg.size[1] - cfg.size[0]), dur = cfg.dur[0] + r() * (cfg.dur[1] - cfg.dur[0]);
    o += `<i class="pt ${cfg.kind}${cfg.shape === 'leaf' ? ' leaf' : ''}${cfg.bubble ? ' bubble' : ''}" style="--x:${(r() * 100).toFixed(1)}%;--y:${(r() * 100).toFixed(1)}%;--s:${s.toFixed(1)}px;--pc:${cfg.color};--dur:${dur.toFixed(1)}s;--delay:${(-r() * dur).toFixed(1)}s;--dx:${((r() - .5) * 160).toFixed(0)}px;--o:${(.4 + r() * .5).toFixed(2)}"></i>`;
  }
  return o;
}
function calcBudget() {
  const D = DEST[state.destIdx], [stay, food, act, tr] = D.budget[state.tier], share = state.people > 1 ? .72 : 1;
  const parts = [stay * share, food, act, tr].map(Math.round), perDay = parts.reduce((a, b) => a + b, 0);
  return { parts, perDay, total: perDay * state.days * state.people };
}
function renderResult(idx, opts) {
  state.destIdx = idx; const D = DEST[idx], d = L(D), pct = pctFor(idx), root = stages.result;
  if (resultIO) resultIO.disconnect(); if (subIO) subIO.disconnect();
  document.body.style.setProperty('--bg', D.theme.bg); document.body.style.setProperty('--a', D.theme.a); document.body.style.setProperty('--b', D.theme.b);
  const sc = SCENES[D.id](); const pctTxt = num(pct) + (isRTL() ? '٪' : '%');
  const layers = sc.layers.map(l => `<div class="layer" data-d="${l.d}">${l.h}</div>`).join('');
  const titleHTML = isRTL() ? `<span class="ch" style="--i:0">${esc(d.name)}</span>` : [...d.name].map((c, i) => `<span class="ch" style="--i:${i}">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('');
  const circ = 2 * Math.PI * 44;
  const aligned = DIMS.map((dm, k) => ({ dm, diff: Math.abs(state.profile[dm] - D.vec[k]), v: state.profile[dm], dev: Math.abs(state.profile[dm] - .5) })).filter(x => x.dev >= .15).sort((a, b) => a.diff - b.diff).slice(0, 3);
  const whyRows = DIMS.map((dm, k) => { const lb = DIM_LABELS[state.lang][dm]; return `<div class="why-row" data-reveal style="--i:${k}"><div class="why-lab"><span>${lb[0]}</span><span>${lb[1]}</span></div><div class="why-track"><i class="mk you" style="--v:${state.profile[dm].toFixed(2)}" title="${t('you')}"></i><i class="mk place" style="--v:${D.vec[k]}" title="${t('place')}"></i></div></div>`; }).join('');
  const b = calcBudget();
  const nav = [['story', 'navStory'], ['why', 'navWhy'], ['sights', 'navSights'], ['do', 'navDo'], ['budget', 'navBudget'], ['plan', 'navPlan']];
  const others = state.ranking.filter(r => r.i !== idx).slice(0, 3);
  root.innerHTML = `
  <article class="res">
    <header class="hero${opts.keep ? '' : ' enter'}" id="hero">
      <div class="scene" aria-hidden="true">${layers}</div>
      <div class="particles" aria-hidden="true">${particlesHTML(sc.particles)}</div>
      <div class="hero-shade" aria-hidden="true"></div>
      <div class="hero-copy">
        <p class="eyebrow"><span class="dot"></span>${t('yourDest')}</p>
        <h1 class="hero-title" id="resTitle" tabindex="-1" aria-label="${esc(d.name)}"><span aria-hidden="true">${titleHTML}</span></h1>
        <p class="hero-country"><span class="flag" aria-hidden="true">${icon('pin')}</span>${esc(d.country)}</p>
        <p class="hero-tag">${esc(d.tag)}</p>
      </div>
      <div class="match" role="img" aria-label="${pctTxt} ${t('matchLabel')}"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="t" cx="50" cy="50" r="44"/><circle class="b" cx="50" cy="50" r="44" style="stroke-dasharray:${circ};stroke-dashoffset:${circ * (1 - pct / 100)}"/></svg><b>${pctTxt}</b><span>${t('matchLabel')}</span></div>
      <a class="scroll-cue" href="#story"><i></i>${t('scroll')}</a>
    </header>
    <nav class="subnav" aria-label="${esc(d.name)}"><div class="subnav-in">${nav.map(([id, k]) => `<a href="#${id}" data-sec="${id}">${t(k)}</a>`).join('')}</div></nav>

    <section class="sec story" id="story"><div class="wrap two">
      <div data-reveal><p class="sec-kicker">01</p><h2 class="sec-title">${t('storyTitle', { name: esc(d.name) })}</h2><p class="lead">${esc(d.story)}</p>
        <dl class="facts"><div><dt>${t('factSeason')}</dt><dd>${esc(d.season)}</dd></div><div><dt>${t('factLang')}</dt><dd>${esc(d.language)}</dd></div><div><dt>${t('factCurrency')}</dt><dd>${esc(d.currency)}</dd></div><div><dt>${t('factStay')}</dt><dd>${esc(d.stay)}</dd></div></dl></div>
      <div data-reveal class="pc-wrap"><div class="postcard" data-tilt="9" style="--s1:${D.sky[0]};--s2:${D.sky[1]};--s3:${D.sky[2]}"><div class="pc-glare"></div><div class="pc-stamp" aria-hidden="true">${icon('pin')}</div><div class="pc-art" aria-hidden="true">${icon(D.icons.att[0])}</div><p class="pc-hello">${t('greetings', { name: esc(d.name) })}</p><p class="pc-coords" dir="ltr">${coordStr(D)}</p><p class="pc-sign">— Why Travels?</p></div></div>
    </div></section>

    <section class="sec why" id="why"><div class="wrap">
      <div data-reveal><p class="sec-kicker">02</p><h2 class="sec-title">${t('whyTitle')}</h2><p class="lead">${t('whyLead', { name: esc(d.name), pct: pctTxt })}</p></div>
      <div class="legend" data-reveal><span><i class="mk you"></i>${t('you')}</span><span><i class="mk place"></i>${t('place')}</span></div>
      <div class="why-grid">${whyRows}</div>
      <div data-reveal class="aligned"><p>${t('whyAligned', { name: esc(d.name) })}</p><div class="chips-row">${aligned.map(x => `<span class="chip">${icon('check')} ${TRAITS[state.lang][x.dm][x.v > .5 ? 1 : 0]}</span>`).join('')}</div></div>
    </div></section>

    <section class="sec sights" id="sights"><div class="wrap">
      <div data-reveal><p class="sec-kicker">03</p><h2 class="sec-title">${t('sightsTitle')}</h2></div>
      <div class="sights-grid">${tpl(d.att, (a, i) => `<div data-reveal style="--i:${i}"><article class="s-card" data-tilt="12" style="--i:${i}"><div class="glare"></div><span class="s-num" aria-hidden="true">0${i + 1}</span><span class="s-icon" aria-hidden="true">${icon(D.icons.att[i])}</span><h3>${esc(a[0])}</h3><p>${esc(a[1])}</p></article></div>`)}</div>
    </div></section>

    <section class="sec acts" id="do"><div class="wrap">
      <div data-reveal><p class="sec-kicker">04</p><h2 class="sec-title">${t('doTitle')}</h2></div>
      <ul class="acts-grid">${tpl(d.act, (a, i) => `<li data-reveal style="--i:${i}" class="act"><span class="act-ic" aria-hidden="true">${icon(D.icons.act[i])}</span><div><h3>${esc(a[0])}</h3><p>${esc(a[1])}</p></div></li>`)}</ul>
    </div></section>

    <section class="sec budget" id="budget"><div class="wrap">
      <div data-reveal><p class="sec-kicker">05</p><h2 class="sec-title">${t('budgetTitle')}</h2><p class="lead">${t('budgetSub')}</p></div>
      <div class="panel b-panel" data-reveal>
        <div class="b-controls">
          <div class="tiers" id="tierTabs" role="group" aria-label="${t('budgetTitle')}">${[['low', 'tierLow'], ['mid', 'tierMid'], ['high', 'tierHigh']].map(([k, l]) => `<button type="button" data-tier="${k}" aria-pressed="${state.tier === k}">${t(l)}</button>`).join('')}</div>
          <label class="b-field"><span>${t('days')} <b id="daysOut">${num(state.days)}</b></span><input type="range" id="daysRange" min="2" max="14" step="1" value="${state.days}"></label>
          <div class="b-field"><span>${t('travelers')}</span><div class="stepper"><button type="button" id="pplMinus" aria-label="−">−</button><b id="pplOut" aria-live="polite">${num(state.people)}</b><button type="button" id="pplPlus" aria-label="+">+</button></div></div>
        </div>
        <div class="b-summary">
          <p class="b-cap">${t('tripTotal')}</p><p class="b-total" id="bTotal" data-v="${b.total}">${usd(b.total)}</p>
          <p class="b-per"><b id="bPer">${usd(b.perDay)}</b> ${t('perDay')}</p>
          <div class="bar" id="bBar" aria-hidden="true">${[0, 1, 2, 3].map(i => `<i class="seg s${i}" style="--w:${(b.parts[i] / b.perDay * 100).toFixed(1)}%"></i>`).join('')}</div>
          <ul class="b-list" id="bList">${['stay', 'food', 'activities', 'transport'].map((k, i) => `<li><i class="dot s${i}"></i><span>${t(k)}</span><b>${usd(b.parts[i])}</b></li>`).join('')}</ul>
        </div>
      </div>
      <p class="note" data-reveal>${t('shareNote')}</p>
    </div></section>

    <section class="sec plan" id="plan"><div class="wrap">
      <div data-reveal class="plan-head"><div><p class="sec-kicker">06</p><h2 class="sec-title">${t('planTitle')}</h2></div>
        <div class="plan-actions"><button type="button" class="btn" id="copyBtn">${icon('copy')}<span>${t('copy')}</span></button><button type="button" class="btn" id="printBtn">${icon('printer')}<span>${t('print')}</span></button></div></div>
      <div class="day-tabs" role="tablist" aria-label="${t('planTitle')}" data-reveal>${tpl(d.it, (x, i) => `<button type="button" role="tab" id="tab${i}" aria-controls="panel${i}" aria-selected="${i === state.day}" tabindex="${i === state.day ? 0 : -1}" data-day="${i}"><small>${t('day')} ${num(i + 1)}</small><span>${esc(x.t)}</span></button>`)}</div>
      <div class="day-panels" data-reveal>${tpl(d.it, (x, i) => `<div class="day-panel" role="tabpanel" id="panel${i}" aria-labelledby="tab${i}" ${i === state.day ? '' : 'hidden'}><h3>${t('day')} ${num(i + 1)} — ${esc(x.t)}</h3><ol class="timeline">${[['sunrise', 'morning', x.m], ['sun', 'afternoon', x.a], ['moon', 'evening', x.e]].map(([ic, k, tx], j) => `<li style="--j:${j}"><span class="tl-ic" aria-hidden="true">${icon(ic)}</span><div><b>${t(k)}</b><p>${esc(tx)}</p></div></li>`).join('')}</ol></div>`)}</div>
    </div></section>

    <section class="sec more" id="more"><div class="wrap">
      <div data-reveal><h2 class="sec-title">${t('othersTitle')}</h2><p class="lead">${t('othersSub')}</p></div>
      <div class="more-grid">${tpl(others, (r, i) => { const o = DEST[r.i], od = L(o); return `<div data-reveal style="--i:${i}"><button type="button" class="alt" data-go="${r.i}" data-tilt="8" style="--s1:${o.sky[0]};--s2:${o.sky[1]};--s3:${o.sky[2]}"><span class="alt-flag" aria-hidden="true">${icon('pin')}</span><span class="alt-name">${esc(od.name)}</span><span class="alt-country">${esc(od.country)}</span><span class="alt-pct">${num(r.pct)}${isRTL() ? '٪' : '%'}</span><span class="alt-cta">${t('explore')} <i class="arrow" aria-hidden="true">→</i></span></button></div>`; })}</div>
    </div></section>

    <footer class="foot"><button type="button" class="btn primary big" id="againBtn"><span>${t('again')}</span><span aria-hidden="true">${icon('rotate')}</span></button><p>${t('footNote')}</p></footer>
  </article>`;
  wireResult(root);
}

function updateBudget(root, animate) {
  const b = calcBudget(), tot = $('#bTotal', root), from = +tot.dataset.v || 0; tot.dataset.v = b.total;
  $('#daysOut', root).textContent = num(state.days); $('#pplOut', root).textContent = num(state.people);
  $('#bPer', root).textContent = usd(b.perDay);
  $$('#bBar .seg', root).forEach((s, i) => s.style.setProperty('--w', (b.parts[i] / b.perDay * 100).toFixed(1) + '%'));
  $$('#bList li b', root).forEach((e, i) => e.textContent = usd(b.parts[i]));
  $$('#tierTabs button', root).forEach(x => x.setAttribute('aria-pressed', String(x.dataset.tier === state.tier)));
  if (!animate || reduced()) { tot.textContent = usd(b.total); return; }
  const t0 = performance.now(), dur = 700;
  const step = now => { const p = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - p, 3); tot.textContent = usd(lerp(from, b.total, e)); if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
function itineraryText() {
  const D = DEST[state.destIdx], d = L(D), b = calcBudget();
  let s = `${d.name} — ${d.country}\n${d.tag}\n\n${t('tripTotal')}: ${usd(b.total)} (${num(state.days)} ${t('days')}, ${num(state.people)} ${t('travelers')})\n\n`;
  d.it.forEach((x, i) => { s += `${t('day')} ${num(i + 1)} — ${x.t}\n  ${t('morning')}: ${x.m}\n  ${t('afternoon')}: ${x.a}\n  ${t('evening')}: ${x.e}\n\n`; });
  return s + '— Why Travels?';
}
let toastTimer = 0;
function toast(msg) { const el = $('#toast'); el.textContent = msg; el.classList.add('on'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('on'), 2400); }
async function copyItinerary() {
  const text = itineraryText();
  try { await navigator.clipboard.writeText(text); toast(t('copied')); }
  catch (_) {
    const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
    document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (_) {} ta.remove(); toast(ok ? t('copied') : t('copyFail'));
  }
}
function wireResult(root) {
  resultIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); resultIO.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  $$('[data-reveal]', root).forEach(el => resultIO.observe(el));
  $$('[data-tilt]', root).forEach(bindTilt);
  startParallax(root);
  // subnav highlight
  const links = $$('.subnav a', root);
  subIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => { const on = a.dataset.sec === e.target.id; if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); }); }), { rootMargin: '-45% 0px -50% 0px' });
  $$('.sec', root).forEach(s => subIO.observe(s));
  // budget
  $$('#tierTabs button', root).forEach(b => b.addEventListener('click', () => { state.tier = b.dataset.tier; updateBudget(root, true); }));
  $('#daysRange', root).addEventListener('input', e => { state.days = +e.target.value; updateBudget(root, false); });
  $('#pplMinus', root).addEventListener('click', () => { state.people = Math.max(1, state.people - 1); updateBudget(root, true); });
  $('#pplPlus', root).addEventListener('click', () => { state.people = Math.min(8, state.people + 1); updateBudget(root, true); });
  // itinerary tabs
  const tabs = $$('.day-tabs [role=tab]', root), panels = $$('.day-panel', root);
  const pick = i => { state.day = i; tabs.forEach((t_, k) => { t_.setAttribute('aria-selected', String(k === i)); t_.tabIndex = k === i ? 0 : -1; }); panels.forEach((p, k) => { p.hidden = k !== i; }); };
  tabs.forEach((tb, i) => {
    tb.addEventListener('click', () => pick(i));
    tb.addEventListener('keydown', e => {
      let n = i; const rtl = isRTL();
      if (e.key === 'ArrowRight') n = rtl ? i - 1 : i + 1; else if (e.key === 'ArrowLeft') n = rtl ? i + 1 : i - 1; else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = tabs.length - 1; else return;
      e.preventDefault(); n = (n + tabs.length) % tabs.length; pick(n); tabs[n].focus();
    });
  });
  $('#copyBtn', root).addEventListener('click', copyItinerary);
  $('#printBtn', root).addEventListener('click', () => window.print());
  $$('[data-go]', root).forEach(b => b.addEventListener('click', () => go('result', () => renderResult(+b.dataset.go, {}))));
  $('#againBtn', root).addEventListener('click', restart);
  const ti = $('#resTitle', root); if (ti) ti.focus({ preventScroll: true });
}

/* =========================================================
   FLOW CONTROL & INIT
   ========================================================= */
function restart() { rvTok++; state.answers = []; state.q = 0; state.day = 0; state.lock = false; go('intro'); }
function begin() { state.answers = []; state.q = 0; state.lock = false; go('quest', () => renderQuestion()); }

document.addEventListener('keydown', e => {
  if (state.stage !== 'quest' || state.lock || e.ctrlKey || e.metaKey || e.altKey) return;
  const n = parseInt(e.key, 10); if (!n) return;
  const b = $$('.duel-opt,.c-opt')[n - 1]; if (b) b.click();
});

function init() {
  stages.lang = $('#stage-lang'); stages.intro = $('#stage-intro'); stages.quest = $('#stage-quest'); stages.reveal = $('#stage-reveal'); stages.result = $('#stage-result');
  $$('[data-globe]').forEach(buildGlobe);
  $$('[data-tilt]').forEach(bindTilt);
  const saved = store.get('wt-lang'); if (saved === 'ar' || saved === 'en') { state.lang = saved; }
  const h = document.documentElement; h.lang = state.lang; h.dir = isRTL() ? 'rtl' : 'ltr';
  $$('.lang-switch button').forEach(b => { b.setAttribute('aria-pressed', String(b.dataset.lang === state.lang)); b.addEventListener('click', () => setLang(b.dataset.lang)); });
  applyStatic();
  $$('[data-choose]').forEach(b => b.addEventListener('click', () => { setLang(b.dataset.choose); go('intro'); }));
  $('#beginBtn').addEventListener('click', begin);
  $('#qBack').addEventListener('click', back);
  $('#brandBtn').addEventListener('click', () => { rvTok++; if (state.stage === 'lang') return; go('intro'); });
  stages.lang.classList.add('is-active');
  initStars(); initPointer();
  document.body.classList.add('ready');
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
