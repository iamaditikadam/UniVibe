export interface User {
  id: string
  name: string
  email: string
  campus: string
  avatar?: string
  interests: string[]
  vibePoints: number
  createdAt: Date
  userType?: 'student' | 'club'
  clubDescription?: string
  clubWebsite?: string
  clubCategory?: string
}

export interface Event {
  id: string
  title: string
  description: string
  category: 'Hackathon' | 'Tech' | 'Gaming' | 'Food' | 'Sports' | 'Cultural' | 'Career' | 'Wellness' | 'Volunteering' | 'Clubs'
  date: Date
  time: string
  endDate?: Date
  endTime?: string
  campus: string
  location: string
  image?: string
  host: {
    id: string
    name: string
    avatar?: string
    university: string
  }
  attendees: string[]
  maxAttendees?: number
  isFree: boolean
  tags: string[]
  requirements: string[]
  hasFood: boolean
  isBeginnerFriendly?: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface RSVP {
  id: string
  eventId: string
  userId: string
  createdAt: Date
  checkedIn: boolean
}

export interface ChatMessage {
  id: string
  eventId: string
  senderId: string
  senderName: string
  text: string
  createdAt: Date
}

export interface TeammatePost {
  id: string
  eventId: string
  title: string
  description: string
  skillsNeeded: string[]
  members: string[]
  createdBy: string
  createdAt: Date
}

export interface Campus {
  id: string
  name: string
  domain: string
}
