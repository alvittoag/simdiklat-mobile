import ContainerBackground from "@/components/container/ContainerBackground";
import FormLogin from "@/components/sections/login/FormLogin";
import HeaderLogin from "@/components/sections/login/HeaderLogin";
import InformationLogin from "@/components/sections/login/InformationLogin";
import React from "react";

import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";

export default function login() {
  return (
    <ContainerBackground>
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: moderateScale(30),
        }}
      >
        <HeaderLogin />

        <FormLogin />

        <InformationLogin />
      </SafeAreaView>
    </ContainerBackground>
  );
}
