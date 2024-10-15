import React from "react";
import { View, Text, ScrollView } from "react-native";
import ContainerBackground from "@/components/container/ContainerBackground";
import { moderateScale, scale } from "react-native-size-matters";
import { Avatar, Button } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { useQuery, gql } from "@apollo/client";
import { IProfilePeserta, ISession } from "@/type";
import { getProfilePeserta } from "@/services/query/getProfilePeserta";
import Loading from "@/components/elements/Loading";
import Error from "@/components/elements/Error";
import * as DocumentPicker from "expo-document-picker";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import {
  useQuery as UseQ,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import auth from "@/services/api/auth";

type response = {
  message: string;
  status: string;
  data: string;
};

export default function Profile() {
  const [isPickerBusy, setIsPickerBusy] = React.useState(false);
  const queryClient = useQueryClient();

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

  const { data: session, isPending: isPendingsession } = UseQ({
    queryKey: ["session-key"],
    queryFn: async () => {
      const { data }: { data: ISession } = await auth.getSession();
      return data;
    },
  });

  const { mutate, isPending: isPendingUpload } = useMutation({
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
        textBody: "Foto Profile Berhasil Diperbarui",
        button: "Tutup",
      });
      refetch();
      queryClient.invalidateQueries({ queryKey: ["poto-profile"] });
    },
    onError: (err) => {
      console.error("Upload error:", err);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal ",
        textBody: "Foto Profile Gagal Diperbarui. Silakan coba lagi.",
        button: "Tutup",
      });
    },
  });

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
    }
  };

  // Panggil fungsi ini sebelum membuka ImagePicker
  React.useEffect(() => {
    requestPermissions();
  }, []);

  const imagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      aspect: [4, 3],
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const photo = result.assets[0];

      const formData = new FormData();

      formData.append("photo", {
        uri: photo.uri,
        type: photo.mimeType,
        name: photo.fileName,
      } as any);

      formData.append("user_id", session?.user.id as string);

      mutate(formData);
    }
  };

  // const handleDocumentPick = React.useCallback(async () => {
  //   if (isPickerBusy) return;

  //   setIsPickerBusy(true);

  //   try {
  //     const result = await DocumentPicker.getDocumentAsync({
  //       type: ["image/*"],
  //       copyToCacheDirectory: false,
  //     });

  //     if (!result.canceled && result.assets.length > 0) {
  //       const photo = result.assets[0];
  //       const formData = new FormData();

  //       formData.append("photo", {
  //         uri: photo.uri,
  //         type: photo.mimeType || "image/jpeg",
  //         name: `${photo.name}-${new Date().getTime()}` || "photo.jpg",
  //       } as any);

  //       mutate(formData);
  //     }
  //   } catch (err) {
  //     console.error("Document pick error:", err);
  //     Dialog.show({
  //       type: ALERT_TYPE.DANGER,
  //       title: "Error",
  //       textBody: "Terjadi kesalahan saat memilih foto. Silakan coba lagi.",
  //       button: "Tutup",
  //     });
  //   } finally {
  //     setIsPickerBusy(false);
  //   }
  // }, [isPickerBusy, mutate]);

  if (loading || isPending || isPendingsession) {
    return <Loading />;
  }

  if (error || isError) {
    return <Error />;
  }

  const photoUri = photo?.data
    ? `http://10.15.43.236:8080/api/file/${photo.data}`
    : undefined;

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
              source={{ uri: photoUri }}
              style={{
                backgroundColor: Colors.primary,
              }}
            />

            <Button
              loading={isPendingUpload}
              mode="contained"
              labelStyle={{ color: "black" }}
              onPress={imagePick}
              icon="camera"
              textColor="black"
              disabled={isPickerBusy || isPendingUpload}
              style={{
                backgroundColor: Colors.button_secondary,
                borderRadius: 7,
                paddingVertical: moderateScale(8),
                width: scale(180),
              }}
            >
              Ganti Photo
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
