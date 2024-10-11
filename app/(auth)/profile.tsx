import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import { moderateScale, scale } from "react-native-size-matters";
import { Avatar, Button } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import auth from "@/services/api/auth";
import { gql, useQuery } from "@apollo/client";
import { IProfilePeserta } from "@/type";
import { getProfilePeserta } from "@/services/query/getProfilePeserta";
import Loading from "@/components/elements/Loading";
import Error from "@/components/elements/Error";
import * as DocumentPicker from "expo-document-picker";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { useQuery as UseQ, useMutation } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";

type response = {
  message: string;
  status: string;
  data: string;
};

export default function Profile() {
  const [isPickerBusy, setIsPickerBusy] = React.useState(false);
  const { data, error, loading } = useQuery<{
    profilPesertaDiklat: IProfilePeserta;
  }>(getProfilePeserta);

  const {
    data: photo,
    isPending,
    isError,
    refetch,
  } = UseQ({
    queryKey: ["poto-profile"],
    queryFn: async () => {
      const { data } = await axiosService.get<response>(
        "/api/change-profile/photo"
      );
      return data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (formData: FormData) => {
      return await axiosService.put("/api/change-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: "Foto Profil Berhasil Di Perbarui",
        button: "Tutup",
      });
      refetch();
    },
    onError: (err) => {
      console.log(err);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal ",
        textBody: "Foto Profil Gagal Di Perbarui",
        button: "Tutup",
      });
    },
  });

  const handleDocumentPick = React.useCallback(async () => {
    if (isPickerBusy) {
      return;
    }

    setIsPickerBusy(true);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        if (
          result.assets[0].mimeType !== "image/jpg" &&
          result.assets[0].mimeType !== "image/jpeg" &&
          result.assets[0].mimeType !== "image/png"
        ) {
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: "Gagal",
            textBody: "File harus berupa gambar",
            button: "Tutup",
          });
          return;
        }

        const photo = result.assets[0];
        const formData = new FormData();

        const fileToUpload = {
          uri: photo.uri,
          type: photo.mimeType,
          name: photo.name,
        };

        formData.append("photo", fileToUpload as any);

        mutate(formData);
      }
    } catch (err) {
      console.log("Unknown error: ", err);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody:
          "An error occurred while picking the document. Please try again.",
        button: "Close",
      });
    } finally {
      setIsPickerBusy(false);
    }
  }, [isPickerBusy, mutate]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <ContainerBackground>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            paddingHorizontal: moderateScale(15),
            paddingVertical: moderateScale(35),
            gap: moderateScale(20),
          }}
        >
          <View style={{ alignItems: "center", gap: moderateScale(25) }}>
            <Avatar.Image
              size={200}
              source={{
                uri: isPending
                  ? "#"
                  : `http://10.15.43.236:8080/api/file/${photo?.data}`,
              }}
              style={{
                backgroundColor: Colors.primary,
              }}
            />

            <Button
              onPress={handleDocumentPick}
              icon={"camera"}
              textColor="black"
              style={{
                backgroundColor: Colors.button_secondary,
                borderRadius: 7,
                paddingVertical: moderateScale(8),
                width: scale(180),
              }}
            >
              Ganti Foto
            </Button>
          </View>

          <View style={{ gap: moderateScale(10) }}>
            <View
              style={{
                backgroundColor: "white",
                paddingHorizontal: moderateScale(10),
                paddingVertical: moderateScale(15),
                borderWidth: 1,
                borderColor: Colors.border_primary,
                borderRadius: 7,
                gap: 2,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: 500 }}>Nama</Text>

              <Text style={{ fontSize: 16 }}>
                {data?.profilPesertaDiklat.full_name}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "white",
                paddingHorizontal: moderateScale(10),
                paddingVertical: moderateScale(15),
                borderWidth: 1,
                borderColor: Colors.border_primary,
                borderRadius: 7,
                gap: 2,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: 500 }}>NRK</Text>

              <Text style={{ fontSize: 16 }}>
                {data?.profilPesertaDiklat.nrk}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "white",
                paddingHorizontal: moderateScale(10),
                paddingVertical: moderateScale(15),
                borderWidth: 1,
                borderColor: Colors.border_primary,
                borderRadius: 7,
                gap: 2,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: 500 }}>NIP</Text>

              <Text style={{ fontSize: 16 }}>
                {data?.profilPesertaDiklat.nip}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "white",
                paddingHorizontal: moderateScale(10),
                paddingVertical: moderateScale(15),
                borderWidth: 1,
                borderColor: Colors.border_primary,
                borderRadius: 7,
                gap: 2,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: 500 }}>Jabatan</Text>

              <Text style={{ fontSize: 16 }}>
                {data?.profilPesertaDiklat.nama_jabatan}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "white",
                paddingHorizontal: moderateScale(10),
                paddingVertical: moderateScale(15),
                borderWidth: 1,
                borderColor: Colors.border_primary,
                borderRadius: 7,
                gap: 2,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: 500 }}>Unit Kerja</Text>

              <Text style={{ fontSize: 16 }}>
                {data?.profilPesertaDiklat.nama_uke}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "white",
                paddingHorizontal: moderateScale(10),
                paddingVertical: moderateScale(15),
                borderWidth: 1,
                borderColor: Colors.border_primary,
                borderRadius: 7,
                gap: 2,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: 500 }}>JP</Text>

              <Text style={{ fontSize: 16 }}>
                {data?.profilPesertaDiklat.jp}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "white",
                paddingHorizontal: moderateScale(10),
                paddingVertical: moderateScale(15),
                borderWidth: 1,
                borderColor: Colors.border_primary,
                borderRadius: 7,
                gap: 2,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: 500 }}>IP ASN</Text>

              <Text style={{ fontSize: 16 }}>
                {data?.profilPesertaDiklat.skor_ipasn}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ContainerBackground>
  );
}
