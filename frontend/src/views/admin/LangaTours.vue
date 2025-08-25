<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Langa Tours</h1>



    <ToursTable :tours="tours" />
  </div>
</template>

<script>
import axios from "axios"
import ToursTable from "@/components/ToursTable.vue"

export default {
  components: { ToursTable },
  data() {
    return {
      tours: [],
      selectedDate: ""
    }
  },
  methods: {
    async fetchTours() {
      try {
        const res = await axios.get("http://localhost:5000/api/langa")
        this.tours = res.data || [] // ✅ apply response to prop
      } catch (err) {
        console.error("Failed to fetch tours:", err)
      }
    }
  },
  mounted() {
    // ✅ hook is now in the correct place
    this.fetchTours()
  }
}
</script>
