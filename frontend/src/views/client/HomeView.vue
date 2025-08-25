<template>
  <div>
    <!-- Slideshow with Slogan Overlay -->
    <div class="slideshow-container">
      <div
        class="slideshow-wrapper"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          v-for="(image, index) in images"
          :key="index"
          class="slide"
          :style="{ backgroundImage: `url(${image})` }"
        ></div>
      </div>
      <!-- Slogan Overlay -->
      <div class="slogan-overlay">
        <h2 class="slogan-text">More Than a Tour </h2>
        <h2 class="slogan-text accent">It's a Cape Experience.</h2>
      </div>
    </div>

    <!-- Hero Text -->
    <div class="hero-text-below">
      <h1>Cape Route Tours</h1>
      <p>Experience the heartbeat of Cape Town's communities</p><br>
      <p>
        Cape Route Tours is a cultural tourism service that goes beyond the usual.
        We offer guided taxi experiences through Cape Town's iconic communities.
        Our routes include Mitchells Plain, Langa, Khayelitsha, and Bo-Kaap.
        Each ride includes local food, music, stories, and real human connection.
      </p><br>
      <p>
        Tourism in South Africa is rich, but often misses the heart of the people.
        Cape Route Tours was created to bring visitors closer to real township life.
        Our tours are immersive, safe, and built to celebrate local culture.
        We invite you to not just visit, but truly experience Cape Town.
      </p><br>
      <p>
        Today's travelers want more than just photo ops and landmarks.
        They crave connection, authenticity, and lasting memories.
        Cape Route Tours is designed for this kind of meaningful travel.
        We turn every journey into a powerful story worth telling.
      </p>
    </div>

    <!-- Interesting Facts Section -->
    <div class="facts-section">
      <h2>Did You Know? Cape Town Facts</h2>
      <div class="facts-grid">
        <div class="fact-card" v-for="(fact, index) in facts" :key="index">
          <div class="fact-icon">
            <span v-html="fact.icon"></span>
          </div>
          <h3>{{ fact.title }}</h3>
          <p>{{ fact.description }}</p>
        </div>
      </div>
    </div>

    <!-- Community Icons -->
    <div class="community-icons">
      <h2>Explore Our Destinations</h2>
      <div class="icon-grid">
        <router-link
          v-for="(community, index) in communities"
          :key="index"
          :to="`/tours/${community.slug}`"
          class="community-link"
        >
          <img :src="community.image" :alt="community.name" />
          <span>{{ community.name }}</span>
        </router-link>
      </div>
    </div>

    <!-- Blog Highlights Section -->
    <div class="blog-highlights">
      <h2>From Our Blog</h2>
      <p>Discover stories, tips, and insights about Cape Town's vibrant culture</p>
      <div class="blog-grid">
        <div class="blog-card" v-for="(blog, index) in latestBlogs" :key="index">
          <div class="blog-image" :style="{ backgroundImage: `url(${blog.imageUrl || fallbackImage})` }"></div>
          <div class="blog-content">
            <h3>{{ blog.title }}</h3>
            <p class="blog-meta">{{ blog.author }} | {{ formatDate(blog.created_at) }}</p>
            <p class="blog-excerpt">{{ generatePreview(blog.content) }}</p>
            <router-link :to="{ name: 'BlogDetails', params: { id: blog.id } }" class="read-more">Read More</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HomeView",
  data() {
    return {
      currentIndex: 0,
      images: [
        'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=450,height=450,dpr=2/tour_img/b25eee60c655631ccbc96c51128556e88b9b04a105e1e7fc722c093a33b72589.jpeg',
        "https://widevisiontravel.com/wp-content/uploads/fimg-cape-town-ships-tours-jpeg.webp",
        'https://capetowndiva.com/wp-content/uploads/2019/06/tomazile-mpanu-stands-at-his-winning-ultra-2019-mural-on-bitterhout-street--1024x611.jpeg',
        'https://landlopers.com/wp-content/uploads/2014/08/Kayamandi-Township-Stellenbosch-South-Africa.jpg'
      ],
      communities: [
        { name: "Mitchells Plain", slug: "mitchellsplain", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxF4VAJtPBCQhCEb9aRuqb_YQCa9hSIoOM2A&s" },
        { name: "Khayelitsha", slug: "khayelitsha", image: "https://adct.org.za/wp-content/uploads/2023/03/Screen-Shot-2023-03-16-at-08.46.35.png" },
        { name: "Langa", slug: "langa", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLQjfnpD-z6AUBO0TdAE2qlupyirNBZvNdDg&s" },
        { name: "Bo-Kaap", slug: "bokaap", image: "https://www.andbeyond.com/wp-content/uploads/sites/5/bo-kaap.jpg" }
      ],
      facts: [
        { icon: "🏙️", title: "Mother City", description: "Cape Town is known as the 'Mother City' because it was the first city established in South Africa." },
        { icon: "🌍", title: "Biodiversity Hotspot", description: "The Cape Floristic Region in Cape Town is one of the world's six floral kingdoms and a UNESCO World Heritage Site." },
        { icon: "⛰️", title: "Table Mountain", description: "Table Mountain is one of the oldest mountains in the world, approximately 360 million years old." },
        { icon: "🍇", title: "Wine Region", description: "The Cape Winelands near Cape Town produce some of the world's finest wines, with vineyards dating back to the 17th century." }
      ],
      latestBlogs: [],
      fallbackImage: "https://via.placeholder.com/400x250?text=No+Image+Available"
    };
  },
  mounted() {
    setInterval(() => {
      if (this.images && this.images.length > 0) {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
      }
    }, 4000);

    this.fetchLatestBlogs();
  },
  methods: {
    async fetchLatestBlogs() {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs");
        // Sort by created_at (newest first), then take top 3
        this.latestBlogs = res.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3);
      } catch (err) {
        console.error("Error fetching latest blogs:", err);
        this.latestBlogs = [];
      }
    },
    generatePreview(content, maxLength = 100) {
      if (!content) return "";
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      const text = tempDiv.textContent || tempDiv.innerText || "";
      let preview = text.trim().substring(0, maxLength);
      const lastSpace = preview.lastIndexOf(" ");
      if (lastSpace > 0 && text.length > maxLength) {
        preview = preview.substring(0, lastSpace) + "...";
      }
      return preview;
    },
    formatDate(dateString) {
      if (!dateString) return "";
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  }
};
</script>


<style>
.slideshow-container {
  width: 100%;
  height: 70vh; /* give it a height */
  overflow: hidden;
  position: relative; /* important for absolute positioning of overlay */
}

.slideshow-wrapper {
  display: flex;
  transition: transform 1s ease-in-out;
  height: 100%;
  position: relative;
  z-index: 1;
}

.slide {
  min-width: 100%;
  background-size: cover;
  background-position: center;
  z-index: 0;
}


.slide {
  min-width: 100%;
  background-size: cover;
  background-position: center;
}

/* Slogan Overlay Styles */
.slideshow-container {
  position: relative; /* ensure positioning context */
}

.slideshow-wrapper {
  position: relative;
  z-index: 1; /* slides stay at base layer */
}

.slogan-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  
  color: white;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
  width: 80%;
  max-width: 800px;
  z-index: 2; /* 👈 force it above slides */
  pointer-events: none; /* prevent blocking clicks */
}

.slogan-overlay .slogan-text{
    font-family: Poppins, Arial, Helvetica, sans-serif;
}



.slogan-text {
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  letter-spacing: 1px;
  text-shadow: 3px 3px 10px rgba(0,0,0,0.9);
  font-family: 'Playfair Display', serif;
}

.slogan-text.accent {
  color: #c9b128; /* Gold color for emphasis */
  font-style: italic;
  font-family: Poppins, Arial, Helvetica, sans-serif;
}

.hero-text-below {
  text-align: center;
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.hero-text-below h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero-text-below p {
  font-size: 1.2rem;
  color: #151515;
  line-height: 1.6;
}

.community-icons {
  text-align: center;
  background-color: #f9f9f9;
}

.icon-grid {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  padding: 50px;
  /* background-color: #f6c46d; */
  margin-top: 1rem;
}

.community-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #333;
  transition: transform 0.2s;
}

.community-link img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 6px solid #091d35;
}

.community-link span {
  margin-top: 0.5rem;
  font-weight: 500;
}

.community-link:hover {
  transform: scale(1.05);
}

/* Facts Section Styles */
.facts-section {
  text-align: center;
  background-color: #fff;
}

.facts-section h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
}

.facts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  width: 100vw;
  background-color: #091d35;
  padding: 50px;
  margin-bottom: 20px;
}

.fact-card {
  background: #f8f8f8;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.fact-card:hover {
  transform: translateY(-5px);
}

.fact-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.fact-card h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.fact-card p {
  color: #555;
  line-height: 1.5;
}

/* Blog Highlights Styles */
.blog-highlights {
  padding: 3rem 2rem;
  text-align: center;
  background-color: #f9f9f9;
}

.blog-highlights h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.blog-highlights > p {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto 2rem;
}

.blog-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.blog-card:hover {
  transform: translateY(-5px);
}

.blog-image {
  height: 200px;
  background-size: cover;
  background-position: center;
}

.blog-content {
  padding: 1.5rem;
}

.blog-content h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.blog-meta {
  color: #777;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.blog-excerpt {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
  font-size: 0.95rem;
}

.read-more {
  color: #e74c3c;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
  font-size: 0.9rem;
}

.read-more:hover {
  color: #c0392b;
  text-decoration: underline;
}

.view-all-blogs {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #e74c3c;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 600;
  transition: background-color 0.2s;
}

.view-all-blogs:hover {
  background-color: #c0392b;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .slogan-text {
    font-size: 2rem;
  }
  
  .facts-grid, .blog-grid {
    grid-template-columns: 1fr;
  }
  
  .hero-text-below {
    padding: 1.5rem;
  }
  
  .community-link img {
    width: 150px;
    height: 150px;
  }
}

</style>