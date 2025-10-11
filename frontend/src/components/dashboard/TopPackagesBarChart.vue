<template>
  <div class="card shadow-sm h-100">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="card-title text-muted mb-0">Top Packages</h5>
        <small class="text-muted">Bookings & Revenue</small>
      </div>
      <div style="height: 300px;">
        <canvas ref="chart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import API_URL from '@/config/api.js';

import axios from 'axios'
import Chart from 'chart.js/auto'

export default {
  name: 'TopPackagesBarChart',
  setup() {
    const chart = ref(null)
    let chartInstance = null

    const fetchTop = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/dashboard/top-packages`)
        const data = res.data // expect { labels: [], counts: [], revenue: [] }

        const labels = data.labels || []
        const counts = data.counts || []
        const revenue = data.revenue || []

        if (chartInstance) chartInstance.destroy()

        chartInstance = new Chart(chart.value, {
          data: {
            labels,
            datasets: [
              {
                type: 'bar',
                label: 'Bookings',
                data: counts,
                backgroundColor: 'rgba(246, 196, 109,0.85)',
                yAxisID: 'y'
              },
              {
                type: 'line',
                label: 'Revenue (R)',
                data: revenue,
                borderColor: 'rgba(79, 70, 229,1)',
                backgroundColor: 'rgba(179, 70, 229,0.08)',
                tension: 0.3,
                yAxisID: 'y_revenue'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } },
            scales: {
              y: { beginAtZero: true, position: 'left', title: { display: true, text: 'Bookings' } },
              y_revenue: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Revenue (R)' }, ticks: { callback: v => 'R' + Number(v).toLocaleString() } }
            }
          }
        })
      } catch (err) {
        console.error('TopPackages fetch failed', err)
      }
    }

    onMounted(() => {
      fetchTop()
    })

    onUnmounted(() => {
      if (chartInstance) chartInstance.destroy()
    })

    return { chart }
  }
}
</script>

<style scoped>
.card { border-radius: 12px; border: none; }
</style>
