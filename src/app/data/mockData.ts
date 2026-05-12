export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  city: string;
  rating: number;
  experience: number;
  reviewCount: number;
  isOnline: boolean;
  availability: "Available Now" | "Today" | "Tomorrow" | "This Week";
  consultationType: ("Online" | "Physical")[];
  nextSlot: string;
  fee: number;
  image: string;
  verified: boolean;
  hospital: string;
  education: string;
  about: string;
  aiMatch?: "Best Match" | "Recommended" | "Top Rated";
  languages: string[];
  slots: { time: string; available: boolean; date: string }[];
};

export type Appointment = {
  id: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  type: "Online" | "Physical";
  status: "Upcoming" | "Completed" | "Cancelled";
  image: string;
};

export type Message = {
  id: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  lastMessage: string;
  time: string;
  unread: number;
  image: string;
  isOnline: boolean;
};

export type Notification = {
  id: string;
  type: "booking" | "reminder" | "inquiry" | "review" | "system";
  title: string;
  description: string;
  time: string;
  read: boolean;
};

export const DOCTORS: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Ahmed Khan",
    specialization: "Cardiologist",
    city: "Lahore",
    rating: 4.9,
    experience: 14,
    reviewCount: 312,
    isOnline: true,
    availability: "Available Now",
    consultationType: ["Online", "Physical"],
    nextSlot: "3:00 PM",
    fee: 2500,
    image: "https://images.unsplash.com/photo-1615177393114-bd2917a4f74a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    verified: true,
    hospital: "Lahore Heart Center",
    education: "MBBS, FCPS (Cardiology) – King Edward Medical University",
    about: "Dr. Ahmed Khan is a highly experienced cardiologist with over 14 years of practice in interventional cardiology. He specializes in complex coronary interventions and heart failure management.",
    aiMatch: "Best Match",
    languages: ["Urdu", "English", "Punjabi"],
    slots: [
      { time: "9:00 AM", available: false, date: "Today" },
      { time: "10:00 AM", available: false, date: "Today" },
      { time: "11:00 AM", available: true, date: "Today" },
      { time: "3:00 PM", available: true, date: "Today" },
      { time: "4:00 PM", available: true, date: "Today" },
      { time: "9:00 AM", available: true, date: "Tomorrow" },
      { time: "11:00 AM", available: true, date: "Tomorrow" },
      { time: "2:00 PM", available: false, date: "Tomorrow" },
    ],
  },
  {
    id: "d2",
    name: "Dr. Sara Malik",
    specialization: "Dermatologist",
    city: "Karachi",
    rating: 4.7,
    experience: 9,
    reviewCount: 218,
    isOnline: true,
    availability: "Available Now",
    consultationType: ["Online", "Physical"],
    nextSlot: "2:30 PM",
    fee: 2000,
    image: "https://images.unsplash.com/photo-1673865641073-4479f93a7776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    verified: true,
    hospital: "Aga Khan Hospital",
    education: "MBBS, MCPS (Dermatology) – Aga Khan University",
    about: "Dr. Sara Malik is a board-certified dermatologist specializing in acne, eczema, skin cancer screening, and cosmetic dermatology. She is known for her patient-centered approach.",
    aiMatch: "Recommended",
    languages: ["Urdu", "English"],
    slots: [
      { time: "10:00 AM", available: true, date: "Today" },
      { time: "2:30 PM", available: true, date: "Today" },
      { time: "4:00 PM", available: false, date: "Today" },
      { time: "9:00 AM", available: true, date: "Tomorrow" },
      { time: "1:00 PM", available: true, date: "Tomorrow" },
    ],
  },
  {
    id: "d3",
    name: "Dr. Bilal Raza",
    specialization: "Neurologist",
    city: "Islamabad",
    rating: 4.8,
    experience: 12,
    reviewCount: 189,
    isOnline: false,
    availability: "Today",
    consultationType: ["Physical"],
    nextSlot: "5:00 PM",
    fee: 3000,
    image: "https://images.unsplash.com/photo-1769072610024-5b8a50f05c73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    verified: true,
    hospital: "PIMS Hospital Islamabad",
    education: "MBBS, FCPS (Neurology) – University of Health Sciences",
    about: "Dr. Bilal Raza is an expert in treating neurological disorders including epilepsy, migraines, stroke rehabilitation, and movement disorders.",
    aiMatch: "Top Rated",
    languages: ["Urdu", "English"],
    slots: [
      { time: "5:00 PM", available: true, date: "Today" },
      { time: "10:00 AM", available: true, date: "Tomorrow" },
      { time: "12:00 PM", available: false, date: "Tomorrow" },
      { time: "3:00 PM", available: true, date: "Tomorrow" },
    ],
  },
  {
    id: "d4",
    name: "Dr. Fatima Hussain",
    specialization: "Orthopedic",
    city: "Lahore",
    rating: 4.6,
    experience: 8,
    reviewCount: 145,
    isOnline: true,
    availability: "Available Now",
    consultationType: ["Online", "Physical"],
    nextSlot: "1:00 PM",
    fee: 2200,
    image: "https://images.unsplash.com/photo-1615177393579-5fc7431152c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    verified: true,
    hospital: "Shaukat Khanum Hospital",
    education: "MBBS, FCPS (Orthopedic Surgery) – University of Punjab",
    about: "Dr. Fatima Hussain specializes in joint replacement surgery, sports injuries, and spine disorders. She has performed over 500 successful joint replacement surgeries.",
    aiMatch: "Recommended",
    languages: ["Urdu", "English", "Punjabi"],
    slots: [
      { time: "1:00 PM", available: true, date: "Today" },
      { time: "3:00 PM", available: true, date: "Today" },
      { time: "9:00 AM", available: false, date: "Tomorrow" },
      { time: "11:00 AM", available: true, date: "Tomorrow" },
    ],
  },
  {
    id: "d5",
    name: "Dr. Omar Sheikh",
    specialization: "Psychiatrist",
    city: "Karachi",
    rating: 4.5,
    experience: 10,
    reviewCount: 97,
    isOnline: false,
    availability: "Tomorrow",
    consultationType: ["Online"],
    nextSlot: "10:00 AM",
    fee: 2800,
    image: "https://images.unsplash.com/photo-1758691461513-88a0aef72160?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    verified: true,
    hospital: "Karachi Psychiatry Clinic",
    education: "MBBS, FCPS (Psychiatry) – Dow University",
    about: "Dr. Omar Sheikh provides compassionate care for mental health conditions including anxiety, depression, OCD, and PTSD. He uses evidence-based therapeutic approaches.",
    languages: ["Urdu", "English"],
    slots: [
      { time: "10:00 AM", available: true, date: "Tomorrow" },
      { time: "12:00 PM", available: true, date: "Tomorrow" },
      { time: "2:00 PM", available: true, date: "Tomorrow" },
    ],
  },
  {
    id: "d6",
    name: "Dr. Nadia Iqbal",
    specialization: "Gynecologist",
    city: "Lahore",
    rating: 4.9,
    experience: 16,
    reviewCount: 402,
    isOnline: true,
    availability: "Available Now",
    consultationType: ["Online", "Physical"],
    nextSlot: "2:00 PM",
    fee: 2500,
    image: "https://images.unsplash.com/photo-1673865641073-4479f93a7776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    verified: true,
    hospital: "Services Hospital Lahore",
    education: "MBBS, FCPS (Gynecology) – Fatima Jinnah Medical University",
    about: "Dr. Nadia Iqbal is a leading gynecologist with extensive experience in high-risk pregnancies, laparoscopic surgery, and infertility treatment.",
    aiMatch: "Best Match",
    languages: ["Urdu", "English"],
    slots: [
      { time: "2:00 PM", available: true, date: "Today" },
      { time: "4:00 PM", available: true, date: "Today" },
      { time: "9:00 AM", available: false, date: "Tomorrow" },
    ],
  },
  {
    id: "d7",
    name: "Dr. Kamran Ali",
    specialization: "Pediatrician",
    city: "Islamabad",
    rating: 4.7,
    experience: 11,
    reviewCount: 263,
    isOnline: false,
    availability: "Today",
    consultationType: ["Physical"],
    nextSlot: "6:00 PM",
    fee: 1800,
    image: "https://images.unsplash.com/photo-1615177393114-bd2917a4f74a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    verified: true,
    hospital: "Children's Hospital Islamabad",
    education: "MBBS, FCPS (Pediatrics) – Quaid-e-Azam Medical College",
    about: "Dr. Kamran Ali is a dedicated pediatrician specializing in child development, vaccinations, and pediatric emergency care.",
    languages: ["Urdu", "English"],
    slots: [
      { time: "6:00 PM", available: true, date: "Today" },
      { time: "10:00 AM", available: true, date: "Tomorrow" },
    ],
  },
  {
    id: "d8",
    name: "Dr. Zainab Tariq",
    specialization: "ENT Specialist",
    city: "Karachi",
    rating: 4.6,
    experience: 7,
    reviewCount: 132,
    isOnline: true,
    availability: "Available Now",
    consultationType: ["Online", "Physical"],
    nextSlot: "3:30 PM",
    fee: 2000,
    image: "https://images.unsplash.com/photo-1673865641073-4479f93a7776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    verified: false,
    hospital: "Liaquat National Hospital",
    education: "MBBS, DLO (ENT) – University of Karachi",
    about: "Dr. Zainab Tariq specializes in ear infections, hearing disorders, sinus diseases, and throat conditions including tonsillitis and vocal cord disorders.",
    languages: ["Urdu", "English", "Sindhi"],
    slots: [
      { time: "3:30 PM", available: true, date: "Today" },
      { time: "5:00 PM", available: true, date: "Today" },
      { time: "9:00 AM", available: true, date: "Tomorrow" },
    ],
  },
];

export const APPOINTMENTS: Appointment[] = [
  {
    id: "a1",
    doctorId: "d1",
    doctorName: "Dr. Ahmed Khan",
    specialization: "Cardiologist",
    date: "May 14, 2026",
    time: "3:00 PM",
    type: "Online",
    status: "Upcoming",
    image: "https://images.unsplash.com/photo-1615177393114-bd2917a4f74a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "a2",
    doctorId: "d2",
    doctorName: "Dr. Sara Malik",
    specialization: "Dermatologist",
    date: "May 20, 2026",
    time: "2:30 PM",
    type: "Physical",
    status: "Upcoming",
    image: "https://images.unsplash.com/photo-1673865641073-4479f93a7776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "a3",
    doctorId: "d3",
    doctorName: "Dr. Bilal Raza",
    specialization: "Neurologist",
    date: "April 28, 2026",
    time: "5:00 PM",
    type: "Physical",
    status: "Completed",
    image: "https://images.unsplash.com/photo-1769072610024-5b8a50f05c73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "a4",
    doctorId: "d4",
    doctorName: "Dr. Fatima Hussain",
    specialization: "Orthopedic",
    date: "April 10, 2026",
    time: "1:00 PM",
    type: "Online",
    status: "Completed",
    image: "https://images.unsplash.com/photo-1615177393579-5fc7431152c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
];

export const MESSAGES: Message[] = [
  {
    id: "m1",
    doctorId: "d1",
    doctorName: "Dr. Ahmed Khan",
    specialization: "Cardiologist",
    lastMessage: "Your ECG results look normal. Continue with the prescribed medication.",
    time: "10:32 AM",
    unread: 2,
    image: "https://images.unsplash.com/photo-1615177393114-bd2917a4f74a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    isOnline: true,
  },
  {
    id: "m2",
    doctorId: "d2",
    doctorName: "Dr. Sara Malik",
    specialization: "Dermatologist",
    lastMessage: "I've reviewed your photos. Please apply the cream twice daily.",
    time: "Yesterday",
    unread: 0,
    image: "https://images.unsplash.com/photo-1673865641073-4479f93a7776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    isOnline: false,
  },
  {
    id: "m3",
    doctorId: "d4",
    doctorName: "Dr. Fatima Hussain",
    specialization: "Orthopedic",
    lastMessage: "How is your knee feeling after the physiotherapy sessions?",
    time: "Mon",
    unread: 1,
    image: "https://images.unsplash.com/photo-1615177393579-5fc7431152c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    isOnline: true,
  },
];

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "booking",
    title: "Appointment Confirmed",
    description: "Your appointment with Dr. Ahmed Khan is confirmed for May 14, 3:00 PM",
    time: "2 min ago",
    read: false,
  },
  {
    id: "n2",
    type: "reminder",
    title: "Appointment Reminder",
    description: "You have an appointment with Dr. Sara Malik tomorrow at 2:30 PM",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "n3",
    type: "inquiry",
    title: "New Message",
    description: "Dr. Ahmed Khan has replied to your query about chest pain",
    time: "3 hours ago",
    read: false,
  },
  {
    id: "n4",
    type: "review",
    title: "Leave a Review",
    description: "How was your consultation with Dr. Bilal Raza? Share your feedback",
    time: "Yesterday",
    read: true,
  },
  {
    id: "n5",
    type: "system",
    title: "Profile Verified",
    description: "Your patient profile has been successfully verified",
    time: "2 days ago",
    read: true,
  },
  {
    id: "n6",
    type: "booking",
    title: "Appointment Cancelled",
    description: "Your appointment on April 15 has been cancelled. Book a new slot.",
    time: "3 days ago",
    read: true,
  },
];

export const SPECIALIZATIONS = [
  { name: "Cardiologist", icon: "❤️", count: 48 },
  { name: "Dermatologist", icon: "🧴", count: 63 },
  { name: "Neurologist", icon: "🧠", count: 29 },
  { name: "Orthopedic", icon: "🦴", count: 37 },
  { name: "Gynecologist", icon: "👩‍⚕️", count: 54 },
  { name: "Pediatrician", icon: "👶", count: 71 },
  { name: "Psychiatrist", icon: "💭", count: 22 },
  { name: "ENT Specialist", icon: "👂", count: 31 },
  { name: "Ophthalmologist", icon: "👁️", count: 28 },
  { name: "Oncologist", icon: "🎗️", count: 19 },
  { name: "Urologist", icon: "🩺", count: 24 },
  { name: "General Physician", icon: "🏥", count: 112 },
];

export const AI_SEARCH_SUGGESTIONS: Record<string, string[]> = {
  skin: ["Dermatologist", "Skin rash treatment", "Skin allergy specialist", "Skin cancer screening"],
  heart: ["Cardiologist", "Chest pain specialist", "Heart checkup", "Cardiac rehabilitation"],
  back: ["Orthopedic surgeon", "Spine specialist", "Back pain physiotherapy", "Neurologist"],
  head: ["Neurologist", "Headache specialist", "Migraine treatment", "Neurosurgeon"],
  stomach: ["Gastroenterologist", "Digestive disorders", "Abdominal pain treatment"],
  eye: ["Ophthalmologist", "Eye specialist", "Vision problems", "Glaucoma specialist"],
  ear: ["ENT Specialist", "Hearing loss", "Ear infection", "Tinnitus treatment"],
  child: ["Pediatrician", "Child specialist", "Newborn care", "Child development"],
  mental: ["Psychiatrist", "Anxiety treatment", "Depression specialist", "Mental health"],
  fever: ["General Physician", "Viral fever", "Infection specialist", "Emergency care"],
};

export const CHAT_MESSAGES = [
  { id: 1, sender: "doctor", text: "Hello! How can I help you today?", time: "10:00 AM" },
  { id: 2, sender: "patient", text: "I've been experiencing chest pain for the past 2 days", time: "10:01 AM" },
  { id: 3, sender: "doctor", text: "I understand. Can you describe the pain? Is it sharp or dull? Does it radiate to your arm or jaw?", time: "10:02 AM" },
  { id: 4, sender: "patient", text: "It's more of a dull ache, mostly in the center. Sometimes I feel it in my left shoulder.", time: "10:03 AM" },
  { id: 5, sender: "doctor", text: "That's important information. I'd recommend we schedule an ECG and blood test. Are you available this afternoon?", time: "10:04 AM" },
  { id: 6, sender: "patient", text: "Yes, I can come at 3 PM", time: "10:05 AM" },
  { id: 7, sender: "doctor", text: "Perfect. I've noted your appointment for 3:00 PM. Please avoid heavy meals before the test. See you then! 🏥", time: "10:06 AM" },
];

export const ADMIN_STATS = {
  totalDoctors: 248,
  totalPatients: 18642,
  todayAppointments: 342,
  pendingVerifications: 12,
  activeChats: 89,
  monthlyRevenue: 2847500,
};
