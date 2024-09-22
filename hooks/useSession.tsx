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

        const dateNow = new Date();

        setIsAuthenticated(session !== null);
      } catch (error) {
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
