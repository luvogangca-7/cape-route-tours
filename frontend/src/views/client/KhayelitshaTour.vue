<template>
  <div class="khayelitsha-tour-page" ref="topAnchor">
    <!-- Hero Section -->
    <section class="hero">
      <div class="overlay"></div>
      <div class="hero-content">
        <h1> Khayelitsha: New Home New Dreams</h1>
        <p>Where Hustle Meets Hope</p>
      </div>
    </section>

    <!-- Tour Info Two-Column -->
    <section class="tour-info">
      <div class="tour-card">
        <h2>About This Tour</h2><br><br>
        <p>
          Experience the rhythm and resilience of one of South Africa’s fastest-growing townships. Khayelitsha—meaning “new home” in 
          isiXhosa—is a vibrant urban hub where baristas, barbers, and beatmakers are redefining African city life from the ground up. 
          This is a walking story through hope, hustle, and homegrown culture.
        </p>
<br>
        <h3>✨ What’s Included</h3><br>
        <ul>
          <li>☕ Coffee tasting at a buzzing container café</li>
          <li>🧩 Guided story walk through Site C & Makhaza</li>
          <li>🎧 Drop in at a local hip-hop studio</li>
          <li>🥘 Traditional lunch – chakalaka, pap & more</li>
          <li>📸 Get your portrait taken by a local street photographer</li>
          <li>🚐 Transport included (pickup and drop-off)</li>
        </ul>

        <p><strong>🕒 Duration:</strong> 5 Hours</p>
        <p><strong>💰 Price:</strong> R1500 per person</p>
        <p><strong>🎁 Includes transport, lunch, and all experiences</strong></p>

        <h3>📍 About Khayelitsha</h3><br>
        <p>
          Khayelitsha was founded in the early 1980s under apartheid as a residential area for Black South Africans forcibly removed 
          from central Cape Town. Today, it is home to over 400,000 people, spanning formal suburbs like Kuyasa, Litha Park, and 
          Makhaza, as well as informal settlements such as Enkanini and QQ Section. 
          Though born out of displacement, Khayelitsha has become a symbol of youth-driven energy, community innovation, and grassroots transformation. 
          Organizations like the Social Justice Coalition work tirelessly for safety, sanitation, and social change.
        </p>

        <h3>🌟 Why This Tour?</h3><br>
        <p>
          This isn’t just a township tour—it’s an eye-opening cultural exchange. You’ll walk the streets with locals, share stories over food 
          and music, and witness firsthand how creativity and resilience fuel Khayelitsha’s future.
        </p>

<!-- In MitchellsplainTourDetails.vue -->
<button 
  class="book-btn"
  @click="bookKhayelitsha"
>
  👉 Book your Khayelitsha experience now
</button>      </div>

      <!-- Image / Media Column -->
      <div class="tour-media">
        <img
          src="https://i.pinimg.com/1200x/e0/50/75/e05075e5278441ff0348106efbd7c6f2.jpg"
          alt="Khayelitsha Street View"
        />
        <img
          src="https://i.pinimg.com/736x/45/b1/57/45b157eac7936ab199ff26f8e5eee659.jpg"
          alt="Local life in Khayelitsha"
          class="second-image"
        />
        <img 
  src="https://www.capetown.travel/wp-content/uploads/pakwathu-braai-restaurants.jpg" 
  alt="Cape Malay food" 
  class="third-image"
>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "KhayelitshaTourDetails",
  mounted() {
    this.$refs.topAnchor.scrollIntoView()
  },methods: {
  bookKhayelitsha() {
    this.$router.push({
      path: '/single-township',
      query: { presetTownship: 'Khayelitsha' }
    });
  }
}
}
</script>

<style scoped>
.hero {
  position: relative;
  background: url('https://i.pinimg.com/736x/75/24/7d/75247d8aacaddd288dee17c4fb79fd0d.jpg') center/cover no-repeat;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  /* Parallax Magic Starts Here */
  background-attachment: fixed; /* Key property */
  background-position: center;
  background-size: cover;
  overflow: hidden; /* Ensures no scrollbar issues */
}

.hero .overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  /* Optional: Add subtle movement to overlay */
  transform: translateZ(0); /* Boosts performance */
}

/* Optional: Add depth to text */
.hero-content {
  transform: translateZ(0.1px); /* Slight parallax effect */
  position: relative;
  z-index: 2;
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

.tour-media img.third-image {
  height: 400px;
  object-fit: cover;
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
