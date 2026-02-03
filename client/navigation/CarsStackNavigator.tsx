import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CarsScreen from "@/screens/CarsScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type CarsStackParamList = {
  Cars: undefined;
};

const Stack = createNativeStackNavigator<CarsStackParamList>();

export default function CarsStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Cars"
        component={CarsScreen}
        options={{
          headerTitle: () => <HeaderTitle title="Cars" />,
        }}
      />
    </Stack.Navigator>
  );
}
