"use client"

import { useEditorStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Palette, Info } from "lucide-react"

export function BottomSheetContent() {
  const { activeBlock, updateBlock, setActiveBlock, setEditingMode } = useEditorStore()

  if (!activeBlock) return null

  const handleClose = () => {
    setActiveBlock(null)
  }

  const handleBackToStyling = () => {
    setEditingMode("styling")
  }

  // Real-time update function for non-text properties
  const updateProp = (key: string, value: any) => {
    updateBlock(activeBlock.id, { [key]: value })
  }

  const renderContentEditor = () => {
    switch (activeBlock.type) {
      case "title":
      case "link":
      case "category":
      case "form":
        return (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Info className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-blue-900 mb-2">Direct Text Editing</h4>
              <p className="text-sm text-blue-700">
                Click directly on the text in your component to edit it. You'll see a blue highlight when editing is
                active.
              </p>
            </div>

            {activeBlock.type === "link" && (
              <div className="space-y-3 text-left">
                <div>
                  <Label htmlFor="url" className="text-sm font-medium">
                    Link URL
                  </Label>
                  <Input
                    id="url"
                    type="url"
                    value={activeBlock.props.url || ""}
                    onChange={(e) => updateProp("url", e.target.value)}
                    placeholder="https://example.com"
                    className="mt-2"
                    autoComplete="off"
                  />
                </div>
              </div>
            )}

            {activeBlock.type === "form" && (
              <div className="space-y-3 text-left">
                <div>
                  <Label htmlFor="submitUrl" className="text-sm font-medium">
                    Submit URL (Webhook)
                  </Label>
                  <Input
                    id="submitUrl"
                    type="url"
                    value={activeBlock.props.submitUrl || ""}
                    onChange={(e) => updateProp("submitUrl", e.target.value)}
                    placeholder="https://formspree.io/f/your-form-id"
                    className="mt-2"
                    autoComplete="off"
                  />
                </div>
                <div>
                  <Label htmlFor="submitText" className="text-sm font-medium">
                    Submit Button Text
                  </Label>
                  <Input
                    id="submitText"
                    value={activeBlock.props.submitText || ""}
                    onChange={(e) => updateProp("submitText", e.target.value)}
                    placeholder="Submit"
                    className="mt-2"
                    autoComplete="off"
                  />
                </div>
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="text-center text-gray-500">
            <p className="text-sm">This component doesn't have editable content.</p>
            <p className="text-xs mt-1">Use the styling options to customize its appearance.</p>
          </div>
        )
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300" onClick={handleClose} />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 transform transition-transform duration-300 ease-out">
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Handle */}
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold capitalize">Edit {activeBlock.type} Content</h3>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content Editor */}
          {renderContentEditor()}

          {/* Actions */}
          <div className="flex gap-3 mt-8 pt-4 border-t">
            <Button variant="outline" onClick={handleBackToStyling} className="flex-1 bg-transparent">
              <Palette className="w-4 h-4 mr-1" />
              Style
            </Button>

            <Button onClick={handleClose} className="flex-1">
              Done
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
