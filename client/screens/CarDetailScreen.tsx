import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import { format, isAfter } from "date-fns";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { StatusBadge } from "@/components/StatusBadge";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { getCarWithBookings, getUserById, requestToJoinRide } from "@/lib/storage";
import { Spacing, BorderRadius, Shadows, StatusColors } from "@/constants/theme";
import type { CarWithBookings, Booking, User } from "@/types";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type RouteParams = RouteProp<RootStackParamList, "CarDetail">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface BookingBlock extends Booking {
  booker?: User;
}

export default function CarDetailScreen() {
  const route = useRoute<RouteParams>();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { carId } = route.params;

  const [car, setCar] = useState<CarWithBookings | null>(null);
  const [bookings, setBookings] = useState<BookingBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCar = useCallback(async () => {
    try {
      const carData = await getCarWithBookings(carId);
      setCar(carData);

      if (carData?.bookings) {
        const now = new Date();
        const upcomingBookings = carData.bookings
          .filter((b) => isAfter(new Date(b.returnAt), now) && b.status !== "cancelled")
          .sort((a, b) => new Date(a.pickupAt).getTime() - new Date(b.pickupAt).getTime());

        const bookingsWithUsers = await Promise.all(
          upcomingBookings.map(async (booking) => {
            const booker = await getUserById(booking.userId);
            return { ...booking, booker: booker || undefined };
          })
        );
        setBookings(bookingsWithUsers);
      }
    } catch (error) {
      console.error("Failed to load car:", error);
    } finally {
      setIsLoading(false);
    }
  }, [carId]);

  useEffect(() => {
    loadCar();
  }, [loadCar]);

  useEffect(() => {
    if (car) {
      navigation.setOptions({ title: car.plate });
    }
  }, [car, navigation]);

  const handleBookCar = () => {
    navigation.navigate("NewBooking", { preselectedCarId: carId });
  };

  const handleJoinRide = async (booking: BookingBlock) => {
    if (!user) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await requestToJoinRide(
      booking.id,
      user.id,
      `Hi, I'm heading to ${booking.destination} too. Can I join your ride?`
    );
    loadCar();
  };

  if (isLoading) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerHeight + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl },
        ]}
      >
        <LoadingSkeleton height={200} borderRadius={BorderRadius.md} />
        <View style={styles.specGrid}>
          {[1, 2, 3, 4].map((i) => (
            <LoadingSkeleton key={i} width="48%" height={60} style={{ marginBottom: Spacing.md }} />
          ))}
        </View>
      </ScrollView>
    );
  }

  if (!car) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.backgroundRoot }]}>
        <ThemedText>Car not found</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: headerHeight + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={
          car.photoUrl
            ? { uri: car.photoUrl }
            : require("../../assets/images/default-car.png")
        }
        style={styles.image}
        contentFit="cover"
        transition={200}
      />

      <View style={styles.headerInfo}>
        <View>
          <ThemedText type="h2">{car.make} {car.model}</ThemedText>
          <ThemedText style={[styles.plate, { color: theme.textSecondary }]}>
            {car.plate}
          </ThemedText>
        </View>
        <StatusBadge status={car.status} />
      </View>

      <View style={[styles.specCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }, Shadows.sm]}>
        <View style={styles.specGrid}>
          <View style={styles.specItem}>
            <Feather name="users" size={20} color={theme.primary} />
            <ThemedText style={styles.specValue}>{car.seats}</ThemedText>
            <ThemedText style={[styles.specLabel, { color: theme.textSecondary }]}>Seats</ThemedText>
          </View>
          <View style={styles.specItem}>
            <Feather name="map-pin" size={20} color={theme.primary} />
            <ThemedText style={styles.specValue}>{car.base}</ThemedText>
            <ThemedText style={[styles.specLabel, { color: theme.textSecondary }]}>Base</ThemedText>
          </View>
          <View style={styles.specItem}>
            <Feather name="droplet" size={20} color={theme.primary} />
            <ThemedText style={styles.specValue}>{car.lastFuel || "N/A"}</ThemedText>
            <ThemedText style={[styles.specLabel, { color: theme.textSecondary }]}>Fuel</ThemedText>
          </View>
          <View style={styles.specItem}>
            <Feather name="activity" size={20} color={theme.primary} />
            <ThemedText style={styles.specValue}>
              {car.lastOdometer ? `${(car.lastOdometer / 1000).toFixed(0)}k` : "N/A"}
            </ThemedText>
            <ThemedText style={[styles.specLabel, { color: theme.textSecondary }]}>KM</ThemedText>
          </View>
        </View>

        {car.tags.length > 0 ? (
          <View style={styles.tagsRow}>
            {car.tags.map((tag) => (
              <View key={tag} style={[styles.tag, { backgroundColor: theme.surfaceVariant }]}>
                <ThemedText style={[styles.tagText, { color: theme.textSecondary }]}>
                  {tag.toUpperCase()}
                </ThemedText>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      {car.notes ? (
        <View style={[styles.notesCard, { backgroundColor: theme.warning + "15", borderColor: theme.warning }]}>
          <Feather name="alert-circle" size={16} color={theme.warning} />
          <ThemedText style={[styles.notesText, { color: theme.warning }]}>{car.notes}</ThemedText>
        </View>
      ) : null}

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>Upcoming Bookings</ThemedText>
        {bookings.length === 0 ? (
          <View style={[styles.emptyBookings, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
            <Feather name="calendar" size={24} color={theme.accent} />
            <ThemedText style={{ color: theme.textSecondary, marginTop: Spacing.sm }}>
              No upcoming bookings
            </ThemedText>
          </View>
        ) : (
          bookings.map((booking) => (
            <View
              key={booking.id}
              style={[
                styles.bookingBlock,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.cardBorder,
                  borderLeftColor: StatusColors[booking.status],
                },
                Shadows.sm,
              ]}
            >
              <View style={styles.bookingHeader}>
                <View>
                  <ThemedText style={styles.bookingRoute}>
                    {booking.pickupLocation} → {booking.destination}
                  </ThemedText>
                  <ThemedText style={[styles.bookingTime, { color: theme.textSecondary }]}>
                    {format(new Date(booking.pickupAt), "MMM d, HH:mm")} -{" "}
                    {format(new Date(booking.returnAt), "HH:mm")}
                  </ThemedText>
                </View>
                <StatusBadge status={booking.status} size="small" />
              </View>

              <View style={styles.bookerInfo}>
                <Feather name="user" size={14} color={theme.textSecondary} />
                <ThemedText style={[styles.bookerName, { color: theme.textSecondary }]}>
                  {booking.booker?.fullName || "Unknown"}
                  {booking.booker?.sharePhone && booking.booker?.phone
                    ? ` • ${booking.booker.phone}`
                    : null}
                </ThemedText>
              </View>

              {booking.userId !== user?.id ? (
                <Pressable
                  onPress={() => handleJoinRide(booking)}
                  style={[styles.joinButton, { borderColor: theme.primary }]}
                >
                  <Feather name="user-plus" size={14} color={theme.primary} />
                  <ThemedText style={[styles.joinButtonText, { color: theme.primary }]}>
                    Request to Join Ride
                  </ThemedText>
                </Pressable>
              ) : (
                <View style={[styles.yourBookingBadge, { backgroundColor: theme.accent + "20" }]}>
                  <ThemedText style={{ color: theme.accent, fontSize: 12, fontWeight: "500" }}>
                    Your Booking
                  </ThemedText>
                </View>
              )}
            </View>
          ))
        )}
      </View>

      {car.status === "available" ? (
        <Button onPress={handleBookCar} style={styles.bookButton}>
          Book This Car
        </Button>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: BorderRadius.md,
    backgroundColor: "#E8ECF1",
  },
  headerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  plate: {
    fontSize: 15,
    marginTop: Spacing.xs,
  },
  specCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  specGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  specItem: {
    width: "48%",
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  specValue: {
    fontWeight: "600",
    fontSize: 16,
    marginTop: Spacing.xs,
  },
  specLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  tag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "500",
  },
  notesCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  notesText: {
    flex: 1,
    fontSize: 13,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  emptyBookings: {
    alignItems: "center",
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  bookingBlock: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  bookingRoute: {
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  bookingTime: {
    fontSize: 13,
  },
  bookerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  bookerName: {
    fontSize: 13,
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  joinButtonText: {
    fontSize: 13,
    fontWeight: "500",
  },
  yourBookingBadge: {
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  bookButton: {
    marginTop: Spacing.md,
  },
});
