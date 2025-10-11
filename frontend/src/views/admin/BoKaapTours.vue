<!-- file path: frontend/src/views/BoKaap.vue -->
<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Bo - Kaap Tours</h1>

    <ToursTable :tours="filteredTours" :loading="loading" :error="error" />
  </div>
</template>

<script>
import API_URL from '@/config/api.js'

import axios from "axios"
import ToursTable from "@/components/ToursTable.vue"

export default {
  components: { ToursTable },
  data() {
    return {
      tours: [],
      selectedDate: "",
      loading: false,
      error: null,
    }
  },
  computed: {
    filteredTours() {
      if (!this.selectedDate) return this.tours
      // assuming each tour has a `date` field in YYYY-MM-DD format
      return this.tours.filter(tour => tour.date === this.selectedDate)
    }
  },
  methods: {
    async fetchTours() {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get(`${API_URL}/api/bokaap`)
        // make sure data is an array
        this.tours = Array.isArray(res.data) ? res.data : []
      } catch (err) {
        console.error("Failed to fetch tours:", err)
        this.error = "Failed to fetch tours. Please try again later."
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    this.fetchTours()
  }
}
</script>
