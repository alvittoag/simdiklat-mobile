import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { moderateScale } from "react-native-size-matters";
import { Button, Icon, TextInput } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { useMutation } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { router } from "expo-router";
import * as Yup from "yup";
import { Formik } from "formik";

const karyaTulisSchema = Yup.object().shape({
  judul: Yup.string()
    .min(2, "Minimum 2 Karakter")
    .required("Harap Masukan Judul Kegiatan"),
  tempat: Yup.string()
    .min(2, "Minimum 2 Karakter")
    .required("Harap Masukan Tempat Disampaikan/Dipublikasikan"),
  tahun: Yup.number()
    .integer()
    .min(1000, "Format Tahun Tidak Benar")
    .max(9999, "Format Tahun Tidak Benar")
    .required("Harap Masukan Tahun")
    .typeError("Tahun harus berupa angka"),
});

export default function karyaAdd() {
  const mutationAdd = useMutation({
    mutationFn: async (formData: FormData) => {
      return await axiosService.post(
        "/api/data-kompetensi/karya-tulis/post",
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
        textBody: "Karya Tulis Berhasil Ditambahkan",
        button: "Tutup",
      });

      router.navigate({
        pathname: "/biodata-kompetensi",
        params: { data: "success" },
      });
    },
    onError: (error) => {
      console.error("Error adding karya tulis:", error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: error?.message || "Karya Tulis Gagal Ditambahkan",
        button: "Tutup",
      });
    },
  });
  const handleAdd = async ({
    judul,
    tempat,
    keterangan,
    tahun,
  }: {
    judul: string;
    tempat: string;
    keterangan: string;
    tahun: number | string;
  }) => {
    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("tahun", tahun.toString());
    formData.append("tempat", tempat);
    formData.append("keterangan", keterangan === "" ? " " : keterangan);

    mutationAdd.mutate(formData);
  };

  return (
    <View>
      <Formik
        initialValues={{
          judul: "",
          tahun: "",
          tempat: "",
          keterangan: "",
        }}
        validationSchema={karyaTulisSchema}
        onSubmit={(val, { resetForm }) => {
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
              value={values.judul}
              onChangeText={handleChange("judul")}
              error={errors.judul ? true : false}
              textColor={Colors.text_primary}
              label={"Judul Kegiatan *"}
              mode="outlined"
              outlineColor={Colors.border_primary}
              activeOutlineColor={Colors.border_input_active}
              style={{ backgroundColor: "white" }}
            />

            {errors.judul && (
              <Text style={{ color: "salmon", fontWeight: "bold" }}>
                {errors.judul}
              </Text>
            )}

            <TextInput
              value={values.tahun}
              onChangeText={handleChange("tahun")}
              error={errors.tahun ? true : false}
              textColor={Colors.text_primary}
              label={"Tahun *"}
              inputMode="numeric"
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

            <TextInput
              value={values.tempat}
              onChangeText={handleChange("tempat")}
              textColor={Colors.text_primary}
              label={
                " Disampaikan / Dipublikasin pada Seminar / Mahalah / Koran / Website *"
              }
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
    </View>
  );
}
