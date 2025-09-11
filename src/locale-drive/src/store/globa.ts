import { create } from 'zustand'

export default create((set: any) => ({
    storagePath: 0,
    setStoragePath: (path: string) => set({ storagePath: path }),
}))
