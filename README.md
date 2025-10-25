# UniVibe Events 🎉

A beautiful, student-focused event discovery platform built with Next.js 14 and Tailwind CSS.

## ✨ Features

- **🎨 Up Bank-inspired Design** - Gorgeous gradients, rounded corners, and joyful UI
- **📱 Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- **🎯 Smart Filtering** - Filter by category, campus, date, free food, and more
- **💬 Event Chat** - Real-time chat for each event (mock implementation)
- **🤝 Teammate Matching** - Find teammates for hackathons and workshops
- **📊 Profile & Stats** - Track your events, vibe points, and interests
- **🎉 Micro-interactions** - Confetti, hover effects, and smooth animations

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Pages & Features

### 🏠 Home Page (`/`)
- Hero section with animated gradient background
- Event discovery with smart filters
- Category chips with emojis
- Responsive event grid
- Search functionality

### 📅 Event Detail (`/events/[id]`)
- Full event information
- RSVP with confetti animation
- Event chat (mock real-time)
- Teammate board for hackathons
- QR code for check-ins
- Share functionality

### ➕ Create Event (`/create`)
- Multi-step form with live preview
- Category and campus selection
- Image upload placeholder
- Tags and special features
- Form validation

### 📋 My Events (`/my-events`)
- Attending events tab
- Hosting events tab
- Past events with attendance badges
- Event management actions

### 👤 Profile (`/profile`)
- User information and stats
- Vibe points system
- Interests management
- Settings and preferences
- Account management

### 🔐 Authentication (`/login`, `/signup`)
- Beautiful gradient backgrounds
- University email validation
- Social login options
- Form validation

## 🎨 Design System

### Colors
- **Primary Gradient**: `#FF6F91` → `#FFA06A` → `#FFC75F`
- **Accent**: `#845EC2`
- **Background**: `#F9FAFB`
- **Text**: `#1E1E1E`

### Typography
- **Headings**: Poppins (600, 700)
- **Body**: Inter (400, 500, 600)

### Components
- Rounded corners (18-24px)
- Soft shadows with hover effects
- Gradient buttons and badges
- Smooth transitions (300ms)

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Confetti**: React Confetti
- **Date Handling**: date-fns

## 📊 Mock Data

The app includes comprehensive mock data:
- 5 sample events across different categories
- 3 mock users with profiles
- Chat messages for events
- Teammate posts for hackathons
- RSVP data and user interactions

## 🎯 Key Components

### UI Components (`/components/ui/`)
- `Button` - Primary, secondary, ghost variants
- `Card` - Rounded cards with hover effects
- `Input` - Form inputs with focus states
- `Badge` - Category and status badges
- `Dialog` - Modal overlays

### Feature Components
- `EventCard` - Event display with RSVP
- `Hero` - Landing page hero section
- `Navbar` - Responsive navigation
- `ChatBox` - Event chat interface
- `TeammateBoard` - Team finding board

## 🚧 What's Next (Backend Integration)

- Firebase Authentication
- Firestore database
- Real-time chat
- Image uploads
- Email validation
- Push notifications
- Analytics dashboard

## 🎉 Try It Out!

1. Browse events on the home page
2. Click on an event to see details
3. Try the RSVP button (with confetti!)
4. Create a new event
5. Check out your profile
6. Test the responsive design on mobile

The UI is fully functional with mock data - perfect for demos and user testing! 🚀
