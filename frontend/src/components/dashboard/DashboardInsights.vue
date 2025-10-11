<template>
  <div class="row mb-4 g-3">
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card shadow-sm h-100">
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <h6 class="text-muted">Best Month</h6>
            <h5 class="mb-1">{{ insights.bestMonth.label || '—' }}</h5>
          </div>
          <div>
            <small class="text-muted">Revenue: <strong>R{{ insights.bestMonth.revenue ? insights.bestMonth.revenue.toLocaleString() : '0' }}</strong></small>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 col-md-6 col-lg-4">
      <div class="card shadow-sm h-100">
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <h6 class="text-muted">Last 30 days</h6>
            <h5 class="mb-1">{{ insights.last30.bookingsCount || 0 }} bookings</h5>
          </div>
          <div>
            <small class="text-muted">Revenue: <strong>R{{ insights.last30.revenue ? insights.last30.revenue.toLocaleString() : '0' }}</strong></small>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 col-md-6 col-lg-4">
      <div class="card shadow-sm h-100">
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <h6 class="text-muted">Avg booking value</h6>
            <h5 class="mb-1">R{{ insights.avgBookingValue ? insights.avgBookingValue.toLocaleString() : '0' }}</h5>
          </div>
          <div>
            <small class="text-muted">(paid bookings)</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'DashboardInsights',
  data() {
    return { insights: { bestMonth: {}, last30: {}, avgBookingValue: 0 } }
  },
  async mounted() {
    try {
      const res = await axios.get('http://localhost:5000/api/dashboard/insights')
      this.insights = res.data
    } catch (err) {
      console.error('Failed to load insights', err)
    }
  }
}
</script>

<style scoped>
.card { border-radius: 12px; border: none; }
</style>
