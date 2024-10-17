import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { TextInput } from "react-native-paper";
import { router } from "expo-router";
import ButtonOpacity from "@/components/elements/ButtonOpacity";
import { Colors } from "@/constants/Colors";
import { axiosService } from "@/services/axiosService";
import * as qs from "qs";
import { Formik } from "formik";
import * as Yup from "yup";
import auth from "@/services/api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loading from "@/components/elements/Loading";
import Error from "@/components/elements/Error";

const loginSchema = Yup.object().shape({
  nrk: Yup.string().min(2, "Minimum 2 Karakter").required("Harap Masukan NRK"),
  password: Yup.string().required("Harap Masukan Password"),
});

export default function FormLogin() {
  const [showPassword, setShowPassword] = React.useState(false);

  const { data: csrfToken } = useQuery({
    queryKey: ["csrfToken"],
    queryFn: async () => {
      const res = await axiosService.get("/api/auth/csrf");
      return res.data.csrfToken;
    },
    retry: 10,
  });

  const { mutate, isPending: isPendingMutate } = useMutation({
    mutationFn: async (values: { nrk: string; password: string }) => {
      const options = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify({
          username: values.nrk,
          password: values.password,
          csrfToken: csrfToken,
        }),
        url: "/api/auth/callback/credentials",
      };
      await axiosService(options).then(async () => {
        const { data } = await auth.getSession();

        if (!data.user.nrk) {
          return Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: "Gagal Login",
            textBody: "NRK/Username Atau Password Salah",
            button: "Tutup",
          });
        }

        await AsyncStorage.setItem("session", JSON.stringify(data));
      });
    },
    onSuccess: () => {
      router.replace("/halaman-utama");
    },
    onError: (err) => {
      console.log(err);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: "Terjadi Kesalahan Pada Server",
        button: "Tutup",
      });
    },
    retry: 10,
  });

  const handleLogin = async (values: { nrk: string; password: string }) => {
    mutate(values);
  };

  return (
    <View style={{ gap: moderateScale(25) }}>
      <Formik
        onSubmit={(values) => handleLogin(values)}
        validationSchema={loginSchema}
        initialValues={{ nrk: "", password: "" }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View style={{ gap: moderateScale(10) }}>
            <TextInput
              error={errors.nrk ? true : false}
              onChangeText={handleChange("nrk")}
              onBlur={handleBlur("nrk")}
              value={values.nrk}
              label="NRK/Username"
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

            {errors.nrk && (
              <Text style={{ color: "salmon", fontWeight: "bold" }}>
                {errors.nrk}
              </Text>
            )}

            <TextInput
              error={errors.password ? true : false}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              label="Password"
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

            {errors.password && (
              <Text style={{ color: "salmon", fontWeight: "bold" }}>
                {errors.password}
              </Text>
            )}

            <View style={{ gap: moderateScale(10) }}>
              <ButtonOpacity
                bgcolor={Colors.button_primary}
                textcolor="white"
                textsize={15}
                vertical={19}
                textweight="600"
                onPress={handleSubmit}
              >
                {isPendingMutate ? (
                  <ActivityIndicator size={"small"} color={"white"} />
                ) : (
                  "Masuk"
                )}
              </ButtonOpacity>

              <ButtonOpacity
                bgcolor="#D40E0E"
                textcolor="white"
                textsize={15}
                vertical={19}
                textweight="600"
                onPress={() => router.push("/lupa-password")}
              >
                Lupa Password
              </ButtonOpacity>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}
