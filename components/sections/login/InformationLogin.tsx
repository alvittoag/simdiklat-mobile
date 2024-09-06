import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import assets from "@/assets";
import { router } from "expo-router";

export default function InformationLogin() {
  return (
    <View style={{ gap: moderateScale(10) }}>
      <TouchableOpacity
        onPress={() => router.push("/pengumuman")}
        style={{
          borderWidth: 1,
          borderColor: "#9F9F9F",
          width: scale(320),
          borderRadius: 20,
          height: verticalScale(55),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={assets.pengumuman}
          style={{
            width: 33,
            height: 33,
            position: "absolute",
            left: moderateScale(65),
          }}
        />

        <Text
          style={{
            fontSize: moderateScale(15),
            fontWeight: "bold",
            paddingLeft: 10,
          }}
        >
          Pengumuman
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: "#9F9F9F",
          width: scale(320),
          borderRadius: 20,
          height: verticalScale(55),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={assets.kalender_diklat}
          style={{
            width: 30,
            height: 34,
            position: "absolute",
            left: moderateScale(65),
          }}
        />

        <Text
          style={{
            fontSize: moderateScale(15),
            fontWeight: "bold",
            paddingLeft: 20,
          }}
        >
          Kalender Diklat
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/unduh-panduan")}
        style={{
          borderWidth: 1,
          borderColor: "#9F9F9F",
          width: scale(320),
          borderRadius: 20,
          height: verticalScale(55),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={assets.unduh_panduan}
          style={{
            width: 32,
            height: 31,
            position: "absolute",
            left: moderateScale(65),
          }}
        />

        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            paddingLeft: 25,
          }}
        >
          Unduh Panduan
        </Text>
      </TouchableOpacity>
    </View>
  );
}
