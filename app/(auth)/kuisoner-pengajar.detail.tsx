import { View, Text, Dimensions } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import { Colors } from "@/constants/Colors";
import { moderateScale } from "react-native-size-matters";
import { Button, RadioButton, TextInput } from "react-native-paper";

export default function KuisonerPengajarDetail() {
  return (
    <ContainerBackground>
      <View
        style={{
          paddingHorizontal: moderateScale(15),
          paddingVertical: moderateScale(20),
          gap: moderateScale(20),
        }}
      >
        <View
          style={{
            backgroundColor: Colors.button_primary,
            padding: moderateScale(15),
            borderRadius: 8,
            elevation: 3,
          }}
        >
          <Text
            style={{
              color: Colors.text_white,
              fontSize: 17,
              fontWeight: "bold",
            }}
          >
            Podcast Kopi Sedap Angkatan 53
          </Text>
        </View>

        <View style={{ gap: 25 }}>
          <View style={{ flexDirection: "row", gap: 2 }}>
            <Text
              style={{
                fontWeight: "bold",
                color: Colors.text_primary,
                fontSize: 15,
              }}
            >
              1.
            </Text>

            <View style={{ gap: 10, flex: 1 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: Colors.text_primary,
                  fontSize: 15,
                }}
              >
                Pelayanan panitia atau
              </Text>

              <View style={{ gap: 15 }}>
                <View
                  style={{
                    backgroundColor: Colors.border_primary,
                    paddingVertical: 13,
                    paddingHorizontal: 10,
                    borderRadius: 7,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                    Sangat Memuaskan
                  </Text>
                  <RadioButton.Android
                    value="first"
                    status={"unchecked"}
                    color="red"
                    uncheckedColor={Colors.text_primary}
                  />
                </View>

                <View
                  style={{
                    backgroundColor: Colors.border_primary,
                    paddingVertical: 13,
                    paddingHorizontal: 10,
                    borderRadius: 7,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                    Sangat Memuaskan
                  </Text>
                  <RadioButton.Android
                    value="first"
                    status={"unchecked"}
                    color="red"
                    uncheckedColor={Colors.text_primary}
                  />
                </View>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 2,
              alignItems: "stretch",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: Colors.text_primary,
                fontSize: 15,
              }}
            >
              2.
            </Text>

            <View style={{ gap: 10, flex: 1 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: Colors.text_primary,
                  fontSize: 15,
                }}
              >
                Sopan santun, perhatian dan keramahan
              </Text>

              <View style={{ gap: 15 }}>
                <View
                  style={{
                    backgroundColor: Colors.border_primary,
                    paddingVertical: 13,
                    paddingHorizontal: 10,
                    borderRadius: 7,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                    Sangat Memuaskan
                  </Text>
                  <RadioButton.Android
                    value="first"
                    status={"unchecked"}
                    color="red"
                    uncheckedColor={Colors.text_primary}
                  />
                </View>

                <View
                  style={{
                    backgroundColor: Colors.border_primary,
                    paddingVertical: 13,
                    paddingHorizontal: 10,
                    borderRadius: 7,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                    Sangat Memuaskan
                  </Text>
                  <RadioButton.Android
                    value="first"
                    status={"unchecked"}
                    color="red"
                    uncheckedColor={Colors.text_primary}
                  />
                </View>

                <TextInput
                  outlineColor="transparent"
                  placeholder="Isi Saran Untuk Pengajar"
                  placeholderTextColor={Colors.text_secondary}
                  activeOutlineColor="transparent"
                  multiline
                  mode="outlined"
                  textColor="black"
                  style={{
                    backgroundColor: Colors.border_primary,
                    borderRadius: 7,
                    minHeight: 100,
                    paddingVertical: 10,
                  }}
                />

                <Button
                  icon={"send"}
                  mode="contained"
                  style={{
                    borderRadius: 7,
                    backgroundColor: Colors.button_secondary,
                    paddingVertical: 7,
                  }}
                >
                  Kirim
                </Button>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ContainerBackground>
  );
}
