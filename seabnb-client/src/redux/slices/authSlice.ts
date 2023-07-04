import { IUserInfo } from '@/features/Authentication/services/user-info.service'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface IAuthState {
  isAuthModalOpen: boolean
  modalMode: 'login' | 'register'
  accessToken: string | null
  user: IUserInfo | null
  loading: boolean
}

const initialState: IAuthState = {
  isAuthModalOpen: false,
  modalMode: 'login',
  accessToken: null,
  user: null,
  loading: true
}

export const counterSlice = createSlice({
  name: 'counter',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    openAuthModal: (state, actions: PayloadAction<{ modalMode: 'login' | 'register' }>) => {
      state.isAuthModalOpen = true
      state.modalMode = actions.payload.modalMode
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false
    },
    saveAccessToken: (state, actions: PayloadAction<{ accessToken: string }>) => {
      state.accessToken = actions.payload.accessToken
      state.isAuthModalOpen = false
    },
    saveUser: (state, actions: PayloadAction<{ user: any }>) => {
      state.user = actions.payload.user
    },
    setLoading: (state, actions: PayloadAction<boolean>) => {
      state.loading = actions.payload
    },
    clearAuthState: (state) => {
      state.isAuthModalOpen = false
      state.accessToken = null
      state.user = null
      state.modalMode = 'login'
    },
  },
})

export const { openAuthModal, closeAuthModal, setLoading, saveAccessToken, saveUser, clearAuthState } = counterSlice.actions

export default counterSlice.reducer