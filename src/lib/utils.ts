import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-AU', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return formatDate(date)
}

export function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    'Hackathon': '🧪',
    'Tech': '🛠',
    'Gaming': '🎮',
    'Food': '🍜',
    'Sports': '⚽',
    'Cultural': '🎭',
    'Career': '💼',
    'Wellness': '🧘',
    'Volunteering': '🤝',
    'Clubs': '👥',
  }
  return emojis[category] || '🎉'
}
