"use client"

import type React from "react"

import { useEditorStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Upload, LayoutGrid, ArrowRight, Plus, Trash2, GripVertical, Palette } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import type { FormField } from "@/lib/types"

const fieldTypes = [
  { value: "text", label: "Text Input" },
  { value: "email", label: "Email" },
  { value: "textarea", label: "Textarea" },
  { value: "select", label: "Select Dropdown" },
  { value: "checkbox", label: "Checkboxes" },
  { value: "radio", label: "Radio Buttons" },
  { value: "number", label: "Number" },
  { value: "tel", label: "Phone" },
  { value: "url", label: "URL" },
]

export function BottomSheetSettings() {
  const { activeBlock, updateBlock, setActiveBlock, setEditingMode } = useEditorStore()
  const [originalProps, setOriginalProps] = useState<Record<string, any>>({})
  const [editingField, setEditingField] = useState<FormField | null>(null)
  const [showAddField, setShowAddField] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (activeBlock) {
      // Save original props when opening the bottom sheet
      setOriginalProps({ ...activeBlock.props })
    }
  }, [activeBlock]) // Only reset when switching to a different block

  if (!activeBlock) return null

  const handleClose = () => {
    setActiveBlock(null)
  }

  const handleCancel = () => {
    // Revert to original props
    updateBlock(activeBlock.id, originalProps)
    setActiveBlock(null)
  }

  const handleBackToStyling = () => {
    setEditingMode("styling")
  }

  // Real-time update function
  const updateProp = (key: string, value: any) => {
    updateBlock(activeBlock.id, { [key]: value })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          if (activeBlock.type === "avatar") {
            updateProp("src", result)
          } else if (activeBlock.type === "image") {
            const currentImages = activeBlock.props.images || []
            updateProp("images", [...currentImages, result])
          } else if (activeBlock.type === "product") {
            updateProp("image", result)
          } else if (activeBlock.type === "menu-header") {
            updateProp("logo", result)
          } else if (activeBlock.type === "special-offer") {
            updateProp("image", result)
          }
        }
        reader.readAsDataURL(file)
      })
      // Clear the input so the same files can be selected again if needed
      event.target.value = ""
    }
  }

  const removeImage = (index: number) => {
    const currentImages = activeBlock.props.images || []
    const newImages = currentImages.filter((_: any, i: number) => i !== index)
    updateProp("images", newImages)
  }

  // Form field management functions
  const addFormField = (type: string) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: type as FormField["type"],
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: `Enter ${type}`,
      required: false,
      options: type === "select" || type === "checkbox" || type === "radio" ? ["Option 1", "Option 2"] : undefined,
    }

    const currentFields = activeBlock.props.fields || []
    updateProp("fields", [...currentFields, newField])
    setShowAddField(false)
  }

  const updateFormField = (fieldId: string, updates: Partial<FormField>) => {
    const currentFields = activeBlock.props.fields || []
    const updatedFields = currentFields.map((field: FormField) =>
      field.id === fieldId ? { ...field, ...updates } : field,
    )
    updateProp("fields", updatedFields)
  }

  const removeFormField = (fieldId: string) => {
    const currentFields = activeBlock.props.fields || []
    const updatedFields = currentFields.filter((field: FormField) => field.id !== fieldId)
    updateProp("fields", updatedFields)
  }

  const renderSettingsControls = () => {
    const props = activeBlock.props

    switch (activeBlock.type) {
      case "avatar":
        return (
          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Profile Image</Label>
              <div className="space-y-3">
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {props.src && (
                  <div className="flex justify-center">
                    <img
                      src={props.src || "/placeholder.svg"}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case "image":
        return (
          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Images</Label>
              <div className="space-y-3">
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Add Images
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Image Preview Grid */}
                {props.images && props.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {props.images.map((img: string, index: number) => (
                      <div key={index} className="relative">
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`Image ${index + 1}`}
                          className="w-full h-16 object-cover rounded border"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Layout Style */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Layout Style</Label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <Button
                  variant={props.layout === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateProp("layout", "grid")}
                >
                  <LayoutGrid className="w-4 h-4 mr-1" />
                  Grid
                </Button>
                <Button
                  variant={props.layout === "carousel" ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateProp("layout", "carousel")}
                >
                  <ArrowRight className="w-4 h-4 mr-1" />
                  Carousel
                </Button>
              </div>

              {/* Grid Style Options - Only show when layout is grid */}
              {props.layout === "grid" && (
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-gray-600">Grid Style</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={props.gridStyle === "simple" || !props.gridStyle ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateProp("gridStyle", "simple")}
                      className="text-xs"
                    >
                      Simple
                    </Button>
                    <Button
                      variant={props.gridStyle === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateProp("gridStyle", "list")}
                      className="text-xs"
                    >
                      List
                    </Button>
                    <Button
                      variant={props.gridStyle === "pinterest" ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateProp("gridStyle", "pinterest")}
                      className="text-xs"
                    >
                      Pinterest
                    </Button>
                  </div>

                  {/* Column Count - Only show for simple and pinterest styles */}
                  {(props.gridStyle === "simple" || props.gridStyle === "pinterest" || !props.gridStyle) && (
                    <div>
                      <Label className="text-xs font-medium text-gray-600 mb-2 block">
                        Columns: {props.columns || 2}
                      </Label>
                      <div className="grid grid-cols-4 gap-1">
                        {[1, 2, 3, 4].map((num) => (
                          <Button
                            key={num}
                            variant={props.columns === num || (!props.columns && num === 2) ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateProp("columns", num)}
                            className="text-xs"
                          >
                            {num}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )

      case "link":
        return (
          <div className="space-y-6">
            {/* URL Input */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Link URL</Label>
              <Input
                type="url"
                value={props.url || ""}
                onChange={(e) => updateProp("url", e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
        )

      case "product":
        return (
          <div className="space-y-6">
            {/* Product Image */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Product Image</Label>
              <div className="space-y-3">
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {props.image && (
                  <div className="flex justify-center">
                    <img
                      src={props.image || "/placeholder.svg"}
                      alt="Preview"
                      className="w-20 h-20 rounded object-cover border-2 border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Show Image Toggle */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Display Options</Label>
              <Button
                variant={props.showImage ? "default" : "outline"}
                onClick={() => updateProp("showImage", !props.showImage)}
                className="w-full"
              >
                {props.showImage ? "Hide Image" : "Show Image"}
              </Button>
            </div>
          </div>
        )

      case "menu-header":
        return (
          <div className="space-y-6">
            {/* Logo Upload */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Restaurant Logo</Label>
              <div className="space-y-3">
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {props.logo && (
                  <div className="flex justify-center">
                    <img
                      src={props.logo || "/placeholder.svg"}
                      alt="Logo Preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Display Options */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Display Options</Label>
              <div className="space-y-2">
                <Button
                  variant={props.showLogo ? "default" : "outline"}
                  onClick={() => updateProp("showLogo", !props.showLogo)}
                  className="w-full"
                >
                  {props.showLogo ? "Hide Logo" : "Show Logo"}
                </Button>
                <Button
                  variant={props.showContact ? "default" : "outline"}
                  onClick={() => updateProp("showContact", !props.showContact)}
                  className="w-full"
                >
                  {props.showContact ? "Hide Contact Info" : "Show Contact Info"}
                </Button>
              </div>
            </div>
          </div>
        )

      case "special-offer":
        return (
          <div className="space-y-6">
            {/* Offer Image */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Offer Image</Label>
              <div className="space-y-3">
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {props.image && (
                  <div className="flex justify-center">
                    <img
                      src={props.image || "/placeholder.svg"}
                      alt="Preview"
                      className="w-20 h-20 rounded object-cover border-2 border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Badge Options */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Badge</Label>
              <div className="space-y-2">
                <Button
                  variant={props.showBadge ? "default" : "outline"}
                  onClick={() => updateProp("showBadge", !props.showBadge)}
                  className="w-full"
                >
                  {props.showBadge ? "Hide Badge" : "Show Badge"}
                </Button>
                {props.showBadge && (
                  <Input
                    value={props.badgeText || ""}
                    onChange={(e) => updateProp("badgeText", e.target.value)}
                    placeholder="Badge text"
                  />
                )}
              </div>
            </div>
          </div>
        )

      case "hours":
        return (
          <div className="space-y-6">
            {/* Show Icon */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Display Options</Label>
              <Button
                variant={props.showIcon ? "default" : "outline"}
                onClick={() => updateProp("showIcon", !props.showIcon)}
                className="w-full"
              >
                {props.showIcon ? "Hide Clock Icon" : "Show Clock Icon"}
              </Button>
            </div>
          </div>
        )

      case "form":
        return (
          <div className="space-y-6">
            {/* Form Settings */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Form Settings</Label>

              <div>
                <Label className="text-xs text-gray-600 mb-2 block">Submit URL (Webhook/Email)</Label>
                <Input
                  value={props.submitUrl || ""}
                  onChange={(e) => updateProp("submitUrl", e.target.value)}
                  placeholder="https://formspree.io/f/your-form-id"
                />
              </div>

              <div>
                <Label className="text-xs text-gray-600 mb-2 block">Success Message</Label>
                <Input
                  value={props.successMessage || ""}
                  onChange={(e) => updateProp("successMessage", e.target.value)}
                  placeholder="Thank you! Your form has been submitted."
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Form Fields</Label>
                <Button size="sm" onClick={() => setShowAddField(true)} className="text-xs">
                  <Plus className="w-3 h-3 mr-1" />
                  Add Field
                </Button>
              </div>

              {/* Field List */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {(props.fields || []).map((field: FormField, index: number) => (
                  <div key={field.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-3 h-3 text-gray-400" />
                        <span className="text-sm font-medium">{field.label}</span>
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">{field.type}</span>
                        {field.required && (
                          <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">Required</span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingField(field)}
                          className="h-6 w-6 p-0 text-xs"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFormField(field.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      {field.placeholder && `Placeholder: ${field.placeholder}`}
                    </div>
                  </div>
                ))}

                {(!props.fields || props.fields.length === 0) && (
                  <div className="text-center py-6 text-gray-500">
                    <p className="text-sm">No form fields added yet.</p>
                    <Button size="sm" variant="outline" onClick={() => setShowAddField(true)} className="mt-2">
                      Add Your First Field
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Add Field Modal */}
            {showAddField && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Add Form Field</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowAddField(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {fieldTypes.map((fieldType) => (
                      <Button
                        key={fieldType.value}
                        variant="outline"
                        onClick={() => addFormField(fieldType.value)}
                        className="justify-start text-sm"
                      >
                        {fieldType.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Edit Field Modal */}
            {editingField && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Edit Field</h3>
                    <Button variant="ghost" size="sm" onClick={() => setEditingField(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm mb-2 block">Field Type</Label>
                      <select
                        value={editingField.type}
                        onChange={(e) => {
                          const newType = e.target.value as FormField["type"]
                          const updatedField = { ...editingField, type: newType }

                          // Add default options for select/checkbox/radio
                          if (
                            (newType === "select" || newType === "checkbox" || newType === "radio") &&
                            !updatedField.options
                          ) {
                            updatedField.options = ["Option 1", "Option 2"]
                          }

                          setEditingField(updatedField)
                          updateFormField(editingField.id, updatedField)
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        {fieldTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Field Label</Label>
                      <Input
                        value={editingField.label}
                        onChange={(e) => {
                          const updatedField = { ...editingField, label: e.target.value }
                          setEditingField(updatedField)
                          updateFormField(editingField.id, updatedField)
                        }}
                        placeholder="Enter field label"
                      />
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Placeholder Text</Label>
                      <Input
                        value={editingField.placeholder || ""}
                        onChange={(e) => {
                          const updatedField = { ...editingField, placeholder: e.target.value }
                          setEditingField(updatedField)
                          updateFormField(editingField.id, updatedField)
                        }}
                        placeholder="Enter placeholder text"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="required"
                        checked={editingField.required || false}
                        onCheckedChange={(checked) => {
                          const updatedField = { ...editingField, required: !!checked }
                          setEditingField(updatedField)
                          updateFormField(editingField.id, updatedField)
                        }}
                      />
                      <Label htmlFor="required" className="text-sm">
                        Required field
                      </Label>
                    </div>

                    {/* Options for select, checkbox, radio */}
                    {(editingField.type === "select" ||
                      editingField.type === "checkbox" ||
                      editingField.type === "radio") && (
                      <div>
                        <Label className="text-sm mb-2 block">Options</Label>
                        <div className="space-y-2">
                          {editingField.options?.map((option, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...(editingField.options || [])]
                                  newOptions[index] = e.target.value
                                  const updatedField = { ...editingField, options: newOptions }
                                  setEditingField(updatedField)
                                  updateFormField(editingField.id, updatedField)
                                }}
                                placeholder={`Option ${index + 1}`}
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const newOptions = editingField.options?.filter((_, i) => i !== index) || []
                                  const updatedField = { ...editingField, options: newOptions }
                                  setEditingField(updatedField)
                                  updateFormField(editingField.id, updatedField)
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newOptions = [
                                ...(editingField.options || []),
                                `Option ${(editingField.options?.length || 0) + 1}`,
                              ]
                              const updatedField = { ...editingField, options: newOptions }
                              setEditingField(updatedField)
                              updateFormField(editingField.id, updatedField)
                            }}
                            className="w-full"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Option
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Validation settings */}
                    {(editingField.type === "text" || editingField.type === "textarea") && (
                      <div className="space-y-3">
                        <Label className="text-sm">Validation</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs text-gray-600">Min Length</Label>
                            <Input
                              type="number"
                              value={editingField.validation?.minLength || ""}
                              onChange={(e) => {
                                const updatedField = {
                                  ...editingField,
                                  validation: {
                                    ...editingField.validation,
                                    minLength: e.target.value ? Number.parseInt(e.target.value) : undefined,
                                  },
                                }
                                setEditingField(updatedField)
                                updateFormField(editingField.id, updatedField)
                              }}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600">Max Length</Label>
                            <Input
                              type="number"
                              value={editingField.validation?.maxLength || ""}
                              onChange={(e) => {
                                const updatedField = {
                                  ...editingField,
                                  validation: {
                                    ...editingField.validation,
                                    maxLength: e.target.value ? Number.parseInt(e.target.value) : undefined,
                                  },
                                }
                                setEditingField(updatedField)
                                updateFormField(editingField.id, updatedField)
                              }}
                              placeholder="100"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button onClick={() => setEditingField(null)} className="flex-1">
                      Done
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case "social":
        return (
          <div className="space-y-6">
            {/* Platform Selection */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Social Platforms</Label>
              <div className="grid grid-cols-2 gap-2">
                {["twitter", "linkedin", "github", "instagram"].map((platform) => (
                  <Button
                    key={platform}
                    variant={props.platforms?.includes(platform) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const currentPlatforms = props.platforms || []
                      if (currentPlatforms.includes(platform)) {
                        updateProp(
                          "platforms",
                          currentPlatforms.filter((p: string) => p !== platform),
                        )
                      } else {
                        updateProp("platforms", [...currentPlatforms, platform])
                      }
                    }}
                    className="text-xs capitalize"
                  >
                    {platform}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center text-gray-500">
            <p className="text-sm">No settings available for this component.</p>
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
            <h3 className="text-lg font-semibold capitalize">{activeBlock.type.replace("-", " ")} Settings</h3>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Settings Controls */}
          {renderSettingsControls()}

          {/* Actions */}
          <div className="flex gap-3 mt-8 pt-4 border-t">
            <Button variant="outline" onClick={handleBackToStyling} className="flex-1 bg-transparent">
              <Palette className="w-4 h-4 mr-1" />
              Style
            </Button>
            <Button variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
              Cancel
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
