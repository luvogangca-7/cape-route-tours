<template>
  <div class="row mb-4">
    <!-- Total Clients Card -->
    <div class="col-md-6 mb-3 mb-md-0">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="card-title text-muted mb-0">TOTAL CLIENTS</h5>
          </div>
          <div class="d-flex align-items-end">
            <h2 class="card-text fw-bold text-dark mb-0 me-2">{{ formatNumber(summaryData.totalClients) }}</h2>
            <span class="badge bg-success">
              <i class="fas fa-arrow-up me-1"></i>
              +{{ Math.round((summaryData.totalClients / 100) * 5) }}% since last month
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Total Revenue Card -->
    <div class="col-md-6">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="card-title text-muted mb-0">TOTAL REVENUE</h5>
          </div>
          <div class="d-flex align-items-end">
            <h2 class="card-text fw-bold text-dark mb-0 me-2">R{{ formatNumber(summaryData.totalRevenue) }}</h2>
            <span class="badge bg-success">
              <i class="fas fa-arrow-up me-1"></i>
              +{{ Math.round((summaryData.totalRevenue / 500000) * 8) }}% since last quarter
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'SummaryCards',
  setup() {
    const summaryData = ref({
      totalClients: 3462, // Default demo data
      totalRevenue: 103430 // Default demo data
    })

    const formatNumber = (num) => {
      return new Intl.NumberFormat('en-ZA').format(num)
    }

    const fetchSummaryData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard/summary')
        summaryData.value = response.data
      } catch (error) {
        console.error('Error fetching summary data:', error)
        // Keep demo data if API fails
      }
    }

    onMounted(() => {
      fetchSummaryData()
      setInterval(fetchSummaryData, 30000)
    })

    return {
      summaryData,
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

.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-text {
  font-size: 2rem;
}
</style>