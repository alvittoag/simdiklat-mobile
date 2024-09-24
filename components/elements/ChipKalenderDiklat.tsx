import { View, Text } from "react-native";
import React from "react";
import { Button } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { moderateScale } from "react-native-size-matters";

export default function ChipKalenderDiklat({
  aproval,
}: {
  aproval: number | null;
}) {
  let status;
  let background;
  switch (aproval) {
    case null:
      status = "Belum Mendaftar";
      background = "#9C8061";
      break;

    case 10:
      status = "Diterima";
      background = Colors.text_green;
      break;

    case 1:
      status = "Sudah Diverifikasi";
      background = "#F1C40E";
      break;

    case 0:
      status = "Belum Diverifikasi";
      background = "#E67D23";
      break;

    case -1:
      status = "Ditolak";
      background = Colors.text_red;
      break;
  }

  return (
    <Button
      style={{
        flex: 1,
        backgroundColor: background,
        paddingHorizontal: moderateScale(25),
        paddingVertical: 5,
        borderRadius: 8,
        marginBottom: 10,
      }}
      textColor="white"
    >
      {status}
    </Button>
  );
}
