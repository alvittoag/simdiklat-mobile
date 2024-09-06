import Loading from "@/components/elements/Loading";
import useSession from "@/hooks/useSession";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function PublicLayout() {
  const { isAuthenticated, isLoading } = useSession();

  if (isLoading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return <Redirect href="/halaman-utama" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen
        name="pengumuman"
        options={{ animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name="unduh-panduan"
        options={{ animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name="lupa-password"
        options={{ animation: "slide_from_bottom" }}
      />
    </Stack>
  );
}
