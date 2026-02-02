# Project Car Booking - Design Guidelines

## Brand Identity

**Purpose**: Internal Siemens Mobility tool for engineers to efficiently book and share project cars between offices (Dubai ↔ Al Ain).

**Tone**: **Industrial Precision** — Clean, confident, utilitarian. Think airport terminals or high-speed rail stations: trustworthy infrastructure with subtle engineering elegance. Not cold or corporate-boring; warm professionalism with smart touches.

**Memorable Element**: Horizontal timeline blocks showing car availability at a glance (inspired by calendar grid systems). The booking interface feels like an air traffic control dashboard — clear, precise, immediate understanding of what's available.

## Navigation Architecture

**Root Navigation**: Tab Bar (4 tabs + FAB for core action)

1. **Cars** (tab) - Browse vehicle inventory
2. **Book** (floating action button) - Create new booking
3. **Bookings** (tab) - My current/upcoming reservations
4. **Profile** (tab) - User settings and preferences
5. **Admin** (conditional tab, shown only for admin role)

## Screen-by-Screen Specifications

### 1. Login Screen (Stack-only)
- **Purpose**: Authenticate users via email/password
- **Layout**: 
  - Centered card on colored gradient background
  - Logo/app name at top
  - Email + password fields with validation
  - "Sign In" button (full-width, below form)
  - No header
- **Safe Area**: Top: insets.top + Spacing.xl, Bottom: insets.bottom + Spacing.xl

### 2. Cars Tab (List Screen)
- **Purpose**: Browse available project cars with quick filters
- **Layout**:
  - Header: Transparent, title "Fleet", right button (filter icon)
  - Scrollable list of car cards
  - Filter chips below header (base, seats, status, tags)
- **Components**: 
  - Car card: plate, make/model, status badge, seats icon, base label, thumbnail
  - Empty state: "No vehicles match your filters"
- **Safe Area**: Top: headerHeight + Spacing.xl, Bottom: tabBarHeight + Spacing.xl

### 3. Car Detail Screen (Modal Stack)
- **Purpose**: View car specs and availability timeline
- **Layout**:
  - Header: Default navigation, title is plate number, right button "Book"
  - Scrollable content: photo, specs grid, availability timeline (horizontal blocks)
  - Section: "Current/Upcoming Bookings" — shows time blocks with booker name
  - If booked, show "Request to Join Ride" button on booking block
- **Safe Area**: Top: Spacing.xl, Bottom: insets.bottom + Spacing.xl

### 4. Book Flow (Floating Action Button → Modal Stack)
- **Purpose**: Create new car booking
- **Layout** (Step 1 - Time Selection):
  - Header: Title "New Booking", left button "Cancel", right button "Next"
  - Form (scrollable): pickup datetime, return datetime, pickup location, destination, purpose, passengers
  - Submit button in header (right)
- **Layout** (Step 2 - Select Car):
  - Header: Title "Available Cars", left button "Back"
  - List: Available cars matching time window
  - Car card shows "Available" badge
- **Layout** (Step 3 - Confirm):
  - Header: Title "Confirm Booking", left button "Back"
  - Summary card: car, dates, route, purpose
  - "Confirm Booking" button (full-width, bottom of scroll)
- **Safe Area**: Top: Spacing.xl, Bottom: insets.bottom + Spacing.xl

### 5. Bookings Tab (List Screen)
- **Purpose**: View my current and upcoming bookings
- **Layout**:
  - Header: Transparent, title "My Bookings"
  - Segmented control: Upcoming / Past
  - Scrollable list of booking cards
- **Components**:
  - Booking card: car plate, route, dates, status badge
  - Empty state: "No bookings yet. Tap + to book a car"
- **Safe Area**: Top: headerHeight + Spacing.xl, Bottom: tabBarHeight + Spacing.xl

### 6. Booking Detail Screen (Modal Stack)
- **Purpose**: View booking details, check-out/return, manage ride requests
- **Layout**:
  - Header: Title is route (e.g., "Dubai → Al Ain"), right button menu (Cancel/Edit)
  - Scrollable content:
    - Status banner (if checked out or pending return)
    - Car details
    - Time/route info
    - "Ride Mates" section (if any approved)
    - "Join Requests" section (if owner, shows pending requests)
    - Action buttons: "Check Out" / "Return Car" (contextual)
- **Safe Area**: Top: Spacing.xl, Bottom: insets.bottom + Spacing.xl

### 7. Check-Out/Return Screen (Modal Stack)
- **Purpose**: Record vehicle handover details
- **Layout**:
  - Header: Title "Check Out" or "Return Car", left button "Cancel", right button "Save"
  - Scrollable form: odometer, fuel level, photo upload, notes
  - Submit button in header (right)
- **Safe Area**: Top: Spacing.xl, Bottom: insets.bottom + Spacing.xl

### 8. Profile Tab
- **Purpose**: User settings and preferences
- **Layout**:
  - Header: Transparent, title "Profile"
  - Scrollable content:
    - Avatar + name at top
    - Settings list: Share phone toggle, home office, role (read-only)
    - "Sign Out" button at bottom
- **Safe Area**: Top: headerHeight + Spacing.xl, Bottom: tabBarHeight + Spacing.xl

### 9. Admin Tab (Conditional)
- **Purpose**: Manage fleet and view all bookings
- **Layout**:
  - Header: Transparent, title "Admin"
  - Scrollable list: "Manage Cars", "All Bookings", "Reported Issues", "Maintenance"
- **Safe Area**: Top: headerHeight + Spacing.xl, Bottom: tabBarHeight + Spacing.xl

## Color Palette

**Primary**: #0066B2 (Siemens corporate blue, confident and trustworthy)  
**Primary Variant**: #004A87 (darker, for pressed states)  
**Accent**: #00897B (teal, for availability/success indicators)  
**Background**: #F5F7FA (cool light gray)  
**Surface**: #FFFFFF  
**Surface Variant**: #E8ECF1 (subtle card borders)  
**Text Primary**: #1A2332  
**Text Secondary**: #5F6E7F  
**Error**: #D32F2F  
**Warning**: #F57C00  
**Success**: #00897B  
**Disabled**: #B0BEC5

**Status Colors**:  
- Available: #00897B  
- Reserved: #F57C00  
- Checked Out: #0066B2  
- Maintenance: #D32F2F

## Typography

**Font**: System default (SF Pro for iOS, Roboto for Android) for maximum legibility at small sizes  
**Type Scale**:  
- Large Title: 34pt, Bold  
- Title: 28pt, Bold  
- Headline: 17pt, Semibold  
- Body: 15pt, Regular  
- Subhead: 13pt, Regular  
- Caption: 11pt, Regular

## Visual Design

- Use Feather icons from @expo/vector-icons
- Touchable feedback: Reduce opacity to 0.7 on press
- Floating action button (FAB for "Book"):
  - Background: Primary color
  - Size: 56×56pt circle
  - Shadow: shadowOffset {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2
- Card style: White background, corner radius 12pt, subtle border (Surface Variant, 1px)
- Status badges: Rounded pill shape, 6pt vertical padding, colored background with white text
- Booking timeline blocks: Horizontal rectangles with start/end times, color-coded by status

## Assets to Generate

1. **icon.png** — App icon: Stylized car key with Siemens blue/teal gradient  
   **WHERE USED**: Device home screen

2. **splash-icon.png** — Simple car silhouette icon  
   **WHERE USED**: App launch screen

3. **empty-cars.png** — Illustration of a clean, empty parking lot with subtle road markings  
   **WHERE USED**: Cars tab when no vehicles match filters

4. **empty-bookings.png** — Illustration of a calendar with a highlighted "+ new" symbol  
   **WHERE USED**: Bookings tab when user has no bookings

5. **default-car.png** — Generic sedan silhouette (neutral gray)  
   **WHERE USED**: Car cards and detail screens when no photo uploaded

6. **default-avatar.png** — Minimal geometric profile icon (teal circle with white initials)  
   **WHERE USED**: Profile screen and ride mate lists