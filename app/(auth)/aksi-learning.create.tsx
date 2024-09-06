import { View, Text } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import { moderateScale } from "react-native-size-matters";
import { Button, TextInput } from "react-native-paper";
import { Colors } from "@/constants/Colors";

export default function AksiLearningCreate() {
  return (
    <ContainerBackground>
      <View
        style={{
          paddingHorizontal: moderateScale(15),
          paddingVertical: moderateScale(20),
          gap: moderateScale(18),
        }}
      >
        <TextInput
          label={"Aktivitas"}
          activeOutlineColor={Colors.button_primary}
          outlineColor={Colors.border_primary}
          mode="outlined"
          style={{ backgroundColor: "white" }}
        />

        <TextInput
          label={"Deskripsi"}
          activeOutlineColor={Colors.button_primary}
          outlineColor={Colors.border_primary}
          mode="outlined"
          style={{ backgroundColor: "white" }}
        />

        <TextInput
          label={"Bukti Coaching"}
          activeOutlineColor={Colors.button_primary}
          outlineColor={Colors.border_primary}
          mode="outlined"
          style={{ backgroundColor: "white" }}
        />

        <TextInput
          label={"Tanggal Mulai Coaching"}
          activeOutlineColor={Colors.button_primary}
          outlineColor={Colors.border_primary}
          mode="outlined"
          style={{ backgroundColor: "white" }}
        />

        <TextInput
          label={"Tanggal Selesai Coaching"}
          activeOutlineColor={Colors.button_primary}
          outlineColor={Colors.border_primary}
          mode="outlined"
          style={{ backgroundColor: "white" }}
        />

        <Button
          mode="contained"
          icon={"content-save"}
          textColor="black"
          style={{
            backgroundColor: Colors.button_secondary,
            borderRadius: 7,
            paddingVertical: 7,
          }}
        >
          Simpan
        </Button>
      </View>
    </ContainerBackground>
  );
}
