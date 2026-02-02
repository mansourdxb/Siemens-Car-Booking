import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import type {
  User,
  Car,
  Booking,
  BookingRideMate,
  Handover,
  Issue,
  BookingWithDetails,
  CarWithBookings,
} from "@/types";

const STORAGE_KEYS = {
  CURRENT_USER: "@carbooking/current_user",
  USERS: "@carbooking/users",
  CARS: "@carbooking/cars",
  BOOKINGS: "@carbooking/bookings",
  RIDE_MATES: "@carbooking/ride_mates",
  HANDOVERS: "@carbooking/handovers",
  ISSUES: "@carbooking/issues",
  INITIALIZED: "@carbooking/initialized",
};

async function getItem<T>(key: string): Promise<T | null> {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Storage error:", error);
  }
}

export async function initializeSeedData(): Promise<void> {
  const initialized = await getItem<boolean>(STORAGE_KEYS.INITIALIZED);
  if (initialized) return;

  const users: User[] = [
    {
      id: uuidv4(),
      email: "admin@siemens.com",
      fullName: "Admin User",
      phone: "+971501234567",
      sharePhone: true,
      role: "admin",
      homeOffice: "Dubai",
      team: "Project Management",
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      email: "john.engineer@siemens.com",
      fullName: "John Engineer",
      phone: "+971507654321",
      sharePhone: true,
      role: "user",
      homeOffice: "Dubai",
      team: "Rail Systems",
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      email: "sarah.tech@siemens.com",
      fullName: "Sarah Tech",
      phone: "+971509876543",
      sharePhone: false,
      role: "user",
      homeOffice: "Al Ain",
      team: "Signaling",
      createdAt: new Date().toISOString(),
    },
  ];

  const cars: Car[] = [
    {
      id: uuidv4(),
      plate: "DXB-1234",
      make: "Toyota",
      model: "Land Cruiser",
      color: "White",
      seats: 7,
      base: "Dubai",
      status: "available",
      tags: ["SUV"],
      lastOdometer: 45230,
      lastFuel: "Full",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      plate: "DXB-5678",
      make: "Nissan",
      model: "Patrol",
      color: "Black",
      seats: 7,
      base: "Dubai",
      status: "available",
      tags: ["SUV", "luxury"],
      lastOdometer: 32100,
      lastFuel: "3/4",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      plate: "AAN-9012",
      make: "Toyota",
      model: "Camry",
      color: "Silver",
      seats: 5,
      base: "Al Ain",
      status: "available",
      tags: ["sedan"],
      lastOdometer: 67800,
      lastFuel: "1/2",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      plate: "AAN-3456",
      make: "Honda",
      model: "Accord",
      color: "Gray",
      seats: 5,
      base: "Al Ain",
      status: "maintenance",
      tags: ["sedan"],
      lastOdometer: 89450,
      lastFuel: "1/4",
      notes: "Scheduled for AC maintenance",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      plate: "DXB-7890",
      make: "Lexus",
      model: "LX570",
      color: "Pearl White",
      seats: 7,
      base: "Dubai",
      status: "available",
      tags: ["SUV", "luxury"],
      lastOdometer: 28900,
      lastFuel: "Full",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      plate: "ABD-2468",
      make: "Toyota",
      model: "Corolla",
      color: "Blue",
      seats: 5,
      base: "Abu Dhabi",
      status: "available",
      tags: ["sedan", "compact"],
      lastOdometer: 54320,
      lastFuel: "Full",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const bookings: Booking[] = [
    {
      id: uuidv4(),
      carId: cars[0].id,
      userId: users[1].id,
      pickupAt: tomorrow.toISOString(),
      returnAt: new Date(tomorrow.getTime() + 8 * 60 * 60 * 1000).toISOString(),
      pickupLocation: "Dubai Office",
      destination: "Al Ain Customer Site",
      purpose: "Client meeting - Project Hafeet Phase 2",
      passengers: 2,
      status: "reserved",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      carId: cars[1].id,
      userId: users[2].id,
      pickupAt: new Date(
        now.getTime() + 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      returnAt: new Date(
        now.getTime() + 3 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000
      ).toISOString(),
      pickupLocation: "Al Ain Office",
      destination: "Abu Dhabi Metro Station",
      purpose: "Site inspection",
      passengers: 3,
      status: "reserved",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      carId: cars[4].id,
      userId: users[0].id,
      pickupAt: nextWeek.toISOString(),
      returnAt: new Date(
        nextWeek.getTime() + 10 * 60 * 60 * 1000
      ).toISOString(),
      pickupLocation: "Dubai Office",
      destination: "Al Ain",
      purpose: "Project kickoff meeting",
      passengers: 4,
      status: "reserved",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  await setItem(STORAGE_KEYS.USERS, users);
  await setItem(STORAGE_KEYS.CARS, cars);
  await setItem(STORAGE_KEYS.BOOKINGS, bookings);
  await setItem(STORAGE_KEYS.RIDE_MATES, []);
  await setItem(STORAGE_KEYS.HANDOVERS, []);
  await setItem(STORAGE_KEYS.ISSUES, []);
  await setItem(STORAGE_KEYS.INITIALIZED, true);
}

export async function getCurrentUser(): Promise<User | null> {
  return getItem<User>(STORAGE_KEYS.CURRENT_USER);
}

export async function setCurrentUser(user: User | null): Promise<void> {
  if (user) {
    await setItem(STORAGE_KEYS.CURRENT_USER, user);
  } else {
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export async function login(
  email: string,
  _password: string
): Promise<User | null> {
  const users = (await getItem<User[]>(STORAGE_KEYS.USERS)) || [];
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (user) {
    await setCurrentUser(user);
    return user;
  }
  return null;
}

export async function register(
  email: string,
  fullName: string,
  homeOffice: string
): Promise<User> {
  const users = (await getItem<User[]>(STORAGE_KEYS.USERS)) || [];
  const newUser: User = {
    id: uuidv4(),
    email,
    fullName,
    sharePhone: false,
    role: "user",
    homeOffice: homeOffice as User["homeOffice"],
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  await setItem(STORAGE_KEYS.USERS, users);
  await setCurrentUser(newUser);
  return newUser;
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  const users = (await getItem<User[]>(STORAGE_KEYS.USERS)) || [];
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updates };
  await setItem(STORAGE_KEYS.USERS, users);
  const currentUser = await getCurrentUser();
  if (currentUser?.id === userId) {
    await setCurrentUser(users[index]);
  }
  return users[index];
}

export async function logout(): Promise<void> {
  await setCurrentUser(null);
}

export async function getCars(): Promise<Car[]> {
  return (await getItem<Car[]>(STORAGE_KEYS.CARS)) || [];
}

export async function getCarById(id: string): Promise<Car | null> {
  const cars = await getCars();
  return cars.find((c) => c.id === id) || null;
}

export async function getCarWithBookings(id: string): Promise<CarWithBookings | null> {
  const car = await getCarById(id);
  if (!car) return null;
  const bookings = await getBookings();
  return {
    ...car,
    bookings: bookings.filter((b) => b.carId === id && b.status !== "cancelled"),
  };
}

export async function updateCar(carId: string, updates: Partial<Car>): Promise<Car | null> {
  const cars = await getCars();
  const index = cars.findIndex((c) => c.id === carId);
  if (index === -1) return null;
  cars[index] = { ...cars[index], ...updates, updatedAt: new Date().toISOString() };
  await setItem(STORAGE_KEYS.CARS, cars);
  return cars[index];
}

export async function getBookings(): Promise<Booking[]> {
  return (await getItem<Booking[]>(STORAGE_KEYS.BOOKINGS)) || [];
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const bookings = await getBookings();
  return bookings.find((b) => b.id === id) || null;
}

export async function getBookingWithDetails(id: string): Promise<BookingWithDetails | null> {
  const booking = await getBookingById(id);
  if (!booking) return null;

  const [car, users, rideMates, handovers] = await Promise.all([
    getCarById(booking.carId),
    getItem<User[]>(STORAGE_KEYS.USERS),
    getItem<BookingRideMate[]>(STORAGE_KEYS.RIDE_MATES),
    getItem<Handover[]>(STORAGE_KEYS.HANDOVERS),
  ]);

  const user = users?.find((u) => u.id === booking.userId);
  const bookingRideMates = rideMates?.filter((rm) => rm.bookingId === id) || [];
  const handover = handovers?.find((h) => h.bookingId === id);

  return {
    ...booking,
    car: car || undefined,
    user: user || undefined,
    rideMates: bookingRideMates.map((rm) => ({
      ...rm,
      user: users?.find((u) => u.id === rm.userId),
    })),
    handover: handover || undefined,
  };
}

export async function getUserBookings(userId: string): Promise<BookingWithDetails[]> {
  const [bookings, cars, users] = await Promise.all([
    getBookings(),
    getCars(),
    getItem<User[]>(STORAGE_KEYS.USERS),
  ]);

  return bookings
    .filter((b) => b.userId === userId)
    .map((b) => ({
      ...b,
      car: cars.find((c) => c.id === b.carId),
      user: users?.find((u) => u.id === b.userId),
    }))
    .sort((a, b) => new Date(b.pickupAt).getTime() - new Date(a.pickupAt).getTime());
}

export async function checkAvailability(
  carId: string,
  pickupAt: Date,
  returnAt: Date,
  excludeBookingId?: string
): Promise<boolean> {
  const bookings = await getBookings();
  const conflicting = bookings.find(
    (b) =>
      b.carId === carId &&
      b.id !== excludeBookingId &&
      b.status !== "cancelled" &&
      b.status !== "returned" &&
      new Date(b.pickupAt) < returnAt &&
      new Date(b.returnAt) > pickupAt
  );
  return !conflicting;
}

export async function getAvailableCars(
  pickupAt: Date,
  returnAt: Date
): Promise<Car[]> {
  const cars = await getCars();
  const available: Car[] = [];

  for (const car of cars) {
    if (car.status === "maintenance") continue;
    const isAvailable = await checkAvailability(car.id, pickupAt, returnAt);
    if (isAvailable) {
      available.push(car);
    }
  }

  return available;
}

export async function createBooking(
  booking: Omit<Booking, "id" | "createdAt" | "updatedAt">
): Promise<Booking> {
  const bookings = await getBookings();
  const newBooking: Booking = {
    ...booking,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  bookings.push(newBooking);
  await setItem(STORAGE_KEYS.BOOKINGS, bookings);
  return newBooking;
}

export async function updateBooking(
  bookingId: string,
  updates: Partial<Booking>
): Promise<Booking | null> {
  const bookings = await getBookings();
  const index = bookings.findIndex((b) => b.id === bookingId);
  if (index === -1) return null;
  bookings[index] = {
    ...bookings[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await setItem(STORAGE_KEYS.BOOKINGS, bookings);
  return bookings[index];
}

export async function cancelBooking(bookingId: string): Promise<boolean> {
  const result = await updateBooking(bookingId, { status: "cancelled" });
  return !!result;
}

export async function checkoutBooking(
  bookingId: string,
  odometer: number,
  fuel: string
): Promise<Handover> {
  await updateBooking(bookingId, { status: "checked_out" });

  const handovers = (await getItem<Handover[]>(STORAGE_KEYS.HANDOVERS)) || [];
  const handover: Handover = {
    id: uuidv4(),
    bookingId,
    checkoutOdometer: odometer,
    checkoutFuel: fuel,
    createdAt: new Date().toISOString(),
  };
  handovers.push(handover);
  await setItem(STORAGE_KEYS.HANDOVERS, handovers);

  const booking = await getBookingById(bookingId);
  if (booking) {
    await updateCar(booking.carId, { status: "in_use" });
  }

  return handover;
}

export async function returnBooking(
  bookingId: string,
  odometer: number,
  fuel: string,
  notes?: string
): Promise<Handover | null> {
  await updateBooking(bookingId, { status: "returned" });

  const handovers = (await getItem<Handover[]>(STORAGE_KEYS.HANDOVERS)) || [];
  const index = handovers.findIndex((h) => h.bookingId === bookingId);

  if (index === -1) return null;

  handovers[index] = {
    ...handovers[index],
    returnOdometer: odometer,
    returnFuel: fuel,
    notes,
  };
  await setItem(STORAGE_KEYS.HANDOVERS, handovers);

  const booking = await getBookingById(bookingId);
  if (booking) {
    await updateCar(booking.carId, {
      status: "available",
      lastOdometer: odometer,
      lastFuel: fuel,
    });
  }

  return handovers[index];
}

export async function requestToJoinRide(
  bookingId: string,
  userId: string,
  message?: string
): Promise<BookingRideMate> {
  const rideMates = (await getItem<BookingRideMate[]>(STORAGE_KEYS.RIDE_MATES)) || [];
  const request: BookingRideMate = {
    id: uuidv4(),
    bookingId,
    userId,
    status: "requested",
    message,
    createdAt: new Date().toISOString(),
  };
  rideMates.push(request);
  await setItem(STORAGE_KEYS.RIDE_MATES, rideMates);
  return request;
}

export async function updateRideMateRequest(
  requestId: string,
  status: BookingRideMate["status"]
): Promise<BookingRideMate | null> {
  const rideMates = (await getItem<BookingRideMate[]>(STORAGE_KEYS.RIDE_MATES)) || [];
  const index = rideMates.findIndex((rm) => rm.id === requestId);
  if (index === -1) return null;
  rideMates[index] = { ...rideMates[index], status };
  await setItem(STORAGE_KEYS.RIDE_MATES, rideMates);
  return rideMates[index];
}

export async function createIssue(
  issue: Omit<Issue, "id" | "createdAt">
): Promise<Issue> {
  const issues = (await getItem<Issue[]>(STORAGE_KEYS.ISSUES)) || [];
  const newIssue: Issue = {
    ...issue,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  issues.push(newIssue);
  await setItem(STORAGE_KEYS.ISSUES, issues);
  return newIssue;
}

export async function getIssues(): Promise<Issue[]> {
  return (await getItem<Issue[]>(STORAGE_KEYS.ISSUES)) || [];
}

export async function getUsers(): Promise<User[]> {
  return (await getItem<User[]>(STORAGE_KEYS.USERS)) || [];
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await getUsers();
  return users.find((u) => u.id === id) || null;
}

export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
}
