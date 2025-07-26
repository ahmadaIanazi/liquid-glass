"use client"

import type React from "react"

import { useEditorStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { X, AlignLeft, AlignCenter, AlignRight, Plus, Trash2, GripVertical } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import type { FormField } from "@/lib/types"

const colorOptions = ["#1f2937", "#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"]

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

export function BottomSheetStyling() {
  const { activeBlock, updateBlock, setActiveBlock } = useEditorStore()
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

  const moveFormField = (fromIndex: number, toIndex: number) => {
    const currentFields = [...(activeBlock.props.fields || [])]
    const [movedField] = currentFields.splice(fromIndex, 1)
    currentFields.splice(toIndex, 0, movedField)
    updateProp("fields", currentFields)
  }

  const renderFormBuilder = () => {
    const props = activeBlock.props
    const fields = props.fields || []

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
            {fields.map((field: FormField, index: number) => (
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
                <div className="text-xs text-gray-600">{field.placeholder && `Placeholder: ${field.placeholder}`}</div>
              </div>
            ))}

            {fields.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm">No form fields added yet.</p>
                <Button size="sm" variant="outline" onClick={() => setShowAddField(true)} className="mt-2">
                  Add Your First Field
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Form Styling */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Form Styling</Label>

          <div>
            <Label className="text-xs text-gray-600 mb-2 block">Background Color</Label>
            <div className="flex gap-2 flex-wrap">
              {[...colorOptions, "#ffffff"].map((color) => (
                <button
                  key={color}
                  onClick={() => updateProp("backgroundColor", color)}
                  className={`w-6 h-6 rounded border-2 transition-all ${
                    props.backgroundColor === color ? "border-gray-900 scale-110" : "border-gray-200 hover:scale-105"
                  } ${color === "#ffffff" ? "border-gray-300" : ""}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs text-gray-600 mb-2 block">Border Radius: {props.borderRadius || 8}px</Label>
            <Slider
              value={[props.borderRadius || 8]}
              onValueChange={([value]) => updateProp("borderRadius", value)}
              min={0}
              max={24}
              step={2}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600 mb-2 block">Form Padding: {props.padding || 16}px</Label>
            <Slider
              value={[props.padding || 16]}
              onValueChange={([value]) => updateProp("padding", value)}
              min={8}
              max={32}
              step={4}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600 mb-2 block">Field Spacing: {props.fieldSpacing || 12}px</Label>
            <Slider
              value={[props.fieldSpacing || 12]}
              onValueChange={([value]) => updateProp("fieldSpacing", value)}
              min={4}
              max={24}
              step={2}
              className="w-full"
            />
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
  }

  const renderStylingControls = () => {
    const props = activeBlock.props

    switch (activeBlock.type) {
      case "form":
        return (
          <div className="space-y-4">
            {/* Form Styling */}
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-gray-600 mb-2 block">Background Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {[...colorOptions, "#ffffff"].map((color) => (
                    <button
                      key={color}
                      onClick={() => updateProp("backgroundColor", color)}
                      className={`w-6 h-6 rounded border-2 transition-all ${
                        props.backgroundColor === color
                          ? "border-gray-900 scale-110"
                          : "border-gray-200 hover:scale-105"
                      } ${color === "#ffffff" ? "border-gray-300" : ""}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-600 mb-2 block">Border Radius: {props.borderRadius || 8}px</Label>
                <Slider
                  value={[props.borderRadius || 8]}
                  onValueChange={([value]) => updateProp("borderRadius", value)}
                  min={0}
                  max={24}
                  step={2}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-xs text-gray-600 mb-2 block">Form Padding: {props.padding || 16}px</Label>
                <Slider
                  value={[props.padding || 16]}
                  onValueChange={([value]) => updateProp("padding", value)}
                  min={8}
                  max={32}
                  step={4}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-xs text-gray-600 mb-2 block">Field Spacing: {props.fieldSpacing || 12}px</Label>
                <Slider
                  value={[props.fieldSpacing || 12]}
                  onValueChange={([value]) => updateProp("fieldSpacing", value)}
                  min={4}
                  max={24}
                  step={2}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )

      case "title":
        return (
          <div className="space-y-6">
            {/* Alignment */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Alignment</Label>
              <div className="flex gap-2">
                {[
                  { value: "left", icon: AlignLeft },
                  { value: "center", icon: AlignCenter },
                  { value: "right", icon: AlignRight },
                ].map(({ value, icon: Icon }) => (
                  <Button
                    key={value}
                    variant={props.alignment === value ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateProp("alignment", value)}
                    className="flex-1"
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Font Size: {props.fontSize || 24}px</Label>
              <Slider
                value={[props.fontSize || 24]}
                onValueChange={([value]) => updateProp("fontSize", value)}
                min={16}
                max={48}
                step={2}
                className="w-full"
              />
            </div>

            {/* Font Weight */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Font Weight: {props.fontWeight || 700}</Label>
              <Slider
                value={[props.fontWeight || 700]}
                onValueChange={([value]) => updateProp("fontWeight", value)}
                min={400}
                max={900}
                step={100}
                className="w-full"
              />
            </div>

            {/* Color */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Color</Label>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => updateProp("color", color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      props.color === color ? "border-gray-900 scale-110" : "border-gray-200 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Padding */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Padding: {props.padding || 8}px</Label>
              <Slider
                value={[props.padding || 8]}
                onValueChange={([value]) => updateProp("padding", value)}
                min={0}
                max={32}
                step={4}
                className="w-full"
              />
            </div>
          </div>
        )

      case "avatar":
        return (
          <div className="space-y-6">
            {/* Size */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Size: {props.size || 120}px</Label>
              <Slider
                value={[props.size || 120]}
                onValueChange={([value]) => updateProp("size", value)}
                min={60}
                max={200}
                step={10}
                className="w-full"
              />
            </div>

            {/* Border */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Border</Label>
              <Button
                variant={props.border ? "default" : "outline"}
                onClick={() => updateProp("border", !props.border)}
                className="w-full"
              >
                {props.border ? "Remove Border" : "Add Border"}
              </Button>
            </div>
          </div>
        )

      case "image":
        return (
          <div className="space-y-6">
            {/* Roundness */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Roundness: {props.radius || 8}px</Label>
              <Slider
                value={[props.radius || 8]}
                onValueChange={([value]) => updateProp("radius", value)}
                min={0}
                max={32}
                step={2}
                className="w-full"
              />
            </div>
          </div>
        )

      case "link":
        return (
          <div className="space-y-6">
            {/* Button Style */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Button Style</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "pill", label: "Pill" },
                  { value: "outline", label: "Outline" },
                  { value: "minimal", label: "Minimal" },
                ].map(({ value, label }) => (
                  <Button
                    key={value}
                    variant={props.style === value ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateProp("style", value)}
                    className="text-xs"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Roundness */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Roundness: {props.borderRadius || 24}px</Label>
              <Slider
                value={[props.borderRadius || 24]}
                onValueChange={([value]) => updateProp("borderRadius", value)}
                min={0}
                max={32}
                step={2}
                className="w-full"
              />
            </div>

            {/* Padding */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Padding: {props.padding || 12}px</Label>
              <Slider
                value={[props.padding || 12]}
                onValueChange={([value]) => updateProp("padding", value)}
                min={8}
                max={24}
                step={2}
                className="w-full"
              />
            </div>

            {/* Color */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Button Color</Label>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => updateProp("backgroundColor", color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      props.backgroundColor === color ? "border-gray-900 scale-110" : "border-gray-200 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )

      case "category":
        return (
          <div className="space-y-6">
            {/* Color */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Badge Color</Label>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => updateProp("color", color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      props.color === color ? "border-gray-900 scale-110" : "border-gray-200 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Size: {props.size || "medium"}</Label>
              <div className="grid grid-cols-3 gap-2">
                {["small", "medium", "large"].map((size) => (
                  <Button
                    key={size}
                    variant={props.size === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateProp("size", size)}
                    className="text-xs capitalize"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Roundness */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Roundness: {props.borderRadius || 16}px</Label>
              <Slider
                value={[props.borderRadius || 16]}
                onValueChange={([value]) => updateProp("borderRadius", value)}
                min={4}
                max={32}
                step={2}
                className="w-full"
              />
            </div>
          </div>
        )

      case "product":
        return (
          <div className="space-y-6">
            {/* Currency */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Currency</Label>
              <div className="grid grid-cols-4 gap-2">
                {["$", "€", "£", "¥"].map((currency) => (
                  <Button
                    key={currency}
                    variant={props.currency === currency ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateProp("currency", currency)}
                  >
                    {currency}
                  </Button>
                ))}
              </div>
            </div>

            {/* Layout */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Layout</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={props.layout === "horizontal" ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateProp("layout", "horizontal")}
                >
                  Horizontal
                </Button>
                <Button
                  variant={props.layout === "vertical" ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateProp("layout", "vertical")}
                >
                  Vertical
                </Button>
              </div>
            </div>

            {/* Availability */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Availability</Label>
              <Button
                variant={props.available ? "default" : "outline"}
                onClick={() => updateProp("available", !props.available)}
                className="w-full"
              >
                {props.available ? "Available" : "Unavailable"}
              </Button>
            </div>

            {/* Tags */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Tags</Label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {["Popular", "Vegetarian", "Spicy", "New", "Chef's Choice"].map((tag) => (
                    <Button
                      key={tag}
                      variant={props.tags?.includes(tag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const currentTags = props.tags || []
                        if (currentTags.includes(tag)) {
                          updateProp(
                            "tags",
                            currentTags.filter((t: string) => t !== tag),
                          )
                        } else {
                          updateProp("tags", [...currentTags, tag])
                        }
                      }}
                      className="text-xs"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Styling */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Background Color</Label>
              <div className="flex gap-2 flex-wrap">
                {[...colorOptions, "#ffffff"].map((color) => (
                  <button
                    key={color}
                    onClick={() => updateProp("backgroundColor", color)}
                    className={`w-8 h-8 rounded border-2 transition-all ${
                      props.backgroundColor === color ? "border-gray-900 scale-110" : "border-gray-200 hover:scale-105"
                    } ${color === "#ffffff" ? "border-gray-300" : ""}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Border Radius */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Border Radius: {props.borderRadius || 8}px</Label>
              <Slider
                value={[props.borderRadius || 8]}
                onValueChange={([value]) => updateProp("borderRadius", value)}
                min={0}
                max={24}
                step={2}
                className="w-full"
              />
            </div>

            {/* Padding */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Padding: {props.padding || 16}px</Label>
              <Slider
                value={[props.padding || 16]}
                onValueChange={([value]) => updateProp("padding", value)}
                min={8}
                max={32}
                step={4}
                className="w-full"
              />
            </div>
          </div>
        )

      case "menu-category":
        return (
          <div className="space-y-6">
            {/* Alignment */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Alignment</Label>
              <div className="flex gap-2">
                {[
                  { value: "left", icon: AlignLeft },
                  { value: "center", icon: AlignCenter },
                  { value: "right", icon: AlignRight },
                ].map(({ value, icon: Icon }) => (
                  <Button
                    key={value}
                    variant={props.alignment === value ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateProp("alignment", value)}
                    className="flex-1"
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            </div>

            {/* Show Line */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Decorative Line</Label>
              <Button
                variant={props.showLine ? "default" : "outline"}
                onClick={() => updateProp("showLine", !props.showLine)}
                className="w-full"
              >
                {props.showLine ? "Hide Line" : "Show Line"}
              </Button>
            </div>

            {/* Text Color */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Text Color</Label>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => updateProp("textColor", color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      props.textColor === color ? "border-gray-900 scale-110" : "border-gray-200 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Background Color */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Background Color</Label>
              <div className="flex gap-2 flex-wrap">
                {[...colorOptions, "#ffffff", "transparent"].map((color) => (
                  <button
                    key={color}
                    onClick={() => updateProp("backgroundColor", color)}
                    className={`w-8 h-8 rounded border-2 transition-all ${
                      props.backgroundColor === color ? "border-gray-900 scale-110" : "border-gray-200 hover:scale-105"
                    } ${color === "#ffffff" || color === "transparent" ? "border-gray-300" : ""}`}
                    style={{
                      backgroundColor: color === "transparent" ? "transparent" : color,
                      backgroundImage:
                        color === "transparent"
                          ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                          : undefined,
                      backgroundSize: color === "transparent" ? "8px 8px" : undefined,
                      backgroundPosition: color === "transparent" ? "0 0, 0 4px, 4px -4px, -4px 0px" : undefined,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Padding */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Padding: {props.padding || 16}px</Label>
              <Slider
                value={[props.padding || 16]}
                onValueChange={([value]) => updateProp("padding", value)}
                min={8}
                max={32}
                step={4}
                className="w-full"
              />
            </div>
          </div>
        )

      case "menu-header":
        return (
          <div className="space-y-6">
            {/* Text Color */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Text Color</Label>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => updateProp("textColor", color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      props.textColor === color ? "border-gray-900 scale-110" : "border-gray-200 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Background Color */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Background Color</Label>
              <div className="flex gap-2 flex-wrap">
                {[...colorOptions, "#ffffff"].map((color) => (
                  <button
                    key={color}
                    onClick={() => updateProp("backgroundColor", color)}
                    className={`w-8 h-8 rounded border-2 transition-all ${
                      props.backgroundColor === color ? "border-gray-900 scale-110" : "border-gray-200 hover:scale-105"
                    } ${color === "#ffffff" ? "border-gray-300" : ""}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Padding */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Padding: {props.padding || 24}px</Label>
              <Slider
                value={[props.padding || 24]}
                onValueChange={([value]) => updateProp("padding", value)}
                min={16}
                max={48}
                step={4}
                className="w-full"
              />
            </div>
          </div>
        )

      case "special-offer":
        return (
          <div className="space-y-6">
            {/* Currency */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Currency</Label>
              <div className="grid grid-cols-4 gap-2">
                {["$", "€", "£", "¥"].map((currency) => (
                  <Button
                    key={currency}
                    variant={props.currency === currency ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateProp("currency", currency)}
                  >
                    {currency}
                  </Button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Background Color</Label>
              <div className="flex gap-2 flex-wrap">
                {["#fef3c7", "#fecaca", "#ddd6fe", "#d1fae5", "#fed7d7", "#ffffff"].map((color) => (
                  <button
                    key={color}
                    onClick={() => updateProp("backgroundColor", color)}
                    className={`w-8 h-8 rounded border-2 transition-all ${
                      props.backgroundColor === color ? "border-gray-900 scale-110" : "border-gray-200 hover:scale-105"
                    } ${color === "#ffffff" ? "border-gray-300" : ""}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Border Color</Label>
              <div className="flex gap-2 flex-wrap">
                {["#f59e0b", "#ef4444", "#8b5cf6", "#10b981", "#f56565", "#6b7280"].map((color) => (
                  <button
                    key={color}
                    onClick={() => updateProp("borderColor", color)}
                    className={`w-8 h-8 rounded border-2 transition-all ${
                      props.borderColor === color ? "border-gray-900 scale-110" : "border-gray-200 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Border Radius */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Border Radius: {props.borderRadius || 12}px</Label>
              <Slider
                value={[props.borderRadius || 12]}
                onValueChange={([value]) => updateProp("borderRadius", value)}
                min={0}
                max={24}
                step={2}
                className="w-full"
              />
            </div>

            {/* Padding */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Padding: {props.padding || 16}px</Label>
              <Slider
                value={[props.padding || 16]}
                onValueChange={([value]) => updateProp("padding", value)}
                min={8}
                max={32}
                step={4}
                className="w-full"
              />
            </div>
          </div>
        )

      case "hours":
        return (
          <div className="space-y-6">
            {/* Background Color */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Background Color</Label>
              <div className="flex gap-2 flex-wrap">
                {[...colorOptions, "#ffffff"].map((color) => (
                  <button
                    key={color}
                    onClick={() => updateProp("backgroundColor", color)}
                    className={`w-8 h-8 rounded border-2 transition-all ${
                      props.backgroundColor === color ? "border-gray-900 scale-110" : "border-gray-200 hover:scale-105"
                    } ${color === "#ffffff" ? "border-gray-300" : ""}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Border Radius */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Border Radius: {props.borderRadius || 8}px</Label>
              <Slider
                value={[props.borderRadius || 8]}
                onValueChange={([value]) => updateProp("borderRadius", value)}
                min={0}
                max={24}
                step={2}
                className="w-full"
              />
            </div>

            {/* Padding */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Padding: {props.padding || 16}px</Label>
              <Slider
                value={[props.padding || 16]}
                onValueChange={([value]) => updateProp("padding", value)}
                min={8}
                max={32}
                step={4}
                className="w-full"
              />
            </div>
          </div>
        )

      case "horizontal-categories":
        return (
          <div className="space-y-4 text-center">
            <div className="text-gray-500">
              <p className="text-sm">This component automatically shows navigation for your categories and sections.</p>
              <p className="text-xs mt-2">Add more categories and sections to see them appear here.</p>
            </div>
          </div>
        )

      default:
        return <div className="text-center text-gray-500">No styling options available</div>
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
            <h3 className="text-lg font-semibold capitalize">Style {activeBlock.type.replace("-", " ")}</h3>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Styling Controls */}
          {renderStylingControls()}

          {/* Actions */}
          <div className="flex gap-3 mt-8 pt-4 border-t">
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
