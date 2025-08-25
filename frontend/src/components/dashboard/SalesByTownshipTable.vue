<template>
  <div class="card shadow-sm h-100">
    <div class="card-body">
      <h5 class="card-title text-muted mb-4">Sales by Township</h5>
      <div class="table-responsive">
        <table class="table table-hover">
          <thead class="table-light">
            <tr>
              <th>Township</th>
              <th>Bookings</th>
              <th>Tickets</th>
              <th>Total Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in salesData" :key="index">
              <td class="fw-bold">{{ item.township }}</td>
              <td>{{ item.totalBookings }}</td>
              <td>{{ item.totalTickets }}</td>
              <td class="fw-bold text-success">R{{ formatNumber(item.totalValue) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'SalesByTownshipTable',
  setup() {
    const salesData = ref([])

    const formatNumber = (num) => {
      return new Intl.NumberFormat('en-ZA').format(num)
    }

    const fetchSalesData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard/sales-by-township')
        salesData.value = response.data
      } catch (error) {
        console.error('Error fetching sales data:', error)
        // Use demo data if API fails
        salesData.value = [
          { township: 'Khayelitsha', totalBookings: 45, totalTickets: 2500, totalValue: 230900 },
          { township: 'Langa', totalBookings: 32, totalTickets: 1900, totalValue: 190700 },
          { township: 'Mitchells Plain', totalBookings: 28, totalTickets: 1400, totalValue: 154000 },
          { township: 'Bo-Kaap', totalBookings: 18, totalTickets: 900, totalValue: 99000 }
        ]
      }
    }

    onMounted(() => {
      fetchSalesData()
      setInterval(fetchSalesData, 30000)
    })

    return {
      salesData,
      formatNumber
    }
  }
}
</script>

<style scoped>
.card {
  border: none;
  border-radius: 12px;
}

.table th {
  border-top: none;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  color: #6c757d;
}
</style>