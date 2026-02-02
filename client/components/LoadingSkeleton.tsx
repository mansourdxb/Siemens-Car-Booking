import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface LoadingSkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: object;
}

export function LoadingSkeleton({
  width = "100%",
  height = 20,
  borderRadius = BorderRadius.sm,
  style,
}: LoadingSkeletonProps) {
  const { theme } = useTheme();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1200 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.3, 0.6, 0.3]),
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: theme.surfaceVariant,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function CarCardSkeleton() {
  return (
    <View style={styles.cardContainer}>
      <LoadingSkeleton height={140} borderRadius={BorderRadius.md} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <LoadingSkeleton width={100} height={24} />
          <LoadingSkeleton width={80} height={24} borderRadius={BorderRadius.full} />
        </View>
        <LoadingSkeleton width={150} height={16} style={{ marginTop: Spacing.sm }} />
        <View style={styles.cardDetails}>
          <LoadingSkeleton width={70} height={14} />
          <LoadingSkeleton width={60} height={14} />
        </View>
      </View>
    </View>
  );
}

export function BookingCardSkeleton() {
  return (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <LoadingSkeleton width="60%" height={22} />
        <LoadingSkeleton width={70} height={22} borderRadius={BorderRadius.full} />
      </View>
      <LoadingSkeleton width={180} height={14} style={{ marginTop: Spacing.sm }} />
      <View style={styles.bookingDetails}>
        <LoadingSkeleton width={100} height={14} />
        <LoadingSkeleton width={120} height={14} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {},
  cardContainer: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  cardContent: {
    padding: Spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardDetails: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  bookingCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bookingDetails: {
    flexDirection: "row",
    gap: Spacing.xl,
    marginTop: Spacing.md,
  },
});
