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
import AppHeader from "@/components/AppHeader";
import { IPengumumanPublic } from "@/type";

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

export default function PengumumanDetail() {
  const { item } = useLocalSearchParams();

  console.log(item);

  const data: IPengumumanPublic = JSON.parse(item as string);

  return (
    <ContainerBackground>
      <AppHeader title="Pengumuman Seleksi Detail" />
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
            {data.title}
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
              {data.title}
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
              {parseDateLong(data.registrasi_mulai as string)}
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
              {data.status_registrasi === "open" ? "Buka" : "Tutup"}
            </Text>
          </View>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: Colors.border_primary,
            paddingVertical: moderateScale(15),
            paddingHorizontal: moderateScale(15),
            gap: moderateScale(25),
            borderRadius: moderateScale(7),
          }}
        >
          <View style={{ gap: moderateScale(10) }}>
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
              <Text
                style={{ fontWeight: "bold", color: Colors.text_secondary }}
              >
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
              <Text
                style={{ fontWeight: "bold", color: Colors.text_secondary }}
              >
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
          </View>

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
            Linking.openURL(
              `https://simdiklat-bpsdm.jakarta.go.id/sim-diklat/file/get/${data.files.file_path.replace(
                "/app/files/",
                ""
              )}`
            )
          }
          icon={"download"}
          textColor="white"
          style={{
            backgroundColor: Colors.primary,
            paddingVertical: moderateScale(9),
            borderRadius: 7,
          }}
        >
          Download SK Lampiran
        </Button>
      </ScrollView>
    </ContainerBackground>
  );
}
