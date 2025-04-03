// Common item types
export interface BaseItem {
  id: string | number
  title?: string | null
}

// Source-specific types
export interface SourceItem extends BaseItem {
  url?: string | null
  author?: string | null
}

// Atom-specific types
export interface AtomItem extends BaseItem {
  mainContent?: string | null
}

// Synthetic atom-specific types
export interface SyntheticAtomItem extends BaseItem {
  mainContent?: string | null
}
