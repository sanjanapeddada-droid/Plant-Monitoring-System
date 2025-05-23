<template>
  <div v-if="isVisible" :class="['notification', type]">
    <span class="message">{{ message }}</span>
    <button class="close-btn" @click="dismiss">×</button>
  </div>
</template>


<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps({
  type: String,
  message: String
})

const emit = defineEmits(['close'])

const isVisible = ref(true)

function dismiss() {
  isVisible.value = false
  emit('close') // Let parent know the user manually closed it
}
</script>


<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 300px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

.notification.warning {
  background-color: #e74c3c; /* Red background */
  color: white; /* Keep white text for warning */
}

.notification.success {
  background-color: #2ecc71; /* Green background */
  color: white; /* Keep white text for success */
}

.message {
  flex: 1;
  margin-right: 1rem;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
}
</style>
