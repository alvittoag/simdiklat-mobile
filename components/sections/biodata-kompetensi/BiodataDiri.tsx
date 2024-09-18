import React, { useMemo } from "react";
import { StyleSheet, FlatList } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "@/constants/Colors";
import { useMutation, useQuery } from "@apollo/client";
import Loading from "@/components/elements/Loading";
import Error from "@/components/elements/Error";
import { IUserPeserta } from "@/type";
import { getUserBiodata } from "@/services/query/get-user-biodata";
import { FlashList } from "@shopify/flash-list";
import { parseDateLong } from "@/lib/parseDate";
import { updateBiodata } from "@/services/mutation/UpdateBiodata";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

interface BiodataInput {
  id: NestedKeyOf<IUserPeserta>;
  label: string;
  editable: boolean;
}

const biodataInputs: BiodataInput[] = [
  { id: "nrk", label: "NRK", editable: false },
  { id: "nip", label: "NIP", editable: false },
  { id: "gelar_depan", label: "Gelar Depan", editable: false },
  { id: "full_name", label: "Nama Lengkap", editable: false },
  { id: "gelar_belakang", label: "Gelar Belakang", editable: false },
  { id: "uke.name", label: "Unit Kerja", editable: false },
  { id: "jabatan.jenis", label: "Jenis Jabatan", editable: false },
  { id: "jabatan.name", label: "Jabatan", editable: false },
  { id: "tmt_pangkat", label: "TMT Pangkat", editable: false },
  { id: "tmt_eselon", label: "TMT Eselon", editable: false },
  { id: "tmt_cpns", label: "TMT CPNS", editable: false },
  { id: "pangkat.name", label: "Pangkat", editable: false },
  { id: "agama", label: "Agama", editable: false },
  {
    id: "pendidikan.jurusan",
    label: "Pendidikan Terakhir (Sesuai SK)",
    editable: false,
  },
  { id: "email", label: "Email", editable: true },
  { id: "gender", label: "Jenis Kelamin", editable: false },
  { id: "tempat_lahir", label: "Tempat Lahir", editable: false },
  { id: "tgl_lahir", label: "Tanggal Lahir", editable: false },
  { id: "ktp", label: "No KTP", editable: true },
  { id: "npwp", label: "NPWP", editable: true },
  { id: "bank_account", label: "Bank Account", editable: true },
  { id: "pemilik_rekening", label: "Atas Nama", editable: true },
  { id: "rekening", label: "Rekening", editable: true },
  { id: "kantor_alamat", label: "Alamat Kantor", editable: true },
  { id: "kantor_kel", label: "Kelurahan", editable: true },
  { id: "kantor_kec", label: "Kecamatan", editable: true },
  { id: "kantor_kota", label: "Kabupaten Kota", editable: true },
  { id: "kantor_propinsi", label: "Provinsi", editable: true },
  { id: "kantor_telp", label: "Telephone", editable: true },
  { id: "kantor_fax", label: "Fax", editable: true },
  { id: "ktp_rumah_alamat", label: "Sesuai Dengan KTP", editable: true },
  { id: "ktp_rumah_kel", label: "Kelurahan", editable: true },
  { id: "ktp_rumah_kec", label: "Kecamatan", editable: true },
  { id: "ktp_rumah_kota", label: "Kabupaten Kota", editable: true },
  { id: "ktp_rumah_propinsi", label: "Provinsi", editable: true },
  { id: "ktp_rumah_kdpos", label: "Kode Pos", editable: true },
  { id: "ktp_rumah_telp", label: "Telephone", editable: true },
  { id: "telp_mobile", label: "Handphone", editable: true },
];

const BiodataDiri = ({ navigation }: { navigation: any }) => {
  const { data, loading, error } = useQuery<{ user: IUserPeserta }>(
    getUserBiodata
  );

  const [updateBio, { loading: loadingUpdate, error: errorUpdate }] =
    useMutation(updateBiodata);

  const [inputData, setInputData] = React.useState<Record<string, string>>({});
  const [changedData, setChangedData] = React.useState<Record<string, string>>(
    {}
  );

  const handleUpdate = () => {
    updateBio({
      variables: {
        input: {
          ...changedData,
        },
      },
    })
      .then(() =>
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Berhasil",
          textBody: "Biodata Diri Berhasil Disimpan",
          button: "Tutup",
        })
      )
      .catch((err) => {
        console.log(err);
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Gagal",
          textBody: "Gagal Update Biodata Diri",
          button: "Tutup",
        });
      });
  };

  const initialInputData = useMemo(() => {
    if (!data) return {};
    return biodataInputs.reduce((acc, input) => {
      const keys = input.id.split(".");
      let value: any = data?.user;
      for (const key of keys) {
        if (!value) break;
        value = value[key as keyof typeof value] as any;
      }
      if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        const date: any = new Date(value);
        if (!isNaN(date.getTime())) {
          value = parseDateLong(date);
        }
      }
      acc[input.id] = value || "";
      return acc;
    }, {} as Record<string, string>);
  }, [data]);

  React.useEffect(() => {
    setInputData(initialInputData);
  }, [initialInputData]);

  const handleInputChange = React.useCallback((id: string, value: string) => {
    setInputData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setChangedData((prev) => ({
      ...prev,
      [id]: value,
    }));
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error />;

  console.log("Changed data:", changedData);

  const renderItem = ({ item }: { item: BiodataInput }) => (
    <TextInput
      key={item.id}
      editable={item.editable}
      mode="outlined"
      multiline
      textColor={Colors.text_primary}
      value={inputData[item.id] === " " ? "-" : inputData[item.id]}
      onChangeText={(value) => handleInputChange(item.id, value)}
      label={item.label}
      style={[styles.textInput, !item.editable && styles.disabledInput]}
      outlineColor={Colors.border_primary}
      activeOutlineColor={Colors.border_input_active}
    />
  );

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      data={biodataInputs}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListFooterComponent={() => (
        <Button
          disabled={loadingUpdate}
          loading={loadingUpdate}
          mode="contained"
          onPress={handleUpdate}
          icon="content-save-outline"
          labelStyle={{ color: "black" }}
          style={styles.button}
        >
          Selanjutnya
        </Button>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(20),
  },
  textInput: {
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 15,
  },
  disabledInput: {
    backgroundColor: "#F7F7F8",
  },
  button: {
    backgroundColor: Colors.button_secondary,
    paddingVertical: moderateScale(7),
    marginTop: moderateScale(15),
    borderRadius: 7,
  },
});

export default BiodataDiri;
