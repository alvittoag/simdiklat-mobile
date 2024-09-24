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
import { Formik } from "formik";
import * as Yup from "yup";

const gantiPasswordSchema = Yup.object().shape({
  saatIni: Yup.string()
    .min(2, "Minimum 2 Karakter")
    .required("Harap Masukan Password Saat Ini"),
  baru: Yup.string()
    .min(2, "Minimum 2 Karakter")
    .required("Harap Masukan Password Baru"),
  konfirmasi: Yup.string().equals([Yup.ref("baru")], "Password Tidak Sama"),
});

export default function GantiPassword() {
  const [showPassword, setShowPassword] = React.useState({
    saatIni: false,
    baru: false,
    konfirmasi: false,
  });

  const mutationEdit = useMutation({
    mutationFn: async ({
      saatIni,
      baru,
      konfirmasi,
    }: {
      saatIni: string;
      baru: string;
      konfirmasi: string;
    }) => {
      try {
        const res = await axiosService.put(
          "/api/auth-rest/user-reset-password",
          {
            old_password: saatIni,
            new_password: konfirmasi,
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

  return (
    <ContainerBackground>
      <View
        style={{
          paddingHorizontal: moderateScale(15),
          paddingVertical: moderateScale(20),
          gap: moderateScale(25),
        }}
      >
        <Formik
          validationSchema={gantiPasswordSchema}
          initialValues={{ saatIni: "", baru: "", konfirmasi: "" }}
          onSubmit={({ baru, konfirmasi, saatIni }, { resetForm }) => {
            mutationEdit.mutate({
              saatIni,
              baru,
              konfirmasi,
            });
            resetForm();
          }}
        >
          {({ handleChange, handleSubmit, values, errors }) => (
            <>
              <View style={{ gap: moderateScale(10) }}>
                <TextInput
                  value={values.saatIni}
                  onChangeText={handleChange("saatIni")}
                  error={errors.saatIni ? true : false}
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

                {errors.saatIni && (
                  <Text style={{ color: "salmon", fontWeight: "bold" }}>
                    {errors.saatIni}
                  </Text>
                )}

                <TextInput
                  label="Password Baru"
                  mode="outlined"
                  value={values.baru}
                  error={errors.baru ? true : false}
                  onChangeText={handleChange("baru")}
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
                        setShowPassword((prev) => ({
                          ...prev,
                          baru: !prev.baru,
                        }))
                      }
                    />
                  }
                />

                {errors.baru && (
                  <Text style={{ color: "salmon", fontWeight: "bold" }}>
                    {errors.baru}
                  </Text>
                )}

                <TextInput
                  label="Konfirmasi Password Baru"
                  mode="outlined"
                  value={values.konfirmasi}
                  onChangeText={handleChange("konfirmasi")}
                  error={errors.konfirmasi ? true : false}
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

                {errors.konfirmasi && (
                  <Text style={{ color: "salmon", fontWeight: "bold" }}>
                    {errors.konfirmasi}
                  </Text>
                )}
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
                  onPress={handleSubmit as any}
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
            </>
          )}
        </Formik>
      </View>
    </ContainerBackground>
  );
}
