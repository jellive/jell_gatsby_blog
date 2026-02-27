// Category mapping: directory path → frontmatter metadata
// Used by scaffold.mjs and quality validators

export const CATEGORIES = {
  'dev/js': { category: 'Javascript', tags: ['Javascript'] },
  'dev/js/tip': { category: 'Javascript', tags: ['Javascript', 'Tips'] },
  'dev/blog': { category: 'Blog', tags: ['Blog'] },
  'dev/docker': { category: 'Docker', tags: ['Docker'] },
  'dev/ios': { category: 'iOS', tags: ['iOS'] },
  'dev/linux': { category: 'Linux', tags: ['Linux'] },
  'dev/network': { category: 'Network', tags: ['Network'] },
  'dev/algorithm': { category: 'Algorithm', tags: ['Algorithm'] },
  'dev/architecture': { category: 'Architecture', tags: ['Architecture'] },
  'dev/jell': { category: 'Dev', tags: ['개발'] },
  bicycle: { category: 'Bicycle', tags: ['Bicycle'] },
  chat: { category: 'Chat', tags: ['Chat'] },
  game: { category: 'Game', tags: ['Game'] },
  notice: { category: 'Notice', tags: ['Notice'] },
}

// Valid category keys for CLI validation
export const CATEGORY_KEYS = Object.keys(CATEGORIES)

// Get category config or throw
export function getCategoryConfig(categoryPath) {
  const config = CATEGORIES[categoryPath]
  if (!config) {
    const available = CATEGORY_KEYS.join(', ')
    throw new Error(
      `Unknown category: "${categoryPath}"\nAvailable: ${available}`
    )
  }
  return config
}
