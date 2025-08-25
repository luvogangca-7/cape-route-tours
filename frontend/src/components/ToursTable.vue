<template>
  <div>
    <div v-if="loading">Loading tours...</div>
    <div v-if="error" class="error">{{ error }}</div>
    
    <table v-if="tours && tours.length" class="tours-table">
      <thead>
        <tr>
          <th>Booking ID</th>
          <th>Customer Name</th>
          <th>Tickets</th>
          <th>Package</th>
          <th>Status</th>
          <th>Township Name</th>
          <th>Total Price</th>
        </tr>
      </thead>
      <tbody>
        <!-- ✅ safe key -->
        <tr v-for="(tour, index) in tours" :key="tour.bookingId || index">
          <td>{{ tour.bookingId }}</td>
          <td>{{ tour.customerName }}</td>
          <td>{{ tour.numberOfPeople }}</td>
          <td>{{ tour.packageName }}</td>
          <td>{{ tour.status }}</td>
          <td>{{ tour.townName }}</td>
          <td>{{ tour.totalPrice }}</td>
        </tr>
      </tbody>
    </table>

    <div v-else-if="!loading" class="no-data">
      No tour data available
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

defineProps({
  tours: {
    type: Array,
    default: () => []
  }
})

const loading = ref(false)
const error = ref(null)
</script>

<style scoped>
.tours-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.tours-table th,
.tours-table td {
  border: 1px solid #ccc;
  padding: 8px 12px;
  text-align: center;
}
.tours-table th {
  background-color: #004080;
  color: white;
}
.error {
  color: red;
  padding: 1rem;
}
.no-data {
  padding: 1rem;
  text-align: center;
  font-style: italic;
}
</style>
