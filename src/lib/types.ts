/** Shapes mirrored from the app (Events repo: types/supabase.ts, types/guest.ts). */

export type RsvpStatus = "pending" | "confirmed" | "declined";
export type EventType =
  | "wedding"
  | "baptism"
  | "birthday"
  | "cause"
  | "corporate"
  | "memorial"
  | "other";
export type ReactionType = "love" | "celebrate";
export type AlbumStatus = "not_started" | "generating" | "ready";

export interface GuestRow {
  id: string;
  event_id: string;
  guest_user_id: string | null;
  guest_phone: string | null;
  guest_name: string | null;
  rsvp_status: RsvpStatus;
  dietary_preferences: string[];
  table_id: string | null;
}

export interface EventRow {
  id: string;
  organizer_id: string;
  type: EventType;
  name: string;
  event_date: string | null;
  location: string | null;
  welcome_message: string | null;
  plan_tier: string | null;
  album_status: AlbumStatus;
  event_guests: GuestRow[];
}

export interface AppEvent {
  id: string;
  ownerId: string;
  type: EventType;
  name: string;
  date: string | null;
  location: string | null;
  welcomeMessage: string | null;
  planTier: string | null;
  albumStatus: AlbumStatus;
  /** Owner: every guest. Guest: RLS limits this to their own single row. */
  guests: GuestRow[];
}

/** An event seen from the signed-in user's side. */
export interface MyEvent extends AppEvent {
  isOwner: boolean;
  /** The caller's own guest row; null for the owner. */
  myGuest: GuestRow | null;
}

export interface Moment {
  id: string;
  title: string;
  photoUrl: string | null;
  createdAt: string;
}

export interface MomentReaction {
  momentId: string;
  userId: string;
  type: ReactionType;
}

export interface Message {
  id: string;
  senderId: string;
  senderLabel: string;
  content: string;
  createdAt: string;
}

export interface Photo {
  id: string;
  uploadedBy: string;
  uploadedByLabel: string | null;
  thumbUrl: string | null;
  fullUrl: string | null;
  createdAt: string;
}

export interface Fund {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  location: string;
}

export interface Venue {
  name: string;
  address: string;
  notes: string[];
}

export interface Menu {
  starter: string;
  main: string;
  dessert: string;
}

export interface SeatingTable {
  id: string;
  name: string;
  label: string;
  seatCount: number;
}

export interface Accommodation {
  id: string;
  name: string;
  detailLine: string;
  priceLine: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  handle: string;
  externalUrl: string;
}

export interface PlanCapabilities {
  maxGuests: number | null;
  contributionsEnabled: boolean;
  liveScreenEnabled: boolean;
  chatEnabled: boolean;
  lodgingTransportEnabled: boolean;
  vendorTaggingEnabled: boolean;
}
