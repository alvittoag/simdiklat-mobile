import { ImageBackground } from "react-native";
import React from "react";
import assets from "@/assets";

export default function ContainerBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ImageBackground
      source={assets.background}
      resizeMode="repeat"
      style={{ flex: 1 }}
    >
      {children}
    </ImageBackground>
  );
}
