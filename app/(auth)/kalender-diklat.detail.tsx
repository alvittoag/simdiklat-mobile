import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import ContainerBackground from "@/components/container/ContainerBackground";
import { moderateScale } from "react-native-size-matters";
import { useQuery } from "@apollo/client";
import { IKalenderDiklatList } from "@/type";
import Loading from "@/components/elements/Loading";
import Error from "@/components/elements/Error";
import { getKalenderDiklatDetail } from "@/services/query/get-kalender";
import parseLongText from "@/lib/parseLongText";

export default function KalenderDiklatDetail() {
  const { id } = useLocalSearchParams();

  const { data, loading, error } = useQuery<{
    kalenderDiklat: IKalenderDiklatList;
  }>(getKalenderDiklatDetail, {
    variables: { id: Number(id) },
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
              {data?.kalenderDiklat.diklat.name === " "
                ? "-"
                : data?.kalenderDiklat.diklat.name}
            </Text>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Jumlah Angkatan
            </Text>
            <Text style={{ fontSize: 16 }}>
              {data?.kalenderDiklat.jumlah_angkatan}
            </Text>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Jumlah Peserta
            </Text>
            <Text style={{ fontSize: 16 }}>
              {data?.kalenderDiklat.jumlah_peserta}
            </Text>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Durasi Hari
            </Text>
            <Text style={{ fontSize: 16 }}>
              {data?.kalenderDiklat.durasi_hari}
            </Text>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Waktu Pelaksanaan
            </Text>
            <Text style={{ fontSize: 16 }}>
              {data?.kalenderDiklat.waktu_pelaksanaan === " "
                ? "-"
                : data?.kalenderDiklat.waktu_pelaksanaan}
            </Text>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Tujuan</Text>
            <Text style={{ fontSize: 16 }}>
              {data?.kalenderDiklat.tujuan == " "
                ? "-"
                : data?.kalenderDiklat.tujuan}
            </Text>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Persyaratan
            </Text>
            <View>
              {data?.kalenderDiklat.persyaratan === " " ? (
                <Text style={{ fontSize: 16 }}>-</Text>
              ) : (
                parseLongText({
                  data: data?.kalenderDiklat.persyaratan,
                })
              )}
            </View>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Keterangan</Text>
            <Text style={{ fontSize: 16 }}>
              {data?.kalenderDiklat.keterangan === " "
                ? "-"
                : data?.kalenderDiklat.keterangan}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ContainerBackground>
  );
}
