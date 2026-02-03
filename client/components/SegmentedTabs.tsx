import React from "react";
import { View, Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing, Shadows } from "@/constants/theme";

interface SegmentedTabsProps {
  options: [string, string] | string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export function SegmentedTabs({ options, selectedIndex, onChange }: SegmentedTabsProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.surfaceVariant, borderColor: theme.border },
        Shadows.xs,
      ]}
    >
      {options.map((label, idx) => {
        const selected = idx === selectedIndex;
        return (
          <Pressable
            key={label}
            onPress={() => onChange(idx)}
            style={[
              styles.tab,
              {
                backgroundColor: selected ? theme.primary : "transparent",
              },
            ]}
          >
            <ThemedText
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: selected ? "#FFFFFF" : theme.textSecondary,
              }}
            >
              {label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    padding: 3,
    gap: 3,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
});
