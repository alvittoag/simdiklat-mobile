import { View, Text, TouchableOpacity } from "react-native";
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

export default function KompetensiLainnyaAdd() {
  const [dataInput, setDataInput] = React.useState({
    keterangan: "",
    penyelenggara: "",
    tahun: "",
    durasi: "",
    nomor_sertifikat: "",
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
        keterangan: "",
        penyelenggara: "",
        tahun: "",
        durasi: "",
        nomor_sertifikat: "",
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
  });

  const handleAdd = async () => {
    const formData = new FormData();
    formData.append("keterangan", dataInput.keterangan);
    formData.append("jenis", selectValue?.value as string);
    formData.append("penyelenggara", dataInput.penyelenggara);
    formData.append("tahun", dataInput.tahun);
    formData.append("durasi", dataInput.durasi);
    formData.append("nomor_sertifikat", dataInput.nomor_sertifikat);
    formData.append("tgl_sertifikat", dataInput.tgl_sertifikat);

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
    <View>
      <View
        style={{
          gap: moderateScale(20),
          paddingHorizontal: moderateScale(15),
          paddingVertical: moderateScale(20),
        }}
      >
        <TextInput
          value={dataInput.keterangan}
          onChangeText={(text) =>
            setDataInput({ ...dataInput, keterangan: text })
          }
          textColor={Colors.text_primary}
          label={"Nama Pengembangan Kompetensi *"}
          mode="outlined"
          outlineColor={Colors.border_primary}
          activeOutlineColor={Colors.border_input_active}
          style={{ backgroundColor: "white" }}
        />

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
          value={dataInput.penyelenggara}
          onChangeText={(text) =>
            setDataInput({ ...dataInput, penyelenggara: text })
          }
          textColor={Colors.text_primary}
          label={"Penyelenggara *"}
          mode="outlined"
          outlineColor={Colors.border_primary}
          activeOutlineColor={Colors.border_input_active}
          style={{ backgroundColor: "white" }}
        />

        <TextInput
          value={dataInput.tahun}
          inputMode="numeric"
          onChangeText={(text) => setDataInput({ ...dataInput, tahun: text })}
          textColor={Colors.text_primary}
          label={"Tahun *"}
          mode="outlined"
          outlineColor={Colors.border_primary}
          activeOutlineColor={Colors.border_input_active}
          style={{ backgroundColor: "white" }}
        />

        <TextInput
          value={dataInput.durasi}
          inputMode="numeric"
          onChangeText={(text) => setDataInput({ ...dataInput, durasi: text })}
          textColor={Colors.text_primary}
          label={"Durasi Pengembangan Kompetensi *"}
          mode="outlined"
          outlineColor={Colors.border_primary}
          activeOutlineColor={Colors.border_input_active}
          style={{ backgroundColor: "white" }}
        />

        <TextInput
          value={dataInput.nomor_sertifikat}
          onChangeText={(text) =>
            setDataInput({ ...dataInput, nomor_sertifikat: text })
          }
          textColor={Colors.text_primary}
          label={"Nomor Sertifikat/Surat Tugas *"}
          mode="outlined"
          outlineColor={Colors.border_primary}
          activeOutlineColor={Colors.border_input_active}
          style={{ backgroundColor: "white" }}
        />

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
            onPress={handleAdd}
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
    </View>
  );
}

const dataSelect = [
  { value: "Kepemimpinan", label: "Kepemimpinan" },
  { value: "Fungsional", label: "Fungsional" },
  { value: "Teknis", label: "Teknis" },
  { value: "Lainnya", label: "Lainnya" },
];
