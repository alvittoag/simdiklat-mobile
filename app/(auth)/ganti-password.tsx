import { View, Text } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import { Button, TextInput } from "react-native-paper";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { useMutation } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";

export default function GantiPassword() {
  const [password, setPassword] = React.useState({
    saatIni: "",
    baru: "",
    konfirmasi: "",
  });

  const [showPassword, setShowPassword] = React.useState({
    saatIni: false,
    baru: false,
    konfirmasi: false,
  });

  const mutationEdit = useMutation({
    mutationFn: async () => {
      try {
        const res = await axiosService.put(
          "/api/auth-rest/user-reset-password",
          {
            old_password: password.saatIni,
            new_password: password.baru,
          }
        );
        return res.data;
      } catch (error: any) {
        throw error.response.data;
      }
    },
    onSuccess: () => {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: "Password Berhasil Diubah",
        button: "Tutup",
      });

      setPassword({
        saatIni: "",
        baru: "",
        konfirmasi: "",
      });
    },
    onError: (error) => {
      console.log(error);
      if (error.message === "Password Lama Salah") {
        return Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Gagal Ganti Password",
          textBody: error.message,
          button: "Tutup",
        });
      }
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal Ganti Password",
        textBody: "Terjadi Kesalahan Saat Mengganti Password",
        button: "Tutup",
      });
    },
  });

  const handleChangePassword = () => {
    if (Object.values(password).includes("")) {
      return Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal Ganti Password",
        textBody: "Harap Isi Semua Data",
        button: "Tutup",
      });
    }
    if (password.baru !== password.konfirmasi) {
      return Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal Ganti Password",
        textBody: "Konfirmasi Password Tidak Sesuai",
        button: "Tutup",
      });
    }

    mutationEdit.mutate();
  };

  return (
    <ContainerBackground>
      <View
        style={{
          paddingHorizontal: moderateScale(15),
          paddingVertical: moderateScale(20),
          gap: moderateScale(25),
        }}
      >
        <View style={{ gap: moderateScale(10) }}>
          <TextInput
            value={password.saatIni}
            onChangeText={(e) =>
              setPassword((prev) => ({ ...prev, saatIni: e }))
            }
            label="Password Saat ini"
            mode="outlined"
            secureTextEntry={!showPassword.saatIni}
            style={{
              backgroundColor: "white",
              height: verticalScale(50),
            }}
            activeOutlineColor={Colors.border_input_active}
            outlineColor={Colors.border_primary}
            textColor="black"
            right={
              <TextInput.Icon
                icon={showPassword.saatIni ? "eye-off" : "eye"}
                onPress={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    saatIni: !prev.saatIni,
                  }))
                }
              />
            }
          />

          <TextInput
            label="Password Baru"
            mode="outlined"
            value={password.baru}
            onChangeText={(e) => setPassword((prev) => ({ ...prev, baru: e }))}
            secureTextEntry={!showPassword.baru}
            style={{
              backgroundColor: "white",
              height: verticalScale(50),
            }}
            activeOutlineColor={Colors.border_input_active}
            outlineColor={Colors.border_primary}
            textColor="black"
            right={
              <TextInput.Icon
                icon={showPassword.baru ? "eye-off" : "eye"}
                onPress={() =>
                  setShowPassword((prev) => ({ ...prev, baru: !prev.baru }))
                }
              />
            }
          />

          <TextInput
            label="Konfirmasi Password Baru"
            mode="outlined"
            value={password.konfirmasi}
            onChangeText={(e) =>
              setPassword((prev) => ({ ...prev, konfirmasi: e }))
            }
            secureTextEntry={!showPassword.konfirmasi}
            style={{
              backgroundColor: "white",
              height: verticalScale(50),
            }}
            activeOutlineColor={Colors.border_input_active}
            outlineColor={Colors.border_primary}
            textColor="black"
            right={
              <TextInput.Icon
                icon={showPassword.konfirmasi ? "eye-off" : "eye"}
                onPress={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    konfirmasi: !prev.konfirmasi,
                  }))
                }
              />
            }
          />
        </View>

        <View style={{ flexDirection: "row", gap: moderateScale(25) }}>
          <Button
            onPress={() => router.back()}
            textColor="white"
            icon={"arrow-left"}
            style={{
              backgroundColor: Colors.button_primary,
              flex: 1,
              paddingVertical: moderateScale(10),
              borderRadius: 7,
            }}
          >
            Kembali
          </Button>

          <Button
            loading={mutationEdit.isPending}
            disabled={mutationEdit.isPending}
            labelStyle={{ color: "black" }}
            onPress={handleChangePassword}
            icon={"content-save-outline"}
            style={{
              backgroundColor: Colors.button_secondary,
              flex: 1,
              paddingVertical: moderateScale(10),
              borderRadius: 7,
            }}
          >
            Simpan
          </Button>
        </View>
      </View>
    </ContainerBackground>
  );
}
