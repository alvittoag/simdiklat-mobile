import {
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
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

export default function LupaPassword() {
  const [active, setActive] = React.useState(0);
  const [doneProgress, setDoneProgress] = React.useState<any>([]);

  const [showPassword, setShowPassword] = React.useState(false);

  const [email, setEmail] = React.useState("");
  const [tokenVal, setTokenVal] = React.useState("");
  const [password, setPassword] = React.useState({
    pass: "",
    conf: "",
  });

  const [loading, setLoading] = React.useState(false);

  const handleEmail = async () => {
    setLoading(true);
    const token = Math.ceil(Math.random() * 99999).toString();

    console.log(token);

    const templateParams = {
      email: email,
      message: token,
      to: email,
      location: Platform.OS === "web" ? "Web Browser" : "React Native App",
    };

    try {
      await auth.forget_password_token({ email, token });

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
      console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    setLoading(true);
    try {
      await auth.forget_password_verify({ email, token: tokenVal });

      setActive(2);
      setDoneProgress([...doneProgress, active]);
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

  const handleReset = async () => {
    if (password.pass !== password.conf) {
      return Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal Reset",
        textBody: "Konfirmasi Password Tidak Sesuai",
        button: "Tutup",
      });
    }

    setLoading(true);

    try {
      await auth.forget_password_reset({
        email,
        token: tokenVal,
        password: password.pass,
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
            <View style={{ gap: moderateScale(20) }}>
              <TextInput
                value={email}
                inputMode="email"
                onChangeText={(e) => setEmail(e)}
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

              <Button
                icon={"send"}
                onPress={handleEmail}
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

          {active === 1 && (
            <View style={{ gap: moderateScale(20) }}>
              <TextInput
                value={tokenVal}
                onChangeText={(e) => setTokenVal(e)}
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

              <Button
                icon={"send"}
                onPress={handleVerifyEmail}
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

          {active === 2 && (
            <View style={{ gap: moderateScale(20) }}>
              <TextInput
                value={password.pass}
                onChangeText={(e) =>
                  setPassword((prev) => ({ ...prev, pass: e }))
                }
                label="Password Baru"
                mode="outlined"
                secureTextEntry={!showPassword}
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
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              <TextInput
                value={password.conf}
                onChangeText={(e) =>
                  setPassword((prev) => ({ ...prev, conf: e }))
                }
                label="Konfirmasi Password Baru"
                mode="outlined"
                secureTextEntry={!showPassword}
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
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              <Button
                icon={"send"}
                onPress={handleReset}
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
