import { View, Text } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Icon } from "react-native-paper";

export default function NotFoundSearch() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
      }}
    >
      <Icon source={"information"} color={Colors.text_secondary} size={60} />
      <Text
        style={{
          color: Colors.text_primary,
          fontWeight: 500,
          fontSize: 18,
        }}
      >
        Data Tidak Ditemukan
      </Text>
    </View>
  );
}
