# React Art Gallery

A React application built with Vite and TypeScript featuring PrimeReact DataTable with server-side pagination and persistent row selection.

Features:
- React + TypeScript + Vite setup
- PrimeReact DataTable component for display
- Fetches artworks data from https://api.artic.edu/api/v1/artworks?page=1
- Displays fields: title, place_of_origin, artist_display, inscriptions, date_start, date_end
- Server-side pagination with API calls on page change
- Row selection with checkbox and custom selection panel
- Persistent selection state across pages without caching all data client-side
- Deployed on Netlify at https://react-art-gallery-0000.netlify.app

Setup and Run:
1. Clone repo: git clone https://github.com/ChemicalSalt/react-art-gallery.git
2. Install dependencies: npm install
3. Run dev server: npm run dev
4. Build production: npm run build
5. Deploy: netlify deploy --prod --dir=dist or use Netlify UI

Project URL: https://react-art-gallery-0000.netlify.app
Netlify Admin: https://app.netlify.com/projects/react-art-gallery-0000
