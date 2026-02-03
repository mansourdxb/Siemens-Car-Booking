import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "@/screens/LoginScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type AuthStackParamList = {
  Login: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
