export interface Block {
  id: string
  type:
    | "title"
    | "avatar"
    | "category"
    | "link"
    | "social"
    | "image"
    | "section"
    | "horizontal-categories"
    | "form"
    | "product"
    | "menu-category"
    | "menu-header"
    | "special-offer"
    | "hours"
  props: Record<string, any>
}

export interface FormField {
  id: string
  type: "text" | "email" | "textarea" | "select" | "checkbox" | "radio" | "number" | "tel" | "url"
  label: string
  placeholder?: string
  required?: boolean
  options?: string[] // For select, radio, checkbox
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
  }
}

export interface GlobalSettings {
  pageTitle: string
  favicon: string
  fontFamily: string
  primaryColor: string
  backgroundColor: string
  borderRadius: number
  padding: number
  maxWidth: number
  theme: "light" | "dark" | "system"
}

export interface User {
  id: string
  username: string
  blocks: Block[]
  globalSettings: GlobalSettings
  createdAt: Date
  updatedAt: Date
}

export interface PageData {
  username: string
  blocks: Block[]
  globalSettings: GlobalSettings
}
