<template>
  <div class="card shadow-sm h-100">
    <div class="card-body">
      <h5 class="card-title text-muted mb-4">Tickets by Township</h5>
      <div class="chart-container" style="position: relative; height: 300px;">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import Chart from 'chart.js/auto'

export default {
  name: 'TownshipBarChart',
  setup() {
    const chartCanvas = ref(null)
    let chartInstance = null

    const fetchChartData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard/tickets-by-township')
        const data = response.data
        
        const labels = data.map(item => item.township)
        const values = data.map(item => item.ticketsSold)

        if (chartInstance) {
          chartInstance.destroy()
        }

        chartInstance = new Chart(chartCanvas.value, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Tickets Sold',
              data: values,
              backgroundColor: 'rgba(79, 70, 229, 0.7)',
              borderColor: 'rgba(79, 70, 229, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Tickets Sold'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Townships'
                }
              }
            }
          }
        })
      } catch (error) {
        console.error('Error fetching chart data:', error)
        // Use demo data if API fails
        const demoData = [
          { township: 'Khayelitsha', ticketsSold: 2500 },
          { township: 'Langa', ticketsSold: 1900 },
          { township: 'Mitchells Plain', ticketsSold: 1400 },
          { township: 'Bo-Kaap', ticketsSold: 900 }
        ]
        
        const labels = demoData.map(item => item.township)
        const values = demoData.map(item => item.ticketsSold)

        if (chartInstance) {
          chartInstance.destroy()
        }

        chartInstance = new Chart(chartCanvas.value, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Tickets Sold',
              data: values,
              backgroundColor: 'rgba(79, 70, 229, 0.7)',
              borderColor: 'rgba(79, 70, 229, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            }
          }
        })
      }
    }

    onMounted(() => {
      fetchChartData()
      const interval = setInterval(fetchChartData, 60000)
      
      onUnmounted(() => {
        clearInterval(interval)
        if (chartInstance) {
          chartInstance.destroy()
        }
      })
    })

    return {
      chartCanvas
    }
  }
}
</script>

<style scoped>
.card {
  border: none;
  border-radius: 12px;
}
</style>