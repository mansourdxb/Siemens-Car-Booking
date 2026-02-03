import AsyncStorage from "@react-native-async-storage/async-storage";

const CARS_URL = process.env.EXPO_PUBLIC_CARS_URL!; // GitHub raw url
const CACHE_KEY = "@carbooking/cars_remote_cache_v1";

export type RemoteCar = {
  id: string;
  name: string;
  plate: string;
  seats: number;
  base: string;
  status: "available" | "maintenance" | "inactive";
  tags?: string[];
};

type RemoteCarsPayload = { updatedAt: string; cars: RemoteCar[] };

export async function loadCarsFromRemote(): Promise<RemoteCarsPayload | null> {
  try {
    const res = await fetch(CARS_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as RemoteCarsPayload;
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    return data;
  } catch {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    return cached ? (JSON.parse(cached) as RemoteCarsPayload) : null;
  }
}
