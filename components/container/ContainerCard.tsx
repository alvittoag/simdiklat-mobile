import { View, Text, Platform } from "react-native";
import React from "react";
import { Divider } from "react-native-paper";
import { Colors } from "@/constants/Colors";

export default function ContainerCard({
  title,
  children,
  textSize = 16,
}: {
  title: string;
  children: React.ReactNode;
  textSize?: number;
}) {
  return (
    <View
      style={{
        backgroundColor: "white",
        padding: 20,
        elevation: 3,
        borderRadius: 10,
        gap: 15,
        borderWidth: Platform.OS === "android" ? 0 : 0.5,
        borderColor: Colors.border_primary,
      }}
    >
      <View style={{ gap: 15 }}>
        <Text style={{ fontWeight: "bold", fontSize: textSize }}>{title}</Text>
        <Divider />
      </View>

      {children}
    </View>
  );
}
