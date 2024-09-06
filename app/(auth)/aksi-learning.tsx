import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import {
  Button,
  Dialog,
  Divider,
  Portal,
  RadioButton,
  Searchbar,
} from "react-native-paper";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function AksiLearning() {
  const [visible, setVisible] = React.useState(false);
  const [value, setValue] = React.useState("status");

  const [search, setSearch] = React.useState("");

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);
  return (
    <ContainerBackground>
      <View
        style={{
          backgroundColor: "white",
          paddingVertical: 15,
          paddingHorizontal: 15,
          borderWidth: 1,
          borderColor: Colors.border_primary,
          flexDirection: "row",
          gap: 15,
          alignItems: "center",
        }}
      >
        <Searchbar
          value={search}
          onChangeText={(text) => setSearch(text)}
          placeholder="Search"
          iconColor={Colors.border_primary}
          inputStyle={{
            color: Colors.text_primary,
          }}
          style={{
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: Colors.border_primary,
            flex: 1,
          }}
        />

        <TouchableOpacity onPress={showDialog}>
          <Ionicons name="filter-outline" size={30} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            paddingHorizontal: moderateScale(15),
            paddingVertical: moderateScale(20),
            gap: moderateScale(25),
          }}
        >
          <View
            style={{
              gap: moderateScale(20),
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: Colors.border_primary,
                borderRadius: 10,
                padding: moderateScale(20),
                gap: moderateScale(25),
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                Kelompok I
              </Text>

              <View>
                <Text style={{ color: Colors.text_secondary, fontSize: 15 }}>
                  Detail Diklat
                </Text>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  Diklat Prajabatan Golongan III (Reguler) (Angkatan: 197)
                </Text>
              </View>

              <View>
                <Text style={{ color: Colors.text_secondary, fontSize: 15 }}>
                  Coach
                </Text>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  Helena Ras Ulina Sembiring
                </Text>
              </View>

              <Button
                onPress={() =>
                  router.push({
                    pathname: "/aksi-learning.tahapan",
                    params: { id: 1 },
                  })
                }
                mode="contained"
                icon={"account"}
                textColor="black"
                style={{
                  backgroundColor: Colors.button_secondary,
                  borderRadius: 7,
                  paddingVertical: 5,
                }}
              >
                View Tahapan
              </Button>
            </View>
          </View>

          <View
            style={{
              gap: moderateScale(20),
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: Colors.border_primary,
                borderRadius: 10,
                padding: moderateScale(20),
                gap: moderateScale(25),
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                Kelompok I
              </Text>

              <View>
                <Text style={{ color: Colors.text_secondary, fontSize: 15 }}>
                  Detail Diklat
                </Text>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  Diklat Prajabatan Golongan III (Reguler) (Angkatan: 197)
                </Text>
              </View>

              <View>
                <Text style={{ color: Colors.text_secondary, fontSize: 15 }}>
                  Coach
                </Text>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  Helena Ras Ulina Sembiring
                </Text>
              </View>

              <Button
                mode="contained"
                icon={"account"}
                textColor="black"
                style={{
                  backgroundColor: Colors.button_secondary,
                  borderRadius: 7,
                  paddingVertical: 5,
                }}
              >
                View Tahapan
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>

      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={{ backgroundColor: "white" }}
        >
          <Dialog.Title style={{ color: Colors.text_primary }}>
            Filter Berdasarkan
          </Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={(newValue) => setValue(newValue)}
              value={value}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="status"
                  color={Colors.border_input_active}
                  uncheckedColor="black"
                />
                <Text>Status</Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="jenis-diklat"
                  color={Colors.border_input_active}
                  uncheckedColor="black"
                />
                <Text>Jenis Diklat</Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="jadwal-pelaksanaan"
                  color={Colors.border_input_active}
                  uncheckedColor="black"
                />
                <Text>Jadwal Pelaksanaan</Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="lokasi-diklat"
                  color={Colors.border_input_active}
                  uncheckedColor="black"
                />
                <Text>Lokasi Diklat</Text>
              </View>
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={hideDialog}
              mode="contained"
              textColor="black"
              style={{ backgroundColor: Colors.button_secondary, flexGrow: 1 }}
            >
              Terapkan
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ContainerBackground>
  );
}
