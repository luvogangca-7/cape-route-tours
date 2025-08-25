<template>
  <div class="bokaap-tour-page" ref="topAnchor">
    <!-- Hero Section -->
    <section class="hero">
      <div class="overlay"></div>
      <div class="hero-content">
        <h1> Bo-Kaap: Spice Soul & Stories</h1>
        <p>A Cultural Deep Dive Through 300 Years of Cape Malay Heritage</p>
      </div>
    </section>

    <!-- Tour Info Two-Column -->
    <section class="tour-info">
      <div class="tour-card">
        <h2>About This Tour</h2><br><br>
        <p>
          Wander the cobbled streets of Bo-Kaap, where every corner tells a story. From pastel-painted homes and the melodic call to
          prayer, to the aroma of slow-cooked curries—this experience is a feast for the senses.
          Join us for a journey that blends history, heritage, and hospitality in Cape Town’s most iconic neighborhood.
        </p>
        <br>

        <h3>🌍 What’s Included</h3>
        <ul>
          <li>🕌 Guided tour of Auwal Mosque & Bo-Kaap Museum</li>
          <li>📚 Discover the stories of slavery, faith & freedom</li>
          <li>🖼 Photo walk with historical stops and hidden gems</li>
          <li>🧕 Cook with a local family in their home kitchen</li>
          <li>🍛 Cape Malay cooking class: learn to make koeksisters, curry, and roll your own roti</li>
          <li>🚐 Transport included (pickup and drop-off)</li>
        </ul>

        <p><strong>🕒 Duration:</strong> 5 Hours</p>
        <p><strong>💰 Price:</strong> R1500 per person</p>
        <p><strong>🎁 Includes meal, transport, and all entrance fees</strong></p>

        <h3>📍 About Bo-Kaap</h3>
        <p>
          Bo-Kaap, meaning "Above the Cape", was born in the 1760s when Jan de Waal built homes for freed slaves. These
          residents—many from Southeast Asia—laid the foundation for the Cape Malay community.
          After slavery was abolished, they painted their homes in bright, joyful colours—a powerful symbol of identity and liberation.
          Despite apartheid-era relocations, Bo-Kaap’s Muslim Malay heritage survived. Today, over half the original architecture still
          stands, with the area preserved as a heritage zone.
        </p>

        <h3>🌟 Why This Tour?</h3><br>
        <p>
          This isn't just a sightseeing trip—it’s a personal encounter with the soul of Cape Town. Cook in a family home, hear lived
          histories, and leave with a deeper understanding of a vibrant culture that continues to shape South Africa.
        </p>
<button 
  class="book-btn"
  @click="bookBokaap"
>
  👉 Ready to taste the history?
</button>
      </div>

      <!-- Image / Media Column -->
      <div class="tour-media">
        <img
          src="https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=620,height=400,dpr=1/tour_img/233a23846397c2198a8949457415d61f4df1e3d40c1d25deb3576ea8a983b9a9.jpg"
          alt="Bo-Kaap street view"
        />
        <img
          src="https://images.squarespace-cdn.com/content/v1/635050ebac0df95f5bb3de4d/16d419e3-c90a-4289-b3a7-25a5b09bef33/07.jpg"
          alt="Bo-Kaap colorful houses"
          class="second-image"
        />
        <img 
  src="https://scontent-cpt1-1.xx.fbcdn.net/v/t39.30808-6/490013515_1273877501406465_8634601725007088905_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFgRAFjd-Y3fSs4CNagZFZ9UknlMAMjBCVSSeUwAyMEJf-fsDiwfxIVrp0ivM8R2q_9I6lw4THvcqk6u6gzkpdS&_nc_ohc=cq0tb3_KB-wQ7kNvwHLbDaL&_nc_oc=Adn_M-wqNjntBOJZs8c_1RZnNLV_GTf2O5pc7q01yZ3LV4llpQMx_To23mliynFpZJ4&_nc_zt=23&_nc_ht=scontent-cpt1-1.xx&_nc_gid=pCi7j35JQvKYPA34Uk5ZYA&oh=00_AfWByPjzE4ZeiN97DPg5HFEIg4yUqgYE61Qg53_cGnYOZw&oe=689BCC90" 
  alt="Cape Malay food" 
  class="third-image"
>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "BokaapTourDetails",
  mounted() {
    this.$refs.topAnchor.scrollIntoView()
  },
  methods: {
  bookBokaap() {
    this.$router.push({
      path: '/single-township',
      query: { presetTownship: 'Bo-Kaap' }
    });
  }
}
}
</script>

<style scoped>
.hero {
  position: relative;
  background: url('https://www.travelbeginsat40.com/wp-content/uploads/2019/12/98659660-1024x622.jpg.webp') center/cover no-repeat;
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
  overflow: visible;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tour-media img {
  width: 100%;
  height: 250px;
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

