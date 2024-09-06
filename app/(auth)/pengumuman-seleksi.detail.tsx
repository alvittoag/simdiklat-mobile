import { View, Text, ScrollView, Linking } from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@apollo/client";
import { getPengumumanDetail } from "@/services/query/get-pengumuman";
import Loading from "@/components/elements/Loading";
import Error from "@/components/elements/Error";
import ContainerBackground from "@/components/container/ContainerBackground";
import { Colors } from "@/constants/Colors";
import { moderateScale } from "react-native-size-matters";
import { Button } from "react-native-paper";
import { parseDateLong } from "@/lib/parseDate";

interface SeleksiWidyaiswara {
  id: number;
  title: string;
  tahun: number;
  registrasi_mulai: string;
  registrasi_selesai: string;
  keterangan: string;
  isOpen: boolean;
  file_pengumuman: string;
}

interface QueryData {
  seleksiWidyaiswara: SeleksiWidyaiswara;
}

export default function PengumumanSeleksiDetail() {
  const { id } = useLocalSearchParams();

  console.log(id);

  const { data, loading, error } = useQuery<QueryData>(getPengumumanDetail, {
    variables: { id: Number(id) },
  });

  console.log(data?.seleksiWidyaiswara);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <ContainerBackground>
      <ScrollView
        contentContainerStyle={{
          gap: moderateScale(25),
          paddingHorizontal: moderateScale(15),
          paddingVertical: moderateScale(20),
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: Colors.button_primary,
            padding: moderateScale(20),
            borderRadius: moderateScale(7),
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              lineHeight: 25,
              fontSize: 15,
            }}
          >
            {data?.seleksiWidyaiswara.title}
          </Text>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: Colors.border_primary,
            paddingVertical: moderateScale(15),
            paddingHorizontal: moderateScale(15),
            gap: moderateScale(15),
            borderRadius: moderateScale(7),
          }}
        >
          <View style={{ gap: 5 }}>
            <Text style={{ fontWeight: "bold", color: Colors.text_secondary }}>
              Judul Pengumuman
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: Colors.text_primary,
                fontWeight: "bold",
              }}
            >
              SELEKSI CALON PESERTA DUTCH TRAINING AND EXPOSURE PROGRAMME
              (DUTEP) TAHUN 2024
            </Text>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ fontWeight: "bold", color: Colors.text_secondary }}>
              Jadwal Mulai Registrasi
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: Colors.text_primary,
                fontWeight: "bold",
              }}
            >
              {parseDateLong(
                data?.seleksiWidyaiswara.registrasi_mulai as string
              )}
            </Text>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ fontWeight: "bold", color: Colors.text_secondary }}>
              Status Registrasi
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: Colors.text_primary,
                fontWeight: "bold",
              }}
            >
              {data?.seleksiWidyaiswara.isOpen ? "Buka" : "Tutup"}
            </Text>
          </View>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: Colors.border_primary,
            paddingVertical: moderateScale(15),
            paddingHorizontal: moderateScale(15),
            gap: moderateScale(15),
            borderRadius: moderateScale(7),
          }}
        >
          <View style={{ gap: 5 }}>
            <Text
              style={{
                fontWeight: "bold",
                color: Colors.text_red,
                fontSize: 16,
              }}
            >
              Catatan
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: Colors.text_primary,
              }}
            >
              Untuk dapat mendafar anda harus login terlebih dahulu ke
              SIM-Diklat dengan menggunakan
            </Text>
          </View>

          <View style={{ gap: 5, flexDirection: "row" }}>
            <Text style={{ fontWeight: "bold", color: Colors.text_secondary }}>
              Username:
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: Colors.text_red,
                fontWeight: "bold",
              }}
            >
              NRK (6 digit)
            </Text>
          </View>

          <View style={{ gap: 5, flexDirection: "row" }}>
            <Text style={{ fontWeight: "bold", color: Colors.text_secondary }}>
              Password:
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: Colors.text_red,
                fontWeight: "bold",
              }}
            >
              Password
            </Text>
          </View>

          <Button
            onPress={() => router.navigate("/halaman-utama")}
            icon={"home"}
            mode="contained"
            textColor="white"
            style={{
              backgroundColor: Colors.button_primary,
              paddingVertical: 7,
            }}
          >
            Halaman Utama
          </Button>

          <View style={{ gap: 5 }}>
            <Text
              style={{
                fontWeight: "bold",
                color: Colors.text_red,
                fontSize: 16,
              }}
            >
              Peringatan
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: Colors.text_primary,
              }}
            >
              Terkait isu keamanan, diwajibkan untuk setiap user Merubah
              password setelah berhasil login
            </Text>
          </View>
        </View>

        <Button
          onPress={() =>
            Linking.openURL(data?.seleksiWidyaiswara.file_pengumuman as string)
          }
          icon={"download"}
          textColor="white"
          style={{
            backgroundColor: Colors.primary,
            paddingVertical: moderateScale(9),
            borderRadius: 7,
          }}
        >
          Download Lampiran
        </Button>
      </ScrollView>
    </ContainerBackground>
  );
}
