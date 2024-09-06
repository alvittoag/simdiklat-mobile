import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";
import React from "react";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "@/constants/Colors";
import assets from "@/assets";

type Props = {
  bgcolor: string;
  vertical: number;
  icon?: any;
  textcolor: string;
  textsize: number;
  textweight: string;
  children: React.ReactNode;
  onPress?: () => void;
};

export default function ButtonOpacity(props: Props) {
  const {
    children,
    bgcolor,
    vertical,
    icon,
    textcolor = Colors.text_primary,
    textsize = 14,
    textweight = "500",
    onPress,
  } = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: moderateScale(vertical),
        backgroundColor: bgcolor,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: moderateScale(8),
      }}
    >
      {icon && (
        <Image
          source={icon}
          resizeMode="contain"
          style={{ width: 23, height: 23 }}
        />
      )}

      <Text
        style={{
          fontSize: moderateScale(textsize),
          fontWeight: textweight as any,
          color: textcolor,
          textAlign: "center",
        }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}
