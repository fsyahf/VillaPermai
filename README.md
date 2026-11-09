# Villa Permai

Website katalog dan pemesanan villa sederhana yang dibuat menggunakan **HTML5, CSS3, dan JavaScript murni**

## Deskripsi Project
Villa Permai adalah aplikasi pemesanan villa berbasis HTML, CSS, dan JavaScript yang memungkinkan pengguna melihat daftar villa, melakukan pencarian, mengecek ketersediaan, menghitung estimasi biaya, serta menyimpan riwayat pemesanan menggunakan Local Storage.

## Fitur

1. Menampilkan daftar villa dari JavaScript.
2. Menampilkan detail dan fasilitas villa.
3. Pencarian villa.
4. Formulir pemesanan.
5. Validasi data pemesanan.
6. Perhitungan estimasi harga.
7. Penyimpanan riwayat menggunakan Local Storage.
8. Menghapus riwayat pemesanan.

## Struktur Folder


villa-permai/
├── index.html
├── style.css
├── script.js
├── README.md
└── .gitignore


## Screenshot Placeholder

Tambahkan screenshot tampilan website ke folder `screenshots/`, kemudian ubah placeholder berikut sesuai nama file screenshot.

![Screenshot halaman Villa Permai](screenshots/villa-permai-home.png)

Contoh screenshot yang disarankan:
- Halaman utama dan kartu villa (desktop).
- Form pemesanan dan kalkulasi biaya.
- Tampilan responsive pada mobile.
- Riwayat pemesanan.


## Catatan Penyimpanan

- Data disimpan pada `localStorage` dengan key `villaPermaiBookings`.
- Data hanya tersedia pada browser dan perangkat tempat pemesanan dibuat.
- Menghapus data situs/browser dapat menghapus riwayat tersebut.
- Untuk penggunaan produksi, hubungkan aplikasi ke backend dan database serta tambahkan autentikasi dan proses konfirmasi pemesanan.

## Contoh Alur Commit Git

Jalankan perintah berikut secara berurutan dari folder project:

```bash
git init
git add index.html
git commit -m "chore: add initial HTML structure"

git add style.css
git commit -m "style: create responsive Villa Permai layout"

git add script.js
git commit -m "feat: add villa search and booking functionality"

git add README.md .gitignore
git commit -m "docs: add project guide and gitignore"
```

Jika repository GitHub sudah dibuat dan remote belum ditambahkan:

```bash
git branch -M main
git remote add origin https://github.com/USERNAME/villa-permai.git
git push -u origin main
```

Ganti `USERNAME` dan URL repository dengan milik Anda.

## Teknologi

- HTML5
- CSS3 (Grid, Flexbox, Media Query)
- JavaScript (DOM API, Array, Event Listener, localStorage)
