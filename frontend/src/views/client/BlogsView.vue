<template>
  <div class="user-blog-page">
    <!-- Hero Slideshow -->
    <div class="slideshow-container">
      <div class="slideshow-wrapper">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="slide"
          :class="{ active: index === currentIndex }"
          :style="{ backgroundImage: `url(${image})` }"
        >
          <!-- <h1 class="slide-title"> Read some of our blogs to know more about the Cape Flats!!</h1> -->
        </div>
      </div>
    </div>

    <h1 class="page-title">Our Blog</h1>

    <!-- Blog Grid -->
    <div class="blogs-grid">
      <div class="blog-card" v-for="blog in blogPreviews" :key="blog.id">
        <div class="img-container">
          <img :src="blog.imageUrl || fallbackImage" alt="Blog Image" />
        </div>
        <div class="blog-details">
          <h2 class="blog-title">{{ blog.title }}</h2>
          <p class="blog-meta">
            {{ blog.author }} | {{ formatDate(blog.created_at) }}
          </p>
          <p class="blog-preview">{{ blog.preview }}</p>
          <router-link
            :to="{ name: 'BlogDetails', params: { id: blog.id } }"
            class="read-more-btn"
          >
            Read More
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserBlogPage",
  data() {
    return {
      blogs: [],
      fallbackImage:
        "https://via.placeholder.com/400x250?text=No+Image+Available",
      currentIndex: 0,
      intervalId: null,
    };
  },
  computed: {
    blogPreviews() {
      return this.blogs.map((blog) => ({
        ...blog,
        preview: this.generatePreview(blog.content),
      }));
    },
    images() {
      // Hero slideshow images come from blog images
      return this.blogs.map((blog) => blog.imageUrl || this.fallbackImage);
    },
  },
  mounted() {
    this.fetchBlogs();

    // Auto-slide every 3s
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 3000);
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  },
  methods: {
    async fetchBlogs() {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs");
        this.blogs = res.data;
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    },
    generatePreview(content, maxLength = 120) {
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
    },
    nextSlide() {
      if (!this.images || this.images.length === 0) return;
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },
  },
};
</script>

<style scoped>


.user-blog-page {
  font-family: inherit;
}

.page-title {
  text-align: center;
  color: #091d35;
  margin-block: 30px;
}

.blogs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
}

.blog-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

.img-container img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.blog-details {
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.blog-title {
  font-size: 1.2em;
  margin-bottom: 5px;
  color: #091d35;
}

.blog-meta {
  font-size: 0.9em;
  color: #555;
  margin-bottom: 10px;
}

.blog-preview {
  flex: 1;
  font-size: 0.95em;
  margin-bottom: 15px;
}

.read-more-btn {
  padding: 8px;
  background-color: #091d35;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  align-self: flex-start;
  text-decoration: none;
}

.read-more-btn:hover {
  color: rgb(246, 196, 109);
}

/* Hero Slideshow */
.slideshow-container {
  position: relative;
  width: 100%;
  height: 70vh;
  overflow: hidden;
}

.slideshow-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.slide.active {
  opacity: 1;
  z-index: 1;
}
</style>
