<template>
  <div class="blog-details">
    <article>
      <h1 class="blog-title">{{ blog.title }}</h1>
      <div class="meta">
        <span>{{ blog.author }}</span> |
        <span>{{ formatDate(blog.created_at) }}</span>
      </div>
      <img v-if="blog.imageUrl" :src="blog.imageUrl" alt="Blog Image" class="blog-image" />
      <div class="content" v-html="blog.content"></div>
    </article>

    <hr />

   <section class="read-next">
  <h2>Read Next</h2>
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
</section>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['id'],
  data() {
    return {
      blog: {},
      otherBlogs: []
    };
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
        const { data } = await axios.get(`http://localhost:5000/api/blogs/${this.id}`);
        console.log('Fetched blog:', data.title); // Debug log
        this.blog = data;
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    },
    async fetchOtherBlogs() {
      try {
        console.log('Fetching other blogs, excluding ID:', this.id); // Debug log
        const { data } = await axios.get(`http://localhost:5000/api/blogs/others/${this.id}`);
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
.blog-details {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

.blog-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  margin: 20px 0;
}

.meta {
  color: #777;
  margin-bottom: 10px;
}

.content {
  line-height: 1.6;
}

.read-next {
  margin-top: 40px;
}

.blog-cards {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.blog-card {
  cursor: pointer;
  width: calc(33% - 20px);
  border: 1px solid #eee;
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
</style>