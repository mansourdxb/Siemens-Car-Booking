import React, { useState } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useTheme } from "@/hooks/useTheme";
import { returnBooking } from "@/lib/storage";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type RouteParams = RouteProp<RootStackParamList, "Return">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const fuelLevels = ["Full", "3/4", "1/2", "1/4", "Empty"];

export default function ReturnScreen() {
  const route = useRoute<RouteParams>();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { bookingId } = route.params;

  const [odometer, setOdometer] = useState("");
  const [fuel, setFuel] = useState("Full");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!odometer) {
      Alert.alert("Missing Info", "Please enter the current odometer reading.");
      return;
    }

    setIsSubmitting(true);
    try {
      await returnBooking(bookingId, parseInt(odometer), fuel, notes || undefined);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    } catch (error) {
      console.error("Return failed:", error);
      Alert.alert("Error", "Failed to return car. Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      <ThemedText type="h3" style={styles.title}>
        Return Car
      </ThemedText>
      <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
        Record the vehicle condition after your trip
      </ThemedText>

      <View
        style={[
          styles.card,
          { backgroundColor: theme.surface, borderColor: theme.cardBorder },
          Shadows.sm,
        ]}
      >
        <Input
          label="Odometer Reading (km)"
          placeholder="e.g., 45430"
          value={odometer}
          onChangeText={setOdometer}
          keyboardType="number-pad"
          leftIcon="activity"
        />

        <View style={styles.fuelSection}>
          <ThemedText style={styles.fuelLabel}>Fuel Level</ThemedText>
          <View style={styles.fuelOptions}>
            {fuelLevels.map((level) => (
              <Button
                key={level}
                onPress={() => {
                  Haptics.selectionAsync();
                  setFuel(level);
                }}
                style={[
                  styles.fuelButton,
                  {
                    backgroundColor:
                      fuel === level ? theme.primary : theme.surfaceVariant,
                  },
                ]}
              >
                {level}
              </Button>
            ))}
          </View>
        </View>

        <Input
          label="Notes / Issues (optional)"
          placeholder="Any damage, issues, or notes about the trip..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          leftIcon="edit-3"
          style={styles.notesInput}
        />

        <View
          style={[
            styles.infoBox,
            { backgroundColor: theme.warning + "15", borderColor: theme.warning },
          ]}
        >
          <ThemedText style={[styles.infoText, { color: theme.warning }]}>
            Please return the car keys to the designated location after completing this form.
          </ThemedText>
        </View>
      </View>

      <Button
        onPress={handleSubmit}
        disabled={isSubmitting}
        style={styles.submitButton}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          "Confirm Return"
        )}
      </Button>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    marginBottom: Spacing.xl,
  },
  card: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  fuelSection: {
    marginBottom: Spacing.lg,
  },
  fuelLabel: {
    fontWeight: "500",
    marginBottom: Spacing.md,
  },
  fuelOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  fuelButton: {
    paddingHorizontal: Spacing.md,
    height: 40,
  },
  notesInput: {
    height: 80,
    textAlignVertical: "top",
  },
  infoBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  infoText: {
    fontSize: 13,
  },
  submitButton: {
    width: "100%",
  },
});
