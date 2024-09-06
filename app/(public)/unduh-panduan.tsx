import { Text, Image, TouchableOpacity, Linking } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import AppHeader from "@/components/AppHeader";
import assets from "@/assets";
import { moderateScale } from "react-native-size-matters";
import { useQuery } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import Loading from "@/components/elements/Loading";
import Error from "@/components/elements/Error";
import { FlashList } from "@shopify/flash-list";

interface Panduan {
  title: string;
  file: string;
  type: "pdf" | "image" | "video";
}

interface PanduanResponse {
  status: "success" | "error";
  message: string;
  data: Panduan[];
}

export default function UnduhPanduan() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["panduan"],
    queryFn: async () => {
      const response = await axiosService.get<PanduanResponse>("/api/panduan");
      return response.data;
    },
  });

  if (isPending) {
    return <Loading />;
  }
  if (isError) {
    return <Error />;
  }

  const openPDF = (link: string) => {
    Linking.openURL(link);
  };

  return (
    <ContainerBackground>
      <AppHeader title="Unduh Panduan" />

      <FlashList
        data={data.data}
        contentContainerStyle={{
          paddingHorizontal: moderateScale(15),
          paddingVertical: moderateScale(20),
        }}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        estimatedItemSize={11}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => openPDF(item.file)}
            style={{
              backgroundColor: "#F3F3F3",
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: moderateScale(25),
              paddingHorizontal: moderateScale(20),
              borderRadius: 20,
              borderWidth: 0.8,
              borderColor: "#9F9F9F",
              marginBottom: index !== data.data.length - 1 ? 20 : 0,
            }}
          >
            <Image
              resizeMode="contain"
              source={assets.unduh_panduan}
              style={{ width: 40, height: 40 }}
            />

            <Text
              style={{
                fontSize: 15,
                paddingRight: moderateScale(55),
                paddingLeft: moderateScale(10),
              }}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />
    </ContainerBackground>
  );
}
