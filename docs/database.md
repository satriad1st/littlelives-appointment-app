
# 📦 Database Schema Documentation

This document provides an overview of the database schema used in this project.

The database is powered by **MongoDB**, selected for its flexibility and schema-less design which allows easy iteration of data models over time.

---

## 🗂️ Collections & Schemas

### 1️⃣ **SlotConfig Collection**

```ts
{
  weekday: number,              // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime: string,            // Start time in "HH:mm" format (e.g., "08:00")
  endTime: string,              // End time in "HH:mm" format (e.g., "17:00")
  slotDurationMinutes: number,  // Slot duration in minutes (e.g., 30)
  maxBookingPerSlot: number     // Max number of bookings allowed per slot
}
```

- Defines booking configurations per weekday.
- Determines available slots based on operating hours and duration.

---

### 2️⃣ **HolidayConfig Collection**

```ts
{
  date: string,                 // Holiday date in "YYYY-MM-DD" format
  reason?: string               // Optional reason for marking the day as a holiday
}
```

- Blocks appointment bookings on specified dates.
- Used to skip availability on holidays.

---

### 3️⃣ **Appointment Collection**

```ts
{
  name: string,                 // Name of the person booking
  email: string,                // Email of the person booking
  phone?: string,               // Optional phone number
  date: string,                 // Appointment date in "YYYY-MM-DD" format
  time: string                  // Appointment time in "HH:mm" format
}
```

- Represents a scheduled appointment.
- Validated to prevent overlapping with other appointments.
- Ensures booking only within allowed slots and dates.

---

## 📝 Notes

- All date and time fields are stored as **string** using ISO date and "HH:mm" time formats.
- Business logic like checking overlaps, validating available slots, and excluding holidays is handled at the application level.

This schema supports a flexible and scalable appointment scheduling system.
