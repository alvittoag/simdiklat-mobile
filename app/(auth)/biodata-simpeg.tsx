import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import AppHeaderNav from "@/components/AppHeaderNav";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { moderateScale, verticalScale } from "react-native-size-matters";
import {
  Button,
  Checkbox,
  Dialog,
  IconButton,
  Portal,
  TextInput,
} from "react-native-paper";

export default function BiodataSimpeg() {
  const [dialog, setDialog] = React.useState(false);
  return (
    <ContainerBackground>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            paddingVertical: moderateScale(15),
            borderBottomWidth: 1,
            borderBottomColor: Colors.border_primary,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: moderateScale(15),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: moderateScale(10),
              }}
            >
              <MaterialIcons name="people-outline" size={32} />

              <Text
                style={{
                  fontWeight: "bold",
                  color: Colors.text_primary,
                  fontSize: 17,
                }}
              >
                Di SIMDIKLAT
              </Text>
            </View>

            <IconButton
              onPress={() => setDialog(true)}
              icon={"information"}
              iconColor={Colors.text_primary}
              size={30}
            />
          </View>

          <View
            style={{
              paddingHorizontal: moderateScale(35),
              flexDirection: "row",
              alignItems: "center",
              gap: moderateScale(5),
              marginTop: -10,
            }}
          >
            <Checkbox
              status="unchecked"
              uncheckedColor={Colors.text_primary}
              color={Colors.text_primary}
            />
            <Text style={{ fontSize: 16 }}>Di SIMPEG</Text>
          </View>
        </View>

        <View
          style={{
            paddingTop: moderateScale(20),
            paddingBottom: moderateScale(40),
            paddingHorizontal: moderateScale(15),
            gap: moderateScale(30),
          }}
        >
          <View
            style={{
              gap: moderateScale(8),
            }}
          >
            <View style={{ gap: moderateScale(5) }}>
              <TextInput
                mode="outlined"
                label="NRK"
                textColor="black"
                style={{
                  backgroundColor: "white",
                  height: verticalScale(45),
                }}
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
              />

              <View
                style={{
                  paddingHorizontal: moderateScale(25),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(5),
                }}
              >
                <Checkbox.Android
                  status="unchecked"
                  uncheckedColor={Colors.text_primary}
                  color={Colors.text_primary}
                />
                <Text style={{ fontSize: 16 }}>NRK</Text>
              </View>
            </View>

            <View style={{ gap: moderateScale(5) }}>
              <TextInput
                mode="outlined"
                label="NIP"
                textColor="black"
                style={{
                  backgroundColor: "white",
                  height: verticalScale(45),
                }}
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
              />

              <View
                style={{
                  paddingHorizontal: moderateScale(25),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(5),
                }}
              >
                <Checkbox.Android
                  status="unchecked"
                  uncheckedColor={Colors.text_primary}
                  color={Colors.text_primary}
                />
                <Text style={{ fontSize: 16 }}>NIP</Text>
              </View>
            </View>

            <View style={{ gap: moderateScale(5) }}>
              <TextInput
                mode="outlined"
                label="Gelar Depan"
                textColor="black"
                style={{
                  backgroundColor: "white",
                  height: verticalScale(45),
                }}
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
              />

              <View
                style={{
                  paddingHorizontal: moderateScale(25),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(5),
                }}
              >
                <Checkbox.Android
                  status="unchecked"
                  uncheckedColor={Colors.text_primary}
                  color={Colors.text_primary}
                />
                <Text style={{ fontSize: 16 }}>Gelar Depan</Text>
              </View>
            </View>

            <View style={{ gap: moderateScale(5) }}>
              <TextInput
                mode="outlined"
                label="Nama Lengkap"
                textColor="black"
                style={{
                  backgroundColor: "white",
                  height: verticalScale(45),
                }}
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
              />

              <View
                style={{
                  paddingHorizontal: moderateScale(25),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(5),
                }}
              >
                <Checkbox.Android
                  status="unchecked"
                  uncheckedColor={Colors.text_primary}
                  color={Colors.text_primary}
                />
                <Text style={{ fontSize: 16 }}>Nama Lengkap</Text>
              </View>
            </View>

            <View style={{ gap: moderateScale(5) }}>
              <TextInput
                mode="outlined"
                label="Gelar Belakang"
                textColor="black"
                style={{
                  backgroundColor: "white",
                  height: verticalScale(45),
                }}
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
              />

              <View
                style={{
                  paddingHorizontal: moderateScale(25),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(5),
                }}
              >
                <Checkbox.Android
                  status="unchecked"
                  uncheckedColor={Colors.text_primary}
                  color={Colors.text_primary}
                />
                <Text style={{ fontSize: 16 }}>Gelar Belakang</Text>
              </View>
            </View>

            <View style={{ gap: moderateScale(5) }}>
              <TextInput
                mode="outlined"
                label="Jenis Kelamin"
                textColor="black"
                style={{
                  backgroundColor: "white",
                  height: verticalScale(45),
                }}
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
              />

              <View
                style={{
                  paddingHorizontal: moderateScale(25),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(5),
                }}
              >
                <Checkbox.Android
                  status="unchecked"
                  uncheckedColor={Colors.text_primary}
                  color={Colors.text_primary}
                />
                <Text style={{ fontSize: 16 }}>Jenis Kelamin</Text>
              </View>
            </View>

            <View style={{ gap: moderateScale(5) }}>
              <TextInput
                mode="outlined"
                label="Agama"
                textColor="black"
                style={{
                  backgroundColor: "white",
                  height: verticalScale(45),
                }}
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
              />

              <View
                style={{
                  paddingHorizontal: moderateScale(25),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(5),
                }}
              >
                <Checkbox.Android
                  status="unchecked"
                  uncheckedColor={Colors.text_primary}
                  color={Colors.text_primary}
                />
                <Text style={{ fontSize: 16 }}>Agama</Text>
              </View>
            </View>

            <View style={{ gap: moderateScale(5) }}>
              <TextInput
                mode="outlined"
                label="Status Pegawai"
                textColor="black"
                style={{
                  backgroundColor: "white",
                  height: verticalScale(45),
                }}
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
              />

              <View
                style={{
                  paddingHorizontal: moderateScale(25),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(5),
                }}
              >
                <Checkbox.Android
                  status="unchecked"
                  uncheckedColor={Colors.text_primary}
                  color={Colors.text_primary}
                />
                <Text style={{ fontSize: 16 }}>Status Pegawai</Text>
              </View>
            </View>

            <View style={{ gap: moderateScale(5) }}>
              <TextInput
                mode="outlined"
                label="Tempat Lahir"
                textColor="black"
                style={{
                  backgroundColor: "white",
                  height: verticalScale(45),
                }}
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
              />

              <View
                style={{
                  paddingHorizontal: moderateScale(25),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(5),
                }}
              >
                <Checkbox.Android
                  status="unchecked"
                  uncheckedColor={Colors.text_primary}
                  color={Colors.text_primary}
                />
                <Text style={{ fontSize: 16 }}>Tempat Lahir</Text>
              </View>
            </View>

            <View style={{ gap: moderateScale(5) }}>
              <TextInput
                mode="outlined"
                label="Alamat Rumah"
                textColor="black"
                style={{
                  backgroundColor: "white",
                  height: verticalScale(45),
                }}
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
              />

              <View
                style={{
                  paddingHorizontal: moderateScale(25),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(5),
                }}
              >
                <Checkbox.Android
                  status="unchecked"
                  uncheckedColor={Colors.text_primary}
                  color={Colors.text_primary}
                />
                <Text style={{ fontSize: 16 }}>Alamat Rumah</Text>
              </View>
            </View>

            <View style={{ gap: moderateScale(5) }}>
              <TextInput
                mode="outlined"
                label="Kota"
                textColor="black"
                style={{
                  backgroundColor: "white",
                  height: verticalScale(45),
                }}
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
              />

              <View
                style={{
                  paddingHorizontal: moderateScale(25),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(5),
                }}
              >
                <Checkbox.Android
                  status="unchecked"
                  uncheckedColor={Colors.text_primary}
                  color={Colors.text_primary}
                />
                <Text style={{ fontSize: 16 }}>Kota</Text>
              </View>
            </View>

            <View style={{ gap: moderateScale(5) }}>
              <TextInput
                mode="outlined"
                label="Telepon Rumah"
                textColor="black"
                style={{
                  backgroundColor: "white",
                  height: verticalScale(45),
                }}
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
              />

              <View
                style={{
                  paddingHorizontal: moderateScale(25),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(5),
                }}
              >
                <Checkbox.Android
                  status="unchecked"
                  uncheckedColor={Colors.text_primary}
                  color={Colors.text_primary}
                />
                <Text style={{ fontSize: 16 }}>Telepon Rumah</Text>
              </View>
            </View>

            <View style={{ gap: moderateScale(5) }}>
              <TextInput
                mode="outlined"
                label="NPWP"
                textColor="black"
                style={{
                  backgroundColor: "white",
                  height: verticalScale(45),
                }}
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
              />

              <View
                style={{
                  paddingHorizontal: moderateScale(25),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(5),
                }}
              >
                <Checkbox.Android
                  status="unchecked"
                  uncheckedColor={Colors.text_primary}
                  color={Colors.text_primary}
                />
                <Text style={{ fontSize: 16 }}>NPWP</Text>
              </View>
            </View>

            <View style={{ gap: moderateScale(5) }}>
              <TextInput
                mode="outlined"
                label="Nomor Rekening Bank DKI"
                textColor="black"
                style={{
                  backgroundColor: "white",
                  height: verticalScale(45),
                }}
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
              />

              <View
                style={{
                  paddingHorizontal: moderateScale(25),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(5),
                }}
              >
                <Checkbox.Android
                  status="unchecked"
                  uncheckedColor={Colors.text_primary}
                  color={Colors.text_primary}
                />
                <Text style={{ fontSize: 16 }}>Nomor Rekening Bank DKI</Text>
              </View>
            </View>

            <View style={{ gap: moderateScale(5) }}>
              <TextInput
                mode="outlined"
                label="Nomor Rekening Bank DKI"
                textColor="black"
                style={{
                  backgroundColor: "white",
                  height: verticalScale(45),
                }}
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
              />

              <View
                style={{
                  paddingHorizontal: moderateScale(25),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(5),
                }}
              >
                <Checkbox.Android
                  status="unchecked"
                  uncheckedColor={Colors.text_primary}
                  color={Colors.text_primary}
                />
                <Text style={{ fontSize: 16 }}>Nomor Rekening Bank DKI</Text>
              </View>
            </View>

            <View style={{ gap: moderateScale(5) }}>
              <TextInput
                mode="outlined"
                label="Pendidikan Sesuai SK"
                textColor="black"
                style={{
                  backgroundColor: "white",
                  height: verticalScale(45),
                }}
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
              />

              <View
                style={{
                  paddingHorizontal: moderateScale(25),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(5),
                }}
              >
                <Checkbox.Android
                  status="unchecked"
                  uncheckedColor={Colors.text_primary}
                  color={Colors.text_primary}
                />
                <Text style={{ fontSize: 16 }}>Pendidikan Sesuai SK</Text>
              </View>
            </View>

            <View style={{ gap: moderateScale(5) }}>
              <TextInput
                mode="outlined"
                label="TMT PNS"
                textColor="black"
                style={{
                  backgroundColor: "white",
                  height: verticalScale(45),
                }}
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
              />

              <View
                style={{
                  paddingHorizontal: moderateScale(25),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(5),
                }}
              >
                <Checkbox.Android
                  status="unchecked"
                  uncheckedColor={Colors.text_primary}
                  color={Colors.text_primary}
                />
                <Text style={{ fontSize: 16 }}>TMT PNS</Text>
              </View>
            </View>

            <View style={{ gap: moderateScale(5) }}>
              <TextInput
                mode="outlined"
                label="Unit Kerja"
                textColor="black"
                style={{
                  backgroundColor: "white",
                  height: verticalScale(45),
                }}
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
              />

              <View
                style={{
                  paddingHorizontal: moderateScale(25),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(5),
                }}
              >
                <Checkbox.Android
                  status="unchecked"
                  uncheckedColor={Colors.text_primary}
                  color={Colors.text_primary}
                />
                <Text style={{ fontSize: 16 }}>Unit Kerja</Text>
              </View>
            </View>

            <View style={{ gap: moderateScale(5) }}>
              <TextInput
                mode="outlined"
                label="Pengikat"
                textColor="black"
                style={{
                  backgroundColor: "white",
                  height: verticalScale(45),
                }}
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
              />

              <View
                style={{
                  paddingHorizontal: moderateScale(25),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(5),
                }}
              >
                <Checkbox.Android
                  status="unchecked"
                  uncheckedColor={Colors.text_primary}
                  color={Colors.text_primary}
                />
                <Text style={{ fontSize: 16 }}>Pengikat</Text>
              </View>
            </View>

            <View style={{ gap: moderateScale(5) }}>
              <TextInput
                mode="outlined"
                label="Golongan"
                textColor="black"
                style={{
                  backgroundColor: "white",
                  height: verticalScale(45),
                }}
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
              />

              <View
                style={{
                  paddingHorizontal: moderateScale(25),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(5),
                }}
              >
                <Checkbox.Android
                  status="unchecked"
                  uncheckedColor={Colors.text_primary}
                  color={Colors.text_primary}
                />
                <Text style={{ fontSize: 16 }}>Golongan</Text>
              </View>
            </View>

            <View style={{ gap: moderateScale(5) }}>
              <TextInput
                mode="outlined"
                label="Eselon"
                textColor="black"
                style={{
                  backgroundColor: "white",
                  height: verticalScale(45),
                }}
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
              />

              <View
                style={{
                  paddingHorizontal: moderateScale(25),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(5),
                }}
              >
                <Checkbox.Android
                  status="unchecked"
                  uncheckedColor={Colors.text_primary}
                  color={Colors.text_primary}
                />
                <Text style={{ fontSize: 16 }}>Eselon</Text>
              </View>
            </View>

            <View style={{ gap: moderateScale(5) }}>
              <TextInput
                mode="outlined"
                label="TMT PNS"
                textColor="black"
                style={{
                  backgroundColor: "white",
                  height: verticalScale(45),
                }}
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
              />

              <View
                style={{
                  paddingHorizontal: moderateScale(25),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(5),
                }}
              >
                <Checkbox.Android
                  status="unchecked"
                  uncheckedColor={Colors.text_primary}
                  color={Colors.text_primary}
                />
                <Text style={{ fontSize: 16 }}>TMT PNS</Text>
              </View>
            </View>

            <View style={{ gap: moderateScale(5) }}>
              <TextInput
                mode="outlined"
                label="Jabatan"
                textColor="black"
                style={{
                  backgroundColor: "white",
                  height: verticalScale(45),
                }}
                outlineColor={Colors.border_primary}
                activeOutlineColor={Colors.border_input_active}
              />

              <View
                style={{
                  paddingHorizontal: moderateScale(25),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(5),
                }}
              >
                <Checkbox.Android
                  status="unchecked"
                  uncheckedColor={Colors.text_primary}
                  color={Colors.text_primary}
                />
                <Text style={{ fontSize: 16 }}>Jabatan</Text>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: moderateScale(25) }}>
            <Button
              icon={"arrow-left"}
              mode="elevated"
              style={{
                backgroundColor: Colors.button_primary,
                paddingVertical: moderateScale(8),
                flex: 1,
              }}
              textColor="white"
            >
              Kembali
            </Button>

            <Button
              icon={"send"}
              mode="elevated"
              style={{
                backgroundColor: Colors.button_secondary,
                paddingVertical: moderateScale(8),
                flex: 1,
              }}
              textColor="black"
            >
              Kirim
            </Button>
          </View>
        </View>
      </ScrollView>

      <Portal>
        <Dialog
          style={{
            backgroundColor: "white",
            padding: moderateScale(10),
          }}
          visible={dialog}
          onDismiss={() => setDialog(false)}
        >
          <Dialog.Title
            style={{
              fontWeight: "bold",
              color: Colors.text_primary,
              fontSize: 19,
            }}
          >
            Peringatan
          </Dialog.Title>

          <Dialog.Content>
            <Text style={{ fontSize: 16 }}>
              Silahkan perbaharui Biodata pegawai pada SIMDIKLAT dengan biodata
              yang sudah tersimpan pada data SIMPEG
            </Text>
          </Dialog.Content>

          <Dialog.Actions>
            <Button
              mode="elevated"
              style={{
                backgroundColor: Colors.button_primary,
                paddingVertical: moderateScale(8),
                flex: 1,
              }}
              textColor="white"
              onPress={() => setDialog(false)}
            >
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ContainerBackground>
  );
}
