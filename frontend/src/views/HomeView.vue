<template>
    <div>
      <h1> {{ t('welcome') }} </h1>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  </script>