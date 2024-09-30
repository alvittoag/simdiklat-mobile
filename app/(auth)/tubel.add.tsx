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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { router, useLocalSearchParams } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";

export default function TubelAdd() {
  const queryClient = useQueryClient();
  const { peserta_id, voucher_id, semester }: any = useLocalSearchParams();
  const [dataInput, setDataInput] = React.useState({
    jenis: "",
    title: "",
    semester: "",
    laporan: null as any,
  });
  const [selectValue, setSelectValue] = React.useState<{
    value: string;
    label: string;
  } | null>(null);
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
      return await axiosService.post("/api/tubel/laporan/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: "Laporan Tubel Berhasil Ditambahkan",
        button: "Tutup",
      });
      setDataInput({
        jenis: "",
        title: "",
        laporan: null as any,
        semester: "",
      });
      setSelectValue(null);
      queryClient.invalidateQueries({ queryKey: ["tubel-laporan"] });
      router.back();
    },
    onError: (error) => {
      console.error("Error adding tubel:", error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: error?.message || "Laporan Tubel Gagal Ditambahkan",
        button: "Tutup",
      });
    },
  });

  const handleAdd = async () => {
    if (!selectValue) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Peringatan",
        textBody: "Jenis File harus dipilih",
        button: "Tutup",
      });
    }

    if (dataInput.title === "") {
      return Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Peringatan",
        textBody: "Judul/Nama File harus diisi",
        button: "Tutup",
      });
    }

    if (dataInput.semester === "") {
      return Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Peringatan",
        textBody: "Semester harus dipilih",
        button: "Tutup",
      });
    }

    if (!dataInput.laporan) {
      return Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Peringatan",
        textBody: "File Laporan harus dipilih",
        button: "Tutup",
      });
    }

    const formData = new FormData();

    formData.append("peserta_id", peserta_id as string);
    formData.append("voucher_id", voucher_id as string);
    formData.append("jenis_id", selectValue?.value as string);
    formData.append("title", dataInput.title);
    formData.append("semester", dataInput.semester);

    if (dataInput.laporan) {
      const fileToUpload = {
        uri: dataInput.laporan.uri,
        type: dataInput.laporan.mimeType,
        name: dataInput.laporan.name,
      };
      formData.append("laporan", fileToUpload as any);
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
          laporan: result.assets[0] as any,
        });
      }
    } catch (err) {
      console.log("Unknown error: ", err);
    }
  };

  const semesterLoopong = () => {
    let data = [];
    for (let i = 1; i <= semester; i++) {
      data.push({
        label: `Semester ${i}`,
        value: `${i}`,
      });
    }
    return data;
  };

  const filteredData = dataSelect.filter((item) =>
    item.label.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <ScrollView>
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
              {selectValue?.label ?? "Jenis File *"}
            </Text>
            <Icon size={24} source={"open-in-new"} color="gray" />
          </TouchableOpacity>
        </View>

        <TextInput
          value={dataInput.title}
          onChangeText={(text) => setDataInput({ ...dataInput, title: text })}
          textColor={Colors.text_primary}
          label={"Judul/Nama File *"}
          mode="outlined"
          outlineColor={Colors.border_primary}
          activeOutlineColor={Colors.border_input_active}
          style={{ backgroundColor: "white" }}
        />

        <Dropdown
          value={dataInput.semester}
          onChange={({ value }) =>
            setDataInput({ ...dataInput, semester: value })
          }
          style={{
            backgroundColor: "white",
            borderWidth: 1,
            borderRadius: 7,
            borderColor: Colors.border_primary,
            paddingVertical: 16,
            paddingHorizontal: 15,
            marginTop: 10,
          }}
          placeholderStyle={{ color: Colors.text_secondary }}
          placeholder="Pilih Semester *"
          labelField="label"
          valueField="value"
          data={semesterLoopong()}
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
              {dataInput?.laporan?.name ?? "File Laporan *"}
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
    </ScrollView>
  );
}

const dataSelect = [
  { value: "1", label: "Jurnal Ilmiah" },
  { value: "2", label: "Tesis" },
  { value: "3", label: "Ijazah" },
  { value: "4", label: "Transkrip Nilai" },
];
