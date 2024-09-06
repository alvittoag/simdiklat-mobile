import { View, Text } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import { moderateScale } from "react-native-size-matters";
import { Button, TextInput } from "react-native-paper";
import { Colors } from "@/constants/Colors";

export default function KotakMasukCreate() {
  return (
    <ContainerBackground>
      <View
        style={{
          paddingVertical: moderateScale(20),
          paddingHorizontal: moderateScale(15),
          gap: moderateScale(25),
        }}
      >
        <View style={{ gap: moderateScale(15) }}>
          <TextInput
            mode="outlined"
            label="Kepada"
            activeOutlineColor={Colors.border_input_active}
            outlineColor={Colors.border_primary}
            style={{
              backgroundColor: "white",
              minHeight: 60,
            }}
          />

          <TextInput
            mode="outlined"
            label="Subjek"
            activeOutlineColor={Colors.border_input_active}
            outlineColor={Colors.border_primary}
            style={{
              backgroundColor: "white",
              minHeight: 60,
            }}
          />

          <TextInput
            mode="outlined"
            label="Isi Pesan"
            multiline
            activeOutlineColor={Colors.border_input_active}
            outlineColor={Colors.border_primary}
            style={{
              backgroundColor: "white",
              minHeight: 60,
            }}
          />
        </View>

        <View style={{ gap: moderateScale(25), flexDirection: "row" }}>
          <Button
            icon={"arrow-left"}
            mode="contained"
            textColor="white"
            style={{
              borderRadius: 7,
              backgroundColor: Colors.button_primary,
              paddingVertical: moderateScale(5),
              flex: 1,
            }}
          >
            Kembali
          </Button>

          <Button
            icon={"send"}
            mode="contained"
            textColor="black"
            style={{
              borderRadius: 7,
              backgroundColor: Colors.button_secondary,
              paddingVertical: moderateScale(5),
              flex: 1,
            }}
          >
            Kirim
          </Button>
        </View>
      </View>
    </ContainerBackground>
  );
}
