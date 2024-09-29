import React from "react";
import { Appbar, Avatar, Badge } from "react-native-paper";
import { router, useNavigation } from "expo-router";
import { Colors } from "@/constants/Colors";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import assets from "@/assets";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { DrawerActions } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { getProfilePeserta } from "@/services/query/getProfilePeserta";
import { IProfilePeserta } from "@/type";
import auth from "@/services/api/auth";
import { useQuery as useQ } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";

type response = {
  status: string;
  message: string;
  data: number;
};

export default function AppHeaderAuth() {
  const navigation = useNavigation();

  const { data, error, loading } = useQuery<{
    profilPesertaDiklat: IProfilePeserta;
  }>(getProfilePeserta);

  const {
    data: dataCount,
    isPending,
    isError,
  } = useQ({
    queryKey: ["count-notif"],
    queryFn: async () => {
      const { data } = await axiosService.get<response>("/api/message/notify");

      return data;
    },
  });

  const { data: photo, isPending: isPendingPhoto } = useQ({
    queryKey: ["poto-profile"],
    queryFn: async () => {
      const { data } = await axiosService.get<response>(
        "/api/change-profile/photo"
      );
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
      <View style={{ flexDirection: "row", alignItems: "center", gap: 25 }}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Image source={assets.hamburger} style={{ width: 28, height: 28 }} />
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size={"small"} color={Colors.text_white} />
        ) : (
          <TouchableOpacity
            onPress={() => router.push("/profile")}
            style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
          >
            <Avatar.Image
              size={42}
              source={{
                uri: isPendingPhoto
                  ? "#"
                  : `http://10.15.43.236:8080/api/file/${photo?.data}`,
              }}
              style={{ backgroundColor: "white" }}
            />

            <View style={{ gap: 3 }}>
              <Text
                style={{
                  color: Colors.text_white,
                  fontWeight: 500,
                  fontSize: 15,
                }}
              >
                {data?.profilPesertaDiklat.full_name}
              </Text>

              <Text style={{ color: Colors.text_white, fontSize: 13 }}>
                NRK : {data?.profilPesertaDiklat.nrk}
              </Text>
            </View>
          </TouchableOpacity>
        )}
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
