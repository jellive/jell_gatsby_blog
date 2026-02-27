// Obsidian vault configuration
// Update VAULT_PATH to point to your Obsidian vault

export const VAULT_PATH = process.env.OBSIDIAN_VAULT_PATH || '~/Documents/Obsidian'

// PARA folder mapping
export const PARA_FOLDERS = {
  Projects: {
    path: 'Projects',
    description: 'Active implementation topics',
    bestFor: 'tutorial/guide posts',
  },
  Areas: {
    path: 'Areas',
    description: 'Ongoing expertise topics',
    bestFor: 'deep-dive/analysis posts',
  },
  Resources: {
    path: 'Resources',
    description: 'Reference material',
    bestFor: 'comparison/review posts',
  },
}

// Blog category suggestions based on PARA folder content
export const FOLDER_TO_CATEGORY = {
  'Projects/dev': 'dev/blog',
  'Projects/flutter': 'dev/blog',
  'Projects/react': 'dev/js',
  'Areas/programming': 'dev/blog',
  'Areas/infrastructure': 'dev/linux',
  'Areas/networking': 'dev/network',
  'Resources/tools': 'dev/blog',
}
