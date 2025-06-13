### 1. Menjalankan Proyek
- Pertama, salin (clone) repositori ini dari GitHub ke komputer lokal anda.
- Buka cmd, lalu akses folder yang telah selesai di-clone ke komputer lokal. Gunakan perintah cd pdf-viewer-app.
- Proyek ini menggunakan Node.js dan npm (Node Package Manager). Pastikan anda sudah meng-install Node.js.
- Lalu jalankan perintah berikut untuk meng-install semua dependencies yang dibutuhkan proyek: "npm install"
- Setelah semua dependencies ter-install, jalankan perintah berikut untuk memulai: "npm run dev"
- Setelah server berjalan, buka browser dan akses: http://localhost:5173/

### 2. Fitur
- Zoom in/Zoom Out/Reset
- Rotate PDF
- Page Navigation
- Search & Highlight Result
- Panning & Drag Gesture. Double tap PDF to return to initial position.

## 3. Arsitektur
- Proyek ini menggunakan **React + Vite** dalam pembuatannya.
- App.jsx – Komponen utama.
- components/PDFViewer.jsx – Komponen inti untuk merender PDF dan mengatur Fitur.

## 4. Dependencies
- react-pdf: Menampilkan file PDF dalam React - https://github.com/wojtekmaj/react-pdf
- react-zoom-pan-pinch: Untuk Fitur Drag Gesture - https://github.com/BetterTyped/react-zoom-pan-pinch
- @fortawesome/react-fontawesome: Ikon yang digunakan - https://github.com/FortAwesome/react-fontawesome
