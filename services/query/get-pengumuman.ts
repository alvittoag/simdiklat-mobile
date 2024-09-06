import { gql } from "@apollo/client";

export const getPengumuman = gql`
  query GetSeleksiWidyaiswaraList(
    $q: String
    $page: Int
    $limit: Int
    $tahun: Int
  ) {
    seleksiWidyaiswaras(search: $q, page: $page, limit: $limit, tahun: $tahun) {
      items {
        id
        title
        tahun
        registrasi_mulai
        registrasi_selesai
        keterangan
        isOpen
      }
      total
      hasMore
    }
  }
`;

export const getPengumumanDetail = gql`
  query GetSeleksiWidyaiswaraByID($id: Int) {
    seleksiWidyaiswara(id: $id) {
      id
      title
      tahun
      registrasi_mulai
      registrasi_selesai
      keterangan
      isOpen
      file_pengumuman
    }
  }
`;
