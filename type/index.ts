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
  status: string;
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
