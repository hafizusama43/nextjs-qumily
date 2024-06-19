import { create } from 'zustand'

interface useSidebarStoreProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}
export const useSidebarStore = create<useSidebarStoreProps>((set) => ({
    isOpen: false,
    onOpen: () => set(() => ({ isOpen: true })),
    onClose: () => set(() => ({ isOpen: false })),
}))