<template>
    <div class="register-page">
      <h1>Register Form</h1>
      <p>Your code: {{ authStore.code }}</p>
      <p>Category: {{ authStore.category }}</p>
  
      <form @submit.prevent="submitForm">
        <!-- Name -->
        <label for="name">Name:</label>
        <input id="name" v-model="name" type="text" required />
  
        <!-- Email -->
        <label for="email">Email:</label>
        <input id="email" v-model="email" type="email" required />
  
        <!-- Companion -->
        <!-- If "family", show numeric input; If "guest_with_plusone", maybe show a checkbox. -->
        <div v-if="authStore.category === 'family'">
          <label for="companion">How many total family members (including you)?</label>
          <input
            id="companion"
            type="number"
            min="0"
            v-model.number="companion"
          />
        </div>
  
        <div v-else-if="authStore.category === 'guest_with_plusone'">
          <label>
            <input type="checkbox" v-model="plusOne" />
            Bringing a +1?
          </label>
        </div>
  
        <div class="error" v-if="error">{{ error }}</div>
        <div class="success" v-if="success">{{ success }}</div>
  
        <button type="submit">Register</button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import axios from 'axios'
  import { useAuthStore } from '../stores/auth'
  
  const authStore = useAuthStore()
  
  const name = ref('')
  const email = ref('')
  const plusOne = ref(false)
  const companion = ref<number>(0)
  const error = ref<string | null>(null)
  const success = ref<string | null>(null)
  
  // Decide the final companion count to send to backend
  // If category = "family", we use "companion.value"
  // If category = "guest_with_plusone", we use "plusOne ? 1 : 0"
  // Otherwise, 0
  const finalCompanionCount = computed(() => {
    if (authStore.category === 'family') {
      return companion.value
    }
    if (authStore.category === 'guest_with_plusone') {
      return plusOne.value ? 1 : 0
    }
    return 0
  })
  
  async function submitForm() {
    error.value = null
    success.value = null
  
    if (!authStore.code) {
      error.value = 'No code is set; please log in first.'
      return
    }
  
    try {
      const host = process.env.BACKEND_URI || "http://localhost:3000";
      const response = await axios.post(host + '/register', {
        code: authStore.code,
        name: name.value,
        email: email.value,
        companion: finalCompanionCount.value
      })
      if (response.data.success) {
        success.value = 'Registration successful!'
      } else {
        error.value = 'Error updating registration.'
      }
    } catch (err: any) {
      error.value = err?.response?.data?.error || 'Registration failed.'
    }
  }
  </script>
  
  <style scoped>
  .register-page {
    max-width: 600px;
    margin: 50px auto;
  }
  
  form {
    display: flex;
    flex-direction: column;
  }
  
  label {
    margin: 10px 0 5px;
  }
  
  input[type='text'],
  input[type='email'],
  input[type='number'] {
    padding: 6px;
    margin-bottom: 10px;
  }
  
  .error {
    color: red;
  }
  
  .success {
    color: green;
  }
  </style>
