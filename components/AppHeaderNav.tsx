import React from "react";
import { Appbar, Avatar } from "react-native-paper";
import { router, useNavigation } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Image, Text, TouchableOpacity, View } from "react-native";
import assets from "@/assets";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { DrawerActions } from "@react-navigation/native";

export default function AppHeaderNav({
  title,
}: {
  title: string;
  onPress?: () => void;
}) {
  const navigation = useNavigation();
  return (
    <Appbar.Header
      dark
      mode="center-aligned"
      style={{
        backgroundColor: Colors.primary,
        paddingHorizontal: moderateScale(15),
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <Image source={assets.hamburger} style={{ width: 28, height: 28 }} />
      </TouchableOpacity>

      <Text style={{ color: Colors.text_white, fontSize: 16.5 }}>{title}</Text>

      <TouchableOpacity onPress={() => router.push("/kotak-masuk")}>
        <Image
          resizeMode="contain"
          source={assets.notify}
          style={{ width: 20, height: 25 }}
        />
      </TouchableOpacity>
    </Appbar.Header>
  );
}
