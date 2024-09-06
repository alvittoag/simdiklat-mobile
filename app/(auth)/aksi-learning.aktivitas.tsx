import { View, Text } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import SearchBar from "@/components/sections/SearchBar";
import { moderateScale } from "react-native-size-matters";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Button } from "react-native-paper";

export default function AksiLearningAktivitas() {
  return (
    <ContainerBackground>
      <SearchBar
        handleSearchChange={() => {}}
        search={""}
        showDialog={() => {}}
      />
      <View
        style={{
          paddingVertical: moderateScale(20),
          paddingHorizontal: moderateScale(15),
          gap: moderateScale(20),
        }}
      >
        <Button
          onPress={() => router.push("/aksi-learning.create")}
          icon={"plus"}
          mode="contained"
          textColor="black"
          style={{
            backgroundColor: Colors.button_secondary,
            borderRadius: 7,
            paddingVertical: 7,
          }}
        >
          Tambah Aktivitas Baru
        </Button>

        <View>
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
              <Text style={{ color: Colors.text_secondary }}>Aktivitas</Text>

              <Text
                style={{
                  color: Colors.text_primary,
                  fontWeight: "bold",
                  fontSize: 15,
                }}
              >
                -
              </Text>
            </View>
            <View style={{ gap: 5 }}>
              <Text style={{ color: Colors.text_secondary }}>
                Tanggal Mulai
              </Text>

              <Text
                style={{
                  color: Colors.text_primary,
                  fontWeight: "bold",
                  fontSize: 15,
                }}
              >
                -
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
                -
              </Text>
            </View>
            <View style={{ gap: 5 }}>
              <Text style={{ color: Colors.text_secondary }}>Status</Text>

              <Text
                style={{
                  color: Colors.text_primary,
                  fontWeight: "bold",
                  fontSize: 15,
                }}
              >
                -
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ContainerBackground>
  );
}
