import { create } from "zustand";
import { type Editor } from "@tiptap/react";

interface EditorStore {
  editor: Editor | null;

  // Preview
  isPresentationMode: boolean;
  togglePresentationMode: () => void;

  // Zoom
  zoom: number;
  setZoom: (zoom: number) => void;

  // Orientation
  isLandscape: boolean;
  toggleOrientation: () => void;

  setEditor: (editor: Editor | null) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  editor: null,

  // Preview
  isPresentationMode: false,
  togglePresentationMode: () =>
    set((state) => ({
      isPresentationMode: !state.isPresentationMode,
    })),

  // Zoom
  zoom: 100,
  setZoom: (zoom) => set({ zoom }),

  // Orientation
  isLandscape: false,
  toggleOrientation: () =>
    set((state) => ({
      isLandscape: !state.isLandscape,
    })),

  setEditor: (editor) => set({ editor }),
}));