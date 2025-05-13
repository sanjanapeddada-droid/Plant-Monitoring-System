<!-- src/components/Notification.vue -->
<template>
    <div :class="['notification', type]">
      {{ message }}
    </div>
  </template>
  
  <script setup>
  defineProps({
    type: String,
    message: String
  })
  </script>
  
  <style scoped>
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    z-index: 1000;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    font-weight: bold;
    animation: fade-in 0.3s ease;
  }
  
  .notification.warning {
    background-color: #e74c3c;
  }
  
  .notification.success {
    background-color: #2ecc71;
  }
  
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  </style>
  