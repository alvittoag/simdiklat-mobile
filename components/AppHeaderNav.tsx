import React from "react";
import { Appbar, Avatar, Badge } from "react-native-paper";
import { router, useNavigation } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Image, Text, TouchableOpacity, View } from "react-native";
import assets from "@/assets";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { DrawerActions } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";

type response = {
  status: string;
  message: string;
  data: number;
};

export default function AppHeaderNav({
  title,
}: {
  title: string;
  onPress?: () => void;
}) {
  const navigation = useNavigation();

  const {
    data: dataCount,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["count-notif"],
    queryFn: async () => {
      const { data } = await axiosService.get<response>("/api/message/notify");

      return data;
    },
  });
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

      <TouchableOpacity
        onPress={() => router.push("/kotak-masuk")}
        style={{ position: "relative" }}
      >
        <Badge
          style={{
            position: "absolute",
            top: -5,
            right: -9,
            zIndex: 1,
            backgroundColor: "red",
            color: Colors.text_white,
            fontWeight: 500,
            fontSize: 12,
          }}
        >
          {isPending ? "-" : dataCount?.data}
        </Badge>
        <Image
          resizeMode="contain"
          source={assets.notify}
          style={{ width: 20, height: 25 }}
        />
      </TouchableOpacity>
    </Appbar.Header>
  );
}
