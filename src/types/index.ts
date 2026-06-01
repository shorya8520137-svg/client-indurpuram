export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  longDescription: string;
  benefits: string[];
  duration: string;
  price: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialization: string;
  experience: string;
  education: string;
  certifications: string[];
  image: string;
  bio: string;
  availability: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  rating: number;
  content: string;
  video?: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  service: string;
  doctor: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  beforeImage: string;
  afterImage: string;
  title: string;
  description: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot' | 'admin';
  timestamp: string;
  isRead: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  tags: string[];
  slug: string;
}

export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    stats: Array<{ label: string; value: string }>;
  };
  about: {
    title: string;
    content: string;
    mission: string;
    vision: string;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    hours: Record<string, string>;
    emergency: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
  };
}
