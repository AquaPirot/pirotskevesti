import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const categories = [
  { value: 'ARTICLE', label: 'Članak' },
  { value: 'VIDEO', label: 'Video' },
  { value: 'INTERVIEW', label: 'Intervju' },
  { value: 'RESEARCH', label: 'Istraživanje' },
  { value: 'EDITING', label: 'Montaža' },
  { value: 'SOCIAL_MEDIA', label: 'Društvene mreže' },
  { value: 'OTHER', label: 'Ostalo' }
]

export const statuses = [
  { value: 'IN_PROGRESS', label: 'U radu' },
  { value: 'COMPLETED', label: 'Završeno' },
  { value: 'PUBLISHED', label: 'Objavljeno' }
]

export const priorities = [
  { value: 'HIGH', label: 'Visok' },
  { value: 'MEDIUM', label: 'Srednji' },
  { value: 'LOW', label: 'Nizak' }
]

export const users = [
  { id: 'novinar', name: 'Novinar' },
  { id: 'snimatelj', name: 'Snimatelj' },
  { id: 'saradnik', name: 'Saradnik' },
  { id: 'agencija', name: 'Agencija' }
]