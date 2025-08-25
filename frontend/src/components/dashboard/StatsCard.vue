<template>
  <div class="stat-card">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h6 class="stat-title">{{ title }}</h6>
      <div class="icon-shape" :class="color">
        <i :class="icon"></i>
      </div>
    </div>
    <h3 class="stat-value">{{ value }}</h3>
    <p class="stat-percentage" :class="percentageClass">
      <i :class="percentageIcon"></i>
      {{ percentage }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'StatsCard',
  props: {
    title: String,
    value: String,
    percentage: String,
    icon: String,
    color: String
  },
  computed: {
    percentageClass() {
      return this.percentage.includes('+') ? 'percentage-positive' : 'percentage-negative';
    },
    percentageIcon() {
      return this.percentage.includes('+') ? 'ni ni-bold-up' : 'ni ni-bold-down';
    }
  }
}
</script>

<style scoped>
.icon-shape {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-gradient-success {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.bg-gradient-info {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.bg-gradient-warning {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}
</style>