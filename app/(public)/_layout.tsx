import Loading from "@/components/elements/Loading";
import useSession from "@/hooks/useSession";
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

      <Stack.Screen name="pengumuman-detail" />

      <Stack.Screen
        name="kalender-diklat-public"
        options={{ animation: "slide_from_bottom" }}
      />

      <Stack.Screen name="kalender-diklat-public-detail" />

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
