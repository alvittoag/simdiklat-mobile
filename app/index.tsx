import { View, Text } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import ButtonOpacity from "@/components/elements/ButtonOpacity";
import useSession from "@/hooks/useSession";
import Loading from "@/components/elements/Loading";

export default function index() {
  const { isAuthenticated, isLoading } = useSession();

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace("/halaman-utama");
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ContainerBackground>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "space-between",
          alignItems: "center",
          gap: moderateScale(90),
          paddingHorizontal: moderateScale(15),
          paddingVertical: moderateScale(20),
        }}
      >
        <Text
          style={{
            fontSize: moderateScale(25),
            textAlign: "center",
            color: Colors.text_tertiary,
            fontWeight: "600",
            marginTop: moderateScale(20),
          }}
        >
          Selamat Datang di Sistem Informasi Kediklatan (SIMDIKLAT) Mobile
        </Text>

        <Text
          style={{
            fontSize: moderateScale(20),
            textAlign: "center",
            color: Colors.text_tertiary,
            fontWeight: "600",
          }}
        >
          SIMDIKLAT atau Sistem Informasi Kediklatan merupakan sistem informasi
          yang dikelola oleh BPSDM Provinsi DKI Jakarta untuk membantu
          pengelolaan pengembangan kompetensi ASN di lingkungan Pemerintah
          Provinsi DKI.
        </Text>

        <View style={{ gap: moderateScale(8) }}>
          <ButtonOpacity
            bgcolor={Colors.button_primary}
            textcolor="white"
            textsize={16}
            vertical={18}
            textweight="600"
            onPress={() => router.navigate("/login")}
          >
            Get Started
          </ButtonOpacity>

          <Text style={{ fontWeight: "600", textAlign: "center" }}>
            Support by : Pusdatin BPSDM DKI Jakarta Copyright 2024
          </Text>
        </View>
      </SafeAreaView>
    </ContainerBackground>
  );
}
