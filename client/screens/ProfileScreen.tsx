import React, { useState } from "react";
import { View, StyleSheet, Switch, Pressable, Alert } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { user, logout, updateProfile } = useAuth();

  const [sharePhone, setSharePhone] = useState(user?.sharePhone ?? false);

  const handleSharePhoneChange = async (value: boolean) => {
    setSharePhone(value);
    Haptics.selectionAsync();
    await updateProfile({ sharePhone: value });
  };

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            await logout();
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <ThemedText>Not logged in</ThemedText>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: tabBarHeight + Spacing.xl,
        },
      ]}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <View style={styles.profileHeader}>
        <Image
          source={require("../../assets/images/default-avatar.png")}
          style={styles.avatar}
          contentFit="cover"
        />
        <ThemedText type="h2" style={styles.name}>
          {user.fullName}
        </ThemedText>
        <ThemedText style={[styles.email, { color: theme.textSecondary }]}>
          {user.email}
        </ThemedText>
        <View
          style={[
            styles.roleBadge,
            {
              backgroundColor:
                user.role === "admin" ? theme.primary : theme.accent,
            },
          ]}
        >
          <ThemedText style={styles.roleText}>
            {user.role === "admin" ? "Admin" : "User"}
          </ThemedText>
        </View>
      </View>

      <View
        style={[
          styles.section,
          { backgroundColor: theme.surface, borderColor: theme.cardBorder },
          Shadows.sm,
        ]}
      >
        <ThemedText type="h4" style={styles.sectionTitle}>
          Settings
        </ThemedText>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Feather name="phone" size={20} color={theme.primary} />
            <View style={styles.settingText}>
              <ThemedText style={styles.settingLabel}>
                Share Phone for Ride Sharing
              </ThemedText>
              <ThemedText
                style={[styles.settingDescription, { color: theme.textSecondary }]}
              >
                Allow others to see your phone number when joining rides
              </ThemedText>
            </View>
          </View>
          <Switch
            value={sharePhone}
            onValueChange={handleSharePhoneChange}
            trackColor={{ false: theme.disabled, true: theme.primary }}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <Pressable style={styles.infoItem}>
          <Feather name="map-pin" size={20} color={theme.textSecondary} />
          <View style={styles.infoText}>
            <ThemedText style={[styles.infoLabel, { color: theme.textSecondary }]}>
              Home Office
            </ThemedText>
            <ThemedText style={styles.infoValue}>{user.homeOffice}</ThemedText>
          </View>
        </Pressable>

        {user.team ? (
          <Pressable style={styles.infoItem}>
            <Feather name="users" size={20} color={theme.textSecondary} />
            <View style={styles.infoText}>
              <ThemedText style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Team
              </ThemedText>
              <ThemedText style={styles.infoValue}>{user.team}</ThemedText>
            </View>
          </Pressable>
        ) : null}

        {user.phone ? (
          <Pressable style={styles.infoItem}>
            <Feather name="phone" size={20} color={theme.textSecondary} />
            <View style={styles.infoText}>
              <ThemedText style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Phone
              </ThemedText>
              <ThemedText style={styles.infoValue}>{user.phone}</ThemedText>
            </View>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.logoutContainer}>
        <Button
          onPress={handleLogout}
          style={[styles.logoutButton, { backgroundColor: theme.error }]}
        >
          Sign Out
        </Button>
      </View>

      <ThemedText style={[styles.version, { color: theme.textSecondary }]}>
        Car Booking v1.0.0
      </ThemedText>
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
  profileHeader: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: Spacing.lg,
  },
  name: {
    marginBottom: Spacing.xs,
  },
  email: {
    marginBottom: Spacing.md,
  },
  roleBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  roleText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    marginRight: Spacing.md,
  },
  settingText: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  settingLabel: {
    fontWeight: "500",
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.lg,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  infoText: {
    marginLeft: Spacing.md,
  },
  infoLabel: {
    fontSize: 12,
  },
  infoValue: {
    fontWeight: "500",
  },
  logoutContainer: {
    marginTop: Spacing.md,
  },
  logoutButton: {
    width: "100%",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    marginTop: Spacing.xl,
  },
});
