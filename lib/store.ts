"use client";

import { create } from "zustand";
import type { Block, GlobalSettings } from "./types";

interface EditorState {
  blocks: Block[];
  globalSettings: GlobalSettings;
  activeBlock: Block | null;
  editingMode: "styling" | "content" | "settings" | null;
  showGlobalSettings: boolean;
  mobileActiveBlock: string | null;
  autoSelectedBlock: string | null;
  lastAddedBlockId: string | null;
  history: { blocks: Block[]; globalSettings: GlobalSettings }[];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;
}

interface EditorActions {
  setActiveBlock: (block: Block | null, mode?: "styling" | "content" | "settings") => void;
  setEditingMode: (mode: "styling" | "content" | "settings" | null) => void;
  setShowGlobalSettings: (show: boolean) => void;
  setMobileActiveBlock: (blockId: string | null) => void;
  setAutoSelectedBlock: (blockId: string | null) => void;
  setLastAddedBlockId: (blockId: string | null) => void;
  updateGlobalSettings: (settings: Partial<GlobalSettings>) => void;
  addBlock: (type: string) => void;
  updateBlock: (id: string, props: Record<string, any>) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  deleteBlock: (id: string) => void;
  undo: () => void;
  redo: () => void;
  saveBlocks: () => void;
  loadBlocks: (blocks: Block[], globalSettings?: GlobalSettings) => void;
}

const defaultGlobalSettings: GlobalSettings = {
  pageTitle: "My Link Page",
  favicon: "",
  fontFamily: "Inter",
  primaryColor: "#1f2937",
  backgroundColor: "#ffffff",
  borderRadius: 8,
  padding: 16,
  maxWidth: 400,
  theme: "system",
};

const defaultBlocks: Block[] = [
  {
    id: "1",
    type: "title",
    props: {
      text: "Welcome to my page",
      fontSize: 28,
      alignment: "center",
    },
  },
  {
    id: "2",
    type: "avatar",
    props: {
      src: "/placeholder.svg?height=120&width=120",
      size: 120,
      border: true,
    },
  },
  {
    id: "3",
    type: "horizontal-categories",
    props: {},
  },
  {
    id: "1753476779775",
    type: "category",
    props: {
      label: "Category",
      color: "#8b5cf6",
    },
  },
  {
    id: "1753476781672",
    type: "image",
    props: {
      images: [],
      layout: "grid",
      radius: 8,
    },
  },
  {
    id: "1753476783824",
    type: "special-offer",
    props: {
      title: "Chef's Special",
      description: "Today's featured dish prepared with seasonal ingredients",
      originalPrice: "24.99",
      specialPrice: "19.99",
      currency: "$",
      image: "/placeholder.svg?height=150&width=150",
      validUntil: "End of today",
      backgroundColor: "#fef3c7",
      borderColor: "#f59e0b",
      textColor: "#1f2937",
      showBadge: true,
      badgeText: "LIMITED TIME",
      padding: 16,
      borderRadius: 12,
    },
  },
  {
    id: "1753476785726",
    type: "product",
    props: {
      name: "Delicious Dish",
      description: "Fresh ingredients prepared with care and attention to detail",
      price: "12.99",
      currency: "$",
      image: "/placeholder.svg?height=200&width=200",
      tags: ["Popular", "Vegetarian"],
      available: true,
      layout: "horizontal",
      showImage: true,
      backgroundColor: "#ffffff",
      borderRadius: 8,
      padding: 16,
    },
  },
  {
    id: "1753477409007",
    type: "link",
    props: {
      label: "New Link",
      url: "https://example.com",
      style: "pill",
    },
  },
  {
    id: "1753476787943",
    type: "special-offer",
    props: {
      title: "Chef's Special",
      description: "Today's featured dish prepared with seasonal ingredients",
      originalPrice: "24.99",
      specialPrice: "19.99",
      currency: "$",
      image: "/placeholder.svg?height=150&width=150",
      validUntil: "End of today",
      backgroundColor: "#fef3c7",
      borderColor: "#f59e0b",
      textColor: "#1f2937",
      showBadge: true,
      badgeText: "LIMITED TIME",
      padding: 16,
      borderRadius: 12,
    },
  },
  {
    id: "1753476793751",
    type: "hours",
    props: {
      title: "Opening Hours",
      hours: [
        {
          day: "Monday",
          time: "9:00 AM - 10:00 PM",
          closed: false,
        },
        {
          day: "Tuesday",
          time: "9:00 AM - 10:00 PM",
          closed: false,
        },
        {
          day: "Wednesday",
          time: "9:00 AM - 10:00 PM",
          closed: false,
        },
        {
          day: "Thursday",
          time: "9:00 AM - 10:00 PM",
          closed: false,
        },
        {
          day: "Friday",
          time: "9:00 AM - 11:00 PM",
          closed: false,
        },
        {
          day: "Saturday",
          time: "10:00 AM - 11:00 PM",
          closed: false,
        },
        {
          day: "Sunday",
          time: "10:00 AM - 9:00 PM",
          closed: false,
        },
      ],
      backgroundColor: "#ffffff",
      borderRadius: 8,
      padding: 16,
      showIcon: true,
    },
  },
  {
    id: "1753477290585",
    type: "image",
    props: {
      images: [],
      layout: "grid",
      radius: 8,
    },
  },
];

const createDefaultBlock = (type: string): Block => {
  const id = Date.now().toString();

  const defaults: Record<string, any> = {
    title: { text: "New Title", fontSize: 24, alignment: "center" },
    link: { label: "New Link", url: "https://example.com", style: "pill" },
    category: { label: "Category", color: "#8b5cf6" },
    avatar: { src: "/placeholder.svg?height=120&width=120", size: 120, border: true },
    social: { platforms: ["twitter", "linkedin"], size: "medium" },
    image: { images: [], layout: "grid", radius: 8 },
    section: { text: "Section", spacing: 16 },
    "horizontal-categories": {},
    form: {
      title: "Contact Form",
      fields: [
        {
          id: "name",
          type: "text",
          label: "Full Name",
          placeholder: "Enter your full name",
          required: true,
        },
        {
          id: "email",
          type: "email",
          label: "Email Address",
          placeholder: "Enter your email",
          required: true,
        },
        {
          id: "message",
          type: "textarea",
          label: "Message",
          placeholder: "Enter your message",
          required: true,
        },
      ],
      submitText: "Send Message",
      submitUrl: "",
      backgroundColor: "#ffffff",
      borderRadius: 8,
      padding: 16,
      fieldSpacing: 12,
    },
    product: {
      name: "Delicious Dish",
      description: "Fresh ingredients prepared with care and attention to detail",
      price: "12.99",
      currency: "$",
      image: "/placeholder.svg?height=200&width=200",
      tags: ["Popular", "Vegetarian"],
      available: true,
      layout: "horizontal",
      showImage: true,
      backgroundColor: "#ffffff",
      borderRadius: 8,
      padding: 16,
    },
    "menu-category": {
      title: "Appetizers",
      subtitle: "Start your meal with these delicious options",
      alignment: "center",
      showLine: true,
      backgroundColor: "transparent",
      textColor: "#1f2937",
      padding: 16,
    },
    "menu-header": {
      restaurantName: "Bella Vista Restaurant",
      tagline: "Authentic Italian cuisine in the heart of the city",
      logo: "/placeholder.svg?height=120&width=120",
      address: "123 Main Street, Downtown",
      phone: "(555) 123-4567",
      showLogo: true,
      showContact: true,
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      padding: 24,
    },
    "special-offer": {
      title: "Chef's Special",
      description: "Today's featured dish prepared with seasonal ingredients",
      originalPrice: "24.99",
      specialPrice: "19.99",
      currency: "$",
      image: "/placeholder.svg?height=150&width=150",
      validUntil: "End of today",
      backgroundColor: "#fef3c7",
      borderColor: "#f59e0b",
      textColor: "#1f2937",
      showBadge: true,
      badgeText: "LIMITED TIME",
      padding: 16,
      borderRadius: 12,
    },
    hours: {
      title: "Opening Hours",
      hours: [
        { day: "Monday", time: "9:00 AM - 10:00 PM", closed: false },
        { day: "Tuesday", time: "9:00 AM - 10:00 PM", closed: false },
        { day: "Wednesday", time: "9:00 AM - 10:00 PM", closed: false },
        { day: "Thursday", time: "9:00 AM - 10:00 PM", closed: false },
        { day: "Friday", time: "9:00 AM - 11:00 PM", closed: false },
        { day: "Saturday", time: "10:00 AM - 11:00 PM", closed: false },
        { day: "Sunday", time: "10:00 AM - 9:00 PM", closed: false },
      ],
      backgroundColor: "#ffffff",
      borderRadius: 8,
      padding: 16,
      showIcon: true,
    },
  };

  return {
    id,
    type,
    props: defaults[type] || {},
  };
};

export const useEditorStore = create<EditorState & EditorActions>((set, get) => ({
  blocks: defaultBlocks,
  globalSettings: defaultGlobalSettings,
  activeBlock: null,
  editingMode: null,
  showGlobalSettings: false,
  mobileActiveBlock: null,
  autoSelectedBlock: null,
  lastAddedBlockId: null,
  history: [{ blocks: defaultBlocks, globalSettings: defaultGlobalSettings }],
  historyIndex: 0,
  canUndo: false,
  canRedo: false,

  setActiveBlock: (block, mode = "styling") =>
    set({
      activeBlock: block,
      editingMode: block ? mode : null,
      showGlobalSettings: false,
      mobileActiveBlock: null, // Hide mobile buttons when opening bottom sheet
    }),

  setEditingMode: (mode) => set({ editingMode: mode }),

  setShowGlobalSettings: (show) =>
    set({
      showGlobalSettings: show,
      activeBlock: null,
      editingMode: null,
      mobileActiveBlock: null, // Hide mobile buttons when opening global settings
    }),

  setMobileActiveBlock: (blockId) => set({ mobileActiveBlock: blockId }),

  setAutoSelectedBlock: (blockId) => set({ autoSelectedBlock: blockId }),

  setLastAddedBlockId: (blockId) => set({ lastAddedBlockId: blockId }),

  updateGlobalSettings: (settings) => {
    const newGlobalSettings = { ...get().globalSettings, ...settings };
    const currentState = get();

    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ blocks: currentState.blocks, globalSettings: newGlobalSettings });

      return {
        globalSettings: newGlobalSettings,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        canUndo: true,
        canRedo: false,
      };
    });
  },

  addBlock: (type) => {
    const newBlock = createDefaultBlock(type);
    const newBlocks = [...get().blocks, newBlock];
    const currentState = get();

    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ blocks: newBlocks, globalSettings: currentState.globalSettings });

      return {
        blocks: newBlocks,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        canUndo: true,
        canRedo: false,
        mobileActiveBlock: null, // Hide mobile buttons when adding new block
        autoSelectedBlock: newBlock.id, // Auto-select the new block
        lastAddedBlockId: newBlock.id, // Track the last added block for snap scrolling
      };
    });
  },

  updateBlock: (id, props) => {
    const newBlocks = get().blocks.map((block) => (block.id === id ? { ...block, props: { ...block.props, ...props } } : block));
    const currentState = get();

    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ blocks: newBlocks, globalSettings: currentState.globalSettings });

      return {
        blocks: newBlocks,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        canUndo: true,
        canRedo: false,
      };
    });
  },

  moveBlock: (fromIndex, toIndex) => {
    const blocks = [...get().blocks];
    const [movedBlock] = blocks.splice(fromIndex, 1);
    blocks.splice(toIndex, 0, movedBlock);
    const currentState = get();

    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ blocks, globalSettings: currentState.globalSettings });

      return {
        blocks,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        canUndo: true,
        canRedo: false,
        mobileActiveBlock: null, // Hide mobile buttons after drag
      };
    });
  },

  deleteBlock: (id) => {
    const newBlocks = get().blocks.filter((block) => block.id !== id);
    const currentState = get();

    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ blocks: newBlocks, globalSettings: currentState.globalSettings });

      return {
        blocks: newBlocks,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        canUndo: true,
        canRedo: false,
        mobileActiveBlock: null, // Hide mobile buttons after delete
        autoSelectedBlock: null, // Clear auto-selection after delete
      };
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousState = history[newIndex];
      set({
        blocks: previousState.blocks,
        globalSettings: previousState.globalSettings,
        historyIndex: newIndex,
        canUndo: newIndex > 0,
        canRedo: true,
        activeBlock: null,
        showGlobalSettings: false,
        mobileActiveBlock: null,
        autoSelectedBlock: null,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      set({
        blocks: nextState.blocks,
        globalSettings: nextState.globalSettings,
        historyIndex: newIndex,
        canUndo: true,
        canRedo: newIndex < history.length - 1,
        activeBlock: null,
        showGlobalSettings: false,
        mobileActiveBlock: null,
        autoSelectedBlock: null,
      });
    }
  },

  saveBlocks: () => {
    const data = {
      blocks: get().blocks,
      globalSettings: get().globalSettings,
    };
    console.log("Saving data:", data);
    localStorage.setItem("linkbuilder-data", JSON.stringify(data));
  },

  loadBlocks: (blocks, globalSettings = defaultGlobalSettings) => {
    set({
      blocks,
      globalSettings,
      history: [{ blocks, globalSettings }],
      historyIndex: 0,
      canUndo: false,
      canRedo: false,
      activeBlock: null,
      showGlobalSettings: false,
      mobileActiveBlock: null,
      autoSelectedBlock: null,
      lastAddedBlockId: null,
    });
  },
}));
