<template>
  <nav class="navbar">
    <router-link to="/">
    <div class="logo-container">
        <img
          src="@/assets/logo.png"
          alt="Cape Route Tours Logo"
          class="nav-logo"
        />
        <h1>Cape Route Tours</h1>
      </div>
    </router-link>
    <div class="nav-links">
      <router-link to="/">Home</router-link>
      <router-link to="/tour">Destinations</router-link>
      <router-link to="/blog">Blog</router-link>
      <router-link to="/contact">Contact</router-link>
      <router-link to="/bookings">Bookings</router-link>
    </div>

    <!-- Hamburger for smaller screens -->
    <button class="hamburger" @click="openMobileMenu" aria-label="Open menu">
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>

    <transition name="fade">
      <div v-if="mobileMenuOpen" class="mobile-menu-overlay">
        <div class="mobile-menu-inner">
          <button class="mobile-close" @click="closeMobileMenu">&times;</button>
          <div class="mobile-links">
            <router-link @click="closeMobileMenu" to="/" class="mobile-link">Home</router-link>
            <router-link @click="closeMobileMenu" to="/tour" class="mobile-link">Destinations</router-link>
            <router-link @click="closeMobileMenu" to="/blog" class="mobile-link">Blog</router-link>
            <router-link @click="closeMobileMenu" to="/contact" class="mobile-link">Contact</router-link>
            <router-link @click="closeMobileMenu" to="/bookings" class="mobile-link">Bookings</router-link>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: #091d35;
  padding: 8px 16px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar a {
  text-decoration: none;
}

.nav-logo {
  height: 48px;
  border-radius: 50%;
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
}

.nav-links a:hover {
  text-decoration: underline;
  color: rgb(246, 196, 109);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
}

.logo-container h1 {
  margin-top: 12px;
  text-decoration: none;
  color: white;
}
/* Optional: Add hover effect for the logo */
.logo-container a:hover {
  opacity: 0.8;
}

.nav-links a.router-link-exact-active {
  color: rgb(246, 196, 109);
  text-decoration: underline;
}

/* Hamburger and mobile overlay styles (same behavior as admin) */
.hamburger {
  background: transparent;
  border: none;
  cursor: pointer;
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
}
.hamburger-line {
  width: 20px;
  height: 2px;
  background: white;
  display: block;
  border-radius: 2px;
}
.hamburger { z-index: 1500; }
.mobile-menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(rgba(9,29,53,0.7), rgba(9,29,53,0.7)), url('https://www.capetown.travel/wp-content/uploads/2022/06/Tourist-with-children-in-Khayelitsha.jpeg');
  background-size: cover;
  background-position: center;
  color: white;
}
.mobile-menu-inner {
  width: 100%;
  max-width: 720px;
  padding: 2rem;
  text-align: center;
}
.mobile-close {
  position: absolute;
  top: 12px;
  right: 16px;
  background: transparent;
  border: none;
  font-size: 2rem;
  color: white;
}
.mobile-links {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 2rem;
}
.mobile-link {
  color: rgba(255,255,255,0.95);
  font-size: 1.4rem;
  text-decoration: none;
  font-weight: 700;
}
.mobile-link:hover {
  color: rgb(246, 196, 109);
}

/* Fade transition */
.fade-enter-active, .fade-leave-active { transition: opacity 300ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* hide hamburger by default; show on smaller screens */
.hamburger { display: none; }

@media (max-width: 992px) {
  .nav-links { display: none; }
  .hamburger { display: inline-flex; }
  .nav-logo { height: 32px; }
  .logo-container h1 {
    font-size: 1rem;
    margin: 0 0 0 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: calc(100vw - 120px); /* allow space for hamburger */
  }
  .hamburger { margin-left: auto; }
}
</style>

<script>
export default {
  data() {
    return { mobileMenuOpen: false }
  },
  methods: {
    openMobileMenu() {
      this.mobileMenuOpen = true
      document.body.style.overflow = 'hidden'
    },
    closeMobileMenu() {
      this.mobileMenuOpen = false
      document.body.style.overflow = ''
    }
  }
}
</script>