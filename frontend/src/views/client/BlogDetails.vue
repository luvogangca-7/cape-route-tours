<template>
  <div class="blog-container">
      <div class="blog-details">
    <article>
      <h1 class="blog-title">{{ blog.title }}</h1>
      <div class="meta">
        <span>{{ blog.author }}</span> |
        <span>{{ formatDate(blog.created_at) }}</span>
      </div>

        <img v-if="blog.imageUrl" :src="blog.imageUrl" alt="Blog Image" class="blog-imag" />

      <div class="content-cont">
        <div class="content" v-html="blog.content"></div>
      </div>
    </article>

    
<hr>



  </div>
     <section class="read-next">
  <h3>Read Next</h3>
  <div class="blog-cards">
    <router-link 
      v-for="other in otherBlogs" 
      :key="other.id" 
      :to="{ name: 'BlogDetails', params: { id: other.id } }" 
      class="blog-card"
    >
      <img :src="other.imageUrl" alt="" />
      <h3>{{ other.title }}</h3>
      <p>{{ generatePreview(other.content) }}</p>
    </router-link>
  </div>

  <hr class="line-break" />

  <h3>Destinations</h3>
  <div class="blog-cards">
    <router-link 
      v-for="location in randomLocations" 
      :key="location.route"
      :to="`/tours/${location.route}`"
      class="blog-card"
    >
      <img :src="location.imageUrl" alt="" />
      <h3>{{ location.name }}</h3>
      <p>{{ generatePreview(location.description) }}</p>
    </router-link>
  </div>
</section>

  </div>

</template>

<script>
import API_URL from '@/config/api.js';

import axios from 'axios';

export default {
  props: ['id'],
  data() {
    return {
      blog: {},
      otherBlogs: [],
      locations: [{
        name: 'Bo-Kaap',
        route: 'bokaap',
        imageUrl: require("@/assets/Gemini_Generated_Image_ubnle2ubnle2ubnl.png"),
        description: 'Explore the vibrant neighborhood of Bo-Kaap.'
      }, {
        name: 'Mitchells Plain',
        route: 'mitchellsplain',
        imageUrl: require("@/assets/Gemini_Generated_Image_yjao3jyjao3jyjao.png"),
        description: 'Discover the vibrant community of Mitchells Plain, known for its rich culture and history.'
      }, {
        name: 'Langa',
        route: 'langa',
        imageUrl: require("@/assets/Gemini_Generated_Image_nlxsjqnlxsjqnlxs.png"),
        description: 'Experience the rich cultural heritage and history of Langa, one of Cape Town\'s oldest townships.'
      }, {
        name: 'Khayelitsha',
        route: 'khayelitsha',
        imageUrl: require("@/assets/Gemini_Generated_Image_by3o39by3o39by3o.png"),
        description: 'Explore the vibrant community of Khayelitsha, one of Cape Town\'s largest townships.'
      }]
    };
  },
  computed: {
    randomLocations() {
      // Shuffle and pick 3 random destinations
      return this.locations
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .slice(0, 3)
        .map(obj => obj.value);
    }
  },
  mounted() {
    this.fetchBlog();
    this.fetchOtherBlogs();
  },
  watch: {
    // Watch for route parameter changes
    '$route'(to, from) {
      console.log('Route changed from', from.params.id, 'to', to.params.id); // Debug log
      if (to.params.id !== from.params.id) {
        this.fetchBlog();
        this.fetchOtherBlogs();
      }
    },
    // Alternative: watch the id prop directly
    id: {
      handler(newId, oldId) {
        console.log('ID prop changed from', oldId, 'to', newId); // Debug log
        if (newId !== oldId && newId) {
          this.fetchBlog();
          this.fetchOtherBlogs();
        }
      },
      immediate: false
    }
  },
  methods: {
    async fetchBlog() {
      try {
        console.log('Fetching blog with ID:', this.id); // Debug log
        const { data } = await axios.get(`${API_URL}/api/blogs/${this.id}`);
        console.log('Fetched blog:', data.title); // Debug log
        this.blog = data;
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    },
    async fetchOtherBlogs() {
      try {
        console.log('Fetching other blogs, excluding ID:', this.id); // Debug log
        const { data } = await axios.get(`${API_URL}/api/blogs/others/${this.id}`);
        console.log('Fetched other blogs:', data.length, 'blogs'); // Debug log
        this.otherBlogs = data;
      } catch (error) {
        console.error('Error fetching other blogs:', error);
      }
    },
    formatDate(date) {
      if (!date) return '';
      // Handle SQL datetime format
      const isoString = date.replace ? date.replace(' ', 'T') : date;
      return new Date(isoString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    generatePreview(htmlContent) {
      if (!htmlContent) return '';
      const div = document.createElement("div");
      div.innerHTML = htmlContent;
      const text = div.textContent || div.innerText || '';
      return text.slice(0, 80) + "...";
    }
  }
};
</script>

<style scoped>
/* Desktop styles (your original design) */
.blog-title {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.blog-container {
  display: grid;
  grid-template-columns: 3fr 1fr;
}

.blog-details {
  justify-content: flex-start;
  width: 70vw;
  padding: 20px;
}

.blog-imag {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  margin: 20px 0;
  border-radius: 8px;
}

.meta {
  color: #777;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.content h1, .content h2, .content h3, .content h4, .content h5, .content h6, .content p {
  line-spacing: 1.6;
}

.read-next {
  margin-top: 40px;
  width: 100%;
}

.read-next h3 {
  text-align: start;
  margin-left: 20px;
}

.blog-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  flex-wrap: wrap;
  margin-left: 20px;
}

.blog-card {
  cursor: pointer;
  width: 300px;
  padding: 10px;
  transition: box-shadow 0.2s ease;
  text-decoration: none;
  color: inherit;
}

.blog-card:hover {
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.blog-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.blog-card h3 {
  margin: 10px 0 5px 0;
  font-size: 1.1em;
}

.blog-card p {
  margin: 0;
  font-size: 0.9em;
  color: #666;
}

.content-cont {
  text-justify: newspaper;
  text-align: justify;
}

.line-break {
  width: 100%;
  margin-inline: 30px;
}

/* ============================================ */
/* RESPONSIVE STYLES - TABLET AND MOBILE ONLY */
/* ============================================ */

/* Tablet styles */
@media (max-width: 1024px) {
  .blog-container {
    grid-template-columns: 1fr;
  }
  
  .blog-details {
    width: 100%;
    max-width: 100%;
    padding: 30px 24px;
  }
  
  .blog-title {
    font-size: 2rem;
  }
  
  .blog-imag {
    max-height: 350px;
    border-radius: 10px;
  }
  
  .content-cont {
    text-align: left;
  }
  
  .read-next h3 {
    margin-left: 15px;
  }
  
  .blog-cards {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    margin-left: 15px;
    margin-right: 15px;
  }
  
  .blog-card {
    width: 100%;
    max-width: 100%;
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    padding: 0;
  }
  
  .blog-card:hover {
    box-shadow: 0 6px 20px rgba(0,0,0,0.12);
    transform: translateY(-2px);
  }
  
  .blog-card img {
    height: 180px;
  }
  
  .blog-card h3 {
    margin: 12px 12px 8px 12px;
    font-size: 1.1rem;
  }
  
  .blog-card p {
    margin: 0 12px 12px 12px;
    font-size: 0.9rem;
  }

  .line-break {
    display: none;
}
}

/* Mobile landscape and small tablets */
@media (max-width: 768px) {
  .blog-details {
    padding: 20px 16px;
  }
  
  .blog-title {
    font-size: 1.75rem;
    line-height: 1.2;
  }
  
  .meta {
    margin-bottom: 16px;
    font-size: 0.9rem;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .blog-imag {
    max-height: 280px;
    margin: 16px 0;
  }
  
  .content-cont {
    margin: 24px 0;
    text-align: left;
  }
  
  .content p {
    line-height: 1.7;
    font-size: 1rem;
  }
  
  .content h1, .content h2, .content h3 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    line-height: 1.3;
  }
  
  .read-next {
    margin-top: 40px;
  }
  
  .read-next h3 {
    margin-left: 10px;
    font-size: 1.5rem;
    margin-bottom: 16px;
  }
  
  .blog-cards {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-left: 10px;
    margin-right: 10px;
    padding: 0 8px;
    margin-bottom: 40px;
  }
  
  .blog-card img {
    height: 200px;
  }
  
  .blog-card h3 {
    margin: 14px 14px 8px 14px;
    font-size: 1.1rem;
  }
  
  .blog-card p {
    margin: 0 14px 14px 14px;
    line-height: 1.5;
  }
  
  .line-break {
    display: none;
}
}

/* Mobile portrait */
@media (max-width: 480px) {
  .blog-details {
    padding: 16px 12px;
  }
  
  .blog-title {
    font-size: 1.5rem;
    margin-bottom: 8px;
    line-height: 1.2;
  }
  
  .meta {
    font-size: 0.85rem;
    margin-bottom: 12px;
    gap: 6px;
  }
  
  .blog-imag {
    max-height: 220px;
    margin: 12px 0;
    border-radius: 6px;
  }
  
  .content-cont {
    margin: 20px 0;
  }
  
  .content p {
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 1em;
  }
  
  .content h1, .content h2, .content h3 {
    font-size: 1.25rem;
    margin-top: 1.2em;
    line-height: 1.3;
  }
  
  .read-next {
    margin-top: 32px;
  }
  
  .read-next h3 {
    font-size: 1.35rem;
    margin-bottom: 12px;
    text-align: center;
  }
  
  .blog-cards {
    gap: 16px;
    margin-left: 0;
    margin-right: 0;
    padding: 0 12px;
  }
  
  .blog-card {
    border-radius: 8px;
  }
  
  .blog-card img {
    height: 180px;
  }
  
  .blog-card h3 {
    margin: 12px 12px 6px 12px;
    font-size: 1.05rem;
  }
  
  .blog-card p {
    margin: 0 12px 12px 12px;
    font-size: 0.9rem;
  }
  
  .line-break {
    display: none;
}
}

/* Extra small devices */
@media (max-width: 360px) {
  .blog-details {
    padding: 12px 10px;
  }
  
  .blog-title {
    font-size: 1.35rem;
  }
  
  .meta {
    font-size: 0.8rem;
  }
  
  .blog-imag {
    max-height: 180px;
  }
  
  .content p {
    font-size: 0.9rem;
  }
  
  .blog-card img {
    height: 160px;
  }

    .line-break {
    display: none;
}
}

/* Touch-friendly improvements for mobile devices */
@media (hover: none) and (pointer: coarse) {
  .blog-card:active {
    opacity: 0.9;
    transform: scale(0.98);
  }
}
</style>