import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { moderateScale } from "react-native-size-matters";
import { Button, Icon, TextInput } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import * as DocumentPicker from "expo-document-picker";
import { useMutation } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Yup from "yup";
import { Formik } from "formik";

const pelatihanSchema = Yup.object().shape({
  kegiatan: Yup.string()
    .min(2, "Minimum 2 Karakter")
    .required("Harap Masukan Nama Kegiatan"),
  materi: Yup.string()
    .min(2, "Minimum 2 Karakter")
    .required("Harap Masukan Materi"),
  instansi: Yup.string()
    .min(2, "Minimum 2 Karakter")
    .required("Harap Masukan Instansi"),
  tahun: Yup.number()
    .integer()
    .min(1000, "Format Tahun Tidak Benar")
    .max(9999, "Format Tahun Tidak Benar")
    .required("Harap Masukan Tahun")
    .typeError("Tahun harus berupa angka"),
});

export default function pelatihanAdd() {
  const [dataInput, setDataInput] = React.useState({
    expired_sertifikat: "",
    sertifikat_pdf: null as any,
  });

  const [date, setDate] = React.useState(new Date());
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setDataInput({
      ...dataInput,
      expired_sertifikat: currentDate.toLocaleDateString(),
    });
  };

  const mutationAdd = useMutation({
    mutationFn: async (formData: FormData) => {
      return await axiosService.post(
        "/api/data-kompetensi/pengajaran/post",
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
        textBody: "Pelatihan Berhasil Ditambahkan",
        button: "Tutup",
      });
      setDataInput({
        expired_sertifikat: "",
        sertifikat_pdf: null as any,
      });
      router.navigate({
        pathname: "/biodata-kompetensi",
        params: { data: "success" },
      });
    },
    onError: (error) => {
      console.error("Error adding pelatihan:", error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: error?.message || "Pelatihan Gagal Ditambahkan",
        button: "Tutup",
      });
    },
  });
  const handleAdd = async ({
    kegiatan,
    instansi,
    tahun,
    keterangan,
    materi,
  }: {
    kegiatan: string;
    instansi: string;
    tahun: number | string;
    keterangan: string;
    materi: string;
  }) => {
    const formData = new FormData();
    formData.append("kegiatan", kegiatan);
    formData.append("instansi", instansi);
    formData.append("tahun", tahun.toString());
    formData.append("keterangan", keterangan === "" ? " " : keterangan);
    formData.append("materi", materi);
    formData.append("expired_sertifikat", dataInput.expired_sertifikat);

    if (dataInput.sertifikat_pdf) {
      const fileToUpload = {
        uri: dataInput.sertifikat_pdf.uri,
        type: dataInput.sertifikat_pdf.mimeType,
        name: dataInput.sertifikat_pdf.name,
      };
      formData.append("sertifikat_pdf", fileToUpload as any);
    }

    mutationAdd.mutate(formData);
  };

  console.log(dataInput);
  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setDataInput({
          ...dataInput,
          sertifikat_pdf: result.assets[0] as any,
        });
      }
    } catch (err) {
      console.log("Unknown error: ", err);
    }
  };

  console.log(dataInput);
  return (
    <ScrollView>
      <Formik
        validationSchema={pelatihanSchema}
        initialValues={{
          kegiatan: "",
          instansi: "",
          tahun: "",
          keterangan: "",
          materi: "",
        }}
        onSubmit={(val, { resetForm }) => {
          if (!dataInput.sertifikat_pdf) {
            return Dialog.show({
              type: ALERT_TYPE.WARNING,
              title: "Peringantan",
              textBody: "Harap Isi Sertifikat",
              button: "Tutup",
            });
          }

          if (dataInput.expired_sertifikat === "") {
            return Dialog.show({
              type: ALERT_TYPE.WARNING,
              title: "Peringatan",
              textBody: "Harap Isi Tanggal Expired Sertifikat",
              button: "Tutup",
            });
          }

          handleAdd(val);

          resetForm();
        }}
      >
        {({ handleChange, values, handleSubmit, errors }) => (
          <View
            style={{
              gap: moderateScale(20),
              paddingHorizontal: moderateScale(15),
              paddingVertical: moderateScale(20),
            }}
          >
            <TextInput
              value={values.kegiatan}
              onChangeText={handleChange("kegiatan")}
              error={errors.kegiatan ? true : false}
              textColor={Colors.text_primary}
              label={"Nama Kegiatan *"}
              mode="outlined"
              outlineColor={Colors.border_primary}
              activeOutlineColor={Colors.border_input_active}
              style={{ backgroundColor: "white" }}
            />

            {errors.kegiatan && (
              <Text style={{ color: "salmon", fontWeight: "bold" }}>
                {errors.kegiatan}
              </Text>
            )}

            <TextInput
              value={values.materi}
              onChangeText={handleChange("materi")}
              error={errors.materi ? true : false}
              textColor={Colors.text_primary}
              label={"Materi *"}
              mode="outlined"
              outlineColor={Colors.border_primary}
              activeOutlineColor={Colors.border_input_active}
              style={{ backgroundColor: "white" }}
            />

            {errors.materi && (
              <Text style={{ color: "salmon", fontWeight: "bold" }}>
                {errors.materi}
              </Text>
            )}

            <TextInput
              value={values.instansi}
              onChangeText={handleChange("instansi")}
              error={errors.instansi ? true : false}
              textColor={Colors.text_primary}
              label={"Instansi Penyelenggara *"}
              mode="outlined"
              outlineColor={Colors.border_primary}
              activeOutlineColor={Colors.border_input_active}
              style={{ backgroundColor: "white" }}
            />

            {errors.instansi && (
              <Text style={{ color: "salmon", fontWeight: "bold" }}>
                {errors.instansi}
              </Text>
            )}

            <TextInput
              value={values.tahun}
              onChangeText={handleChange("tahun")}
              error={errors.tahun ? true : false}
              textColor={Colors.text_primary}
              inputMode="numeric"
              label={"Tahun *"}
              mode="outlined"
              outlineColor={Colors.border_primary}
              activeOutlineColor={Colors.border_input_active}
              style={{ backgroundColor: "white" }}
            />

            {errors.tahun && (
              <Text style={{ color: "salmon", fontWeight: "bold" }}>
                {errors.tahun}
              </Text>
            )}

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
                  {dataInput?.sertifikat_pdf?.name ?? "Scan Sertifikat/Bukti"}
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

            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
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
                  color: dataInput.expired_sertifikat ? "black" : "grey",
                  fontWeight: "400",
                  fontSize: 16,
                }}
              >
                {dataInput.expired_sertifikat
                  ? dataInput.expired_sertifikat
                  : "Masa Berlaku Sertifikat *"}
              </Text>
              <Icon size={24} source={"calendar-today"} color="gray" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}

            <TextInput
              value={values.keterangan}
              onChangeText={handleChange("keterangan")}
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
        )}
      </Formik>
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
