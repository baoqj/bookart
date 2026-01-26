import { create } from 'zustand'
import type { User } from './types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  signOut: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => {
    if (user) {
      localStorage.setItem("bookart-user", JSON.stringify(user))
    } else {
      localStorage.removeItem("bookart-user")
    }
    set({ user, isAuthenticated: !!user, isLoading: false })
  },
  signOut: () => {
    localStorage.removeItem("bookart-user")
    set({ user: null, isAuthenticated: false })
  },
}))

interface CreditsState {
  credits: number
  setCredits: (credits: number) => void
  addCredits: (amount: number) => void
  deductCredits: (amount: number) => void
}

export const useCreditsStore = create<CreditsState>((set) => ({
  credits: 0,
  setCredits: (credits) => set({ credits }),
  addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
  deductCredits: (amount) => set((state) => ({ credits: state.credits - amount })),
}))
