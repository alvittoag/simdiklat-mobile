import { gql } from "@apollo/client";

export const getProfilePeserta = gql`
  query GetPesertaProfil {
    profilPesertaDiklat {
      user_id
      full_name
      nama_jabatan
      nama_uke
      jp
      skor_ipasn
      kepemimpinan
      fungsional
      teknis
      lainnya
      tahun
      bulan
      updated_at
      nrk
      nip
    }
  }
`;
