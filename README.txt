NEET FOR JEET — REBUILT FRONTEND
================================

This is a rebuilt responsive Progressive Web App (PWA) frontend.

OPENING THE APP
---------------
1. Extract the complete ZIP file first. Do not open index.html from inside the ZIP preview.
2. Keep the folder structure unchanged.
3. Open index.html in a modern browser. For the most reliable experience, serve this folder from a local web server or deploy it to HTTPS hosting; PWA installation and service-worker caching require HTTPS (or localhost).
4. On Android, upload/deploy the extracted folder to a static HTTPS host, then open the site in Chrome and use Install app / Add to Home screen.

PROJECT STRUCTURE
-----------------
index.html                 App entry point
css/style.css              Responsive purple UI styles
js/data.js                 Subject chapter data and asset paths
js/app.js                  Navigation, local interactions and game logic
assets/subjects/           Chapter covers and chapter logos
assets/interfaces/         Approved design reference images
icons/                     PWA icons
manifest.json              PWA metadata
sw.js                      Service worker shell cache
ASSET_MAPPING.csv           Asset-to-chapter mapping reference

IMPLEMENTED FRONTEND
--------------------
- Home, Batches, Batch detail, Physics/Biology/Chemistry subject screens
- Chapter list, chapter detail and Lectures/DPP/PYQs/Tests tabs
- Bookmarks, daily goal, weekly schedule and local progress summary
- Ratta Games: playable Dimension sequence-memory game
- Basic local Admin Panel for adding batches and learning content
- Local browser persistence using localStorage
- PWA manifest and service worker registration

IMPORTANT LIMITATIONS
---------------------
- The original Dimension Game HTML/source was not present in the supplied files. The included game is a newly implemented sequence-memory game, not a verified copy of the original game.
- The Admin Panel is a local prototype only. It is not a secure multi-user admin system and does not publish content to other devices.
- Login/authentication, Firebase/database sync, secure admin roles, real student analytics, hosted video storage, payment/batch validity enforcement, push notifications, and APK packaging are not connected.
- No demo lecture/DPP/PYQ/test content is fabricated. Add actual content from the Admin Panel or connect a backend.
- Image totals are asset counts, not a claim about the official NEET syllabus chapter count.

DATA
----
All supplied chapter covers and logos are referenced by relative paths. Do not rename or move the assets folder without updating js/data.js.
