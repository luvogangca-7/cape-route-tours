<template>
  <div class="card shadow-sm h-100">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="card-title text-muted mb-0">Sales Overview</h5>
        <small class="text-muted">Last 12 months</small>
      </div>
      <div style="height: 300px;">
        <canvas ref="chartCanvas"></canvas>
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
  name: 'SalesChart',
  setup() {
    const chartCanvas = ref(null)
    let chartInstance = null

    const fetchSales = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/dashboard/sales-overview`)
        const data = res.data // expect { labels: [], values: [] }

        const labels = data.labels || []
        const values = data.values || []

        if (chartInstance) chartInstance.destroy()

        chartInstance = new Chart(chartCanvas.value, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Revenue (R)',
              data: values,
              fill: true,
              backgroundColor: 'rgba(79,70,229,0.08)',
              borderColor: 'rgba(79,70,229,1)',
              tension: 0.3,
              pointRadius: 3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, ticks: { callback: v => 'R' + Number(v).toLocaleString() } }
            }
          }
        })
      } catch (err) {
        console.error('SalesChart fetch failed, using demo data', err)
        const demoLabels = ['Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep']
        const demoValues = [120000, 150000, 90000, 180000, 210000, 190000, 230000, 250000, 220000, 240000, 260000, 280000]

        if (chartInstance) chartInstance.destroy()

        chartInstance = new Chart(chartCanvas.value, {
          type: 'line',
          data: {
            labels: demoLabels,
            datasets: [{
              label: 'Revenue (R)',
              data: demoValues,
              fill: true,
              backgroundColor: 'rgba(79,70,229,0.08)',
              borderColor: 'rgba(79,70,229,1)',
              tension: 0.3,
              pointRadius: 3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
          }
        })
      }
    }

    onMounted(() => {
      fetchSales()
      const interval = setInterval(fetchSales, 60000)
      onUnmounted(() => {
        clearInterval(interval)
        if (chartInstance) chartInstance.destroy()
      })
    })

    return { chartCanvas }
  }
}
</script>

<style scoped>
.card { border-radius: 12px; border: none; }
</style>