import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { StatusBadge } from "@/components/StatusBadge";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import type { Car } from "@/types";

interface CarCardProps {
  car: Car;
  onPress?: () => void;
  showAvailability?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CarCard({ car, onPress, showAvailability = true }: CarCardProps) {
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
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <ThemedText type="h4" style={styles.plate}>
              {car.plate}
            </ThemedText>
            {showAvailability ? <StatusBadge status={car.status} size="small" /> : null}
          </View>
          <ThemedText
            style={[styles.model, { color: theme.textSecondary }]}
          >
            {car.make} {car.model}
          </ThemedText>
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Feather name="users" size={14} color={theme.textSecondary} />
            <ThemedText style={[styles.detailText, { color: theme.textSecondary }]}>
              {car.seats} seats
            </ThemedText>
          </View>
          <View style={styles.detailItem}>
            <Feather name="map-pin" size={14} color={theme.textSecondary} />
            <ThemedText style={[styles.detailText, { color: theme.textSecondary }]}>
              {car.base}
            </ThemedText>
          </View>
          {car.tags.length > 0 ? (
            <View style={styles.detailItem}>
              <Feather name="tag" size={14} color={theme.textSecondary} />
              <ThemedText style={[styles.detailText, { color: theme.textSecondary }]}>
                {car.tags.join(", ")}
              </ThemedText>
            </View>
          ) : null}
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: Spacing.md,
  },
  image: {
    width: "100%",
    height: 140,
    backgroundColor: "#E8ECF1",
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.md,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  plate: {
    letterSpacing: 0.5,
  },
  model: {
    fontSize: 14,
  },
  details: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  detailText: {
    fontSize: 13,
  },
});
