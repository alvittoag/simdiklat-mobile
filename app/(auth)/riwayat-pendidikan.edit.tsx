import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { moderateScale } from "react-native-size-matters";
import {
  Button,
  Icon,
  Modal,
  Portal,
  Searchbar,
  TextInput,
} from "react-native-paper";
import { Colors } from "@/constants/Colors";
import useDebounce from "@/hooks/useDebounce";
import { FlashList } from "@shopify/flash-list";
import * as DocumentPicker from "expo-document-picker";
import { useMutation } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { router, useLocalSearchParams } from "expo-router";
import { IRiwayatPendidikanUser } from "@/type";
import { Formik } from "formik";
import * as Yup from "yup";

const pendidikanSchema = Yup.object().shape({
  nama_sekolah: Yup.string()
    .min(2, "Minimum 2 Karakter")
    .required("Harap Masukan Nama Sekolah/Universitas"),
  jurusan: Yup.string()
    .min(2, "Minimum 2 Karakter")
    .required("Harap Masukan Keterangan Jurusan/Program Studi"),
  tempat: Yup.string()
    .min(2, "Minimum 2 Karakter")
    .required("Harap Masukan Tempat Pendidikan"),
  tahun_lulus: Yup.number()
    .integer()
    .min(1000, "Format Tahun Lulus Tidak Benar")
    .max(9999, "Format Tahun Lulus Tidak Benar")
    .required("Harap Masukan Tahun Lulus")
    .typeError("Tahun harus berupa angka"),
});

export default function RiwayaPendidikanCreate() {
  const params = useLocalSearchParams();

  const dataParams: IRiwayatPendidikanUser = React.useMemo(() => {
    try {
      return JSON.parse(params?.data as string);
    } catch (error) {
      console.error("Error parsing params data:", error);
      return {} as IRiwayatPendidikanUser;
    }
  }, [params?.data]);

  const [dataInput, setDataInput] = React.useState({
    ijazah_pdf: null as any,
  });
  const [selectValue, setSelectValue] = React.useState<{
    value: string;
    label: string;
  } | null>(dataSelect.find((item) => item.value === dataParams.jenis) as any);

  const [search, setsearch] = React.useState("");
  const searchVal = useDebounce(search, 500);
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleSearchChange = React.useCallback((text: string) => {
    setsearch(text);
  }, []);

  const mutationAdd = useMutation({
    mutationFn: async (formData: FormData) => {
      return await axiosService.put(
        "/api/data-kompetensi/riwayat-pendidikan/put",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    onSuccess: () => {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: "Riwayat Pendidikan Berhasil Diperbarui",
        button: "Tutup",
      });
      setDataInput({
        ijazah_pdf: null as any,
      });
      setSelectValue(null);
      router.navigate({
        pathname: "/biodata-kompetensi",
        params: { data: "success" },
      });
    },
    onError: (error) => {
      console.error("Error update riwayat pendidikan:", error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: error?.message || "Riwayat Pendidikan Gagal Diperbarui",
        button: "Tutup",
      });
    },
    retry: 10,
  });

  const handleEdit = async ({
    nama_sekolah,
    jurusan,
    tempat,
    tahun_lulus,
    keterangan,
  }: {
    nama_sekolah: string;
    jurusan: string;
    tempat: string;
    tahun_lulus: string;
    keterangan: string;
  }) => {
    const formData = new FormData();
    formData.append("id", dataParams.id.toString());
    formData.append("jenis", selectValue?.value as string);
    formData.append("nama_sekolah", nama_sekolah);
    formData.append("jurusan", jurusan);
    formData.append("tempat", tempat);
    formData.append("tahun_lulus", tahun_lulus);
    formData.append("keterangan", keterangan);

    if (dataInput.ijazah_pdf) {
      const fileToUpload = {
        uri: dataInput.ijazah_pdf.uri,
        type: dataInput.ijazah_pdf.mimeType,
        name: dataInput.ijazah_pdf.name,
      };
      formData.append("ijazah_pdf", fileToUpload as any);
    }

    mutationAdd.mutate(formData);
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        if (result.assets[0].mimeType !== "application/pdf") {
          return Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: "Gagal",
            textBody: "File harus berupa pdf",
            button: "Tutup",
          });
        }
        setDataInput({
          ...dataInput,
          ijazah_pdf: result.assets[0] as any,
        });
      }
    } catch (err) {
      console.log("Unknown error: ", err);
    }
  };

  const filteredData = dataSelect.filter((item) =>
    item.label.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <ScrollView>
      <Formik
        validationSchema={pendidikanSchema}
        initialValues={{
          nama_sekolah: "",
          jurusan: "",
          tempat: "",
          tahun_lulus: "",
          keterangan: "",
        }}
        onSubmit={(val) => {
          if (!selectValue) {
            return Dialog.show({
              type: ALERT_TYPE.WARNING,
              title: "Peringatan",
              textBody: "Harap Pilih Jenjang Pendidikan Terlebih Dahulu",
              button: "Tutup",
            });
          }

          handleEdit(val);
        }}
      >
        {({ handleChange, values, handleSubmit, errors, setValues }) => {
          React.useEffect(() => {
            if (dataParams) {
              setValues({
                nama_sekolah: dataParams.nama_sekolah || "",
                jurusan: dataParams.jurusan || "",
                tempat: dataParams.tempat || "",
                tahun_lulus: dataParams.tahun_lulus?.toString() || "",
                keterangan: dataParams.keterangan || "",
              });
              setDataInput({
                ijazah_pdf: null,
              });

              const foundSelect = dataSelect.find(
                (item) => item.value === dataParams.jenis
              );
              setSelectValue(foundSelect || null);
            }
          }, [dataParams]);

          return (
            <View
              style={{
                gap: moderateScale(20),
                paddingHorizontal: moderateScale(15),
                paddingVertical: moderateScale(20),
              }}
            >
              <View style={{ position: "relative" }}>
                <TouchableOpacity
                  onPress={showModal}
                  style={{
                    borderWidth: 1,
                    borderColor: Colors.border_primary,
                    paddingHorizontal: 10,
                    paddingVertical: 15,
                    borderRadius: 5,
                    flexDirection: "row",
                    backgroundColor: "white",
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      color: "grey",
                      fontWeight: "400",
                      fontSize: 16,
                    }}
                  >
                    {selectValue?.label ?? "Jenjang Pendidikan"}
                  </Text>
                  <Icon size={24} source={"open-in-new"} color="gray" />
                </TouchableOpacity>
              </View>

              <TextInput
                value={values.nama_sekolah}
                onChangeText={handleChange("nama_sekolah")}
                error={errors.nama_sekolah ? true : false}
                textColor={Colors.text_primary}
                label={"Nama Sekolah/Universitas *"}
                mode="outlined"
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
                style={{ backgroundColor: "white" }}
              />

              {errors.nama_sekolah && (
                <Text style={{ color: "salmon", fontWeight: "bold" }}>
                  {errors.nama_sekolah}
                </Text>
              )}

              <TextInput
                value={values.jurusan}
                onChangeText={handleChange("jurusan")}
                error={errors.jurusan ? true : false}
                textColor={Colors.text_primary}
                label={"Jurusan/Program Studi *"}
                mode="outlined"
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
                style={{ backgroundColor: "white" }}
              />

              {errors.jurusan && (
                <Text style={{ color: "salmon", fontWeight: "bold" }}>
                  {errors.jurusan}
                </Text>
              )}

              <TextInput
                value={values.tempat}
                onChangeText={handleChange("tempat")}
                error={errors.tempat ? true : false}
                textColor={Colors.text_primary}
                label={"Tempat Pendidikan *"}
                mode="outlined"
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
                style={{ backgroundColor: "white" }}
              />

              {errors.tempat && (
                <Text style={{ color: "salmon", fontWeight: "bold" }}>
                  {errors.tempat}
                </Text>
              )}

              <TextInput
                value={values.tahun_lulus}
                onChangeText={handleChange("tahun_lulus")}
                error={errors.tahun_lulus ? true : false}
                textColor={Colors.text_primary}
                inputMode="numeric"
                label={"Tahun Lulus *"}
                mode="outlined"
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
                style={{ backgroundColor: "white" }}
              />

              {errors.tahun_lulus && (
                <Text style={{ color: "salmon", fontWeight: "bold" }}>
                  {errors.tahun_lulus}
                </Text>
              )}

              <TextInput
                value={values.keterangan}
                onChangeText={handleChange("keterangan")}
                error={errors.keterangan ? true : false}
                textColor={Colors.text_primary}
                label={"Keterangan"}
                mode="outlined"
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
                style={{ backgroundColor: "white" }}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(25),
                }}
              >
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: Colors.border_primary,
                    padding: 15,
                    width: "60%",
                    borderRadius: 7,
                    backgroundColor: "white",
                  }}
                >
                  <Text style={{ color: Colors.text_secondary }}>
                    {dataInput?.ijazah_pdf?.name ?? "Scan Ijazah"}
                  </Text>
                </View>

                <Button
                  onPress={handleDocumentPick}
                  icon={"upload"}
                  mode="contained"
                  textColor="black"
                  style={{
                    flex: 1,
                    borderRadius: 7,
                    backgroundColor: Colors.button_secondary,
                    paddingVertical: 7,
                  }}
                >
                  Upload
                </Button>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <Button
                  loading={mutationAdd.isPending}
                  disabled={mutationAdd.isPending}
                  onPress={handleSubmit as any}
                  icon={"content-save-outline"}
                  mode="contained"
                  textColor="white"
                  labelStyle={{ color: "white" }}
                  style={{
                    backgroundColor: Colors.button_primary,
                    borderRadius: 7,
                    paddingVertical: 7,
                    flex: 1,
                  }}
                >
                  Simpan
                </Button>
              </View>
            </View>
          );
        }}
      </Formik>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            backgroundColor: "white",
            height: "60%",
            paddingHorizontal: 15,
            paddingVertical: 20,
          }}
        >
          <Searchbar
            value={search}
            iconColor={Colors.text_secondary}
            inputStyle={{
              color: Colors.text_primary,
            }}
            onChangeText={handleSearchChange}
            placeholder="Cari Data"
            placeholderTextColor={Colors.text_secondary}
            style={{
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: Colors.border_primary,
              borderRadius: 7,
              marginBottom: 20,
            }}
          />

          <FlashList
            data={filteredData}
            keyExtractor={(item) => item.value.toString()}
            estimatedItemSize={10}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectValue(item);
                  hideModal();
                }}
                style={{
                  marginBottom: index === filteredData.length - 1 ? 0 : 20,
                  borderBottomWidth: 1,
                  paddingBottom: 15,
                  borderBottomColor: Colors.border_primary,
                }}
              >
                <Text
                  style={{
                    color: Colors.text_primary,
                    fontSize: 15,
                    fontWeight: "500",
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const dataSelect = [
  { value: "SD", label: "SD/MI/Setara SD" },
  { value: "SLTP", label: "SMP/MTs/Setara SLTP" },
  { value: "SLTA", label: "SMA/STM/SMK/Setara SLTA" },
  { value: "D2", label: "Diploma II" },
  { value: "D3", label: "Diploma III" },
  { value: "S1", label: "S1/Sarjana" },
  { value: "S2", label: "S2/Master" },
  { value: "S3", label: "S3/Doktor" },
];
