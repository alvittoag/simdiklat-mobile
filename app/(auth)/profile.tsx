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
import { SafeAreaView } from "react-native-safe-area-context";
import Loading from "@/components/elements/Loading";
import Error from "@/components/elements/Error";

export default function Profile() {
  const { data, error, loading } = useQuery<{
    profilPesertaDiklat: IProfilePeserta;
  }>(getProfilePeserta);

  React.useEffect(() => {
    const getData = async () => {
      try {
        await auth.getSession();
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

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
            <Avatar.Text
              size={180}
              label={data?.profilPesertaDiklat.full_name.charAt(0) ?? ""}
              style={{
                backgroundColor: Colors.primary,
                borderWidth: 1,
                borderColor: Colors.border_primary,
              }}
            />

            <Button
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
