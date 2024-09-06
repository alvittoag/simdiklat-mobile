import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Button,
  Icon,
  Modal,
  Portal,
  Searchbar,
  TextInput,
} from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { moderateScale } from "react-native-size-matters";
import * as DocumentPicker from "expo-document-picker";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import ContainerBackground from "@/components/container/ContainerBackground";
import { router } from "expo-router";
import useDebounce from "@/hooks/useDebounce";
import { FlashList } from "@shopify/flash-list";

export default function IsianKhususAdd() {
  const queryClient = useQueryClient();
  const [selectValue, setSelectValue] = React.useState<{
    value: string;
    label: string;
  } | null>(null);
  const [dataLampiran, setDataLampiran] = React.useState({
    title: "",
    keterangan: "",
    file: null as any,
  });
  const [search, setsearch] = React.useState("");
  const searchVal = useDebounce(search, 500);
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const mutationAdd = useMutation({
    mutationFn: async (formData: FormData) => {
      return await axiosService.post(
        "/api/isian-khusus/lampiran/post",
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
        textBody: "Lampiran Berhasil Ditambahkan",
        button: "Tutup",
      });
      queryClient.invalidateQueries({ queryKey: ["isian-khusus"] });
      setDataLampiran({ title: "", keterangan: "", file: null });
      setSelectValue(null);
      router.back();
    },
    onError: (error) => {
      console.error("Error adding lampiran:", error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: error?.message || "Lampiran Gagal Ditambahkan",
        button: "Tutup",
      });
    },
  });

  const handleAddLampiran = async () => {
    const formData = new FormData();
    formData.append("jenis_id", selectValue?.value as string);
    formData.append("title", dataLampiran.title);
    formData.append("keterangan", dataLampiran.keterangan);

    if (dataLampiran.file) {
      const fileToUpload = {
        uri: dataLampiran.file.uri,
        type: dataLampiran.file.mimeType,
        name: dataLampiran.file.name,
      };
      formData.append("image", fileToUpload as any);
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
        setDataLampiran({
          ...dataLampiran,
          file: result.assets[0] as any,
        });
      }
    } catch (err) {
      console.log("Unknown error: ", err);
    }
  };

  const handleSearchChange = React.useCallback((text: string) => {
    setsearch(text);
  }, []);

  const filteredData = dataSelect.filter((item) =>
    item.label.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <ContainerBackground>
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
              {selectValue?.label ?? "Pilih Jenis Lampiran"}
            </Text>
            <Icon size={24} source={"open-in-new"} color="gray" />
          </TouchableOpacity>
        </View>

        <TextInput
          textColor={Colors.text_primary}
          value={dataLampiran.title}
          onChangeText={(text) =>
            setDataLampiran({ ...dataLampiran, title: text })
          }
          label={"Judul Dokumen *"}
          mode="outlined"
          outlineColor={Colors.border_primary}
          activeOutlineColor={Colors.border_input_active}
          style={{ backgroundColor: "white" }}
        />

        <TextInput
          textColor={Colors.text_primary}
          value={dataLampiran.keterangan}
          onChangeText={(text) =>
            setDataLampiran({ ...dataLampiran, keterangan: text })
          }
          label={"Keterangan *"}
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
            }}
          >
            <Text style={{ color: Colors.text_secondary }}>
              {dataLampiran?.file?.name ??
                "Upload Sertifikat/Dokumen Bukti Lainnya *"}
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
            onPress={handleAddLampiran}
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
                  borderBottomWidth: index === filteredData.length - 1 ? 0 : 1,
                  paddingBottom: index === filteredData.length - 1 ? 0 : 15,
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
    </ContainerBackground>
  );
}

const dataSelect = [
  { value: "6", label: "Pas Foto" },
  { value: "7", label: "Pas Foto" },
  { value: "8", label: "Pas Foto" },
  { value: "9", label: "Pas Foto" },
  { value: "10", label: "Pas Foto" },
];
