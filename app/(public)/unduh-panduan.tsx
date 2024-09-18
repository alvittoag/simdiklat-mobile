import {
  Text,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from "react-native";
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
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import * as Sharing from "expo-sharing";
import * as WebBrowser from "expo-web-browser";

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

  const downloadPDF = async (pdfUrl: string) => {
    await WebBrowser.openBrowserAsync(pdfUrl);
    // const fileName = pdfUrl.split("/").pop();

    // const fileUri = FileSystem.documentDirectory + `/${fileName}`;

    // try {
    //   const { uri } = await FileSystem.downloadAsync(pdfUrl, fileUri);
    //   console.log(uri);
    //   openPDF(uri);
    // } catch (error) {
    //   console.error("Error saving or opening PDF:", error);
    //   alert("Failed to download or open PDF");
    // }
  };

  const openPDF = async (fileUri: string) => {
    try {
      const contentUri = await FileSystem.getContentUriAsync(fileUri);
      await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: contentUri,
        flags: 1,
      });
    } catch (error) {
      console.error("Error opening PDF:", error);
      alert("Failed to open PDF");
    }
  };

  if (isPending) {
    return <Loading />;
  }
  if (isError) {
    return <Error />;
  }

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
            onPress={() => Linking.openURL(item.file)}
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
