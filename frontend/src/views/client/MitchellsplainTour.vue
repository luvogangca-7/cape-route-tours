<template>
  <div class="mitchells-tour-page" ref="topAnchor">
    <!-- Hero Section -->
    <section class="hero">
      <div class="overlay"></div>
      <div class="hero-content">
        <h1> Mitchells Plain: The Untold Stories of the Cape Flats</h1>
        <p>A Journey Through Street Culture, Resilience & Flavour</p>
      </div>
    </section>

    <!-- Tour Info Two-Column -->
    <section class="tour-info">
      <div class="tour-card">
        <h2>About This Tour</h2><br><br>
        <p>
          Step into the heart of the Cape Flats, where creativity meets community. Mitchells Plain is alive with rhythm, colour, and flavour—from the sound 
          of local beats to the sizzle of street food stalls. 
          This immersive tour shines a light on a vibrant, often misunderstood community—where adversity has inspired innovation, and every corner has a 
          story to tell.
        </p>

        <h3>✨ What’s Included</h3><br>
        <ul>
          <li>🍴 Street food tasting – try the legendary Gatsby & vetkoek</li>
          <li>🎨 Mural walk – guided by a local township artist</li>
          <li>🗣 Meet a youth activist or community leader</li>
          <li>🏖 Beach walk at Mnandi or Wolfgat – a local hidden gem</li>
          <li>🎁 Handmade souvenir to take home</li>
          <li>🚐 Transport included (pickup and drop-off)</li>
        </ul>

        <p><strong>🕒 Duration:</strong> 5 Hours</p>
        <p><strong>💰 Price:</strong> R1500 per person</p>
        <p><strong>🎁 Includes all tastings, transport, guide, and souvenir</strong></p>

        <h3>📍 About Mitchells Plain</h3><br>
        <p>
          Mitchells Plain was created in the 1970s under the apartheid regime, built as a township for Coloured South Africans forcibly removed from 
          inner-city communities like District Six. 
          But what started in struggle has evolved into a proud, entrepreneurial, and culturally rich neighbourhood. Today, Mitchells Plain is known for its 
          powerful community spirit, dynamic street art, and youth-led innovation.
        </p>

        <h3>🌟 Why This Tour?</h3><br>
        <p>
          This is more than a visit—it’s an invitation into real, everyday life on the Cape Flats. You’ll experience local pride, hear untold stories, and taste 
          the flavours that fuel the streets.
        </p>

 
<button 
  class="book-btn"
  @click="bookMitchellsPlain"
>
  👉 Book your Cape Flats experience now
</button>
      </div>

      <!-- Image / Media Column -->
      <div class="tour-media">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/f/f3/Mitchalls_Plain_sign_rock.jpg"
          alt="Mitchells Plain Street View"
        />
        <img
          src="https://www.overberg-info.co.za/info/articles/2353/images/bottom_images/1.jpg"
          alt="Mitchells Plain street art"
          class="second-image"
        />
        <img 
  src="https://www.thefooddictator.com/wp-content/uploads/2021/12/bunnychow.jpg" 
  alt="Cape Malay food" 
  class="third-image"
>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "MitchellsplainTourDetails",
  mounted() {
    this.$refs.topAnchor.scrollIntoView()
  },
  methods: {
  bookMitchellsPlain() {
    this.$router.push({
      path: '/single-township',
      query: { presetTownship: 'Mitchells Plain' }
    });
  }
}
}
</script>
<style scoped>
.hero {
  position: relative;
  background: url("@/assets/Video by Toma Gerzha.jpg")center/cover no-repeat;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  animation: heavyBreathing 4s ease-in-out infinite;
  transform-origin: center;
}

@keyframes heavyBreathing {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08); /* Only zooms out, no shrinking */
  }
}

.hero .overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(8, 8, 8, 0.4);
  
  
  /* Removed overlay animation to keep it simple */
}

@keyframes overlayPulse {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.6;
  }
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


.tour-media img.third-image {
  height: 280px;
  object-fit: cover;
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
  gap: 1rem;
}

.tour-media img {
  width: 100%;
  height: 350px;
  object-fit: cover;
  border-radius: 12px;
}


.tour-media .second-image {
  height: 350px;
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
</style>
