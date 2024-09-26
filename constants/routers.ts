import assets from "@/assets";

export const routers = [
  {
    title: "",
    route: [
      {
        icon: assets.halaman_utama,
        name: "Halaman Utama",
        path: "/halaman-utama",
        other_routes: [
          {
            title: "Profile Saya",
            path: "/profile",
          },
        ],
      },
      {
        icon: assets.pengumuman_seleksi,
        name: "Pengumuman Seleksi",
        path: "/pengumuman-seleksi",
        other_routes: [
          {
            title: "Detail Seleksi",
            path: "/pengumuman-seleksi.detail",
          },
          {
            title: "Lampiran Seleksi",
            path: "/pengumuman-seleksi.lampiran",
          },
        ],
      },
      {
        icon: assets.isian_khusus,
        name: "Isian Khusus",
        path: "/isian-khusus",
        other_routes: [
          {
            title: "Form Tambah Lampiran",
            path: "/isian-khusus.add",
          },
          {
            title: "Edit Lampiran",
            path: "/isian-khusus.edit",
          },
        ],
      },
      {
        icon: assets.kotak_masuk,
        name: "Kotak Masuk",
        path: "/kotak-masuk",
        other_routes: [
          {
            title: "Pesan Kotak Masuk",
            path: "/kotak-masuk.pesan",
          },
          {
            title: "Pesan Arsip",
            path: "/kotak-masuk.pesan.arsip",
          },
          {
            title: "Arsip",
            path: "/kotak-masuk.arsip",
          },
          {
            title: "Kotak Keluar",
            path: "/kotak-masuk.keluar",
          },
          {
            title: "Pesan Kotak Keluar",
            path: "/kotak-masuk.keluar.detail",
          },
          {
            title: "Kirim Pesan",
            path: "/kotak-masuk.create",
          },
        ],
      },
    ],
  },
  {
    title: "ADMINISTRASI PROFIL",
    route: [
      {
        icon: assets.biodata_simpeg,
        name: "Biodata Simpeg",
        title: "Update Biodata Simpeg",
        path: "/biodata-simpeg",
      },
      {
        icon: assets.biodata_kompetensi,
        name: "Biodata & Kompetensi",
        title: "Data Profile Saya",
        path: "/biodata-kompetensi",
        other_routes: [
          {
            title: "Form Tambah Riwayat Pendidikan",
            path: "/riwayat-pendidikan.create",
          },
          {
            title: "Form Edit Riwayat Pendidikan",
            path: "/riwayat-pendidikan.edit",
          },
          {
            title: "Form Tambah Kompetensi Lainnya",
            path: "/kompetensi-lainnya.create",
          },
          {
            title: "Form Edit Kompetensi Lainnya",
            path: "/kompetensi-lainnya.edit",
          },
          {
            title: "Form Tambah Riwayat Pekerjaan",
            path: "/riwayat-pekerjaan.create",
          },
          {
            title: "Form Edit Riwayat Pekerjaan",
            path: "/riwayat-pekerjaan.edit",
          },
          {
            title: "Form Tambah Pelatihan",
            path: "/pelatihan.create",
          },
          {
            title: "Form Edit Pelatihan",
            path: "/pelatihan.edit",
          },
          {
            title: "Form Tambah Karya Tulis",
            path: "/karya.create",
          },
          {
            title: "Form Edit Karya Tulis",
            path: "/karya.edit",
          },
        ],
      },
      {
        icon: assets.biodata_simpeg,
        name: "Update JP SI JULE",
        title: "Data Pelatihan SiJule",
        path: "/update-jp-sijule",
      },
      {
        icon: assets.ganti_password_drawer,
        name: "Ganti Password",
        path: "/ganti-password",
      },
    ],
  },
  {
    title: "ADMINISTRASI DIKLAT",
    route: [
      {
        icon: assets.kalender_drawer,
        name: "Kalender Diklat",
        title: "Rencana Kegiatan Kediklatan",
        path: "/kalender-diklat",
        other_routes: [
          {
            title: "Detail Rencana Kegiatan",
            path: "/kalender-diklat.detail",
          },
        ],
      },
      {
        icon: assets.sedang_diikuti_drawer,
        name: "Diklat Sedang Diikuti",
        path: "/diklat-sedang-diikuti",
        other_routes: [
          {
            title: "Detail Diklat Sedang Diikuti",
            path: "/diklat-sedang-diikuti.detail",
          },
        ],
      },
      {
        icon: assets.sudah_diikuti_drawer,
        name: "Diklat Sudah Diikuti",
        path: "/diklat-sudah-diikuti",
        other_routes: [
          {
            title: "Detail Diklat Sudah Diikuti",
            path: "/diklat-sudah-diikuti.detail",
          },
        ],
      },
      {
        icon: assets.semua_diklat_drawer,
        name: "Semua Diklat",
        path: "/semua-diklat",
        other_routes: [
          {
            title: "Detail Semua Diklat",
            path: "/semua-diklat.detail",
          },
        ],
      },
    ],
  },
  {
    title: "ADMINISTRASI PODCAST",
    route: [
      {
        icon: assets.podcast_perangkat_daerah,
        title: "Daftar Podcast Perangkat Daerah",
        name: "Podcast Perangkat Daerah",
        path: "/podcast-perangkat-daerah",
        other_routes: [
          {
            title: "Detail Podcast Perangkat Daerah",
            path: "/podcast-perangkat-daerah.list",
          },
          {
            title: "Show Podcast",
            path: "/podcast-perangkat-daerah.detail",
          },
        ],
      },
    ],
  },
  {
    title: "ADMINISTRASI KUISIONER",
    route: [
      {
        icon: assets.kuisioner,
        title: "Kuisioner Penyelenggara",
        name: "Kuisioner Penyelenggara",
        path: "/kuisioner-penyelenggara",
        other_routes: [
          {
            title: "Form Kuisoner Penyelenggara",
            path: "/kuisoner-penyelenggara.detail",
          },
        ],
      },
      {
        icon: assets.kuisioner,
        title: "Kuisioner Pengajar",
        name: "Kuisioner Pengajar",
        path: "/kuisioner-pengajar",
        other_routes: [
          {
            title: "Form Kuisoner Pengajar",
            path: "/kuisoner-pengajar.detail",
          },
          {
            title: "Form List Kuisoner Pengajar",
            path: "/kuisoner-pengajar.list",
          },
        ],
      },
    ],
  },
];

export const homeRouters = [
  {
    name: "Biodata SIMPEG",
    path: "/biodata-simpeg",
    icon: assets.simpeg,
  },
  {
    name: "Biodata & Kompetensi",
    path: "/biodata-kompetensi",
    icon: assets.biodata,
  },
  {
    name: "Update JP SI JULE",
    path: "/update-jp-sijule",
    icon: assets.simpeg,
  },
  {
    name: "Kalender Diklat",
    path: "/kalender-diklat",
    icon: assets.kalender,
  },
  {
    name: "Diklat Yang Sedang Diikuti",
    path: "/diklat-sedang-diikuti",
    icon: assets.sedang_diikuti,
  },
  {
    name: "Semua Diklat",
    path: "/semua-diklat",
    icon: assets.semua_diklat,
  },
  {
    name: "Kuisioner Penyelenggara",
    path: "/kuisioner-penyelenggara",
    icon: assets.kuisioner,
  },
  {
    name: "Kuisioner Pengajar",
    path: "/kuisioner-pengajar",
    icon: assets.kuisioner,
  },
];

export const kotakMasukRouters = [
  {
    icon: assets.create_kotak_masuk,
    path: "/",
  },
  {
    icon: assets.chat_kotak_masuk,
    path: "/",
  },
  {
    icon: assets.share_kotak_masuk,
    path: "/",
  },
  {
    icon: assets.hamburger_kotak_masuk,
    path: "/",
  },
];
