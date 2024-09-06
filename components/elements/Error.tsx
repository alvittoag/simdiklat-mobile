import { View, Text } from "react-native";
import React from "react";
import ContainerBackground from "../container/ContainerBackground";

export default function Error() {
  return (
    <ContainerBackground>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red", fontSize: 16 }}>
          Terjadi kesalahan pada server
        </Text>
      </View>
    </ContainerBackground>
  );
}
