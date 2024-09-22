import {
  View,
  Text,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Link, router, useLocalSearchParams } from "expo-router";
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
import { IPengumuman, IPengumumanPublic } from "@/type";

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

export default function PengumumanSeleksiLampiran() {
  const { item } = useLocalSearchParams();

  const data: IPengumuman = JSON.parse(item as string);

  console.log(data.seleksi_widyaiswara.title);

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
            {data.seleksi_widyaiswara.title}
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
              {data.seleksi_widyaiswara.title}
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
                data.seleksi_widyaiswara.registrasi_mulai as string
              )}
            </Text>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ fontWeight: "bold", color: Colors.text_secondary }}>
              Jadwal Selesai Registrasi
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: Colors.text_primary,
                fontWeight: "bold",
              }}
            >
              {parseDateLong(
                data.seleksi_widyaiswara.registrasi_selesai as string
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
              {data.seleksi_widyaiswara.status_registrasi === "open"
                ? "Buka"
                : "Tutup"}
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
            backgroundColor: Colors.button_primary,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: Colors.text_white,
              fontWeight: 500,
            }}
          >
            Daftar Lampiran
          </Text>

          <View style={{ gap: 15 }}>
            {data.lampiran?.map((i, index) => (
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    `https://simdiklat-bpsdm.jakarta.go.id/sim-diklat/download/file/${i.files.id}`
                  )
                }
                key={i.id}
                style={{
                  padding: 10,
                  backgroundColor: "#FFD700",
                  flexDirection: "row",
                  gap: 6,
                  borderRadius: 7,
                }}
              >
                <Text style={{ fontWeight: 500, fontSize: 15 }}>
                  {index + 1}.
                </Text>

                <View style={{ gap: 5 }}>
                  <Text
                    style={{ paddingRight: 20, fontWeight: 500, fontSize: 15 }}
                  >
                    {i.files.keterangan}
                  </Text>

                  <Text
                    style={{ paddingRight: 15, fontWeight: 500, fontSize: 15 }}
                  >
                    Tanggal Input: {parseDateLong(i.created_at)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button
          onPress={() => router.back()}
          icon={"arrow-left"}
          textColor="white"
          style={{
            backgroundColor: Colors.button_primary,
            paddingVertical: moderateScale(9),
            borderRadius: 7,
          }}
        >
          Kembali
        </Button>
      </ScrollView>
    </ContainerBackground>
  );
}
