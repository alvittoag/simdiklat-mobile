import { View, Text, Image } from "react-native";
import React from "react";
import assets from "@/assets";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export default function HeaderLogin() {
  return (
    <View style={{ gap: moderateScale(10) }}>
      <Image
        source={assets.logo_bpsdm}
        style={{ width: scale(200), height: verticalScale(58) }}
      />

      <Text
        style={{
          fontSize: moderateScale(18),
          fontWeight: "bold",
          color: "#1F007C",
        }}
      >
        Sistem Informasi Kediklatan
      </Text>
    </View>
  );
}
