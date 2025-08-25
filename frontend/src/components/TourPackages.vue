<template>
  <div class="tours-container">
    <!-- Close Button -->
    <button class="close-button" @click.stop="handleClose">×</button>

    <!-- Header -->
    <h1 v-if="selectedTour">Our Packages for {{ selectedTour.name }}</h1>
    <h1 v-else>Our Packages</h1>
    
    <!-- Packages -->
    <div class="package-cards-container">
      <div class="package-cards">
        <div 
          class="package-card" 
          v-for="pkg in packages" 
          :key="pkg.id"
        >
          <!-- Icon -->
          <div class="package-icon">
            <span v-if="pkg.id === 'single'">🏘️</span>
            <span v-else-if="pkg.id === 'duo'">🏘️🏘️</span>
            <span v-else>🌍</span>
          </div>

          <!-- Title -->
          <h2>{{ pkg.title }}</h2>

          <!-- Description -->
          <p class="package-description">
            {{ getPackageDescription(pkg.id) }}
          </p>

          <!-- Select Button -->
          <button 
            class="select-btn"
            @click.stop="selectPackage(pkg)"
          >
            Select Package
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TourPackages",
  props: {
    selectedTour: {
      type: Object,
      default: () => ({ name: 'Selected Tour' })
    }
  },
  data() {
    return {
      packages: [
        { id: 'single', title: 'Single Township', component: 'SingleTownship' },
        { id: 'duo', title: 'Township Duo', component: 'TownshipDuo' },
        { id: 'full', title: 'Full Cape Culture', component: 'FullCapeCulture' }
      ]
    }
  },
  methods: {
    selectPackage(pkg) {
      // Emit package-selected event with the package object
      this.$emit('package-selected', pkg);
    },
    getPackageDescription(id) {
      const descriptions = {
        single: 'Immerse yourself in one vibrant township community',
        duo: 'Experience two distinct townships in one day',
        full: 'The complete Cape Town cultural experience'
      };
      return descriptions[id] || '';
    },
    handleClose() {
      // Instead of only emitting close, navigate to tours page
      this.$router.push("/tours");
    }
  }
}
</script>


<style scoped>
.tours-container {
  position: relative;
  padding: 2rem;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #091d35;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  z-index: 10;
}

.close-button:hover {
  background-color: rgba(9, 29, 53, 0.1);
  color: #d9534f;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  color: #091d35;
  padding: 0 1rem;
}

.package-cards {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  align-content: start;
  padding-right: 10px;
}

.package-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  text-align: center;
  border: 1px solid #eee;
}

.package-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  border-color: #f6c46d;
}

.package-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.package-card h2 {
  color: #091d35;
  margin-bottom: 0.8rem;
  font-size: 1.3rem;
}

.package-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  min-height: 60px;
}

.select-btn {
  background-color: #091d35;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  width: 100%;
}

.select-btn:hover {
  background-color: #f6c46d;
  color: #091d35;
}
</style>
