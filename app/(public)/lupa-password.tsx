import {
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  Text,
} from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import assets from "@/assets";
import { Colors } from "@/constants/Colors";
import { Avatar, Button, TextInput } from "react-native-paper";
import { router } from "expo-router";

const { width } = Dimensions.get("window");
const iconSize = 35;
const paddingHorizontal = moderateScale(15);
const lineWidth = (width - iconSize * 3 - paddingHorizontal * 2) / 4;
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import auth from "@/services/api/auth";
import { AxiosError } from "axios";
import { Formik } from "formik";
import * as Yup from "yup";

const emailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email Tidak Valid")
    .required("Harap Masukan Email"),
});

const tokenSchema = Yup.object().shape({
  token: Yup.string()
    .min(5, "Minimum 5 Karakter")
    .required("Harap Masukan Token"),
});

const resetSchema = Yup.object().shape({
  pass: Yup.string()
    .min(2, "Minimum 2 Karakter")
    .required("Harap Masukan Password"),
  conf: Yup.string().equals([Yup.ref("pass")], "Password Tidak Sama"),
});

export default function LupaPassword() {
  const [active, setActive] = React.useState(0);
  const [doneProgress, setDoneProgress] = React.useState<any>([]);

  const [showPassword, setShowPassword] = React.useState({
    pass: false,
    conf: false,
  });
  const [emailValid, setEmailValid] = React.useState("");
  const [tokenValid, setTokenValid] = React.useState("");

  const [loading, setLoading] = React.useState(false);

  const handleEmail = async (values: { email: string }) => {
    setLoading(true);
    const token = String(Math.floor(Math.random() * 100000)).padStart(5, "0");

    const templateParams = {
      email: values.email,
      message: token,
      to: values.email,
      location: Platform.OS === "web" ? "Web Browser" : "React Native App",
    };

    try {
      await auth.forget_password_token({
        email: values.email,
        token,
      });

      const response = await fetch(process.env.EXPO_PUBLIC_API_EMAIL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: process.env.EXPO_PUBLIC_SERVICE_ID!,
          template_id: process.env.EXPO_PUBLIC_TEMPLATE_ID!,
          user_id: process.env.EXPO_PUBLIC_USER_ID!,
          template_params: templateParams,
          accessToken: process.env.EXPO_PUBLIC_TOKEN!,
        }),
      });

      setEmailValid(values.email);

      if (!response.ok) {
        return Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Gagal Kirim Email",
          textBody: "Terjadi Kesalahan Saat Mengirim Email",
          button: "Tutup",
        });
      }

      setActive(1);
      setDoneProgress([...doneProgress, active]);
    } catch (err: unknown) {
      const error = err as AxiosError;

      if (error.response?.status === 400) {
        return Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Gagal Kirim Email",
          textBody: "Email Tidak Terdaftar",
          button: "Tutup",
        });
      }
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal Kirim Email",
        textBody: "Terjadi Kesalahan Saat Mengirim Email",
        button: "Tutup",
      });
      console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (values: { token: string }) => {
    setLoading(true);
    try {
      await auth.forget_password_verify({
        email: emailValid,
        token: values.token,
      });

      setActive(2);
      setDoneProgress([...doneProgress, active]);
      setTokenValid(values.token);
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.status === 400) {
        return Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Gagal Verifikasi",
          textBody: "Token Tidak Sesuai",
          button: "Tutup",
        });
      }

      console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async ({
    pass,
    conf,
  }: {
    pass: string;
    conf: string;
  }) => {
    setLoading(true);

    try {
      // email should be email valid state
      await auth.forget_password_reset({
        email: emailValid,
        token: tokenValid,
        password: pass,
      });

      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil Reset Password",
        textBody: "Silahkan login menggunakan password baru anda",
        button: "Tutup",
      });

      router.replace("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContainerBackground>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: moderateScale(15),
          gap: moderateScale(50),
        }}
      >
        <View style={{ alignContent: "center" }}>
          <Image
            source={assets.logo_bpsdm}
            style={{
              width: scale(200),
              height: verticalScale(58),
              margin: "auto",
            }}
          />
        </View>

        <View style={{ gap: moderateScale(25) }}>
          <View style={styles.container}>
            <View style={styles.stepContainer}>
              <Avatar.Icon
                size={iconSize}
                style={{
                  backgroundColor: doneProgress.includes(0)
                    ? Colors.primary
                    : active === 0
                    ? Colors.primary
                    : Colors.text_secondary,
                }}
                icon={doneProgress?.includes(0) ? "check" : "numeric-1"}
              />
              <View style={styles.line} />
            </View>

            <View style={styles.middleStepContainer}>
              <View style={styles.line} />
              <Avatar.Icon
                size={iconSize}
                style={{
                  backgroundColor: doneProgress.includes(1)
                    ? Colors.primary
                    : active === 1
                    ? Colors.primary
                    : Colors.text_secondary,
                }}
                icon={doneProgress?.includes(1) ? "check" : "numeric-2"}
              />
              <View style={styles.line} />
            </View>

            <View style={styles.stepContainer}>
              <View style={styles.line} />
              <Avatar.Icon
                size={iconSize}
                style={{
                  backgroundColor: doneProgress.includes(2)
                    ? Colors.primary
                    : active === 2
                    ? Colors.primary
                    : Colors.text_secondary,
                }}
                icon={doneProgress?.includes(2) ? "check" : "numeric-3"}
              />
            </View>
          </View>

          {active === 0 && (
            <Formik
              initialValues={{ email: "" }}
              validationSchema={emailSchema}
              onSubmit={(values) => handleEmail(values)}
            >
              {({ handleChange, handleSubmit, values, errors }) => (
                <View style={{ gap: moderateScale(20) }}>
                  <TextInput
                    value={values.email}
                    error={errors.email ? true : false}
                    inputMode="email"
                    onChangeText={handleChange("email")}
                    label="Masukan Email Anda"
                    mode="outlined"
                    style={{
                      width: scale(320),
                      backgroundColor: "white",
                      height: verticalScale(50),
                    }}
                    activeOutlineColor={Colors.border_input_active}
                    outlineColor={Colors.border_primary}
                    textColor="black"
                  />

                  {errors.email && (
                    <Text style={{ color: "salmon", fontWeight: "bold" }}>
                      {errors.email}
                    </Text>
                  )}

                  <Button
                    icon={"send"}
                    onPress={handleSubmit as any}
                    loading={loading}
                    mode="contained"
                    textColor="white"
                    style={{
                      backgroundColor: Colors.button_primary,
                      borderRadius: 7,
                      paddingVertical: 8,
                    }}
                  >
                    Kirim
                  </Button>
                </View>
              )}
            </Formik>
          )}

          {active === 1 && (
            <Formik
              initialValues={{ token: "" }}
              validationSchema={tokenSchema}
              onSubmit={(val) => handleVerifyEmail(val)}
            >
              {({ handleChange, handleSubmit, values, errors }) => (
                <View style={{ gap: moderateScale(20) }}>
                  <TextInput
                    value={values.token}
                    error={errors.token ? true : false}
                    onChangeText={handleChange("token")}
                    inputMode="numeric"
                    label="Masukan Token Anda"
                    mode="outlined"
                    style={{
                      width: scale(320),
                      backgroundColor: "white",
                      height: verticalScale(50),
                    }}
                    activeOutlineColor={Colors.border_input_active}
                    outlineColor={Colors.border_primary}
                    textColor="black"
                  />

                  {errors.token && (
                    <Text style={{ color: "salmon", fontWeight: "bold" }}>
                      {errors.token}
                    </Text>
                  )}

                  <Button
                    icon={"send"}
                    onPress={handleSubmit as any}
                    loading={loading}
                    mode="contained"
                    textColor="white"
                    style={{
                      backgroundColor: Colors.button_primary,
                      borderRadius: 7,
                      paddingVertical: 8,
                    }}
                  >
                    Kirim
                  </Button>
                </View>
              )}
            </Formik>
          )}

          {active === 2 && (
            <Formik
              initialValues={{ pass: "", conf: "" }}
              onSubmit={(val) =>
                handleReset({ pass: val.pass, conf: val.conf })
              }
              validationSchema={resetSchema}
            >
              {({ handleChange, handleSubmit, values, errors }) => (
                <View style={{ gap: moderateScale(20) }}>
                  <TextInput
                    value={values.pass}
                    onChangeText={handleChange("pass")}
                    error={errors.pass ? true : false}
                    label="Password Baru"
                    mode="outlined"
                    secureTextEntry={!showPassword.pass}
                    style={{
                      width: scale(320),
                      backgroundColor: "white",
                      height: verticalScale(50),
                    }}
                    activeOutlineColor={Colors.border_input_active}
                    outlineColor={Colors.border_primary}
                    textColor="black"
                    right={
                      <TextInput.Icon
                        icon={showPassword.pass ? "eye-off" : "eye"}
                        onPress={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            pass: !prev.pass,
                          }))
                        }
                      />
                    }
                  />

                  {errors.pass && (
                    <Text style={{ color: "salmon", fontWeight: "bold" }}>
                      {errors.pass}
                    </Text>
                  )}

                  <TextInput
                    value={values.conf}
                    onChangeText={handleChange("conf")}
                    error={errors.conf ? true : false}
                    label="Konfirmasi Password Baru"
                    mode="outlined"
                    secureTextEntry={!showPassword.conf}
                    style={{
                      width: scale(320),
                      backgroundColor: "white",
                      height: verticalScale(50),
                    }}
                    activeOutlineColor={Colors.border_input_active}
                    outlineColor={Colors.border_primary}
                    textColor="black"
                    right={
                      <TextInput.Icon
                        icon={showPassword.conf ? "eye-off" : "eye"}
                        onPress={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            conf: !prev.conf,
                          }))
                        }
                      />
                    }
                  />

                  {errors.conf && (
                    <Text style={{ color: "salmon", fontWeight: "bold" }}>
                      {errors.conf}
                    </Text>
                  )}

                  <Button
                    icon={"send"}
                    onPress={handleSubmit as any}
                    loading={loading}
                    mode="contained"
                    textColor="white"
                    style={{
                      backgroundColor: Colors.button_primary,
                      borderRadius: 7,
                      paddingVertical: 8,
                    }}
                  >
                    Ganti Password
                  </Button>
                </View>
              )}
            </Formik>
          )}
        </View>
      </View>
    </ContainerBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  middleStepContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  line: {
    height: 2,
    backgroundColor: Colors.border_primary,
    width: lineWidth,
  },
});
