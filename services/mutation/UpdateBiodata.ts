import { gql } from "@apollo/client";

export const updateBiodata = gql`
  mutation UpdateUserBiodata($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      nrk
      nip
      gelar_depan
      gelar_belakang
      full_name
      uke {
        code
        name
        full_name
      }
      jabatan {
        code
        jenis
        name
        full_name
      }
      tmt_eselon
      tmt_pangkat
      tmt_pns
      tmt_cpns
      pangkat {
        code
        name
        name2
        full_name
      }
      agama
      pendidikan {
        id
        jenis
        nama_sekolah
        jurusan
      }
      email
      gender
      tempat_lahir
      tgl_lahir
      ktp
      npwp
      bank_account
      pemilik_rekening
      rekening
      kantor_alamat
      kantor_kel
      kantor_kec
      kantor_kota
      kantor_propinsi
      kantor_kdpos
      kantor_telp
      kantor_fax
      ktp_rumah_alamat
      ktp_rumah_kel
      ktp_rumah_kec
      ktp_rumah_kota
      ktp_rumah_propinsi
      ktp_rumah_kdpos
      ktp_rumah_telp
      ktp_rumah_telp
      rumah_alamat
      rumah_kel
      rumah_kec
      rumah_kota
      rumah_propinsi
      rumah_kdpos
      rumah_telp
      telp_mobile
    }
  }
`;
