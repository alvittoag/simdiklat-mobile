import { View, Text } from "react-native";
import React from "react";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "@/constants/Colors";

type Props = {
  num: number;
  title: string;
  children: React.ReactNode;
};

export default function ContainerIndex(props: Props) {
  const { children, num, title } = props;
  return (
    <View
      style={{
        paddingHorizontal: moderateScale(15),
        paddingBottom: moderateScale(20),
        borderBottomWidth: 1,
        borderBottomColor: Colors.border_primary,
        gap: moderateScale(20),
      }}
    >
      <View style={{ flexDirection: "row", gap: 5 }}>
        <Text>{num}.</Text>
        <Text style={{ paddingRight: 15, fontSize: 15 }}>{title}</Text>
      </View>

      {children}
    </View>
  );
}
