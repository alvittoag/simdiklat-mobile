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
    name_sekolah: dataParams.nama_sekolah,
    jurusan: dataParams.jurusan,
    tempat: dataParams.tempat,
    tahun_lulus: dataParams.tahun_lulus.toString(),
    keterangan: dataParams.keterangan,
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

  React.useEffect(() => {
    if (dataParams) {
      setDataInput({
        name_sekolah: dataParams.nama_sekolah || "",
        jurusan: dataParams.jurusan || "",
        tempat: dataParams.tempat || "",
        tahun_lulus: dataParams.tahun_lulus?.toString() || "",
        keterangan: dataParams.keterangan || "",
        ijazah_pdf: null,
      });

      const foundSelect = dataSelect.find(
        (item) => item.value === dataParams.jenis
      );
      setSelectValue(foundSelect || null);
    }
  }, [dataParams]);

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
        textBody: "Riwayat Pendidikan Berhasil Diupdate",
        button: "Tutup",
      });
      setDataInput({
        name_sekolah: "",
        jurusan: "",
        tempat: "",
        tahun_lulus: "",
        keterangan: "",
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
        textBody: error?.message || "Riwayat Pendidikan Gagal Diupdate",
        button: "Tutup",
      });
    },
  });

  const handleEdit = async () => {
    const formData = new FormData();
    formData.append("id", dataParams.id.toString());
    formData.append("jenis", selectValue?.value as string);
    formData.append("nama_sekolah", dataInput.name_sekolah);
    formData.append("jurusan", dataInput.jurusan);
    formData.append("tempat", dataInput.tempat);
    formData.append("tahun_lulus", dataInput.tahun_lulus);
    formData.append("keterangan", dataInput.keterangan);

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
          value={dataInput.name_sekolah}
          onChangeText={(text) =>
            setDataInput({ ...dataInput, name_sekolah: text })
          }
          textColor={Colors.text_primary}
          label={"Nama Sekolah/Universitas *"}
          mode="outlined"
          outlineColor={Colors.border_primary}
          activeOutlineColor={Colors.border_input_active}
          style={{ backgroundColor: "white" }}
        />

        <TextInput
          value={dataInput.jurusan}
          onChangeText={(text) => setDataInput({ ...dataInput, jurusan: text })}
          textColor={Colors.text_primary}
          label={"Jurusan/Program Studi *"}
          mode="outlined"
          outlineColor={Colors.border_primary}
          activeOutlineColor={Colors.border_input_active}
          style={{ backgroundColor: "white" }}
        />

        <TextInput
          value={dataInput.tempat}
          onChangeText={(text) => setDataInput({ ...dataInput, tempat: text })}
          textColor={Colors.text_primary}
          label={"Tempat Pendidikan *"}
          mode="outlined"
          outlineColor={Colors.border_primary}
          activeOutlineColor={Colors.border_input_active}
          style={{ backgroundColor: "white" }}
        />

        <TextInput
          value={dataInput.tahun_lulus}
          onChangeText={(text) =>
            setDataInput({ ...dataInput, tahun_lulus: text })
          }
          textColor={Colors.text_primary}
          inputMode="numeric"
          label={"Tahun Lulus *"}
          mode="outlined"
          outlineColor={Colors.border_primary}
          activeOutlineColor={Colors.border_input_active}
          style={{ backgroundColor: "white" }}
        />

        <TextInput
          value={dataInput.keterangan}
          onChangeText={(text) =>
            setDataInput({ ...dataInput, keterangan: text })
          }
          textColor={Colors.text_primary}
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
            onPress={handleEdit}
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
  { value: "SD", label: "SD/MI/Setara SD" },
  { value: "SLTP", label: "SMP/MTs/Setara SLTP" },
  { value: "SLTA", label: "SMA/STM/SMK/Setara SLTA" },
  { value: "D2", label: "Diploma II" },
  { value: "D3", label: "Diploma III" },
  { value: "S1", label: "S1/Sarjana" },
  { value: "S2", label: "S2/Master" },
  { value: "S3", label: "S3/Doktor" },
];
