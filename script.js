// 1. Data villa disimpan dalam array object JavaScript.
const villas = [
  {
    id: "villa-pinus",
    nama: "Villa Pinus",
    lokasi: "Puncak, Bogor",
    tipeKamar: "Deluxe",
    fasilitas: ["WiFi", "Kolam Renang", "Parkir"],
    tersedia: true,
    kapasitas: 6,
    harga: 850000,
    gambar: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80"
  },

  {
    id: "villa-samudra",
    nama: "Villa Samudra",
    lokasi: "Anyer, Banten",
    tipeKamar: "Family Room",
    fasilitas: ["WiFi", "Pantai Pribadi", "BBQ"],
    tersedia: true,
    kapasitas: 8,
    harga: 1250000,
    gambar: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80"
  },

  {
    id: "villa-harmoni",
    nama: "Villa Harmoni",
    lokasi: "Lembang, Bandung",
    tipeKamar: "Suite",
    fasilitas: ["WiFi", "Taman", "Parkir"],
    tersedia: false,
    kapasitas: 5,
    harga: 975000,
    gambar: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80"
  }
];

// 2. Referensi elemen HTML yang sering digunakan.
const villaList = document.getElementById("villaList");
const searchInput = document.getElementById("searchVilla");
const villaCount = document.getElementById("villaCount");
const emptyVilla = document.getElementById("emptyVilla");
const villaSelect = document.getElementById("villaSelect");
const bookingForm = document.getElementById("bookingForm");
const nameInput = document.getElementById("customerName");
const checkInInput = document.getElementById("checkIn");
const checkOutInput = document.getElementById("checkOut");
const guestCountInput = document.getElementById("guestCount");
const pricePerNight = document.getElementById("pricePerNight");
const totalPrice = document.getElementById("totalPrice");
const formMessage = document.getElementById("formMessage");
const bookingHistory = document.getElementById("bookingHistory");
const emptyHistory = document.getElementById("emptyHistory");

// 3. Konstanta untuk nama key localStorage.
const STORAGE_KEY = "villaPermaiBookings";

// 4. Format angka menjadi mata uang Rupiah.
function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(angka);
}

// 5. Membuat elemen dengan aman dan mengisi teks melalui textContent.
function buatElemen(tag, className, teks) {
  const elemen = document.createElement(tag);
  if (className) elemen.className = className;
  if (teks !== undefined) elemen.textContent = teks;
  return elemen;
}

// 6. Membuat satu kartu villa menggunakan createElement() dan appendChild().
function buatKartuVilla(villa) {
  const article = buatElemen("article", "villa-card");

  const gambar = document.createElement("img");
  gambar.className = "villa-image";
  gambar.src = villa.gambar;
  gambar.alt = `Foto ${villa.nama}`;
  gambar.loading = "lazy";
  gambar.addEventListener("error", () => {
    gambar.src = "https://placehold.co/900x600/eaf4f9/183247?text=Villa+Permai";
  });
  article.appendChild(gambar);

  const body = buatElemen("div", "villa-card-body");
  body.appendChild(buatElemen("p", "villa-location", `⌖ ${villa.lokasi}`));
  body.appendChild(buatElemen("h3", "villa-name", villa.nama));
  body.appendChild(buatElemen("p","",`Tipe Kamar: ${villa.tipeKamar}`));
  body.appendChild(buatElemen("p","",`Fasilitas: ${villa.fasilitas.join(", ")}`));

  const meta = buatElemen("div", "villa-meta");
  meta.appendChild(buatElemen("span", "", `♧ Maks. ${villa.kapasitas} orang`));
  meta.appendChild(buatElemen("span","", villa.tersedia? "✓ Tersedia": "✗ Tidak Tersedia"));
  body.appendChild(meta);

  const price = buatElemen("div", "villa-price");
  const priceText = buatElemen("div", "");
  priceText.appendChild(buatElemen("strong", "", formatRupiah(villa.harga)));
  priceText.appendChild(buatElemen("span", "", " / malam"));
  price.appendChild(priceText);

  const bookLink = buatElemen("a", "card-book-link", "Pesan villa →");
  bookLink.href = "#pemesanan";
  bookLink.addEventListener("click", () => {
    villaSelect.value = villa.id;
    perbaruiTotal();
  });
  price.appendChild(bookLink);
  body.appendChild(price);
  article.appendChild(body);

  return article;
}

// 7. Render daftar villa dan filter berdasarkan nama atau lokasi.
function renderVilla(dataVilla) {
  villaList.replaceChildren();

  dataVilla.forEach((villa) => {
    villaList.appendChild(buatKartuVilla(villa));
  });

  villaCount.textContent = `Menampilkan ${dataVilla.length} dari ${villas.length} villa`;
  emptyVilla.hidden = dataVilla.length !== 0;
}

// 8. Isi pilihan villa pada elemen select dengan DOM API.
function isiPilihanVilla() {
  villas.forEach((villa) => {
    const option = document.createElement("option");
    option.value = villa.id;
    option.textContent = `${villa.nama} — ${formatRupiah(villa.harga)}/malam`;
    villaSelect.appendChild(option);
  });
}

// 9. Ambil data booking dari localStorage. Jika belum ada, gunakan array kosong.
function ambilPemesanan() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Gagal membaca data pemesanan:", error);
    return [];
  }
}

// 10. Hitung dan tampilkan estimasi biaya secara otomatis.
function perbaruiTotal() {
    const villa =
      villas.find(
        item =>
        item.id === villaSelect.value
      );

    pricePerNight.textContent =
      villa
        ? formatRupiah(villa.harga)
        : "—";

    if (
      !villa ||
      !checkInInput.value ||
      !checkOutInput.value
    ) {
      totalPrice.textContent =
        "Rp0";
      return;
    }

    const checkIn =
      new Date(checkInInput.value);
    const checkOut =
      new Date(checkOutInput.value);
    const jumlahHari =
      (checkOut - checkIn)
      /
      (1000 * 60 * 60 * 24);
    const jumlahTamu =
      Number(guestCountInput.value) || 1;
      const total =
        jumlahHari > 0
          ? villa.harga * jumlahHari * jumlahTamu
          : 0;

    totalPrice.textContent =
      formatRupiah(total);
}
// 11. Atur tanggal minimum check-in menjadi hari ini.
function aturTanggalMinimum() {
  checkInInput.addEventListener("change", () => {
    checkOutInput.min = checkInInput.value;
  });
  const hariIni = new Date();
  const tahun = hariIni.getFullYear();
  const bulan = String(hariIni.getMonth() + 1).padStart(2, "0");
  const tanggal = String(hariIni.getDate()).padStart(2, "0");
  checkInInput.min = `${tahun}-${bulan}-${tanggal}`;
}

// 12. Bersihkan pesan validasi sebelum pemeriksaan baru.
function bersihkanError() {
  [
    "nameError",
    "villaError",
    "guestError",
    "dateError",
    "checkoutError"
  ].forEach((id) => {
    document.getElementById(id).textContent = "";
  });

  formMessage.textContent = "";
  formMessage.className = "form-message";
}

// 13. Validasi semua input pemesanan.
function validasiForm() {
  bersihkanError();
  let valid = true;

  const nama = nameInput.value.trim();
  const villaId = villaSelect.value;

  const jumlahTamu = Number(guestCountInput.value);

  const tanggal = checkInInput.value;
  const checkOut = checkOutInput.value;

  const villaDipilih =
    villas.find(villa => villa.id === villaId);

  const tanggalDipilih =
    tanggal
      ? new Date(`${tanggal}T00:00:00`)
      : null;

  const hariIni = new Date();
  hariIni.setHours(0, 0, 0, 0);

  // validasi nama
  if (nama.length < 3) {
    document.getElementById("nameError").textContent =
      "Nama minimal 3 karakter.";
    valid = false;
  }

  // validasi villa
  if (!villaDipilih) {
    document.getElementById("villaError").textContent =
      "Silakan pilih villa.";
    valid = false;
  }

  // validasi jumlah tamu
  if (!Number.isInteger(jumlahTamu) || jumlahTamu < 1) {
    document.getElementById("guestError").textContent =
      "Minimal 1 tamu.";
    valid = false;
  }

  if (jumlahTamu > 10) {
  document.getElementById("guestError")
    .textContent =
    "Jumlah tamu maksimal 10 orang.";
  valid = false;
  }

  if (
    villaDipilih &&
    jumlahTamu > villaDipilih.kapasitas
  ) {
    document.getElementById("guestError").textContent =
      `Maksimal ${villaDipilih.kapasitas} tamu.`;
    valid = false;
  }

  // validasi check in
  if (!tanggal) {
    document.getElementById("dateError").textContent =
      "Tanggal check-in wajib diisi.";
    valid = false;
  } else if (
    Number.isNaN(tanggalDipilih.getTime()) ||
    tanggalDipilih < hariIni
  ) {
    document.getElementById("dateError").textContent =
      "Tanggal check-in tidak boleh sebelum hari ini.";
    valid = false;
  }

  // validasi check out
  if (!checkOut) {
    document.getElementById("checkoutError").textContent =
      "Tanggal check-out wajib diisi.";
    valid = false;
  }

  if (
    tanggal &&
    checkOut &&
    new Date(checkOut) <= new Date(tanggal)
  ) {
    document.getElementById("checkoutError").textContent =
      "Check-out harus setelah check-in.";
    valid = false;
  }

  return valid;
}

// 14. Simpan pemesanan baru ke localStorage.
function simpanPemesanan(event) {
  event.preventDefault();

  if (!validasiForm()) {
    formMessage.textContent = "Periksa kembali input yang ditandai.";
    formMessage.classList.add("error");
    return;
  }

  const villa = villas.find((item) => item.id === villaSelect.value);
  if (!villa.tersedia) {
    formMessage.textContent =
      "Villa yang dipilih tidak tersedia.";

    formMessage.classList.add("error");

    return;
  }
  const checkIn =
  new Date(checkInInput.value);
  const checkOut =
    new Date(checkOutInput.value);
  const jumlahHari =
    (checkOut - checkIn)
    / (1000 * 60 * 60 * 24);
  const pesananBaru = {
  id: `VP-${Date.now()}`,
  namaPemesan: nameInput.value.trim(),
    villaId: villa.id,
    namaVilla: villa.nama,
    lokasi: villa.lokasi,
    jumlahTamu:
      Number(
        guestCountInput.value
      ),
    checkIn:
      checkInInput.value,
    checkOut:
      checkOutInput.value,
    jumlahMalam:
      jumlahHari,
    hargaPerMalam:
      villa.harga,
    total:
      villa.harga *
      jumlahHari *
      Number(guestCountInput.value),
    dibuatPada:
      new Date().toISOString()
  };

  const daftarPemesanan = ambilPemesanan();
  daftarPemesanan.unshift(pesananBaru);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(daftarPemesanan));
    renderRiwayat();
    bookingForm.reset();
    perbaruiTotal();
    formMessage.textContent = "Pemesanan berhasil disimpan pada browser ini.";
    formMessage.classList.add("success");
  } catch (error) {
    console.error("Gagal menyimpan pemesanan:", error);
    formMessage.textContent = "Penyimpanan gagal. Periksa ruang penyimpanan browser.";
    formMessage.classList.add("error");
  }
}

// 15. Membuat satu kartu riwayat pemesanan menggunakan DOM API.
function buatKartuRiwayat(pesanan) {
  const article = buatElemen("article", "history-card");

  const identitas = buatElemen("div", "");
  identitas.appendChild(buatElemen("h3", "", pesanan.namaVilla));
  identitas.appendChild(buatElemen("p", "", `Pemesan: ${pesanan.namaPemesan}`));
  article.appendChild(identitas);

  const detail = buatElemen("div", "");
  detail.appendChild(buatElemen("p", "", pesanan.lokasi));
  detail.appendChild(buatElemen("p", "", `Check-in: ${formatTanggal(pesanan.checkIn)}`));
  detail.appendChild(buatElemen("p","",`Check-out: ${formatTanggal(pesanan.checkOut)}`));
  detail.appendChild(buatElemen("p","",`Jumlah Tamu: ${pesanan.jumlahTamu}`));
  article.appendChild(detail);

  const durasi = buatElemen("div", "");
  durasi.appendChild(buatElemen("p", "", `${pesanan.jumlahMalam} malam`));
  durasi.appendChild(buatElemen("strong", "history-total", formatRupiah(pesanan.total)));
  article.appendChild(durasi);

  const hapusButton = buatElemen("button", "history-delete", "Hapus");
  hapusButton.type = "button";
  hapusButton.setAttribute("aria-label", `Hapus pemesanan ${pesanan.namaVilla}`);
  hapusButton.addEventListener("click", () => hapusPemesanan(pesanan.id));
  article.appendChild(hapusButton);

  return article;
}

// 16. Format tanggal ISO menjadi format Indonesia.
function formatTanggal(tanggal) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric", month: "long", year: "numeric"
  }).format(new Date(`${tanggal}T00:00:00`));
}

// 17. Render ulang seluruh riwayat dari localStorage.
function renderRiwayat() {
  bookingHistory.replaceChildren();
  const daftarPemesanan = ambilPemesanan();

  daftarPemesanan.forEach((pesanan) => {
    bookingHistory.appendChild(buatKartuRiwayat(pesanan));
  });

  emptyHistory.hidden = daftarPemesanan.length !== 0;
}

// 18. Hapus satu data pemesanan berdasarkan ID.
function hapusPemesanan(id) {
  const dataTerbaru = ambilPemesanan().filter((pesanan) => pesanan.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataTerbaru));
    renderRiwayat();
  } catch (error) {
    console.error("Gagal menghapus pemesanan:", error);
  }
}

// 19. Event listener untuk pencarian, kalkulasi, dan submit form.
searchInput.addEventListener("input", () => {
  const kataKunci = searchInput.value.trim().toLocaleLowerCase("id");
  const hasilFilter = villas.filter((villa) =>
    villa.nama.toLocaleLowerCase("id").includes(kataKunci) ||
    villa.lokasi.toLocaleLowerCase("id").includes(kataKunci)
  );
  renderVilla(hasilFilter);
});

villaSelect.addEventListener("change", perbaruiTotal);
checkInInput.addEventListener("change",perbaruiTotal);
checkOutInput.addEventListener("change",perbaruiTotal);
bookingForm.addEventListener("submit", simpanPemesanan);
guestCountInput.addEventListener("input",perbaruiTotal);

document
  .getElementById("checkAvailability")
  .addEventListener("click", () => {

    const villa =
      villas.find(
        item => item.id === villaSelect.value
      );

    if (!villa) {
      alert("Pilih villa terlebih dahulu");
      return;
    }

    if (!villa.tersedia) {
      formMessage.textContent =
        "Villa yang dipilih tidak tersedia.";

      formMessage.classList.add("error");

      return;
    }
    if (!checkInInput.value) {
      alert("Isi tanggal check-in");
      return;
    }
    if (!checkOutInput.value) {
      alert("Isi tanggal check-out");
      return;
    }
    if (
      new Date(checkOutInput.value)
      <=
      new Date(checkInInput.value)
    ) {
      alert(
        "Check-out harus setelah check-in"
      );
      return;
    }
    const jumlahTamu =
    Number(guestCountInput.value);

    if (jumlahTamu > 10) {
      alert(
        "Jumlah tamu maksimal 10 orang"
      );
      return;
    }

    if (
      jumlahTamu >
      villa.kapasitas
    ) {
      alert(
        `Kapasitas maksimum ${villa.kapasitas} tamu`
      );
      return;
    }

    alert(
      "Villa tersedia untuk dipesan"
    );
  });

// 20. Inisialisasi saat halaman selesai dimuat.
function init() {
  renderVilla(villas);
  isiPilihanVilla();
  aturTanggalMinimum();
  perbaruiTotal();
  renderRiwayat();
  document.getElementById("currentYear").textContent = new Date().getFullYear();
}

init();
