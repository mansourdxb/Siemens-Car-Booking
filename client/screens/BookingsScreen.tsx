import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { SegmentedTabs } from "@/components/SegmentedTabs";

import { BookingCard } from "@/components/BookingCard";
import { EmptyState } from "@/components/EmptyState";
import { BookingCardSkeleton } from "@/components/LoadingSkeleton";
import { FAB } from "@/components/FAB";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { getUserBookings } from "@/lib/storage";
import { Spacing } from "@/constants/theme";
import type { BookingWithDetails } from "@/types";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function BookingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { user } = useAuth();

  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const loadBookings = useCallback(async () => {
    if (!user) return;
    try {
      const userBookings = await getUserBookings(user.id);
      setBookings(userBookings);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadBookings();
    });
    return unsubscribe;
  }, [navigation, loadBookings]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadBookings();
  }, [loadBookings]);

  const now = new Date();
  const upcomingBookings = bookings.filter(
    (b) =>
      new Date(b.returnAt) >= now &&
      b.status !== "cancelled" &&
      b.status !== "returned"
  );
  const pastBookings = bookings.filter(
    (b) =>
      new Date(b.returnAt) < now ||
      b.status === "cancelled" ||
      b.status === "returned"
  );

  const displayedBookings = selectedIndex === 0 ? upcomingBookings : pastBookings;

  const handleBookingPress = (booking: BookingWithDetails) => {
    navigation.navigate("BookingDetail", { bookingId: booking.id });
  };

  const handleNewBooking = () => {
    navigation.navigate("NewBooking");
  };

  const renderItem = ({ item }: { item: BookingWithDetails }) => (
    <BookingCard booking={item} onPress={() => handleBookingPress(item)} />
  );

  const renderEmpty = () => (
    <EmptyState
      image="bookings"
      title={selectedIndex === 0 ? "No upcoming bookings" : "No past bookings"}
      description={
        selectedIndex === 0
          ? "Tap the + button to book a car for your next trip"
          : "Your completed and cancelled bookings will appear here"
      }
      actionLabel={selectedIndex === 0 ? "Book a Car" : undefined}
      onAction={selectedIndex === 0 ? handleNewBooking : undefined}
    />
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      {[1, 2, 3].map((i) => (
        <BookingCardSkeleton key={i} />
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View
        style={[
          styles.segmentContainer,
          { paddingTop: headerHeight + Spacing.lg },
        ]}
      >
        <SegmentedTabs
          options={["Upcoming", "Past"]}
          selectedIndex={selectedIndex}
          onChange={setSelectedIndex}
        />
      </View>

      {isLoading ? (
        <FlatList
          style={styles.list}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: tabBarHeight + Spacing.xl },
          ]}
          scrollIndicatorInsets={{ bottom: insets.bottom }}
          data={[]}
          renderItem={() => null}
          ListEmptyComponent={renderLoading}
        />
      ) : (
        <FlatList
          style={styles.list}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: tabBarHeight + Spacing.xl },
            displayedBookings.length === 0 && styles.emptyList,
          ]}
          scrollIndicatorInsets={{ bottom: insets.bottom }}
          data={displayedBookings}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB onPress={handleNewBooking} bottom={tabBarHeight + Spacing.xl} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  segmentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  segment: {
    marginBottom: Spacing.sm,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  emptyList: {
    flex: 1,
  },
  loadingContainer: {
    paddingTop: Spacing.lg,
  },
});
