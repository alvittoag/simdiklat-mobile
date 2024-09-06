import { gql } from "@apollo/client";

export const getDiklat = gql`
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

export const detailAdministrasiDiklat = gql`
  query GetPesertaDiklatByID($jadwal_diklat_id: Int) {
    pesertaDiklat(jadwal_diklat_id: $jadwal_diklat_id) {
      id
      sertifikat_totaljam
      status
      keterangan

      jadwal_diklat {
        id
        maksimal_peserta
        jadwal_mulai
        jadwal_selesai
        registrasi_selesai
        status_registrasi
        keterangan
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
  }
`;
