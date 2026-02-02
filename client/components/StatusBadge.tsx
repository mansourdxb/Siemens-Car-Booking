import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { StatusColors, BorderRadius, Spacing } from "@/constants/theme";
import type { BookingStatus, CarStatus } from "@/types";

type StatusType = BookingStatus | CarStatus;

const statusLabels: Record<StatusType, string> = {
  available: "Available",
  in_use: "In Use",
  maintenance: "Maintenance",
  reserved: "Reserved",
  checked_out: "Checked Out",
  returned: "Returned",
  cancelled: "Cancelled",
};

interface StatusBadgeProps {
  status: StatusType;
  size?: "small" | "medium";
}

export function StatusBadge({ status, size = "medium" }: StatusBadgeProps) {
  const backgroundColor = StatusColors[status] || StatusColors.available;
  const label = statusLabels[status] || status;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor },
        size === "small" && styles.badgeSmall,
      ]}
    >
      <ThemedText
        style={[
          styles.text,
          size === "small" && styles.textSmall,
        ]}
      >
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    alignSelf: "flex-start",
  },
  badgeSmall: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  textSmall: {
    fontSize: 11,
  },
});
