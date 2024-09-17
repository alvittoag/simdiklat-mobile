import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@/services/api/auth";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { router } from "expo-router";

export default function useSession() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const getSession = async () => {
      try {
        const session = await AsyncStorage.getItem("session");

        const { data } = await auth.getSession();

        const dateNow = new Date();

        const expired = dateNow.getTime() > data.expires;

        if (expired) {
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: "Error",
            textBody: "Sesi anda telah habis. Silahkan login kembali",
            button: "Tutup",
          });

          await AsyncStorage.clear();

          router.replace("/login");
        }

        setIsAuthenticated(session !== null);
      } catch (error) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "Terjadi Kesalahan saat melakukan prosess data pada Server",
          button: "Tutup",
        });
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();
  }, []);

  return {
    isAuthenticated,
    isLoading,
  };
}
