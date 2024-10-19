import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { Slot, Stack, router } from "expo-router";
import React from "react";
import { PaperProvider } from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AlertNotificationRoot } from "react-native-alert-notification";

export const client = new ApolloClient({
  uri: process.env.EXPO_PUBLIC_GRAPHQL_URL,
  cache: new InMemoryCache(),
});

export const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider>
          <AlertNotificationRoot theme="light">
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(public)" />
            </Stack>
          </AlertNotificationRoot>
        </PaperProvider>
      </QueryClientProvider>
    </ApolloProvider>
  );
}
