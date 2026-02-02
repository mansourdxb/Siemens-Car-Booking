import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import { format, addHours, setMinutes, setHours, addDays } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { CarCard } from "@/components/CarCard";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { getAvailableCars, createBooking, getCarById } from "@/lib/storage";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import type { Car } from "@/types";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type RouteParams = RouteProp<RootStackParamList, "NewBooking">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const locations = ["Dubai Office", "Al Ain Office", "Abu Dhabi Office", "Customer Site"];

type Step = "time" | "car" | "details" | "confirm";

export default function NewBookingScreen() {
  const route = useRoute<RouteParams>();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { user } = useAuth();

  const preselectedCarId = route.params?.preselectedCarId;

  const [step, setStep] = useState<Step>(preselectedCarId ? "time" : "time");
  const [pickupDate, setPickupDate] = useState(() => {
    const now = new Date();
    const rounded = setMinutes(setHours(addHours(now, 1), now.getHours() + 1), 0);
    return rounded;
  });
  const [returnDate, setReturnDate] = useState(() => addHours(pickupDate, 4));
  const [showPickupPicker, setShowPickupPicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [pickupLocation, setPickupLocation] = useState("Dubai Office");
  const [destination, setDestination] = useState("Al Ain Office");
  const [purpose, setPurpose] = useState("");
  const [passengers, setPassengers] = useState("2");
  const [availableCars, setAvailableCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isLoadingCars, setIsLoadingCars] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAvailableCars = useCallback(async () => {
    setIsLoadingCars(true);
    try {
      const cars = await getAvailableCars(pickupDate, returnDate);
      setAvailableCars(cars);

      if (preselectedCarId) {
        const preselected = cars.find((c) => c.id === preselectedCarId);
        if (preselected) {
          setSelectedCar(preselected);
        } else {
          const car = await getCarById(preselectedCarId);
          if (car) {
            Alert.alert(
              "Car Unavailable",
              `${car.plate} is not available for the selected time. Please choose another car.`
            );
          }
        }
      }
    } catch (error) {
      console.error("Failed to load cars:", error);
    } finally {
      setIsLoadingCars(false);
    }
  }, [pickupDate, returnDate, preselectedCarId]);

  useEffect(() => {
    if (step === "car") {
      loadAvailableCars();
    }
  }, [step, loadAvailableCars]);

  const handleNext = () => {
    if (step === "time") {
      if (returnDate <= pickupDate) {
        Alert.alert("Invalid Time", "Return time must be after pickup time.");
        return;
      }
      setStep("car");
    } else if (step === "car") {
      if (!selectedCar) {
        Alert.alert("Select a Car", "Please select an available car.");
        return;
      }
      setStep("details");
    } else if (step === "details") {
      if (!pickupLocation || !destination) {
        Alert.alert("Missing Info", "Please fill in pickup and destination.");
        return;
      }
      setStep("confirm");
    }
  };

  const handleBack = () => {
    if (step === "car") setStep("time");
    else if (step === "details") setStep("car");
    else if (step === "confirm") setStep("details");
  };

  const handleSubmit = async () => {
    if (!user || !selectedCar) return;

    setIsSubmitting(true);
    try {
      await createBooking({
        carId: selectedCar.id,
        userId: user.id,
        pickupAt: pickupDate.toISOString(),
        returnAt: returnDate.toISOString(),
        pickupLocation,
        destination,
        purpose: purpose || undefined,
        passengers: parseInt(passengers) || 1,
        status: "reserved",
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    } catch (error) {
      console.error("Failed to create booking:", error);
      Alert.alert("Error", "Failed to create booking. Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTimeStep = () => (
    <View style={styles.stepContent}>
      <ThemedText type="h3" style={styles.stepTitle}>
        When do you need the car?
      </ThemedText>

      <Pressable
        onPress={() => setShowPickupPicker(true)}
        style={[styles.dateButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
      >
        <Feather name="calendar" size={20} color={theme.primary} />
        <View style={styles.dateInfo}>
          <ThemedText style={[styles.dateLabel, { color: theme.textSecondary }]}>Pickup</ThemedText>
          <ThemedText style={styles.dateValue}>
            {format(pickupDate, "EEE, MMM d • HH:mm")}
          </ThemedText>
        </View>
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      </Pressable>

      {showPickupPicker ? (
        <DateTimePicker
          value={pickupDate}
          mode="datetime"
          display="spinner"
          onChange={(_, date) => {
            setShowPickupPicker(false);
            if (date) {
              setPickupDate(date);
              setReturnDate(addHours(date, 4));
            }
          }}
          minimumDate={new Date()}
          maximumDate={addDays(new Date(), 30)}
        />
      ) : null}

      <Pressable
        onPress={() => setShowReturnPicker(true)}
        style={[styles.dateButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
      >
        <Feather name="calendar" size={20} color={theme.primary} />
        <View style={styles.dateInfo}>
          <ThemedText style={[styles.dateLabel, { color: theme.textSecondary }]}>Return</ThemedText>
          <ThemedText style={styles.dateValue}>
            {format(returnDate, "EEE, MMM d • HH:mm")}
          </ThemedText>
        </View>
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      </Pressable>

      {showReturnPicker ? (
        <DateTimePicker
          value={returnDate}
          mode="datetime"
          display="spinner"
          onChange={(_, date) => {
            setShowReturnPicker(false);
            if (date) setReturnDate(date);
          }}
          minimumDate={pickupDate}
          maximumDate={addDays(pickupDate, 7)}
        />
      ) : null}

      <View style={styles.quickOptions}>
        <ThemedText style={[styles.quickLabel, { color: theme.textSecondary }]}>Quick options:</ThemedText>
        <View style={styles.quickButtons}>
          {[2, 4, 8].map((hours) => (
            <Pressable
              key={hours}
              onPress={() => setReturnDate(addHours(pickupDate, hours))}
              style={[
                styles.quickButton,
                { backgroundColor: theme.surfaceVariant },
              ]}
            >
              <ThemedText style={{ fontSize: 13 }}>{hours}h trip</ThemedText>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );

  const renderCarStep = () => (
    <View style={styles.stepContent}>
      <ThemedText type="h3" style={styles.stepTitle}>
        Select an available car
      </ThemedText>
      <ThemedText style={[styles.stepSubtitle, { color: theme.textSecondary }]}>
        {format(pickupDate, "MMM d, HH:mm")} - {format(returnDate, "HH:mm")}
      </ThemedText>

      {isLoadingCars ? (
        <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
      ) : availableCars.length === 0 ? (
        <EmptyState
          image="cars"
          title="No cars available"
          description="No cars are available for the selected time window. Try adjusting the dates."
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {availableCars.map((car) => (
            <Pressable
              key={car.id}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedCar(car);
              }}
            >
              <View
                style={[
                  styles.carWrapper,
                  selectedCar?.id === car.id && {
                    borderColor: theme.primary,
                    borderWidth: 2,
                    borderRadius: BorderRadius.md + 2,
                  },
                ]}
              >
                <CarCard car={car} showAvailability={false} />
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderDetailsStep = () => (
    <View style={styles.stepContent}>
      <ThemedText type="h3" style={styles.stepTitle}>
        Trip Details
      </ThemedText>

      <View style={styles.locationSection}>
        <ThemedText style={[styles.fieldLabel, { color: theme.textSecondary }]}>
          Pickup Location
        </ThemedText>
        <View style={styles.locationOptions}>
          {locations.map((loc) => (
            <Pressable
              key={loc}
              onPress={() => {
                Haptics.selectionAsync();
                setPickupLocation(loc);
              }}
              style={[
                styles.locationOption,
                {
                  backgroundColor: pickupLocation === loc ? theme.primary : theme.surface,
                  borderColor: pickupLocation === loc ? theme.primary : theme.border,
                },
              ]}
            >
              <ThemedText
                style={{ color: pickupLocation === loc ? "#FFFFFF" : theme.text, fontSize: 13 }}
              >
                {loc}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.locationSection}>
        <ThemedText style={[styles.fieldLabel, { color: theme.textSecondary }]}>
          Destination
        </ThemedText>
        <View style={styles.locationOptions}>
          {locations.map((loc) => (
            <Pressable
              key={loc}
              onPress={() => {
                Haptics.selectionAsync();
                setDestination(loc);
              }}
              style={[
                styles.locationOption,
                {
                  backgroundColor: destination === loc ? theme.primary : theme.surface,
                  borderColor: destination === loc ? theme.primary : theme.border,
                },
              ]}
            >
              <ThemedText
                style={{ color: destination === loc ? "#FFFFFF" : theme.text, fontSize: 13 }}
              >
                {loc}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <Input
        label="Purpose / Meeting Reference (optional)"
        placeholder="e.g., Client meeting at Hafeet project"
        value={purpose}
        onChangeText={setPurpose}
        leftIcon="file-text"
      />

      <Input
        label="Number of Passengers"
        placeholder="2"
        value={passengers}
        onChangeText={setPassengers}
        keyboardType="number-pad"
        leftIcon="users"
      />
    </View>
  );

  const renderConfirmStep = () => (
    <View style={styles.stepContent}>
      <ThemedText type="h3" style={styles.stepTitle}>
        Confirm Booking
      </ThemedText>

      <View style={[styles.confirmCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }, Shadows.sm]}>
        {selectedCar ? (
          <View style={styles.confirmSection}>
            <ThemedText style={[styles.confirmLabel, { color: theme.textSecondary }]}>Vehicle</ThemedText>
            <ThemedText style={styles.confirmValue}>
              {selectedCar.plate} - {selectedCar.make} {selectedCar.model}
            </ThemedText>
          </View>
        ) : null}

        <View style={styles.confirmSection}>
          <ThemedText style={[styles.confirmLabel, { color: theme.textSecondary }]}>Date & Time</ThemedText>
          <ThemedText style={styles.confirmValue}>
            {format(pickupDate, "EEEE, MMM d, yyyy")}
          </ThemedText>
          <ThemedText style={[styles.confirmSubvalue, { color: theme.textSecondary }]}>
            {format(pickupDate, "HH:mm")} - {format(returnDate, "HH:mm")}
          </ThemedText>
        </View>

        <View style={styles.confirmSection}>
          <ThemedText style={[styles.confirmLabel, { color: theme.textSecondary }]}>Route</ThemedText>
          <ThemedText style={styles.confirmValue}>
            {pickupLocation} → {destination}
          </ThemedText>
        </View>

        {purpose ? (
          <View style={styles.confirmSection}>
            <ThemedText style={[styles.confirmLabel, { color: theme.textSecondary }]}>Purpose</ThemedText>
            <ThemedText style={styles.confirmValue}>{purpose}</ThemedText>
          </View>
        ) : null}

        <View style={styles.confirmSection}>
          <ThemedText style={[styles.confirmLabel, { color: theme.textSecondary }]}>Passengers</ThemedText>
          <ThemedText style={styles.confirmValue}>{passengers}</ThemedText>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerHeight + Spacing.xl, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.progressBar}>
          {["time", "car", "details", "confirm"].map((s, i) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                {
                  backgroundColor:
                    ["time", "car", "details", "confirm"].indexOf(step) >= i
                      ? theme.primary
                      : theme.surfaceVariant,
                },
              ]}
            />
          ))}
        </View>

        {step === "time" && renderTimeStep()}
        {step === "car" && renderCarStep()}
        {step === "details" && renderDetailsStep()}
        {step === "confirm" && renderConfirmStep()}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.backgroundRoot, paddingBottom: insets.bottom + Spacing.lg }]}>
        <View style={styles.footerButtons}>
          {step !== "time" ? (
            <Button
              onPress={handleBack}
              style={[styles.footerButton, { backgroundColor: theme.surfaceVariant }]}
            >
              Back
            </Button>
          ) : null}
          {step === "confirm" ? (
            <Button
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={[styles.footerButton, { flex: 2 }]}
            >
              {isSubmitting ? <ActivityIndicator color="#FFF" size="small" /> : "Confirm Booking"}
            </Button>
          ) : (
            <Button
              onPress={handleNext}
              style={[styles.footerButton, step === "time" && { flex: 1 }]}
            >
              Next
            </Button>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  progressBar: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    marginBottom: Spacing.sm,
  },
  stepSubtitle: {
    marginBottom: Spacing.lg,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  dateValue: {
    fontWeight: "500",
  },
  quickOptions: {
    marginTop: Spacing.lg,
  },
  quickLabel: {
    fontSize: 13,
    marginBottom: Spacing.sm,
  },
  quickButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  quickButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  loader: {
    marginTop: Spacing["3xl"],
  },
  carWrapper: {
    marginBottom: Spacing.xs,
  },
  locationSection: {
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    fontSize: 13,
    marginBottom: Spacing.sm,
  },
  locationOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  locationOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  confirmCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  confirmSection: {
    marginBottom: Spacing.lg,
  },
  confirmLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  confirmValue: {
    fontWeight: "500",
    fontSize: 15,
  },
  confirmSubvalue: {
    fontSize: 13,
    marginTop: 2,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  footerButtons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  footerButton: {
    flex: 1,
  },
});
