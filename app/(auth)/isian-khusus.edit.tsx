import { View, Text, ScrollView, TouchableOpacity } from "react-native";
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
import * as DocumentPicker from "expo-document-picker";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import ContainerBackground from "@/components/container/ContainerBackground";
import { router, useLocalSearchParams } from "expo-router";
import { Lampiran } from "./isian-khusus";
import Loading from "@/components/elements/Loading";
import Error from "@/components/elements/Error";
import useDebounce from "@/hooks/useDebounce";
import { FlashList } from "@shopify/flash-list";

export interface LampiranResponse {
  status: "success" | "error";
  message: string;
  data: Lampiran;
}

export default function IsianKhususEdit() {
  const { id } = useLocalSearchParams<any>();

  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery({
    queryKey: [id],
    queryFn: async () => {
      const res = await axiosService.get<LampiranResponse>(
        `/api/isian-khusus/lampiran/get/${id}`
      );
      return res.data;
    },
  });

  const [selectValue, setSelectValue] = React.useState<{
    value: string;
    label: string;
  } | null>(null);
  const [dataLampiran, setDataLampiran] = React.useState({
    title: "",
    keterangan: "",
  });

  const [search, setsearch] = React.useState("");
  const searchVal = useDebounce(search, 500);
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  React.useEffect(() => {
    if (data?.data?.file) {
      setDataLampiran({
        title: data?.data?.file.title,
        keterangan: data?.data?.file.keterangan,
      });

      setSelectValue({ label: "Pas Photo", value: data?.data.jenis_id as any });
    }
  }, [data]);

  const mutationEdit = useMutation({
    mutationFn: async (formData: FormData) => {
      return await axiosService.put(
        "/api/isian-khusus/lampiran/put",
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
        textBody: "Lampiran Berhasil Di Edit",
        button: "Tutup",
      });
      queryClient.invalidateQueries({ queryKey: ["isian-khusus"] });
      router.back();
    },
    onError: (error) => {
      console.error("Error adding lampiran:", error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: "Lampiran Gagal Di Edit",
        button: "Tutup",
      });
    },
  });

  const handleEditLampiran = async () => {
    const formData = new FormData();
    formData.append("id", id as string);
    formData.append("file_id", data?.data.file_id as any);
    formData.append("jenis_id", "6");
    formData.append("title", dataLampiran.title as string);
    formData.append("keterangan", dataLampiran.keterangan as string);

    mutationEdit.mutate(formData);
  };

  const handleSearchChange = React.useCallback((text: string) => {
    setsearch(text);
  }, []);

  const filteredData = dataSelect.filter((item) =>
    item.label.toLowerCase().includes(searchVal.toLowerCase())
  );

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

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
        ></View>

        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Button
            loading={mutationEdit.isPending}
            disabled={mutationEdit.isPending}
            onPress={handleEditLampiran}
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
