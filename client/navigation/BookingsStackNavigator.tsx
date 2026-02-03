import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BookingsScreen from "@/screens/BookingsScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type BookingsStackParamList = {
  Bookings: undefined;
};

const Stack = createNativeStackNavigator<BookingsStackParamList>();

export default function BookingsStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{
          headerTitle: () => <HeaderTitle title="Bookings" />,
        }}
      />
    </Stack.Navigator>
  );
}
