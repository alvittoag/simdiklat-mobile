import ContainerBackground from "@/components/container/ContainerBackground";
import FormLogin from "@/components/sections/login/FormLogin";
import HeaderLogin from "@/components/sections/login/HeaderLogin";
import InformationLogin from "@/components/sections/login/InformationLogin";
import React from "react";
import { View } from "react-native";

import { moderateScale } from "react-native-size-matters";

export default function login() {
  return (
    <ContainerBackground>
      <View
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
      </View>
    </ContainerBackground>
  );
}
