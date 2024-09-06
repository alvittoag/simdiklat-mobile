import { View, Text } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

export default function parseLongText({
  data,
  fontSize = 15,
  fontWeight = 400,
}: {
  data: any;
  fontSize?: number;
  fontWeight?: 400 | 700;
}) {
  return data
    ?.replace("persyaratan:", "")
    .split("\r\n")
    .map((item: string) => item.replace(/^\d+\.\s*/, "").trim())
    .join(" ")
    .split(";")
    .map((item: string) => item.trim())
    .filter((item: string) => item !== "")
    .map((item: string, index: number) => (
      <View
        key={index}
        style={{
          flexDirection: "row",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            color: Colors.text_primary,
            fontWeight: fontWeight,
            fontSize: fontSize,
          }}
        >
          {index + 1}.
        </Text>

        <Text
          style={{
            color: Colors.text_primary,
            fontWeight: fontWeight,
            fontSize: 15,
            flexShrink: 1,
          }}
        >
          {item}
        </Text>
      </View>
    ));
}
