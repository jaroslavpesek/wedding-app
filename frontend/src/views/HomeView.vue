<template>
    <div>
      <p style="text-align: left;" v-html="t('home_text')"></p>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

</script>
