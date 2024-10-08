export interface IProfilePeserta {
  __typename: string;
  bulan: number;
  full_name: string;
  fungsional: number;
  jp: number;
  kepemimpinan: number;
  lainnya: number;
  nama_jabatan: string;
  nama_uke: string;
  skor_ipasn: number;
  tahun: number;
  teknis: number;
  updated_at: Date;
  user_id: number;
  nrk: number;
  nip: number;
}

export interface IItemKalenderDiklat {
  id: number;
  waktu_pelaksanaan: string;
  registrasi_mulai: string;
  registrasi_selesai: string;
  status_registrasi: string;
  diklat: {
    name: string;
  };
  lokasi_diklat: {
    name: string;
  };
  persyaratan: string;
  keterangan: string;
  approval: string;
}

export interface IKalenderDiklatList {
  id: number;
  waktu_pelaksanaan: string;
  jumlah_angkatan: number;
  jumlah_peserta: number;
  durasi_hari: number;
  tujuan: string;
  registrasi_mulai: string;
  registrasi_selesai: string;
  status_registrasi: string;
  diklat: {
    name: string;
    jenis_diklat: {
      name: string;
    };
  };
  lokasi_diklat: {
    name: string;
  };
  persyaratan: string;
  keterangan: string;
  approval: number | null;
}

interface IJenisDiklat {
  name: "Diklat Dinas Pendidikan - PAUDNI";
}

export interface IDiklat {
  id: number;
  jenis_diklat_id: number;
  name: string;
  keterangan: string;
  created_at: string;
  updated_at: string;
  elearning_id: number;
  elearning_enable: number;
  kodik: number;
  sertifikat_instansi: number;
  active: number;
  kompetensi_teknis_sertifikat: number;
  mata_pelajaran_sertifikat: number;
  template_sertifikat: string;
  kabid_nrk_sertifikat: number;
  skpd_code: string;
  template_transkrip: string;
  rumpun_id: number;
  sijule_course_id: number;
  jenis_diklat: IJenisDiklat;
}

export interface IUserPeserta {
  id: number;
  nrk: string;
  nip: string;
  gelar_depan: string;
  gelar_belakang: string;
  full_name: string;
  uke: {
    code: string;
    name: string;
    full_name: string;
  };
  jabatan: {
    code: string;
    jenis: string;
    name: string;
    full_name: string;
  };
  tmt_eselon: string;
  tmt_pangkat: string;
  tmt_pns: string;
  tmt_cpns: string;
  pangkat: {
    code: string;
    name: string;
    name2: string;
    full_name: string;
  };
  agama: string;
  pendidikan: {
    id: number;
    jenis: string;
    nama_sekolah: string;
    jurusan: string;
  };
  email: string;
  gender: string;
  tempat_lahir: string;
  tgl_lahir: string;
  ktp: string;
  npwp: string;
  bank_account: string;
  pemilik_rekening: string;
  rekening: string;
  kantor_alamat: string;
  kantor_kel: string;
  kantor_kec: string;
  kantor_kota: string;
  kantor_propinsi: string;
  kantor_kdpos: string;
  kantor_telp: string;
  kantor_fax: string;
  ktp_rumah_alamat: string;
  ktp_rumah_kel: string;
  ktp_rumah_kec: string;
  ktp_rumah_kota: string;
  ktp_rumah_propinsi: string;
  ktp_rumah_kdpos: string;
  ktp_rumah_telp: string;
  rumah_alamat: string;
  rumah_kel: string;
  rumah_kec: string;
  rumah_kota: string;
  rumah_propinsi: string;
  rumah_kdpos: string;
  rumah_telp: string;
  telp_mobile: string;
}

export interface IRiwayatPendidikanUser {
  id: number;
  jenis: string;
  nama_sekolah: string;
  jurusan: string;
  tempat: string;
  tahun_lulus: number;
  keterangan: string;
  ijazah_url: string;
}

export interface IPesertaDiklatList {
  id: number;
  sertifikat_totaljam: string;
  jadwal_diklat: {
    id: number;
    status_registrasi: string;
    name: string;
    jadwal_mulai: string;
    jadwal_selesai: string;
    diklat: {
      id: number;
      name: string;
      jenis_diklat: {
        name: string;
      };
    };
    lokasi_diklat: {
      name: string;
      alamat: string;
    };
  };
}

export interface IPelatihanUser {
  id: number;
  user_id: number;
  keterangan: string;
  jenis: string;
  penyelenggara: string;
  tahun: number;
  sertifikat_url: string;
  status: string;
  nomor_sertifikat: string;
  tgl_sertifikat: string;
  durasi: number;
}

export interface IRiwayatPekerjaanUser {
  id: number;
  jabatan_table: {
    code: string;
    name: string;
    full_name: string;
    jenis: string;
  };
  uke: {
    code: string;
    name: string;
    full_name: string;
  };
  tmt_jabatan: string;
  keterangan: string;
}

export interface IPengajaranUser {
  id: number;
  user_id: number;
  kegiatan: string;
  materi: string;
  instansi: string;
  tahun: number;
  sertifikat_url: string;
  expired_sertifikat: string;
  keterangan: string;
}

export interface IPelatihanUser {
  id: number;
  user_id: number;
  kegiatan: number;
  materi: string;
  instansi: string;
  tahun: number;
  sertifikat_url: string;
  expired_sertifikat: string;
}

export interface IKaryTulisUser {
  id: number;
  user_id: number;
  judul: string;
  tahun: number;
  tempat: string;
  keterangan: string;
}

export interface ISedangDiikuti {
  id: number;
  sertifikat_totaljam: string;
  sertifikat_signed: number;
  status: string;
  jadwal_diklat: {
    id: number;
    maksimal_peserta: number;
    status_registrasi: string;
    status: string;
    name: string;
    jadwal_mulai: string;
    jadwal_selesai: string;
    registrasi_selesai: string;
    keterangan: string;
    diklat: {
      id: number;
      name: string;
      jenis_diklat: {
        name: string;
      };
    };
    lokasi_diklat: {
      name: string;
      alamat: string;
    };
  };
}

export interface IKotakMasuk {
  id: number;
  from_: number;
  subject: string;
  message: string;
  read_notify: string;
  created_at: string;
  sender: {
    id: number;
    full_name: string;
  };
}

type receiver = {
  id: number;
  full_name: string;
};

export interface IKontakKeluar {
  id: number;
  from_: number;
  subject: string;
  message: string;
  read_notify: string;
  created_at: string;
  receiver: receiver[];
}

export interface ISession {
  expires: string;
  user: {
    email: string;
    id: string;
    image: string;
    name: string;
    nrk: string;
    roles: string[];
  };
}

export interface IKuisonerPenyelenggara {
  id: number;
  sertifikat_totaljam: string;
  kuis_penyelenggara_count: number;
  status: string;
  jadwal_diklat: {
    id: number;
    name: string;
    jadwal_mulai: string;
    jadwal_selesai: string;
    diklat: {
      id: number;
      name: string;
      jenis_diklat: {
        name: string;
      };
    };
    lokasi_diklat: {
      name: string;
      alamat: string;
    };
  };
}

export interface IKuisionerPengajar {
  id: number;
  sertifikat_totaljam: string;
  status: string;
  jadwal_diklat: {
    id: number;
    name: string;
    jadwal_mulai: string;
    jadwal_selesai: string;
    diklat: {
      id: 1;
      name: string;
      jenis_diklat: {
        name: string;
      };
    };
    lokasi_diklat: {
      name: string;
      alamat: string;
    };
  };
}

type MenuPenyelenggara = {
  value: string;
  label: string;
};

export interface IKuisPenyelenggara {
  id: number;
  pertanyaan: string;
  urutan: number;
  active: number;
  kategori_id: number;
  created_at: string;
  updated_at: string;
  kategori: {
    id: number;
    jenis_id: number;
    active: number;
    bobot: number;
    nama: string;
    urutan: number;
    created_at: string;
    updated_at: string;
  };
  menu: MenuPenyelenggara[];
}

export interface IKuisonerPenyelenggarList {
  id: number;
  angkatan_id: number;
  pengajar_id: number;
  materi_id: number;
  tanggal: Date;
  jenis_materi: string;
  jp: number;
  keterangan: string;
  kirim_email: number;
  konfirmasi_hadir: string;
  tgl_konfirmasi: Date;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    eselon_id: string;
    uke_induk_id: number;
    uke_id: string;
    jabatan_id: string;
    pangkat_id: number;
    golongan_id: string;
    photo_id: string;
    nip: string;
    nrk: string;
    full_name: string;
  };
  jadwal_diklat: {
    id: number;
    diklat_id: number;
    lokasi_diklat_id: number;
    ruang_id: number;
    name: string;
    jadwal_mulai: Date;
    jadwal_selesai: Date;
    registrasi_mulai: Date;
    registrasi_selesai: Date;
    status_registrasi: string;
    created_at: Date;
    updated_at: Date;
  };
  mata_diklat: {
    id: number;
    name: string;
    deskripsi: string;
    created_at: Date;
    updated_at: Date;
  };
  status: number;
}

export interface IJP {
  NAMA_DIKLAT: string;
  NAMA_KATEGORI: string;
  JP: number;
}

export interface IJule {
  id_pelatihan: number;
  name: string;
  jp: number;
  selesai: Date;
}

export interface IPodcast {
  id: number;
  angkatan_id: number;
  title: string;
  watch_id: string;
  zoom_url: string;
  passcode: string;
  file_sertifikat: string;
  keterangan: string;
  clicked: number;
  created_at: Date;
  updated_at: Date;
  jadwal_diklat: {
    id: 5080;
    diklat_id: 967;
    lokasi_diklat_id: 90;
    ruang_id: 0;
    name: "16";
    minimal_peserta: 0;
    maksimal_peserta: 30;
    jadwal_mulai: "2023-08-14T00:00:00.000Z";
    jadwal_selesai: "2023-08-16T00:00:00.000Z";
    registrasi_mulai: "1970-01-01T07:00:00.000Z";
    registrasi_selesai: "2023-07-10T00:00:00.000Z";
    status_registrasi: "open";
    keterangan: "<p>1. Pegawai Negeri Sipil;<br />2. Pendidikan minimal SLTA atau Sederajat;<br />3. Lulus Pendidikan dan Pelatihan Dasar Kebakaran Tingkat&nbsp;I;<br />4. Pangkat/golongan minimal Pengatur Muda (II/a);<br />5. Diusulkan oleh unit kerja dan tidak sedang mengikuti Diklat&nbsp;atau sejenisnya;<br />6. Tidak sedang menjalani Hukuman Disiplin PP Nomor 94&nbsp;Tahun 2021 Tentang Disiplin PNS;<br />7. Sehat jasmani dan rohani yang dinyatakan dengan Surat&nbsp;Keterangan Sehat dari Dokter.</p>";
    petugas_id: 0;
    manajer_id: 0;
    mfd_id: 0;
    created_at: "2023-12-27T11:12:17.000Z";
    updated_at: "2023-12-27T11:42:32.000Z";
    elearning_id: 0;
    elearning_enable: 0;
    jumlah_jam: 30;
    tgl_sertifikat: "2023-12-27T00:00:00.000Z";
    nama_ttd_sertifikat: "Dra. BUDIHASTUTI, M.Psi";
    nip_ttd_sertifikat: "195903151985032005";
    jabatan_ttd_sertifikat: "KEPALA BADAN PENGEMBANGAN SUMBER DAYA MANUSIA";
    lokasi_diklat_sertifikat: "Jakarta";
    penyelenggara_sertifikat: " ";
    kerjasama_sertifikat: "Badan Pengembangan Sumber Daya Manusia";
    sertifikat_signed: 0;
    tte_status: "none";
    nomor_sertifikat_podcast: null;
    kompetensi_teknis_sertifikat: null;
    mata_pelajaran_sertifikat: null;
    template_sertifikat: null;
    kabid_nrk_sertifikat: null;
    simpegsync_status: "none";
    simpegsync_at: "2023-12-27T04:12:12.000Z";
    transkrip_status: "none";
    template_transkrip: "teknis";
    sp_status: "none";
  };
  isRegisterd: boolean;
  thumbnail: string;
  sertifikat: string;
  jenis_podcast: "rabu_belajar" | "kopi_sedap";
}

export interface IUsers {
  id: number;
  eselon_id: string;
  uke_induk_id: number;
  uke_id: string;
  jabatan_id: string;
  pangkat_id: number;
  golongan_id: string;
  file_cv_id: number;
  photo_id: string;
  nip: string;
  nrk: string;
  full_name: string;
  gelar_depan: string;
  gelar_belakang: string;
  tgl_lahir: Date;
  pendidikan_sk: number;
  tmt_eselon: Date;
  tmt_pangkat: Date;
  tmt_pns: Date;
  tmt_cpns: Date;
  tempat_lahir: string;
  rumah_alamat: string;
  rumah_kota: string;
  rumah_propinsi: string;
  rumah_kdpos: string;
  rumah_telp: string;
  ktp_rumah_alamat: string;
  ktp_rumah_kota: string;
  ktp_rumah_kdpos: string;
  ktp_rumah_telp: string;
  ktp_telp_mobile: string;
  telp_mobile: string;
  kantor_alamat: string;
  kantor_kota: string;
  kantor_propinsi: string;
  kantor_kdpos: null;
  kantor_telp: string;
  kantor_fax: string;
  status_pegawai: string;
  agama: string;
  gender: string;
  ktp: string;
  bank_account: string;
  pemilik_rekening: string;
  rekening: string;
  npwp: string;
  email: string;
  change_password_after_login: number;
  activation_code: null;
  verification_code: null;
  active: number;
  verified: number;
  filled: number;
  created_at: Date;
  updated_at: Date;
  remember_token: string;
  last_change_password: Date;
  recover_password_q: string;
  recover_password_a: string;
  elearning_enable: number;
  kantor_kec: string;
  kantor_kel: string;
  rumah_kec: string;
  rumah_kel: string;
  ktp_rumah_kec: string;
  ktp_rumah_kel: string;
  ktp_rumah_propinsi: string;
  pendidikan_id: number;
  jabatan_sk: string;
  is_jabatan_sk: number;
  password: string;
  jabatan: Jabatan;
  uke: Uke;
  pendidikan: null;
  pangkat: Pangkat;
  eselon: Eselon;
}

export interface Eselon {
  code: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Jabatan {
  code: string;
  name: string;
  full_name: string;
  urutan: number;
  jenis: string;
  jabatan_active: number;
  created_at: Date;
  updated_at: Date;
}

export interface Pangkat {
  code: number;
  name: string;
  name2: string;
  full_name: string;
  golongan: string;
  ruang: string;
  created_at: Date;
  updated_at: Date;
}

export interface SKPD {
  code: string;
  uke_id: string;
  code_old: string;
  spmu: number;
  name: string;
  dki_name: string;
  induk_id: string;
}

export interface Uke {
  code: string;
  uke_induk_id: null;
  skpd_code: string;
  skpd_code_old: null;
  name: string;
  full_name: string;
  nama_dki: string;
  is_active: number;
  created_at: Date;
  updated_at: Date;
  skpd: SKPD;
}

export interface ISimpeg {
  THBL: string;
  NRK: string;
  NIP18: string;
  "GELAR DEPAN": null;
  NAMA: string;
  "GELAR BELAKANG": string;
  JENKEL: string;
  "JENIS KELAMIN": string;
  "KODE AGAMA": number;
  AGAMA: string;
  STAPEG: number;
  "STATUS PEGAWAI": string;
  JENPEG: number;
  "JENIS PEGAWAI": string;
  STAWIN: number;
  "STATUS KAWIN": string;
  "TEMPAT LAHIR": string;
  "TANGGAL LAHIR": string;
  UMUR: number;
  ALAMAT: string;
  KOWIL: string;
  WILAYAH: string;
  KOCAM: string;
  KECAMATAN: string;
  KOKEL: string;
  KELURAHAN: string;
  NOTELP: string;
  NOHP: string;
  "TMT PNS": string;
  "TMT CPNS": string;
  "NO.KTP": string;
  NPWP: string;
  "NO.REKENING": string;
  JENDIK: number;
  KODIK: string;
  PENDIDIKAN: string;
  "KODE UNIVER/SEKOLAH": string;
  UNIVERSITAS: string;
  "LOKASI UNIVERSITAS": string;
  "KODE JURUSAN": string;
  "NAMA JURUSAN": string;
  "NO.IJAZAH": string;
  "TGL.IJAZAH": string;
  KOLOK: string;
  "LOKASI KERJA": string;
  KLOGAD: string;
  "LOKASI GAJI": string;
  "WILAYAH KERJA": string;
  "KODE UKPD": string;
  "NAMA UKPD": string;
  SPMU: string;
  "KODE SKPD": string;
  "NAMA SKPD": string;
  KOPANG: string;
  PANGKAT: string;
  GOL: string;
  "TMT PANGKAT": string;
  ESELON: string;
  "NAMA ESELON": string;
  "TMT ESELON": string;
  KOJAB: string;
  JABATAN: string;
  KD: string;
}

export interface IPengumumanPublic {
  id: number;
  title: string;
  tahun: number;
  registrasi_mulai: string;
  registrasi_selesai: string;
  status_registrasi: string;
  keterangan: string;
  validation: any;
  pengumuman_file: number;
  created_at: string;
  updated_at: string;
  files: IFile;
  isOpen: false;
}

interface IFile {
  id: number;
  title: string;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  file_extension: string;
  keterangan: string;
  created_at: string;
  updated_at: string;
}

export interface IPengumuman {
  id: number;
  seleksi_id: number;
  user_id: number;
  nomot_urut: number;
  nomor_ujian: string;
  status: string;
  bidang: string;
  keterangan: string;
  created_at: string;
  updated_at: string;
  seleksi_widyaiswara: IPengumumanPublic;
  lampiran: ILampiranPengumuman[] | null;
  isOpen: boolean;
}

interface ILampiranPengumuman {
  id: number;
  seleksi_id: number;
  file_id: number;
  created_at: string;
  updated_at: string;
  files: IFile;
}

export interface IJenisLampiran {
  id: number;
  name: string;
  active: number;
  keterangan: string;
  created_at: Date;
  updated_at: Date;
}

export interface ILokasiDiklat {
  id: number;
  name: string;
  alamat: string;
  rute: string;
  google_map: string;
  manajer_kelas: number;
  created_at: string;
  updated_at: string;
}

export interface IKalenderPublic {
  id: number;
  periode: number;
  diklat_id: number;
  jumlah_angkatan: number;
  jumlah_peserta: number;
  durasi_hari: number;
  lokasi: number;
  waktu_pelaksanaan: string;
  tujuan: string;
  persyaratan: string;
  keterangan: string;
  created_at: Date;
  updated_at: Date;
  registrasi_mulai: Date;
  registrasi_selesai: Date;
  status_registrasi: string;
  diklat: IDiklat;
  lokasi_diklat: ILokasiDiklat;
}

export interface IMataDiklat {
  id: number;
  name: string;
  deskripsi: string;
  kompetensi_dasar: string;
  indikator_keberhasilan: string;
  petunjuk_pengajar: string;
  petunjuk_peserta: string;
  evaluasi_kbm: string;
  referensi: string;
  keterangan_modul: string;
  created_at: string;
  updated_at: string;
  elearning_id: number;
  elearning_enable: number;
  kbm: IKBM;
}

interface IKBM {
  id: number;
  mata_diklat_id: number;
  tahapan_kegiatan: string;
  kegiatan_fasilitator: string;
  kegiatan_peserta: string;
  metode: string;
  media: string;
  alokasi_waktu: number;
  urutan: number;
  created_at: string;
  updated_at: string;
}

export interface IKurikulum {
  id: number;
  diklat_id: number;
  mata_diklat_id: number;
  created_at: string;
  updated_at: string;
  mata_diklat: IMataDiklat;
  diklat: IDiklat;
}

export interface IFileMateri {
  id: number;
  materi_id: number;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  file_extension: string;
  keterangan: string;
  file_checksum: string;
  created_at: string;
  updated_at: string;
}

export interface ITubel {
  id: number;
  user_id: number;
  nrk: string;
  prodi_id: number;
  mulai: string;
  selesai: string;
  extend_mulai: Date;
  extend_selesai: Date;
  total_semester: number;
  total_bulan: number;
  tahun: number;
  no_sk: string;
  tgl_sk: string;
  jenis_biaya_id: number;
  sumber_biaya_id: number;
  created_at: Date;
  updated_at: Date;
  user: User;
  prodi: IProdi;
  jenis_biaya: IJenisBiaya;
  sumber_biaya: IJenisBiaya;
  biaya: IBiaya;
  voucher: IVoucher;
}

export interface IBiaya {
  id: number;
  nrk: string;
  peserta_id: number;
  komp_biaya_id: number;
  qty: number;
  satuan: string;
  biaya: number;
  created_at: Date;
  updated_at: Date;
  sumber_biaya_id: number;
  keterangan: null;
}

export interface IJenisBiaya {
  id: number;
  nama: string;
  keterangan?: null | string;
  created_at: Date;
  updated_at: Date;
  jenjang?: string;
}

export interface IProdi {
  id: number;
  nama: string;
  ptn_id: number;
  jenjang_id: number;
  created_at: Date;
  updated_at: Date;
  jenjang: IJenisBiaya;
  universitas: IUniversitas;
}

export interface IUniversitas {
  id: number;
  nama: string;
  singkatan: string;
  lokasi: string;
  alamat: string;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: number;
  eselon_id: string;
  uke_induk_id: number;
  uke_id: string;
  jabatan_id: string;
  pangkat_id: number;
  golongan_id: string;
  file_cv_id: number;
  photo_id: string;
  nip: string;
  nrk: string;
  full_name: string;
  gelar_depan: string;
  gelar_belakang: string;
  tgl_lahir: Date;
  pendidikan_sk: number;
  tmt_eselon: Date;
  tmt_pangkat: Date;
  tmt_pns: Date;
  tmt_cpns: Date;
  tempat_lahir: string;
  rumah_alamat: string;
  rumah_kota: string;
  rumah_propinsi: string;
  rumah_kdpos: string;
  rumah_telp: string;
  ktp_rumah_alamat: string;
  ktp_rumah_kota: string;
  ktp_rumah_kdpos: string;
  ktp_rumah_telp: string;
  ktp_telp_mobile: string;
  telp_mobile: string;
  kantor_alamat: string;
  kantor_kota: string;
  kantor_propinsi: string;
  kantor_kdpos: null;
  kantor_telp: string;
  kantor_fax: string;
  status_pegawai: string;
  agama: string;
  gender: string;
  ktp: string;
  bank_account: string;
  pemilik_rekening: string;
  rekening: string;
  npwp: string;
  email: string;
  change_password_after_login: number;
  activation_code: null;
  verification_code: string;
  active: number;
  verified: number;
  filled: number;
  created_at: Date;
  updated_at: Date;
  remember_token: string;
  last_change_password: Date;
  recover_password_q: string;
  recover_password_a: string;
  elearning_enable: number;
  kantor_kec: string;
  kantor_kel: string;
  rumah_kec: string;
  rumah_kel: string;
  ktp_rumah_kec: string;
  ktp_rumah_kel: string;
  ktp_rumah_propinsi: string;
  pendidikan_id: null;
  jabatan_sk: string;
  is_jabatan_sk: number;
  password: string;
}

export interface IVoucher {
  id: number;
  peserta_id: number;
  tahun: number;
  semester: number;
  mulai: Date;
  selesai: Date;
  ditransfer: number;
  keterangan: string;
  created_at: Date;
  updated_at: Date;
  status: number;
  tgl_transfer: null;
  konfirmasi: number;
  tgl_konfirmasi: null;
}

export interface ITubelLaporan {
  id: number;
  nrk: string;
  peserta_id: number;
  tahun: number;
  semester: number;
  nilai: number;
  tubel_file_id: number;
  voucher_id: number;
  submit_status: string;
  doc_status: string;
  keterangan: null;
  tubel_kwitansi_id: number;
  created_at: Date;
  updated_at: Date;
  tubel_file: TubelFile;
  peserta: Peserta;
  laporan: Laporan;
}

export interface Laporan {
  id: number;
  peserta_id: number;
  jenis_file_id: number;
  tubel_file_id: number;
  status_validasi: string;
  status_catatan: null;
  nama: string;
  keterangan: string;
  created_at: Date;
  updated_at: Date;
  jenis_file: JenisFile;
}

export interface JenisFile {
  id: number;
  nama: string;
  keterangan: null;
  active: number;
  created_at: Date;
  updated_at: Date;
}

export interface Peserta {
  id: number;
  user_id: number;
  nrk: string;
  prodi_id: number;
  mulai: Date;
  selesai: Date;
  extend_mulai: Date;
  extend_selesai: Date;
  total_semester: number;
  total_bulan: number;
  tahun: number;
  no_sk: string;
  tgl_sk: Date;
  jenis_biaya_id: number;
  sumber_biaya_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface TubelFile {
  id: number;
  nama: string;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  file_extension: string;
  created_at: string;
  updated_at: Date;
}

export interface IKopiSedap {
  id: number;
  angkatan_id: number;
  title: string;
  watch_id: string;
  zoom_url: string;
  passcode: string;
  keterangan: string;
  clicked: 0;
  created_at: string;
  file_sertifikat: unknown;
  updated_at: string;
  jadwal_diklat: {
    id: 5520;
    diklat_id: 3693;
    lokasi_diklat_id: 18;
    ruang_id: 0;
    name: "9089";
    minimal_peserta: 0;
    maksimal_peserta: 999999;
    jadwal_mulai: "2024-09-25T09:47:00.000Z";
    jadwal_selesai: "2024-09-25T09:51:00.000Z";
    registrasi_mulai: "2024-09-25T09:47:00.000Z";
    registrasi_selesai: "2024-09-25T09:51:00.000Z";
    status_registrasi: "open";
    keterangan: "<div><p>ew</p></div>";
    petugas_id: 0;
    manajer_id: 0;
    mfd_id: 0;
    created_at: "2024-09-25T09:47:33.000Z";
    updated_at: "2024-09-25T09:47:33.000Z";
    elearning_id: 0;
    elearning_enable: 0;
    jumlah_jam: null;
    tgl_sertifikat: null;
    nama_ttd_sertifikat: "Dra. BUDIHASTUTI, M.Psi";
    nip_ttd_sertifikat: "195903151985032005";
    jabatan_ttd_sertifikat: "KEPALA BADAN PENGEMBANGAN SUMBER DAYA MANUSIA";
    lokasi_diklat_sertifikat: "Jakarta";
    penyelenggara_sertifikat: "-";
    kerjasama_sertifikat: "Badan Pengembangan Sumber Daya Manusia";
    sertifikat_signed: 0;
    tte_status: "none";
    nomor_sertifikat_podcast: "321";
    kompetensi_teknis_sertifikat: null;
    mata_pelajaran_sertifikat: null;
    template_sertifikat: null;
    kabid_nrk_sertifikat: null;
    simpegsync_status: "none";
    simpegsync_at: "2024-09-25T09:47:33.000Z";
    transkrip_status: "none";
    template_transkrip: null;
    sp_status: "none";
  };
  sertifikat: boolean;
  isRegisterd: boolean;
}
