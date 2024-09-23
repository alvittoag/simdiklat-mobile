import { gql } from "@apollo/client";

export const getKalenderDiklatList = gql`
  query GetKalenderDiklatList(
    $q: String
    $page: Int
    $limit: Int
    $tahun: Int
    $sortBy: String
    $sortDirection: String
  ) {
    kalenderDiklats(
      search: $q
      page: $page
      limit: $limit
      tahun: $tahun
      sortBy: $sortBy
      sortDirection: $sortDirection
    ) {
      items {
        id
        waktu_pelaksanaan
        registrasi_mulai
        registrasi_selesai
        status_registrasi
        diklat {
          id
          name
        }
        lokasi_diklat {
          name
        }
        persyaratan
        keterangan
        approval
      }
      total
      hasMore
    }
  }
`;

export const getKalenderDiklatDetail = gql`
  query GetKalenderDiklatByID($id: Int) {
    kalenderDiklat(id: $id) {
      id
      jumlah_angkatan
      jumlah_peserta
      durasi_hari
      tujuan
      waktu_pelaksanaan
      registrasi_mulai
      registrasi_selesai
      status_registrasi
      diklat {
        name
        jenis_diklat {
          name
        }
      }
      lokasi_diklat {
        name
      }
      approval
      persyaratan
      keterangan
    }
  }
`;
