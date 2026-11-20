NEET FOR JEET — GITHUB PAGES READY PROJECT
==========================================

IS PROJECT KO GITHUB PAR PUBLISH KARNE KA TARIKA
-------------------------------------------------
1. Is ZIP ko extract karo.
2. Extract hone par NEET_FOR_JEET_GITHUB folder ke ANDAR ki saari files/folders
   apni GitHub repository ke root mein upload karo. Dhyan rahe index.html root
   mein hona chahiye, kisi extra nested folder ke andar nahi.
3. GitHub repository kholo → Settings → Pages.
4. Build and deployment mein 'Deploy from a branch' select karo.
5. Branch: main (ya tumhari default branch), Folder: / (root) select karo.
6. Save karo. GitHub Pages ka URL kuch minute mein active ho jayega.
7. Android Chrome mein URL kholo → menu → Add to Home screen / Install app.

LOCAL PREVIEW
-------------
index.html ko double-click karne ke bajay VS Code Live Server ya kisi local
static server se kholo. PWA install aur service worker ke liye HTTPS/localhost
zaroori hota hai. GitHub Pages HTTPS deta hai.

PROJECT STRUCTURE
-----------------
index.html                 App entry point
css/style.css              Responsive purple theme
js/data.js                 Subject/chapter asset mapping
js/app.js                  Navigation, local state, game interactions
assets/subjects/           Physics/Biology/Chemistry chapter covers + logos
interfaces/                Approved design reference screenshots
icons/                     App icons
manifest.json              PWA settings
sw.js                      Offline shell + cache handling
ASSET_MAPPING.csv          Asset mapping source

GITHUB-ONLY APP DATA
--------------------
Yeh single-user frontend hai. Progress, bookmarks, goals aur local content
browser ke local storage mein save hote hain. Browser data clear karne par ye
local data reset ho sakta hai. GitHub Pages database/login service nahi hai.

CONTENT ADD KARNA
----------------
App ke Admin Panel se local browser mein batch/content add kiya ja sakta hai.
Yeh changes isi device/browser mein rehte hain; GitHub repository ko automatic
update nahi karte. Permanent default content ke liye js/data.js ya app ke data
files ko GitHub repository mein edit/upload karna hoga.

IMPORTANT
---------
- Lecture URLs, PDFs, DPPs, PYQs aur tests ke liye apne actual resources add karo.
- Included Dimension Game ek simple sequence-memory game hai; supplied files
  mein original dimension_game.html source available nahi tha.
- Subject chapter asset counts official NEET syllabus counts ka claim nahi hain.
- Kisi bhi private key, password ya personal data ko public repository mein mat
  daalna. Is project ko public repo banane se pehle personal content check karo.
