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
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Yup from "yup";
import { Formik } from "formik";

const kompetensiLainnyaSchema = Yup.object().shape({
  keterangan: Yup.string()
    .min(2, "Minimum 2 Karakter")
    .required("Harap Masukan Nama Pengembangan Kompetensi"),
  penyelenggara: Yup.string()
    .min(2, "Minimum 2 Karakter")
    .required("Harap Masukan Penyelenggara"),
  tahun: Yup.number()
    .integer()
    .min(1000, "Format Tahun Tidak Benar")
    .max(9999, "Format Tahun Tidak Benar")
    .required("Harap Masukan Tahun")
    .typeError("Tahun harus berupa angka"),
  durasi: Yup.number()
    .integer()
    .required("Harap Masukan Durasi")
    .typeError("Durasi harus berupa angka"),
  nomor_sertifikat: Yup.string()
    .min(2, "Minimum 2 Karakter")
    .required("Harap Masukan Nomor Sertifikat"),
});

export default function KompetensiLainnyaAdd() {
  const [dataInput, setDataInput] = React.useState({
    tgl_sertifikat: "",
    sertifikat_pdf: null as any,
  });
  const [selectValue, setSelectValue] = React.useState<{
    value: string;
    label: string;
  } | null>(null);
  const [date, setDate] = React.useState(new Date());
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [search, setsearch] = React.useState("");
  const searchVal = useDebounce(search, 500);
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setDataInput({
      ...dataInput,
      tgl_sertifikat: currentDate.toLocaleDateString("id-ID"),
    });
  };

  const handleSearchChange = React.useCallback((text: string) => {
    setsearch(text);
  }, []);

  const mutationAdd = useMutation({
    mutationFn: async (formData: FormData) => {
      return await axiosService.post(
        "/api/data-kompetensi/kompetensi-lainnya/post",
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
        textBody: "Kompetensi Lainnya Berhasil Ditambahkan",
        button: "Tutup",
      });
      setDataInput({
        tgl_sertifikat: "",
        sertifikat_pdf: null as any,
      });
      setSelectValue(null);
      router.navigate({
        pathname: "/biodata-kompetensi",
        params: { data: "success" },
      });
    },
    onError: (error) => {
      console.error("Error adding kompetensin lainnya:", error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: error?.message || "Kompetensi Lainnya Gagal Ditambahkan",
        button: "Tutup",
      });
    },
    retry: 10,
  });

  const handleAdd = async ({
    keterangan,
    penyelenggara,
    tahun,
    durasi,
    nomor_sertifikat,
  }: {
    keterangan: string;
    penyelenggara: string;
    tahun: string | number;
    durasi: string | number;
    nomor_sertifikat: string;
  }) => {
    const formData = new FormData();
    formData.append("keterangan", keterangan);
    formData.append("jenis", selectValue?.value as string);
    formData.append("penyelenggara", penyelenggara);
    formData.append("tahun", tahun.toString());
    formData.append("durasi", durasi.toString());
    formData.append("nomor_sertifikat", nomor_sertifikat);
    formData.append("tgl_sertifikat", date.toISOString());

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
          sertifikat_pdf: result.assets[0] as any,
        });
      }
    } catch (err) {
      console.log("Unknown error: ", err);
    }
  };

  const filteredData = dataSelect.filter((item) =>
    item.label.toLowerCase().includes(searchVal.toLowerCase())
  );

  console.log(dataInput);

  return (
    <ScrollView>
      <Formik
        validationSchema={kompetensiLainnyaSchema}
        initialValues={{
          keterangan: "",
          penyelenggara: "",
          tahun: "",
          durasi: "",
          nomor_sertifikat: "",
        }}
        onSubmit={(val, { resetForm }) => {
          if (!selectValue) {
            return Dialog.show({
              type: ALERT_TYPE.WARNING,
              title: "Peringatan",
              textBody: "Pilih Jenis Kompetensi Lainnya Terlebih Dahulu",
              button: "Tutup",
            });
          }

          if (dataInput.tgl_sertifikat === "") {
            return Dialog.show({
              type: ALERT_TYPE.WARNING,
              title: "Peringatan",
              textBody: "Isi Tanggal Sertifikat Terlebih Dahulu",
              button: "Tutup",
            });
          }

          if (!dataInput.sertifikat_pdf) {
            return Dialog.show({
              type: ALERT_TYPE.WARNING,
              title: "Peringatan",
              textBody: "Pilih Sertifikat Terlebih Dahulu",
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
              value={values.keterangan}
              onChangeText={handleChange("keterangan")}
              error={errors.keterangan ? true : false}
              textColor={Colors.text_primary}
              label={"Nama Pengembangan Kompetensi *"}
              mode="outlined"
              outlineColor={Colors.border_primary}
              activeOutlineColor={Colors.border_input_active}
              style={{ backgroundColor: "white" }}
            />

            {errors.keterangan && (
              <Text style={{ color: "salmon", fontWeight: "bold" }}>
                {errors.keterangan}
              </Text>
            )}

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
                  {selectValue?.label ?? "Kategori Pengembangan Kompetensi *"}
                </Text>
                <Icon size={24} source={"open-in-new"} color="gray" />
              </TouchableOpacity>
            </View>

            <TextInput
              value={values.penyelenggara}
              onChangeText={handleChange("penyelenggara")}
              error={errors.penyelenggara ? true : false}
              textColor={Colors.text_primary}
              label={"Penyelenggara *"}
              mode="outlined"
              outlineColor={Colors.border_primary}
              activeOutlineColor={Colors.border_input_active}
              style={{ backgroundColor: "white" }}
            />

            {errors.penyelenggara && (
              <Text style={{ color: "salmon", fontWeight: "bold" }}>
                {errors.penyelenggara}
              </Text>
            )}

            <TextInput
              value={values.tahun}
              inputMode="numeric"
              onChangeText={handleChange("tahun")}
              error={errors.tahun ? true : false}
              textColor={Colors.text_primary}
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

            <TextInput
              value={values.durasi}
              inputMode="numeric"
              onChangeText={handleChange("durasi")}
              error={errors.durasi ? true : false}
              label={"Durasi Pengembangan Kompetensi *"}
              textColor={Colors.text_primary}
              mode="outlined"
              outlineColor={Colors.border_primary}
              activeOutlineColor={Colors.border_input_active}
              style={{ backgroundColor: "white" }}
            />

            {errors.durasi && (
              <Text style={{ color: "salmon", fontWeight: "bold" }}>
                {errors.durasi}
              </Text>
            )}

            <TextInput
              value={values.nomor_sertifikat}
              onChangeText={handleChange("nomor_sertifikat")}
              error={errors.nomor_sertifikat ? true : false}
              textColor={Colors.text_primary}
              label={"Nomor Sertifikat/Surat Tugas *"}
              mode="outlined"
              outlineColor={Colors.border_primary}
              activeOutlineColor={Colors.border_input_active}
              style={{ backgroundColor: "white" }}
            />

            {errors.nomor_sertifikat && (
              <Text style={{ color: "salmon", fontWeight: "bold" }}>
                {errors.nomor_sertifikat}
              </Text>
            )}

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
                  color: dataInput.tgl_sertifikat ? "black" : "grey",
                  fontWeight: "400",
                  fontSize: 16,
                }}
              >
                {dataInput.tgl_sertifikat
                  ? dataInput.tgl_sertifikat
                  : "Tanggal Sertifikat *"}
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
                  {dataInput?.sertifikat_pdf?.name ??
                    "Upload Sertifikat/Dokumen Bukti Lainnya"}
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
        )}
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
  { value: "Kepemimpinan", label: "Kepemimpinan" },
  { value: "Fungsional", label: "Fungsional" },
  { value: "Teknis", label: "Teknis" },
  { value: "Lainnya", label: "Lainnya" },
];
