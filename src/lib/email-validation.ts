// University email domain validation
const universityDomains = [
  'edu',
  'university.edu',
  'college.edu',
  'student.university.edu',
  'alumni.university.edu'
]

// Common university domains (you can add more)
const commonUniversityDomains = [
  'rmit.edu.au',
  'unimelb.edu.au',
  'monash.edu',
  'swinburne.edu.au',
  'deakin.edu.au',
  'latrobe.edu.au',
  'anu.edu.au',
  'unsw.edu.au',
  'usyd.edu.au',
  'uts.edu.au',
  'mq.edu.au',
  'unsw.edu.au',
  'unimelb.edu.au',
  'monash.edu.au',
  'swinburne.edu.au',
  'deakin.edu.au',
  'latrobe.edu.au',
  'anu.edu.au',
  'unsw.edu.au',
  'usyd.edu.au',
  'uts.edu.au',
  'mq.edu.au'
]

export const validateUniversityEmail = (email: string): boolean => {
  if (!email || !email.includes('@')) {
    return false
  }

  const domain = email.split('@')[1]?.toLowerCase()
  
  if (!domain) {
    return false
  }

  // Check if it ends with .edu or is a known university domain
  return domain.endsWith('.edu') || 
         domain.endsWith('.edu.au') || 
         commonUniversityDomains.includes(domain)
}

export const getUniversityFromEmail = (email: string): string => {
  const domain = email.split('@')[1]?.toLowerCase()
  
  if (!domain) return 'Unknown University'
  
  // Map domains to university names
  const domainMap: { [key: string]: string } = {
    'rmit.edu.au': 'RMIT University',
    'unimelb.edu.au': 'University of Melbourne',
    'monash.edu': 'Monash University',
    'monash.edu.au': 'Monash University',
    'swinburne.edu.au': 'Swinburne University',
    'deakin.edu.au': 'Deakin University',
    'latrobe.edu.au': 'La Trobe University',
    'anu.edu.au': 'Australian National University',
    'unsw.edu.au': 'UNSW Sydney',
    'usyd.edu.au': 'University of Sydney',
    'uts.edu.au': 'University of Technology Sydney',
    'mq.edu.au': 'Macquarie University'
  }
  
  return domainMap[domain] || 'University'
}
