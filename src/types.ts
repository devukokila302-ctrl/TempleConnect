export type UserRole = 'user' | 'admin' | 'priest';

export type TempleStatus =
  | 'community_added'
  | 'pending_verification'
  | 'community_confirmed'
  | 'representative_verified';

export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'shortlisted'
  | 'contacted'
  | 'selected'
  | 'not_selected'
  | 'withdrawn';

export type ProposalStatus = 'pending_admin_review' | 'approved' | 'rejected';

export interface UserLocation {
  lat: number;
  lng: number;
  city?: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  templeId?: string; // If admin, the authorized temple they manage
  priestProfileId?: string; // If priest, profile link
  avatar?: string;
  createdAt: string;
}

export interface Puja {
  id: string;
  name: string;
  timing: string;
  significance: string;
  fee?: string;
}

export interface TempleEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  image?: string;
}

export interface TempleTimings {
  morning: string;
  evening: string;
  notes?: string;
  specialDays?: string;
}

export interface TempleContact {
  phone: string;
  email: string;
  website?: string;
  trusteeContact?: string;
}

export interface Temple {
  id: string;
  name: string;
  deity: string;
  city: string;
  state: string;
  address: string;
  lat: number;
  lng: number;
  description: string;
  history: string;
  timings: TempleTimings;
  pujas: Puja[];
  contact: TempleContact;
  photos: string[];
  status: TempleStatus;
  adminId?: string;
  claimedBy?: string;
  claimStatus?: 'unclaimed' | 'claim_pending' | 'claimed';
  contributors: string[]; // List of priest user IDs granted contributor permissions
  events: TempleEvent[];
  dressCode?: string;
  distanceKm?: number; // Calculated on client/query
  createdAt: string;
  updatedAt: string;
}

export interface PreviousTempleWork {
  templeName: string;
  role: string;
  duration: string;
  city: string;
}

export interface PriestProfile {
  id: string;
  userId: string;
  fullName: string;
  experienceYears: number;
  previousTemples: PreviousTempleWork[];
  purohithamSkills: string[];
  vedaTradition: string;
  trainingQualifications: string;
  languages: string[];
  achievements: string;
  bio: string;
  location: string;
  phone: string;
  email: string;
  shareContactConsent: boolean; // Consent to share private contact with hiring admins
  availableForRelocation: boolean;
  expectedRemuneration: string;
  verifiedAgama?: boolean;
  tradition?: string;
  vedaShakha?: string;
  pathashala?: string;
  skills?: string[];
  contactVisibilityConsent?: boolean;
}

export interface Vacancy {
  id: string;
  templeId: string;
  templeName: string;
  location: string;
  title: string;
  ritualSpecialization: string[];
  vedaTraditionRequired: string;
  minExperienceYears: number;
  remuneration: string;
  accommodationProvided: boolean;
  foodProvided: boolean;
  description: string;
  status: 'open' | 'paused' | 'closed';
  postedDate: string;
  applicantsCount?: number;
}

export interface Application {
  id: string;
  vacancyId: string;
  vacancyTitle: string;
  templeId: string;
  templeName: string;
  priestId: string;
  priestName: string;
  priestPhone?: string;
  priestEmail?: string;
  priestExperience: number;
  priestSkills: string[];
  priestVeda: string;
  priestLanguages: string[];
  coverNote: string;
  availableFrom: string;
  status: ApplicationStatus;
  adminNotes?: string;
  aiMatchScore?: number;
  aiMatchSummary?: string;
  submittedAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  applicationId?: string;
  templeId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  recipientName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface ContributorProposal {
  id: string;
  templeId: string;
  templeName: string;
  priestId: string;
  priestName: string;
  updateType: 'timings' | 'pujas' | 'events' | 'information' | 'photos';
  proposedData: any;
  rationale: string;
  status: ProposalStatus;
  adminFeedback?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface TempleClaimRequest {
  id: string;
  templeId: string;
  templeName: string;
  applicantUserId: string;
  applicantName: string;
  officialRole: string;
  phone: string;
  email: string;
  verificationDocs: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: 'application' | 'status_change' | 'message' | 'contributor_update' | 'temple_claim' | 'nearby_event';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  templeId: string;
  performedBy: string;
  action: string;
  details: string;
  timestamp: string;
}
