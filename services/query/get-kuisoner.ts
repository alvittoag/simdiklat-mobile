import { gql } from "@apollo/client";

export const getKuisonerPenyelenggara = gql`
  query GetPesertaDiklatList(
    $q: String
    $page: Int
    $limit: Int
    $status: String
    $sortBy: String
    $sortDirection: String
    $searchBy: String
  ) {
    pesertaDiklats(
      search: $q
      page: $page
      limit: $limit
      status: $status
      sortBy: $sortBy
      sortDirection: $sortDirection
      searchBy: $searchBy
    ) {
      items {
        id
        sertifikat_totaljam
        kuis_penyelenggara_count
        status
        user_id
        jadwal_diklat {
          id
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

export const getKuisonerPengajar = gql`
  query GetPesertaDiklatList(
    $q: String
    $page: Int
    $limit: Int
    $status: String
    $sortBy: String
    $sortDirection: String
    $searchBy: String
  ) {
    pesertaDiklats(
      search: $q
      page: $page
      limit: $limit
      status: $status
      sortBy: $sortBy
      sortDirection: $sortDirection
      searchBy: $searchBy
    ) {
      items {
        id
        sertifikat_totaljam
        status
        jadwal_diklat {
          id
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
