import { View, Text } from "react-native";
import React from "react";
import { Divider } from "react-native-paper";

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
