import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSelectedPlant = defineStore('selectedPlant', () => {
  const selectedPlantId = ref(null)
  const selectedPlantName = ref('')

  function selectPlant(userPlantId, name) {
    selectedPlantId.value = userPlantId || null
    selectedPlantName.value = name || ''
    localStorage.setItem('selectedPlantId', selectedPlantId.value)
    localStorage.setItem('selectedPlantName', selectedPlantName.value)
  }

  function loadStoredPlant() {
    const storedId = localStorage.getItem('selectedPlantId')
    const storedName = localStorage.getItem('selectedPlantName')
    if (storedId) selectedPlantId.value = storedId
    if (storedName) selectedPlantName.value = storedName
  }

  return { selectedPlantId, selectedPlantName, selectPlant, loadStoredPlant }
})
