import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";

import RootStackNavigator from "@/navigation/RootStackNavigator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import { Colors, Shadows } from "@/constants/theme";

export default function App() {
  const AppShell = (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SafeAreaProvider>
            <GestureHandlerRootView style={styles.root}>
              <KeyboardProvider>
                <NavigationContainer>
                  <RootStackNavigator />
                </NavigationContainer>
                <StatusBar style="auto" />
              </KeyboardProvider>
            </GestureHandlerRootView>
          </SafeAreaProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );

  if (Platform.OS === "web") {
    return (
      <View style={[styles.webOuter, { backgroundColor: Colors.light.backgroundRoot }]}>
        <View style={[styles.webPhoneFrame, { backgroundColor: Colors.light.backgroundDefault }, Shadows.lg]}>
          {AppShell}
        </View>
      </View>
    );
  }

  return AppShell;
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  webOuter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    paddingHorizontal: 12,
  },

  webPhoneFrame: {
    width: 420,
    maxWidth: "100%",
    height: 860,
    maxHeight: "92vh",
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
});
