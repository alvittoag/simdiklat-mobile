import { View, Text, Platform } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import AppHeaderNav from "@/components/AppHeaderNav";
import DataKompetensi from "@/components/sections/biodata-kompetensi/DataKompetensi";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "@/constants/Colors";
import { Button } from "react-native-paper";

export default function UpdateJpSiJule() {
  return (
    <ContainerBackground>
      <View
        style={{
          paddingVertical: moderateScale(20),
          paddingHorizontal: moderateScale(15),
          gap: moderateScale(20),
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            elevation: 3,
            paddingVertical: 20,
            borderRadius: 10,
            gap: moderateScale(5),
            borderWidth: Platform.OS === "ios" ? 1 : 0,
            borderColor: Colors.border_primary,
          }}
        >
          <Text
            style={{ textAlign: "center", fontSize: 19, fontWeight: "bold" }}
          >
            Data Sijule
          </Text>
          <Text style={{ textAlign: "center", fontSize: 17 }}>
            Riyan Adi Lesmana (185494)
          </Text>
        </View>

        <View
          style={{
            gap: moderateScale(20),
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              elevation: 3,
              padding: 20,
              borderRadius: 5,
              gap: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderWidth: Platform.OS === "ios" ? 1 : 0,
              borderColor: Colors.border_primary,
            }}
          >
            <View>
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                Leadership
              </Text>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>JP : 1</Text>
            </View>

            <Text style={{ fontSize: 15, fontWeight: 500 }}>2023-01-17</Text>
          </View>

          <View
            style={{
              backgroundColor: "white",
              elevation: 3,
              padding: 20,
              borderRadius: 5,
              gap: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderWidth: Platform.OS === "ios" ? 1 : 0,
              borderColor: Colors.border_primary,
            }}
          >
            <View>
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                Creative Thingking
              </Text>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>JP : 1</Text>
            </View>

            <Text style={{ fontSize: 15, fontWeight: 500 }}>2023-01-17</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 20,
            }}
          >
            <Button
              icon={"arrow-left"}
              mode="contained"
              textColor="white"
              style={{
                flex: 1,
                paddingVertical: 6,
                backgroundColor: Colors.button_primary,
              }}
            >
              Kembali
            </Button>

            <Button
              icon={"content-save-move-outline"}
              mode="contained"
              textColor="black"
              style={{
                flex: 1,
                paddingVertical: 6,
                backgroundColor: Colors.button_secondary,
              }}
            >
              Proses
            </Button>
          </View>
        </View>
      </View>
    </ContainerBackground>
  );
}
