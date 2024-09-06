import { View, Text } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import AppHeader from "@/components/AppHeader";
import SearchBar from "@/components/sections/SearchBar";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "@/constants/Colors";
import { Button } from "react-native-paper";
import { router } from "expo-router";

export default function PodcastPerangkatDaerahList() {
  return (
    <ContainerBackground>
      <AppHeader title="Daftar Podcast Rabu Belajar" />
      <SearchBar
        handleSearchChange={() => {}}
        search={""}
        showDialog={() => {}}
      />

      <View
        style={{
          paddingVertical: moderateScale(20),
          paddingHorizontal: moderateScale(15),
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: moderateScale(15),
            borderWidth: 1,
            borderColor: Colors.border_primary,
            borderRadius: 7,
            gap: moderateScale(15),
          }}
        >
          <View style={{ gap: moderateScale(3) }}>
            <Text style={{ color: Colors.text_secondary }}>Episode</Text>

            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: Colors.text_primary,
              }}
            >
              131
            </Text>
          </View>

          <View style={{ gap: moderateScale(3) }}>
            <Text style={{ color: Colors.text_secondary }}>Tema</Text>

            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: Colors.text_primary,
              }}
            >
              Mengenal Hiperbarik Oksigen Terapi dan Manfaatnya bagi kesehatan
            </Text>
          </View>

          <View style={{ gap: moderateScale(3) }}>
            <Text style={{ color: Colors.text_secondary }}>Jadwal</Text>

            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: Colors.text_primary,
              }}
            >
              28 Februari 2024 09.00 - 15.00
            </Text>
          </View>

          <View style={{ gap: moderateScale(3) }}>
            <Text style={{ color: Colors.text_secondary }}>Thumbnail</Text>

            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: Colors.text_primary,
              }}
            >
              -
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: moderateScale(10) }}>
            <Button
              onPress={() =>
                router.push({
                  pathname: "/podcast-perangkat-daerah.detail",
                  params: { id: 1 },
                })
              }
              icon={"play"}
              textColor="black"
              mode="contained"
              style={{
                flex: 1,
                backgroundColor: Colors.button_secondary,
                borderRadius: 7,
                paddingVertical: 6,
              }}
            >
              Lihat
            </Button>

            <Button
              icon={"download"}
              mode="contained"
              textColor="white"
              style={{
                flex: 1,
                backgroundColor: Colors.button_primary,
                borderRadius: 7,
                paddingVertical: 6,
              }}
            >
              Sertifikat
            </Button>
          </View>
        </View>
      </View>
    </ContainerBackground>
  );
}
