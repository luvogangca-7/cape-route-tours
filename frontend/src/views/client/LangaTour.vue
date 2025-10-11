<template>
  <div class="langa-tour-page" ref="topAnchor">
    <!-- Hero Section -->
    <section class="hero">
      <div class="overlay"></div>
      <div class="hero-content">
        <h1> Langa: Echoes of the Past, Voices of Today</h1>
        <p>The Birthplace of Jazz, Protest & Pride</p>
      </div>
    </section>

    <!-- Tour Info Two-Column -->
    <section class="tour-info">
      <div class="tour-card">
        <h2>About This Tour</h2><br>
        <p>
          Step into Cape Town’s oldest township—where jazz, resistance, and resilience flow through the streets. 
          Langa, meaning “sun”, carries a legacy that shines through every mural, melody, and memory. 
          This is a soulful journey through history, art, and culture—told by those who live it every day.
        </p>

        <h3>✨ What’s Included</h3><br>
        <ul>
          <li>🎷 Visit to Guga S’thebe Cultural Centre – Langa’s creative heart</li>
          <li>🎨 Live mural art demo by a local street artist</li>
          <li>🏠 Storytelling circle with a host family in their home</li>
          <li>🍛 Traditional umngqusho with homemade ginger beer</li>
          <li>🎶 Mini jazz session by local musicians</li>
          <li>🚐 Transport included</li>
        </ul>

        <p><strong>🕒 Duration:</strong> 5 Hours</p>
        <p><strong>💰 Price:</strong> R1500 per person</p>

        <h3>📍 History of Langa</h3><br>
        <p>
          Langa was officially established in 1927 under the Urban Areas Act, part of apartheid’s early system of racial segregation. 
          Named after Langalibalele—a revered Xhosa chief imprisoned on Robben Island—it quickly became a hub of political resistance 
          and artistic expression. Today, it thrives with jazz heritage, vibrant art, and strong community spirit.
        </p>

     <!-- In MitchellsplainTourDetails.vue -->
<button 
  class="book-btn"
  @click="bookLanga"
>
  👉 Book Your Langa Experience
</button>

      </div>

      <!-- Image / Map Column -->
      <div class="tour-media">
        <img src="https://www.capetown.travel/wp-content/uploads/2022/06/Langa_by_Esteedv-8075-scaled-1.jpeg" alt="Langa Street View">
          <img
    src="https://capetowndiva.com/wp-content/uploads/2019/06/Guga-Sthebe-on-Washington-Street.jpeg"
    alt="Guga S’thebe Cultural Centre"
    class="second-image"
  />
          <img
    src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/f2/bc/e1/lelapa-restaurant.jpg?w=1100&h=1100&s=1"
    alt="food"
    class="third-image"
  />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "LangaTourDetails",
  mounted() {
    this.$refs.topAnchor.scrollIntoView()
  },methods: {
  bookLanga() {
    this.$router.push({
      path: '/single-township',
      query: { presetTownship: 'Langa' }
    });
  }
}
}
</script>
<style scoped>
.hero {
  position: relative;
  background: url('https://i.pinimg.com/originals/ea/c0/21/eac021e9b86e87d3f7d43fc36e4a3823.gif') center/cover no-repeat;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.hero .overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}

.hero-content {
  position: relative;
  text-align: center;
  z-index: 2;
}

.hero-content h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.hero-content p {
  font-size: 1.2rem;
}

/* Two-column layout */
.tour-info {
  display: flex;
  gap: 2rem;
  margin: 2rem auto;
  max-width: 1100px;
  align-items: flex-start;
}

.tour-card {
  flex: 1;
  background: white;
  padding: 2rem;
  text-align: left;
  border-radius: 12px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
}

.tour-card h2,
.tour-card h3 {
  color: #2c3e50;
}

.tour-card ul {
  list-style: none;
  padding: 0;
}

.tour-card ul li {
  margin-bottom: 0.5rem;
}

.tour-media {
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1rem; /* space between images */
}

.tour-media img {
  width: 100%;
  height: 250px; /* fixed height for consistency */
  object-fit: cover;
  border-radius: 12px;
}

.tour-media .second-image {
  height: 250px; /* slightly smaller or same as above */
}

.book-btn {
  margin-top: 1rem;
  padding: 0.7rem 1.5rem;
  background-color: rgb(246, 196, 109);
  border: none;
  color: #000;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.book-btn:hover {
  background-color: #ce9833;
}

.tour-card h2 {
  background-color: #f6c46d; /* Matching your button color */
  display: inline-block;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
}

/* =================================================================
   RESPONSIVE STYLES FOR ALL TOUR PAGES
   Copy the media queries below and add them to the END of each 
   tour page's <style scoped> section (after existing styles)
   ================================================================= */

/* ============================================
   TABLET STYLES (768px - 1024px)
   ============================================ */
@media (max-width: 1024px) {
  .hero-content h1 {
    font-size: 2rem;
  }

  .hero-content p {
    font-size: 1rem;
    padding: 0 1rem;
  }

  .tour-info {
    max-width: 90%;
    gap: 1.5rem;
  }

  .tour-card {
    padding: 1.5rem;
  }

  .tour-media img {
    height: 250px;
  }

  .tour-media .second-image {
    height: 250px;
  }

  .tour-media img.third-image {
    height: 280px;
  }
}

/* ============================================
   MOBILE STYLES (Up to 767px)
   ============================================ */
@media (max-width: 767px) {
  .hero {
    height: 50vh;
    /* Disable parallax and animations on mobile for better performance */
    background-attachment: scroll !important;
    animation: none !important;
  }

  .hero-content h1 {
    font-size: 1.5rem;
    padding: 0 1rem;
  }

  .hero-content p {
    font-size: 0.9rem;
    padding: 0 1rem;
  }

  /* Stack the two-column layout vertically */
  .tour-info {
    flex-direction: column;
    gap: 1.5rem;
    margin: 1rem auto;
    max-width: 95%;
    padding: 0 1rem;
  }

  .tour-card {
    padding: 1.5rem 1rem;
  }

  .tour-card h2 {
    font-size: 1.3rem;
    padding: 0.4rem 1rem;
  }

  .tour-card h3 {
    font-size: 1.1rem;
  }

  .tour-card p,
  .tour-card ul li {
    font-size: 0.95rem;
  }

  /* Adjust image heights for mobile */
  .tour-media img {
    height: 200px;
  }

  .tour-media .second-image {
    height: 200px;
  }

  .tour-media img.third-image {
    height: 220px;
  }

  .book-btn {
    width: 100%;
    padding: 0.8rem 1rem;
    font-size: 0.95rem;
  }
}

/* ============================================
   SMALL MOBILE (Up to 480px)
   ============================================ */
@media (max-width: 480px) {
  .hero {
    height: 40vh;
  }

  .hero-content h1 {
    font-size: 1.3rem;
  }

  .hero-content p {
    font-size: 0.85rem;
  }

  .tour-card {
    padding: 1rem;
  }

  .tour-card h2 {
    font-size: 1.2rem;
  }

  .tour-card h3 {
    font-size: 1rem;
  }

  .tour-media img,
  .tour-media .second-image,
  .tour-media img.third-image {
    height: 180px;
  }
}
</style>