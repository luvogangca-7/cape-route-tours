<template>
  <div class="chart-container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h5 class="mb-0">Sales Overview</h5>
      <span class="text-success">
        <i class="ni ni-bold-up"></i> 4% more in 2021
      </span>
    </div>
    <div class="chart-placeholder">
      <!-- Chart would go here - using placeholder for now -->
      <div style="height: 300px; background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%); 
                border-radius: 8px; display: flex; align-items: center; justify-content: center;">
        <span class="text-muted">Sales Chart</span>
      </div>
    </div>
    <div class="mt-3 text-center">
      <span class="text-muted">Apr May Jun Jul Aug Sep Oct Nov Dec</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SalesChart'
}
</script>