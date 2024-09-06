import { gql } from "@apollo/client";

export const getRiwayatPendidikanUser = gql`
  query GetRiwayatPendidikanUser($page: Int, $limit: Int) {
    riwayatPendidikanUser(page: $page, limit: $limit) {
      items {
        id
        jenis
        nama_sekolah
        jurusan
        tempat
        tahun_lulus
        keterangan
        ijazah_url
      }
      total
      hasMore
    }
  }
`;
export const getPesertaDiklatList = gql`
  query GetPesertaDiklatList(
    $q: String
    $page: Int
    $limit: Int
    $tipe: String
  ) {
    pesertaDiklats(search: $q, page: $page, limit: $limit, listType: $tipe) {
      items {
        id
        sertifikat_totaljam
        jadwal_diklat {
          id
          status_registrasi
          name
          jadwal_mulai
          jadwal_selesai
          diklat {
            id
            name
            jenis_diklat {
              name
            }
          }
          lokasi_diklat {
            name
            alamat
          }
        }
      }
      total
      hasMore
    }
  }
`;

export const getPelatihanUser = gql`
  query GetPelatihanUser($page: Int, $limit: Int, $search: String) {
    pelatihanUser(page: $page, limit: $limit, search: $search) {
      items {
        id
        user_id
        keterangan
        jenis
        penyelenggara
        tahun
        sertifikat_url
        status
        nomor_sertifikat
        tgl_sertifikat
        durasi
      }
      total
      hasMore
    }
  }
`;

export const getRiwayatPekerjaanUser = gql`
  query GetRiwayatPekerjaanUser($page: Int, $limit: Int, $search: String) {
    riwayatPekerjaanUser(page: $page, limit: $limit, search: $search) {
      items {
        id
        jabatan_table {
          jenis
          code
          name
          full_name
        }
        uke {
          code
          name
          full_name
        }
        tmt_jabatan
        keterangan
      }
      total
      hasMore
    }
  }
`;

export const getPengajaranUser = gql`
  query GetPengajaranUser($page: Int, $limit: Int, $search: String) {
    pengajaranUser(page: $page, limit: $limit, search: $search) {
      items {
        id
        user_id
        kegiatan
        materi
        instansi
        tahun
        sertifikat_url
        expired_sertifikat
        keterangan
      }
      total
      hasMore
    }
  }
`;

export const getKaryaTulisUser = gql`
  query GetKaryaTulisUser($page: Int, $limit: Int, $search: String) {
    karyaTulisUser(page: $page, limit: $limit, search: $search) {
      items {
        id
        user_id
        judul
        tahun
        tempat
        keterangan
      }
      total
      hasMore
    }
  }
`;
