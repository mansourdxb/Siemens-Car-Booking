import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { CarCard } from "@/components/CarCard";
import { FilterChip } from "@/components/FilterChip";
import { EmptyState } from "@/components/EmptyState";
import { CarCardSkeleton } from "@/components/LoadingSkeleton";
import { useTheme } from "@/hooks/useTheme";
import { getCars } from "@/lib/storage";
import { Spacing } from "@/constants/theme";
import type { Car, HomeOffice, CarTag } from "@/types";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const baseFilters: HomeOffice[] = ["Dubai", "Al Ain", "Abu Dhabi"];
const tagFilters: CarTag[] = ["SUV", "sedan", "compact", "luxury"];

export default function CarsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();

  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBase, setSelectedBase] = useState<HomeOffice | null>(null);
  const [selectedTag, setSelectedTag] = useState<CarTag | null>(null);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const loadCars = useCallback(async () => {
    try {
      const allCars = await getCars();
      setCars(allCars);
    } catch (error) {
      console.error("Failed to load cars:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadCars();
  }, [loadCars]);

  const filteredCars = cars.filter((car) => {
    if (selectedBase && car.base !== selectedBase) return false;
    if (selectedTag && !car.tags.includes(selectedTag)) return false;
    if (showAvailableOnly && car.status !== "available") return false;
    return true;
  });

  const handleCarPress = (car: Car) => {
    navigation.navigate("CarDetail", { carId: car.id });
  };

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
      >
        <FilterChip
          label="Available"
          selected={showAvailableOnly}
          onPress={() => setShowAvailableOnly(!showAvailableOnly)}
          icon="check-circle"
        />
        {baseFilters.map((base) => (
          <FilterChip
            key={base}
            label={base}
            selected={selectedBase === base}
            onPress={() => setSelectedBase(selectedBase === base ? null : base)}
          />
        ))}
        {tagFilters.map((tag) => (
          <FilterChip
            key={tag}
            label={tag.toUpperCase()}
            selected={selectedTag === tag}
            onPress={() => setSelectedTag(selectedTag === tag ? null : tag)}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderItem = ({ item }: { item: Car }) => (
    <CarCard car={item} onPress={() => handleCarPress(item)} />
  );

  const renderEmpty = () => (
    <EmptyState
      image="cars"
      title="No vehicles found"
      description="No cars match your current filters. Try adjusting your selection."
    />
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      {[1, 2, 3].map((i) => (
        <CarCardSkeleton key={i} />
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      {renderFilters()}
      {isLoading ? (
        <FlatList
          style={styles.list}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingTop: headerHeight + Spacing["5xl"],
              paddingBottom: tabBarHeight + Spacing.xl,
            },
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
            {
              paddingTop: headerHeight + Spacing["5xl"],
              paddingBottom: tabBarHeight + Spacing.xl,
            },
            filteredCars.length === 0 && styles.emptyList,
          ]}
          scrollIndicatorInsets={{ bottom: insets.bottom }}
          data={filteredCars}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: Spacing.sm,
  },
  filtersContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  emptyList: {
    flex: 1,
  },
  loadingContainer: {
    paddingTop: Spacing.lg,
  },
});
