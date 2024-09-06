import { View, Text } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "@/constants/Colors";
import { Button } from "react-native-paper";
import SearchBar from "@/components/sections/SearchBar";
import { router } from "expo-router";

export default function AksiLearningTahapan() {
  const [search, setSearch] = React.useState("");

  const handleSearch = () => {};
  return (
    <ContainerBackground>
      <SearchBar
        handleSearchChange={handleSearch}
        search={search}
        showDialog={() => {}}
      />

      <View
        style={{
          paddingHorizontal: moderateScale(15),
          paddingVertical: moderateScale(20),
        }}
      >
        <View
          style={{
            paddingVertical: moderateScale(20),
            paddingHorizontal: moderateScale(15),
            borderWidth: 1,
            borderRadius: 7,
            borderColor: Colors.border_primary,
            gap: moderateScale(15),
          }}
        >
          <View style={{ gap: 5 }}>
            <Text style={{ color: Colors.text_secondary }}>Tahapan</Text>

            <Text
              style={{
                color: Colors.text_primary,
                fontWeight: "bold",
                fontSize: 15,
              }}
            >
              Tahap 1 : Internalisasi Nilai-Nilai Dasar Profesi PNS
            </Text>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ color: Colors.text_secondary }}>Catatan</Text>

            <Text
              style={{
                color: Colors.text_primary,
                fontWeight: "bold",
                fontSize: 15,
              }}
            >
              Tahap pembelajaran ini membekali peserta dengan nilai-nilai dasar
              yang dibutuhkan dalam menjalankan tugas jabatan Profesi PNS secara
              profesional sebagai pelayanan masyarakat. Nilai-Nilai dasar
              tersebut meliputi: Akuntabilitas, Nasionalisme, Etika, Komintmen
              Mutu dan Anti Korupsi. Kelima nilai-nilai dasar ini diakronimkan
              menjadi ANEKA
            </Text>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ color: Colors.text_secondary }}>Tanggal Mulai</Text>

            <Text
              style={{
                color: Colors.text_primary,
                fontWeight: "bold",
                fontSize: 15,
              }}
            >
              15 April 2023
            </Text>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={{ color: Colors.text_secondary }}>
              Tanggal Selesai
            </Text>

            <Text
              style={{
                color: Colors.text_primary,
                fontWeight: "bold",
                fontSize: 15,
              }}
            >
              15 April 2023
            </Text>
          </View>

          <Button
            onPress={() =>
              router.push({
                pathname: "/aksi-learning.aktivitas",
                params: { id: 1 },
              })
            }
            icon={"account"}
            mode="contained"
            textColor="black"
            style={{
              backgroundColor: Colors.button_secondary,
              borderRadius: 7,
              paddingVertical: 5,
            }}
          >
            Setup Aktivitas
          </Button>
        </View>
      </View>
    </ContainerBackground>
  );
}
