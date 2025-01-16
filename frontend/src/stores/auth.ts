// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const backend_url = process.env.BACKEND_URI || "http://localhost:3000";

export const useAuthStore = defineStore('auth', () => {
  // State
  const code = ref<string | null>(null)
  const category = ref<string | null>(null)

  // A simple computed property to check if we're logged in
  const isLoggedIn = computed(() => code.value !== null)

  // Action: login with a code
  async function login(accessCode: string) {
    // For example, call your backend endpoint: POST /api/verify-code
    // Adjust the URL if needed. If your backend is running on localhost:3000, do something like:
    // 'http://localhost:3000/api/verify-code'
    const url = backend_url + '/verify'

    try {
      const response = await axios.post(url, { code: accessCode })
      const data = response.data

      if (!data.success) {
        throw new Error('Invalid code')
      }

      // If successful, store the code + category
      code.value = accessCode
      category.value = data.category

      // Optionally store them in localStorage for session persistence
      localStorage.setItem('wdng_code', accessCode)
      localStorage.setItem('wdng_category', data.category)
    } catch (err: any) {
      // If it fails, clear any existing state
      code.value = null
      category.value = null
      throw err
    }
  }

  // Action: logout
  function logout() {
    code.value = null
    category.value = null
    localStorage.removeItem('wdng_code')
    localStorage.removeItem('wdng_category')
  }

  // Action: init store from localStorage
  // so that if user reloads the page, we remain "logged in"
  function initFromLocalStorage() {
    const savedCode = localStorage.getItem('wdng_code')
    const savedCat = localStorage.getItem('wdng_category')
    if (savedCode) code.value = savedCode
    if (savedCat) category.value = savedCat
  }

  return {
    code,
    category,
    isLoggedIn,
    login,
    logout,
    initFromLocalStorage,
  }
})
