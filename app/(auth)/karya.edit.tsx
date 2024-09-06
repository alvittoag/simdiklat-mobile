import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { moderateScale } from "react-native-size-matters";
import { Button, Icon, TextInput } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { useMutation } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { router, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { IKaryTulisUser } from "@/type";

export default function karyaAdd() {
  const params = useLocalSearchParams();

  const dataParams: IKaryTulisUser = React.useMemo(() => {
    try {
      return JSON.parse(params?.data as string);
    } catch (error) {
      console.error("Error parsing params data:", error);
      return {} as IKaryTulisUser;
    }
  }, [params?.data]);

  const [dataInput, setDataInput] = React.useState({
    judul: "",
    tahun: "",
    tempat: "",
    keterangan: "",
  });

  React.useEffect(() => {
    if (dataParams) {
      setDataInput({
        judul: dataParams.judul || "",
        tahun: dataParams.tahun.toString() || "",
        tempat: dataParams.tempat || "",
        keterangan: dataParams.keterangan || "",
      });
    }
  }, [dataParams]);

  const mutationAdd = useMutation({
    mutationFn: async (formData: FormData) => {
      return await axiosService.put(
        "/api/data-kompetensi/karya-tulis/put",
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
        textBody: "Karya Tulis Berhasil Di Update",
        button: "Tutup",
      });
      setDataInput({
        judul: "",
        tahun: "",
        tempat: "",
        keterangan: "",
      });
      router.navigate({
        pathname: "/biodata-kompetensi",
        params: { data: "success" },
      });
    },
    onError: (error) => {
      console.error("Error adding karya:", error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: error?.message || "Karya Tulis Gagal Di Update",
        button: "Tutup",
      });
    },
  });
  const handleAdd = async () => {
    const formData = new FormData();
    formData.append("id", dataParams.id.toString());
    formData.append("judul", dataInput.judul);
    formData.append("tahun", dataInput.tahun);
    formData.append("tempat", dataInput.tempat);
    formData.append("keterangan", dataInput.keterangan);

    mutationAdd.mutate(formData);
  };

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
          value={dataInput.judul}
          onChangeText={(text) => setDataInput({ ...dataInput, judul: text })}
          textColor={Colors.text_primary}
          label={"Judul Kegiatan *"}
          mode="outlined"
          outlineColor={Colors.border_primary}
          activeOutlineColor={Colors.border_input_active}
          style={{ backgroundColor: "white" }}
        />

        <TextInput
          value={dataInput.tahun}
          onChangeText={(text) => setDataInput({ ...dataInput, tahun: text })}
          textColor={Colors.text_primary}
          label={"Tahun *"}
          inputMode="numeric"
          mode="outlined"
          outlineColor={Colors.border_primary}
          activeOutlineColor={Colors.border_input_active}
          style={{ backgroundColor: "white" }}
        />

        <TextInput
          value={dataInput.tempat}
          onChangeText={(text) => setDataInput({ ...dataInput, tempat: text })}
          textColor={Colors.text_primary}
          label={
            " Disampaikan / Dipublikasin pada Seminar / Mahalah / Koran / Website *"
          }
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
    </View>
  );
}
