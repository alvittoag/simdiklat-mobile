import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import assets from "@/assets";
import { moderateScale } from "react-native-size-matters";
import { Button } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

export default function PodcastPerangkatDaerah() {
  return (
    <ContainerBackground>
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: moderateScale(15),
            paddingVertical: moderateScale(20),
            borderBottomWidth: 1,
            borderBottomColor: Colors.border_primary,
          }}
        >
          <View style={{ gap: moderateScale(15) }}>
            <View>
              <Text style={{ fontSize: 15 }}>Nama Podcast</Text>
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                Podcast Rabu Belajar
              </Text>
            </View>

            <View>
              <Text style={{ fontSize: 15 }}>Penyelenggara</Text>
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>BPSDM</Text>
            </View>

            <Button
              onPress={() =>
                router.push({
                  pathname: "/podcast-perangkat-daerah.list",
                  params: { id: 1 },
                })
              }
              textColor="black"
              icon={"format-list-bulleted"}
              mode="contained"
              style={{
                backgroundColor: Colors.button_secondary,
                borderRadius: 5,
                paddingVertical: 4,
              }}
            >
              Lihat
            </Button>
          </View>

          <Image
            resizeMode="contain"
            source={assets.podasct}
            style={{ width: 150, height: 150 }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: moderateScale(15),
            paddingVertical: moderateScale(20),
            borderBottomWidth: 1,
            borderBottomColor: Colors.border_primary,
          }}
        >
          <View style={{ gap: moderateScale(15) }}>
            <View>
              <Text style={{ fontSize: 15 }}>Nama Podcast</Text>
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                Podcast Kopi Sedap
              </Text>
            </View>

            <View>
              <Text style={{ fontSize: 15 }}>Penyelenggara</Text>
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>BPKD</Text>
            </View>

            <Button
              onPress={() =>
                router.push({
                  pathname: "/podcast-perangkat-daerah.kopi-sedap",
                  params: { id: 1 },
                })
              }
              textColor="black"
              icon={"format-list-bulleted"}
              mode="contained"
              style={{
                backgroundColor: Colors.button_secondary,
                borderRadius: 5,
                paddingVertical: 4,
              }}
            >
              Lihat
            </Button>
          </View>

          <Image
            resizeMode="contain"
            source={assets.kopi_sedap}
            style={{ width: 130, height: 130 }}
          />
        </View>
      </ScrollView>
    </ContainerBackground>
  );
}
