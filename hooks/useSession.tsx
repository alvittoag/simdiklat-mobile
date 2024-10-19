import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@/services/api/auth";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { router } from "expo-router";
import { ISession } from "@/type";

export default function useSession() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      try {
        const session = await AsyncStorage.getItem("session");

        if (session) {
          const sessionParse: ISession = JSON.parse(session);

          const dateNow = new Date();
          const expirationDate = new Date(sessionParse.expires);

          if (dateNow > expirationDate) {
            await AsyncStorage.removeItem("session");
            setIsAuthenticated(false);
            Dialog.show({
              type: ALERT_TYPE.WARNING,
              title: "Session Expired",
              textBody: "Session anda telah habis, harap melakukan login ulang",
              button: "tutup",
            });
            router.replace("/login");
          } else {
            setIsAuthenticated(true);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    getSession();
  }, []);

  return {
    isAuthenticated,
    isLoading,
  };
}
