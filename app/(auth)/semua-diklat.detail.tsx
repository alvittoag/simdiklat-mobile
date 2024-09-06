import {
  View,
  Text,
  ScrollView,
  Linking,
  useWindowDimensions,
  LogBox,
} from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@apollo/client";
import { ISedangDiikuti } from "@/type";
import Loading from "@/components/elements/Loading";
import Error from "@/components/elements/Error";
import { detailAdministrasiDiklat } from "@/services/query/get-diklat";
import ContainerBackground from "@/components/container/ContainerBackground";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "@/constants/Colors";
import { parseDateLong } from "@/lib/parseDate";
import HTMLRenderer from "@/components/elements/HTMLRenderer";

LogBox.ignoreLogs([
  "TNodeChildrenRenderer: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
]);

export default function SemuaDiklatDetail() {
  const { id } = useLocalSearchParams();

  const { data, loading, error } = useQuery<{
    pesertaDiklat: ISedangDiikuti;
  }>(detailAdministrasiDiklat, {
    variables: { jadwal_diklat_id: Number(id) },
  });

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
            paddingVertical: moderateScale(20),
            gap: moderateScale(20),
          }}
        >
          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Kelompok Diklat
            </Text>
            <Text style={{ fontSize: 16 }}>
              {data?.pesertaDiklat.jadwal_diklat?.diklat.name === " "
                ? "-"
                : data?.pesertaDiklat.jadwal_diklat?.diklat.name}
            </Text>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Lokasi</Text>
            <Text style={{ fontSize: 16 }}>
              {data?.pesertaDiklat.jadwal_diklat.lokasi_diklat
                ? data?.pesertaDiklat.jadwal_diklat.lokasi_diklat.alamat
                : "-"}
            </Text>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Jadwal Akhir Registrasi
            </Text>
            <Text style={{ fontSize: 16 }}>
              {parseDateLong(
                data?.pesertaDiklat.jadwal_diklat.registrasi_selesai as string
              )}
            </Text>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Jadwal Mulai Diklat
            </Text>
            <Text style={{ fontSize: 16 }}>
              {parseDateLong(
                data?.pesertaDiklat.jadwal_diklat.jadwal_mulai as string
              )}
            </Text>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Status Registrasi
            </Text>
            <Text style={{ fontSize: 16 }}>
              {data?.pesertaDiklat.jadwal_diklat.status_registrasi === "open"
                ? "Buka"
                : "Tutup"}
            </Text>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Keterangan</Text>
            <HTMLRenderer
              html={data?.pesertaDiklat.jadwal_diklat.keterangan as string}
            />
          </View>

          <View
            style={{
              backgroundColor: "#f0f0f0",
              paddingVertical: moderateScale(50),
              borderWidth: 1,
              borderColor: Colors.border_primary,
              borderRadius: 7,
            }}
          >
            <Text
              style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}
            >
              Status Anda :{" "}
              {data?.pesertaDiklat.status === "accept" ? "Diterima" : "Ditolak"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ContainerBackground>
  );
}
