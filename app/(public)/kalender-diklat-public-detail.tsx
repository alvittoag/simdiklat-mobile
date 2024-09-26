import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import ContainerBackground from "@/components/container/ContainerBackground";
import { moderateScale } from "react-native-size-matters";
import { IKalenderDiklatList } from "@/type";
import parseLongText from "@/lib/parseLongText";
import AppHeader from "@/components/AppHeader";
import { Icon } from "react-native-paper";

export default function KalenderDiklatDetail() {
  const dataParams = useLocalSearchParams();

  const data: IKalenderDiklatList = JSON.parse(dataParams?.data as string);

  return (
    <ContainerBackground>
      <AppHeader title="Kalender Diklat Detail" />
      <View
        style={{
          paddingHorizontal: 15,
          paddingVertical: 20,
          backgroundColor: "red",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Icon size={28} source={"information"} />
        <Text
          style={{
            fontSize: 16,
            color: "white",
            paddingRight: 30,
          }}
        >
          Informasi Penting : Untuk dapat mendaftar diklat anda harus login
          terlebih dahulu.
        </Text>
      </View>
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
              {data?.diklat.name === " " ? "-" : data?.diklat.name}
            </Text>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Jumlah Angkatan
            </Text>
            <Text style={{ fontSize: 16 }}>{data?.jumlah_angkatan}</Text>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Jumlah Peserta
            </Text>
            <Text style={{ fontSize: 16 }}>{data?.jumlah_peserta}</Text>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Durasi Hari
            </Text>
            <Text style={{ fontSize: 16 }}>{data?.durasi_hari}</Text>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Waktu Pelaksanaan
            </Text>
            <Text style={{ fontSize: 16 }}>
              {data?.waktu_pelaksanaan === " " ? "-" : data?.waktu_pelaksanaan}
            </Text>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Tujuan</Text>
            <Text style={{ fontSize: 16 }}>
              {data?.tujuan == " " ? "-" : data?.tujuan}
            </Text>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Persyaratan
            </Text>
            <View>
              {data?.persyaratan === " " ? (
                <Text style={{ fontSize: 16 }}>-</Text>
              ) : (
                parseLongText({
                  data: data?.persyaratan,
                })
              )}
            </View>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Keterangan</Text>
            <Text style={{ fontSize: 16 }}>
              {data?.keterangan === " " ? "-" : data?.keterangan}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ContainerBackground>
  );
}
