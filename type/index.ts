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

export interface IPengumuman {
  id: number;
  title: string;
  tahun: number;
  registrasi_mulai: string;
  registrasi_selesai: string;
  keterangan: string;
  isOpen: boolean;
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
