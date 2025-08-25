<template>
  <div class="dashboard-container container-fluid py-4">
    <!-- Loading State -->
    <div v-if="loading" class="loading text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-muted">Loading dashboard data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error text-center py-5">
      <h3 class="text-danger">Error Loading Dashboard</h3>
      <p class="text-muted">{{ error }}</p>
      <button @click="loadDashboardData" class="btn btn-primary mt-3">Retry</button>
    </div>

    <!-- Success State -->
    <div v-else class="dashboard-content">
      <!-- Summary Cards -->
      <SummaryCards />
      
      <div class="row mb-4">
        <div class="col-lg-6 mb-4 mb-lg-0">
          <!-- Township Bar Chart -->
          <TownshipBarChart />
        </div>
        <div class="col-lg-6">
          <!-- Sales by Township Table -->
          <SalesByTownshipTable />
        </div>
      </div>

      <!-- Packages List -->
      <div class="row">
        <div class="col-12">
          <PackagesList />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SummaryCards from '@/components/dashboard/SummaryCards.vue'
import TownshipBarChart from '@/components/dashboard/TownshipBarChart.vue'
import SalesByTownshipTable from '@/components/dashboard/SalesByTownshipTable.vue'
import PackagesList from '@/components/dashboard/PackageList.vue'

export default {
  name: 'Dashboard',
  components: {
    SummaryCards,
    TownshipBarChart,
    SalesByTownshipTable,
    PackagesList
  },
  data() {
    return {
      loading: true,
      error: null
    }
  },
  mounted() {
    this.loadDashboardData()
  },
  methods: {
    async loadDashboardData() {
      this.loading = true
      this.error = null
      try {
        // Wait a bit to show loading state
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Data will be loaded by individual components
      } catch (err) {
        this.error = 'Failed to load dashboard data. Please check if the backend server is running.'
        console.error('Dashboard error:', err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  min-height: calc(100vh - 80px);
}

.loading, .error {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>