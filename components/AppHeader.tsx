import React from "react";
import { Appbar } from "react-native-paper";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function AppHeader({ title }: { title: string }) {
  return (
    <Appbar.Header
      dark
      mode="center-aligned"
      style={{ backgroundColor: Colors.primary }}
    >
      <Appbar.BackAction onPress={() => router.back()} />
      <Appbar.Content
        title={title}
        titleStyle={{ fontSize: 18, fontWeight: "600", color: "white" }}
      />
    </Appbar.Header>
  );
}
