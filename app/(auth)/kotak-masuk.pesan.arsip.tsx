import { View, Text, useWindowDimensions, LogBox } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import ContainerBackground from "@/components/container/ContainerBackground";
import { moderateScale } from "react-native-size-matters";
import HTMLRenderer from "@/components/elements/HTMLRenderer";

export default function KotakMasukPesanArsip() {
  const { dari, pesan, subjek } = useLocalSearchParams();

  return (
    <ContainerBackground>
      <View
        style={{
          paddingHorizontal: moderateScale(15),
          paddingVertical: moderateScale(20),
          gap: moderateScale(20),
        }}
      >
        <View style={{ gap: moderateScale(5) }}>
          <Text style={{ fontWeight: 400, fontSize: 16 }}>Dari</Text>
          <Text style={{ fontWeight: 600, fontSize: 16 }}>{dari}</Text>
        </View>

        <View style={{ gap: moderateScale(5) }}>
          <Text style={{ fontWeight: 400, fontSize: 16 }}>Subjek</Text>
          <Text style={{ fontWeight: 600, fontSize: 16 }}>{subjek}</Text>
        </View>

        <View>
          <Text style={{ fontWeight: 400, fontSize: 16 }}>Isi Pesan</Text>

          <HTMLRenderer html={pesan as string} fontWeight="500" />
        </View>
      </View>
    </ContainerBackground>
  );
}
