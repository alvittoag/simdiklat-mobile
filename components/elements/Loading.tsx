import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import ContainerBackground from "../container/ContainerBackground";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";

export default function Loading() {
  return (
    <ContainerBackground>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} color={Colors.primary} />
      </View>
    </ContainerBackground>
  );
}
