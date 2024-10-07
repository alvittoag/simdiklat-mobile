import React from "react";
import { Appbar, Badge } from "react-native-paper";
import { router, useNavigation } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Image, Text, TouchableOpacity, View } from "react-native";
import assets from "@/assets";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { DrawerActions } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";

type Response = {
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
      const { data } = await axiosService.get<Response>("/api/message/notify");
      return data;
    },
  });

  const isLong = title?.length > 50;

  return (
    <Appbar.Header
      dark
      mode="center-aligned"
      style={{
        backgroundColor: Colors.primary,
        paddingHorizontal: moderateScale(15),
        justifyContent: "space-between",
        alignItems: "center",
        height: verticalScale(isLong ? 65 : 50),
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <Image source={assets.hamburger} style={{ width: 28, height: 28 }} />
      </TouchableOpacity>

      <View style={{ flex: 1, paddingHorizontal: moderateScale(20) }}>
        <Text
          numberOfLines={3}
          ellipsizeMode="tail"
          style={{
            color: Colors.text_white,
            fontSize: 16,
            textAlign: isLong ? "left" : "center",
          }}
        >
          {title}
        </Text>
      </View>

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
            fontWeight: "500",
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
