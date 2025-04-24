import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeAgo(timestamp: string) {
  const now = new Date()
  const diffSeconds = Math.floor(
    (now.getTime() - new Date(timestamp).getTime()) / 1000
  )

  const intervals = [
    { label: 'year', value: 60 * 60 * 24 * 365 },
    { label: 'month', value: 60 * 60 * 24 * 30 },
    { label: 'week', value: 60 * 60 * 24 * 7 },
    { label: 'day', value: 60 * 60 * 24 },
    { label: 'hour', value: 60 * 60 },
    { label: 'minute', value: 60 },
    { label: 'second', value: 1 },
  ]
  for (let i=0; i<intervals.length; i++) {
    const interval = intervals[i]
    const count = Math.floor(diffSeconds / interval.value)
    if (count >= 1) {
      return `${count} ${interval.label}${count === 1 ? '' : 's'} ago`
    }
  }
  return 'just now'
}

export function createRandomString(length: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
