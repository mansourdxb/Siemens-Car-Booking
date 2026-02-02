import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { format } from "date-fns";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { StatusBadge } from "@/components/StatusBadge";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import type { BookingWithDetails } from "@/types";

interface BookingCardProps {
  booking: BookingWithDetails;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function BookingCard({ booking, onPress }: BookingCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const pickupDate = new Date(booking.pickupAt);
  const returnDate = new Date(booking.returnAt);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.cardBorder,
        },
        Shadows.sm,
        animatedStyle,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.routeContainer}>
          <ThemedText type="h4" numberOfLines={1}>
            {booking.pickupLocation}
          </ThemedText>
          <Feather
            name="arrow-right"
            size={16}
            color={theme.primary}
            style={styles.arrow}
          />
          <ThemedText type="h4" numberOfLines={1}>
            {booking.destination}
          </ThemedText>
        </View>
        <StatusBadge status={booking.status} size="small" />
      </View>

      <View style={styles.carInfo}>
        {booking.car ? (
          <ThemedText style={[styles.carText, { color: theme.textSecondary }]}>
            {booking.car.plate} - {booking.car.make} {booking.car.model}
          </ThemedText>
        ) : null}
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Feather name="calendar" size={14} color={theme.textSecondary} />
            <ThemedText style={[styles.detailText, { color: theme.textSecondary }]}>
              {format(pickupDate, "MMM d, yyyy")}
            </ThemedText>
          </View>
          <View style={styles.detailItem}>
            <Feather name="clock" size={14} color={theme.textSecondary} />
            <ThemedText style={[styles.detailText, { color: theme.textSecondary }]}>
              {format(pickupDate, "HH:mm")} - {format(returnDate, "HH:mm")}
            </ThemedText>
          </View>
        </View>
        {booking.purpose ? (
          <View style={styles.purposeRow}>
            <Feather name="file-text" size={14} color={theme.textSecondary} />
            <ThemedText
              style={[styles.detailText, { color: theme.textSecondary }]}
              numberOfLines={1}
            >
              {booking.purpose}
            </ThemedText>
          </View>
        ) : null}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: Spacing.sm,
  },
  arrow: {
    marginHorizontal: Spacing.sm,
  },
  carInfo: {
    marginBottom: Spacing.md,
  },
  carText: {
    fontSize: 13,
  },
  details: {
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: "row",
    gap: Spacing.xl,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  purposeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  detailText: {
    fontSize: 13,
  },
});
