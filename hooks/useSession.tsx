import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@/services/api/auth";

export default function useSession() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const getSession = async () => {
      try {
        const session = await AsyncStorage.getItem("session");

        await auth.getSession();
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
