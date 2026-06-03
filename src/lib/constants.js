export const SUBJECTS = [
  { id: 'physics', label: 'Physics', emoji: '⚛️' },
  { id: 'chemistry', label: 'Chemistry', emoji: '🧪' },
  { id: 'biology', label: 'Biology', emoji: '🧬' },
  { id: 'mathematics', label: 'Mathematics', emoji: '📐' },
  { id: 'english', label: 'English', emoji: '📖' },
  { id: 'hindi', label: 'Hindi', emoji: '🇮🇳' },
  { id: 'history', label: 'History', emoji: '🏛️' },
  { id: 'geography', label: 'Geography', emoji: '🌍' },
  { id: 'civics', label: 'Civics', emoji: '⚖️' },
  { id: 'economics', label: 'Economics', emoji: '📊' },
  { id: 'computer', label: 'Computer Science', emoji: '💻' },
  { id: 'accountancy', label: 'Accountancy', emoji: '🧾' },
  { id: 'business', label: 'Business Studies', emoji: '💼' },
]

export const SUBJECT_MAP = Object.fromEntries(SUBJECTS.map(s => [s.id, s]))

export const DOUBT_STATUS = {
  OPEN: 'open',
  ANSWERED: 'answered',
  RESOLVED: 'resolved',
}

export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
}

export const BAD_WORDS = [
  'spam', 'abuse', 'hate', 'idiot', 'stupid', 'fool', 'dumb', 'moron',
  'shut up', 'shutup', 'loser', 'ugly', 'racist', 'sexist', 'nonsense',
]

export function containsBadWord(text) {
  const lower = text.toLowerCase()
  return BAD_WORDS.some(word => lower.includes(word))
}

export function getSubjectClass(subjectId) {
  const map = {
    physics: 'subject-physics',
    chemistry: 'subject-chemistry',
    biology: 'subject-biology',
    mathematics: 'subject-mathematics',
    english: 'subject-english',
    hindi: 'subject-hindi',
    history: 'subject-history',
    geography: 'subject-geography',
    civics: 'subject-civics',
    economics: 'subject-economics',
    computer: 'subject-computer',
    accountancy: 'subject-accountancy',
    business: 'subject-business',
  }
  return map[subjectId] || 'subject-physics'
}

export function timeAgo(dateStr) {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
