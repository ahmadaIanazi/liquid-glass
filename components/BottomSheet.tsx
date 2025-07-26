"use client"

import { useEditorStore } from "@/lib/store"
import { BottomSheetStyling } from "./BottomSheetStyling"
import { BottomSheetContent } from "./BottomSheetContent"
import { BottomSheetSettings } from "./BottomSheetSettings"

export function BottomSheet() {
  const { activeBlock, editingMode } = useEditorStore()

  if (!activeBlock) return null

  if (editingMode === "content") {
    return <BottomSheetContent />
  }

  if (editingMode === "settings") {
    return <BottomSheetSettings />
  }

  return <BottomSheetStyling />
}
