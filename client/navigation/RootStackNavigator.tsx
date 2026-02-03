import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainTabNavigator from "@/navigation/MainTabNavigator";
import AuthStackNavigator from "@/navigation/AuthStackNavigator";
import CarDetailScreen from "@/screens/CarDetailScreen";
import NewBookingScreen from "@/screens/NewBookingScreen";
import BookingDetailScreen from "@/screens/BookingDetailScreen";
import CheckoutScreen from "@/screens/CheckoutScreen";
import ReturnScreen from "@/screens/ReturnScreen";
import ModalScreen from "@/screens/ModalScreen";

import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  CarDetail: { carId: string };
  NewBooking: { preselectedCarId?: string } | undefined;
  BookingDetail: { bookingId: string };
  Checkout: { bookingId: string };
  Return: { bookingId: string };
  Modal: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();
  const { theme } = useTheme();
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.backgroundRoot }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {!isAuthenticated ? (
        <Stack.Screen
          name="Auth"
          component={AuthStackNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Main"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CarDetail"
            component={CarDetailScreen}
            options={{ title: "Vehicle" }}
          />
          <Stack.Screen
            name="NewBooking"
            component={NewBookingScreen}
            options={{ title: "New Booking" }}
          />
          <Stack.Screen
            name="BookingDetail"
            component={BookingDetailScreen}
            options={{ title: "Booking" }}
          />
          <Stack.Screen
            name="Checkout"
            component={CheckoutScreen}
            options={{ title: "Check Out" }}
          />
          <Stack.Screen
            name="Return"
            component={ReturnScreen}
            options={{ title: "Return" }}
          />
          <Stack.Screen
            name="Modal"
            component={ModalScreen}
            options={{ presentation: "modal", headerTitle: "Modal" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
