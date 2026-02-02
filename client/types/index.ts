export type UserRole = "user" | "admin";

export type HomeOffice = "Dubai" | "Al Ain" | "Abu Dhabi";

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  sharePhone: boolean;
  role: UserRole;
  homeOffice: HomeOffice;
  team?: string;
  createdAt: string;
}

export type CarStatus = "available" | "in_use" | "maintenance";

export type CarTag = "SUV" | "sedan" | "compact" | "luxury";

export interface Car {
  id: string;
  plate: string;
  make: string;
  model: string;
  color: string;
  seats: number;
  base: HomeOffice;
  status: CarStatus;
  tags: CarTag[];
  photoUrl?: string;
  lastOdometer?: number;
  lastFuel?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus =
  | "reserved"
  | "checked_out"
  | "returned"
  | "cancelled";

export interface Booking {
  id: string;
  carId: string;
  userId: string;
  pickupAt: string;
  returnAt: string;
  pickupLocation: string;
  destination: string;
  purpose?: string;
  passengers: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export type RideMateStatus = "requested" | "approved" | "declined";

export interface BookingRideMate {
  id: string;
  bookingId: string;
  userId: string;
  status: RideMateStatus;
  message?: string;
  createdAt: string;
}

export interface Handover {
  id: string;
  bookingId: string;
  checkoutOdometer?: number;
  returnOdometer?: number;
  checkoutFuel?: string;
  returnFuel?: string;
  checkoutPhotos?: string[];
  returnPhotos?: string[];
  notes?: string;
  createdAt: string;
}

export type IssueSeverity = "low" | "medium" | "high" | "critical";

export type IssueCategory =
  | "mechanical"
  | "electrical"
  | "cosmetic"
  | "cleanliness"
  | "other";

export type IssueStatus = "open" | "in_progress" | "resolved";

export interface Issue {
  id: string;
  carId: string;
  userId: string;
  category: IssueCategory;
  severity: IssueSeverity;
  description: string;
  photoUrls?: string[];
  status: IssueStatus;
  createdAt: string;
}

export interface BookingWithDetails extends Booking {
  car?: Car;
  user?: User;
  rideMates?: (BookingRideMate & { user?: User })[];
  handover?: Handover;
}

export interface CarWithBookings extends Car {
  bookings?: Booking[];
}
