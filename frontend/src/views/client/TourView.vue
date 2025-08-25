<template>
  <!-- Hero Section -->
    <section class="hero">
      <div class="hero-overlay">
        <h1 class="hero-title">Discover Cape Town's Stories</h1>
        <p class="hero-subtitle">Unique township tours filled with culture, history, and experiences</p>
      </div>
    </section>
    <!-- Tours -->
    <h1 class="page-title" ref="toursSection">Explore Our Tours</h1>
    <div class="tour-list">
      <div
        v-for="tour in tours"
        :key="tour.id"
        class="tour-item"
        @click="goToTour(tour.link)"
      >
        <div class="image-container">
          <img :src="tour.image" :alt="tour.name" class="tour-image" />
        </div>
        <h2 class="tour-title">{{ tour.name }}</h2>
        <button @click.stop="showPackages(tour)" class="book-now-btn">
          Book Now
        </button>
      </div>
    </div>
  <!-- Packages Modal -->
    <div v-if="showPackagesModal" class="modal-overlay" @click.self="closePackagesModal">
      <div class="modal-content">
        <div class="modal-image-side" :style="{ backgroundImage: `url(${selectedTour.image})` }"></div>
        <div class="modal-text-side">
          <TourPackages 
            :selectedTour="selectedTour"
            @package-selected="showPackageDetails"
            @close="closePackagesModal"
          />
        </div>
      </div>
    </div>

    <!-- Package Details Modal -->
    <div v-if="showPackageDetailsModal" class="modal-overlay" @click.self="closePackageDetailsModal">
      <div class="modal-content package-details-modal">
        <button @click="closePackageDetailsModal" class="close-modal-btn">&times;</button>
        <div class="scrollable-content">
          <component :is="selectedPackage.component" :tour="selectedTour" />
        </div>
        <button @click="closePackageDetailsModal" class="action-btn">
          Close Details
        </button>
      </div>
    </div>
</template>


<script>
import TourPackages from '@/components/TourPackages.vue'
import SingleTownship from './SingleTownship.vue'
import TownshipDuo from './TownshipDuo.vue'
import FullCapeCulture from './FullCapeCulture.vue'

export default {
  name: "TourView",
  components: { 
    TourPackages,
    SingleTownship,
    TownshipDuo,
    FullCapeCulture
  },
  data() {
    return {
      showPackagesModal: false,
      showPackageDetailsModal: false,
      selectedTour: null,
      selectedPackage: null,
      tours: [
        {
          id: 1,
          name: "Bo-Kaap Cultural Walk",
          image: require("@/assets/Gemini_Generated_Image_ubnle2ubnle2ubnl.png"),
          link: "/tours/bokaap"
        },
        {
          id: 2,
          name: "Khayelitsha Township Experience",
          image: require("@/assets/Gemini_Generated_Image_by3o39by3o39by3o.png"),
          link: "/tours/khayelitsha"
        },
        {
          id: 3,
          name: "Langa Street Tour",
          image: require("@/assets/Gemini_Generated_Image_nlxsjqnlxsjqnlxs.png"),
          link: "/tours/langa"
        },
        {
          id: 4,
          name: "Mitchells Plain Local Ride",
          image: require("@/assets/Gemini_Generated_Image_yjao3jyjao3jyjao.png"),
          link: "/tours/mitchellsplain"
        }
      ]
    }
  },
  methods: {
    goToTour(link) {
      this.$router.push(link)
    },
    showPackages(tour) {
      this.selectedTour = tour
      this.showPackagesModal = true
    },
    closePackagesModal() {
      this.showPackagesModal = false
    },
    showPackageDetails(pkg) {
      this.selectedPackage = pkg
      this.showPackagesModal = false
      this.showPackageDetailsModal = true
    },
    closePackageDetailsModal() {
      this.showPackageDetailsModal = false
    }
  }
}
</script>

<style scoped>
/* Hero Section */
.hero {
  position: relative;
  background: url('https://www.capetown.travel/wp-content/uploads/neighbourhood-langa.jpg') center/cover no-repeat;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  overflow: hidden;
  margin-bottom: 3rem;
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
}
.hero-overlay {
  padding: 2rem;
  border-radius: 10px;
}
.hero-title {
  font-size: 2.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
.hero-btn {
  background-color: #F6C46D;
  border: none;
  padding: 0.9rem 2rem;
  border-radius: 5px;
  font-weight: bold;
  color: #091D35;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}
.hero-btn:hover {
  background-color: #E4B34A;
  transform: translateY(-2px);
}
.tour-page {
  background: url('https://transparenttextures.com/patterns/cream-paper.png'), #fff;
  padding: 3rem 2rem;
  min-height: 100vh;
}

.page-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #091d35;
  font-weight: bold;
  display: inline-block;
  border: 2px solid #f6c46d;
  padding: 0.6rem 1.5rem;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 4px 6px rgba(246, 196, 109, 0.3);
}

.tour-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 20px
}

.tour-item {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(9, 29, 53, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  text-align: center;
  position: relative;
  height: 100%;
}

.image-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.tour-image {
  width: 100%;
  height: 280px;
  object-fit: cover;
  transition: transform 0.9s ease;
}

.image-container::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6));
  opacity: 0;
  transition: opacity 0.5s ease;
}

.tour-title {
  font-size: 1.5rem;
  font-weight: bold;
  z-index: 2;
  position: relative;
  transition: transform 0.3s ease, color 0.3s ease;
  margin: 1rem 0;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tour-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(9, 29, 53, 0.15);
}

.tour-item:hover .tour-image {
  transform: scale(1.1);
}

.tour-item:hover .image-container::after {
  opacity: 1;
}

.tour-item:hover .tour-title {
  transform: scale(1.05);
  color:#091d35
}

.book-now-btn {
  background-color: white;
  border: 2px solid #f6c46d;
  border-radius: 5px;
  color: #091d35;
  font-weight: bold;
  padding: 0.8rem 1.5rem;
  width: 140px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  position: relative;
  z-index: 2;
  margin-bottom: 1rem;
  align-self: center;
}

.book-now-btn:hover {
  background-color: #f6c46d;
  color: #091d35;
  border-color: #d4a44a;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(9, 29, 53, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(3px);
}

.modal-content {
  background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
  border-radius: 15px;
  padding: 0;
  max-width: 900px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  overflow: hidden;
  max-height: 90vh;
  display: grid;
  grid-template-columns: 40% 60%;
  position: relative;
}

.modal-image-side {
  background-size: cover;
  background-position: center;
  min-height: 300px;
}

.modal-text-side {
  overflow-y: auto;
  padding: 2rem;
  max-height: calc(90vh - 4rem); /* Adjust based on your needs */
}

.package-details-modal {
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  width: 90%;
  max-width: 900px;
}

.close-modal-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #091d35;
  font-size: 1.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-modal-btn:hover {
  background-color: rgba(9, 29, 53, 0.1);
  color: #d9534f;
}

.action-btn {
  margin: 1rem auto 2rem;
  padding: 0.8rem 2rem;
}

.action-btn:hover {
  background-color: #e4b34a;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(246, 196, 109, 0.3);
}

/* Decorative elements */
.modal-content::before {
  content: "";
  position: absolute;
  top: 0;
  left: 40%;
  width: 1px;
  height: 100%;
  background: linear-gradient(to bottom, transparent 0%, rgba(246, 196, 109, 0.3) 50%, transparent 100%);
}

.modal-content::after {
  content: "";
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f6c46d"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>');
  opacity: 0.1;
  z-index: 0;
}

@media (max-width: 768px) {
  .modal-content {
    grid-template-columns: 1fr;
  }
  
  .modal-image-side {
    height: 200px;
  }
  
  .modal-content::before {
    display: none;
  }
  
  .tour-list {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
/* Update package cards container */
.package-cards-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.package-cards {
  overflow-y: visible;
  padding-right: 0;
  margin-bottom: 1rem;
  
}
.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  max-height: calc(80vh - 100px); /* Space for header and button */
}
</style>