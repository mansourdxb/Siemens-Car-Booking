import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ScrollView, Alert, Pressable } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import { format } from "date-fns";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { StatusBadge } from "@/components/StatusBadge";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import {
  getBookingWithDetails,
  cancelBooking,
  updateRideMateRequest,
} from "@/lib/storage";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import type { BookingWithDetails } from "@/types";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type RouteParams = RouteProp<RootStackParamList, "BookingDetail">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function BookingDetailScreen() {
  const route = useRoute<RouteParams>();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { bookingId } = route.params;

  const [booking, setBooking] = useState<BookingWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadBooking = useCallback(async () => {
    try {
      const data = await getBookingWithDetails(bookingId);
      setBooking(data);
    } catch (error) {
      console.error("Failed to load booking:", error);
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    loadBooking();
  }, [loadBooking]);

  useEffect(() => {
    if (booking) {
      navigation.setOptions({
        title: `${booking.pickupLocation} → ${booking.destination}`,
      });
    }
  }, [booking, navigation]);

  const handleCancel = () => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        { text: "Keep Booking", style: "cancel" },
        {
          text: "Cancel Booking",
          style: "destructive",
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await cancelBooking(bookingId);
            loadBooking();
          },
        },
      ]
    );
  };

  const handleCheckout = () => {
    navigation.navigate("Checkout", { bookingId });
  };

  const handleReturn = () => {
    navigation.navigate("Return", { bookingId });
  };

  const handleRideMateAction = async (
    requestId: string,
    status: "approved" | "declined"
  ) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await updateRideMateRequest(requestId, status);
    loadBooking();
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
        <LoadingSkeleton height={60} style={{ marginBottom: Spacing.lg }} />
        <LoadingSkeleton height={120} style={{ marginBottom: Spacing.lg }} />
        <LoadingSkeleton height={80} />
      </ScrollView>
    );
  }

  if (!booking) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.backgroundRoot }]}>
        <ThemedText>Booking not found</ThemedText>
      </View>
    );
  }

  const isOwner = booking.userId === user?.id;
  const canCheckout = booking.status === "reserved" && isOwner;
  const canReturn = booking.status === "checked_out" && isOwner;
  const canCancel = booking.status === "reserved" && isOwner;
  const pendingRequests = booking.rideMates?.filter((rm) => rm.status === "requested") || [];
  const approvedRideMates = booking.rideMates?.filter((rm) => rm.status === "approved") || [];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: headerHeight + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.statusBanner, { backgroundColor: theme.surface, borderColor: theme.cardBorder }, Shadows.sm]}>
        <StatusBadge status={booking.status} />
        <ThemedText style={[styles.statusText, { color: theme.textSecondary }]}>
          {booking.status === "reserved" && "Ready for pickup"}
          {booking.status === "checked_out" && "Currently in use"}
          {booking.status === "returned" && "Trip completed"}
          {booking.status === "cancelled" && "Booking was cancelled"}
        </ThemedText>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.cardBorder }, Shadows.sm]}>
        <ThemedText type="h4" style={styles.cardTitle}>Trip Details</ThemedText>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Feather name="calendar" size={18} color={theme.primary} />
          </View>
          <View style={styles.detailContent}>
            <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>Date</ThemedText>
            <ThemedText style={styles.detailValue}>
              {format(new Date(booking.pickupAt), "EEEE, MMMM d, yyyy")}
            </ThemedText>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Feather name="clock" size={18} color={theme.primary} />
          </View>
          <View style={styles.detailContent}>
            <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>Time</ThemedText>
            <ThemedText style={styles.detailValue}>
              {format(new Date(booking.pickupAt), "HH:mm")} - {format(new Date(booking.returnAt), "HH:mm")}
            </ThemedText>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Feather name="map-pin" size={18} color={theme.primary} />
          </View>
          <View style={styles.detailContent}>
            <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>Route</ThemedText>
            <ThemedText style={styles.detailValue}>
              {booking.pickupLocation} → {booking.destination}
            </ThemedText>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Feather name="users" size={18} color={theme.primary} />
          </View>
          <View style={styles.detailContent}>
            <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>Passengers</ThemedText>
            <ThemedText style={styles.detailValue}>{booking.passengers}</ThemedText>
          </View>
        </View>

        {booking.purpose ? (
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Feather name="file-text" size={18} color={theme.primary} />
            </View>
            <View style={styles.detailContent}>
              <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>Purpose</ThemedText>
              <ThemedText style={styles.detailValue}>{booking.purpose}</ThemedText>
            </View>
          </View>
        ) : null}
      </View>

      {booking.car ? (
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.cardBorder }, Shadows.sm]}>
          <ThemedText type="h4" style={styles.cardTitle}>Vehicle</ThemedText>
          <View style={styles.carInfo}>
            <ThemedText style={styles.carPlate}>{booking.car.plate}</ThemedText>
            <ThemedText style={[styles.carModel, { color: theme.textSecondary }]}>
              {booking.car.make} {booking.car.model} • {booking.car.color}
            </ThemedText>
          </View>
        </View>
      ) : null}

      {approvedRideMates.length > 0 ? (
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.cardBorder }, Shadows.sm]}>
          <ThemedText type="h4" style={styles.cardTitle}>Ride Mates</ThemedText>
          {approvedRideMates.map((rm) => (
            <View key={rm.id} style={styles.rideMateItem}>
              <View style={[styles.rideMateAvatar, { backgroundColor: theme.accent }]}>
                <Feather name="user" size={16} color="#FFFFFF" />
              </View>
              <ThemedText>{rm.user?.fullName || "Unknown"}</ThemedText>
            </View>
          ))}
        </View>
      ) : null}

      {isOwner && pendingRequests.length > 0 ? (
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.cardBorder }, Shadows.sm]}>
          <ThemedText type="h4" style={styles.cardTitle}>Join Requests</ThemedText>
          {pendingRequests.map((rm) => (
            <View key={rm.id} style={styles.requestItem}>
              <View style={styles.requestInfo}>
                <ThemedText style={styles.requestName}>{rm.user?.fullName || "Unknown"}</ThemedText>
                {rm.message ? (
                  <ThemedText style={[styles.requestMessage, { color: theme.textSecondary }]}>
                    "{rm.message}"
                  </ThemedText>
                ) : null}
              </View>
              <View style={styles.requestActions}>
                <Pressable
                  onPress={() => handleRideMateAction(rm.id, "approved")}
                  style={[styles.actionButton, { backgroundColor: theme.success }]}
                >
                  <Feather name="check" size={16} color="#FFFFFF" />
                </Pressable>
                <Pressable
                  onPress={() => handleRideMateAction(rm.id, "declined")}
                  style={[styles.actionButton, { backgroundColor: theme.error }]}
                >
                  <Feather name="x" size={16} color="#FFFFFF" />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {booking.handover ? (
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.cardBorder }, Shadows.sm]}>
          <ThemedText type="h4" style={styles.cardTitle}>Handover Details</ThemedText>
          <View style={styles.handoverGrid}>
            <View style={styles.handoverItem}>
              <ThemedText style={[styles.handoverLabel, { color: theme.textSecondary }]}>Checkout Odometer</ThemedText>
              <ThemedText style={styles.handoverValue}>
                {booking.handover.checkoutOdometer?.toLocaleString() || "-"} km
              </ThemedText>
            </View>
            <View style={styles.handoverItem}>
              <ThemedText style={[styles.handoverLabel, { color: theme.textSecondary }]}>Return Odometer</ThemedText>
              <ThemedText style={styles.handoverValue}>
                {booking.handover.returnOdometer?.toLocaleString() || "-"} km
              </ThemedText>
            </View>
            <View style={styles.handoverItem}>
              <ThemedText style={[styles.handoverLabel, { color: theme.textSecondary }]}>Checkout Fuel</ThemedText>
              <ThemedText style={styles.handoverValue}>{booking.handover.checkoutFuel || "-"}</ThemedText>
            </View>
            <View style={styles.handoverItem}>
              <ThemedText style={[styles.handoverLabel, { color: theme.textSecondary }]}>Return Fuel</ThemedText>
              <ThemedText style={styles.handoverValue}>{booking.handover.returnFuel || "-"}</ThemedText>
            </View>
          </View>
          {booking.handover.notes ? (
            <View style={[styles.handoverNotes, { backgroundColor: theme.surfaceVariant }]}>
              <ThemedText style={{ fontSize: 13 }}>{booking.handover.notes}</ThemedText>
            </View>
          ) : null}
        </View>
      ) : null}

      <View style={styles.actions}>
        {canCheckout ? (
          <Button onPress={handleCheckout} style={styles.actionBtn}>
            Check Out Car
          </Button>
        ) : null}
        {canReturn ? (
          <Button onPress={handleReturn} style={styles.actionBtn}>
            Return Car
          </Button>
        ) : null}
        {canCancel ? (
          <Button
            onPress={handleCancel}
            style={[styles.actionBtn, { backgroundColor: theme.error }]}
          >
            Cancel Booking
          </Button>
        ) : null}
      </View>
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
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  statusText: {
    flex: 1,
    fontSize: 14,
  },
  card: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    marginBottom: Spacing.lg,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  detailValue: {
    fontWeight: "500",
  },
  carInfo: {
    paddingVertical: Spacing.sm,
  },
  carPlate: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  carModel: {
    fontSize: 14,
  },
  rideMateItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  rideMateAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  requestItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    fontWeight: "500",
    marginBottom: 2,
  },
  requestMessage: {
    fontSize: 13,
    fontStyle: "italic",
  },
  requestActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  handoverGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  handoverItem: {
    width: "50%",
    paddingVertical: Spacing.sm,
  },
  handoverLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  handoverValue: {
    fontWeight: "500",
  },
  handoverNotes: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.md,
  },
  actions: {
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  actionBtn: {
    width: "100%",
  },
});
