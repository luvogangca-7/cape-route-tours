<!-- file path: frontend/ src/ components/ Navbar.vue -->
<template>
  <div class="navbar">
    <div class="nav-brand">
      <span>Cape Route Tours ADMIN</span>
    </div>
    <nav class="nav-links">
      <router-link to="/admin/dashboard" class="nav-link">Dashboard</router-link>
      <router-link to="/admin/bookings" class="nav-link">Bookings</router-link>
      <router-link to="/admin/blog" class="nav-link">Blogs</router-link>
      <router-link to="/admin/inquiries" class="nav-link">Inquiries</router-link>

      <!-- Logout triggers confirmation modal -->
      <button @click="confirmLogout" class="nav-link btn-plain">Logout</button>
    </nav>

    <!-- Hamburger (visible on mobile/tablet) -->
    <button class="hamburger" @click="openMobileMenu" aria-label="Open menu">
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>

    <!-- Mobile Fullscreen Menu Overlay -->
    <transition name="fade">
      <div v-if="mobileMenuOpen" class="mobile-menu-overlay">
        <div class="mobile-menu-inner">
          <button class="mobile-close" @click="closeMobileMenu">&times;</button>
          <div class="mobile-links">
            <router-link @click="closeMobileMenu" to="/admin/dashboard" class="mobile-link">Dashboard</router-link>
            <router-link @click="closeMobileMenu" to="/admin/bookings" class="mobile-link">Bookings</router-link>
            <router-link @click="closeMobileMenu" to="/admin/blog" class="mobile-link">Blogs</router-link>
            <router-link @click="closeMobileMenu" to="/admin/inquiries" class="mobile-link">Inquiries</router-link>
            <button class="mobile-link btn-plain" @click="logout">Logout</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Logout Confirmation Modal -->
    <div v-if="showLogoutModal" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Logout</h5>
            <button type="button" class="btn-close" @click="cancelLogout"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to logout?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cancelLogout">Cancel</button>
            <button type="button" class="btn btn-danger" @click="logout">Logout</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminNav',
  data() {
    return {
      showLogoutModal: false
      , mobileMenuOpen: false
    }
  },
  methods: {
    confirmLogout() {
      this.showLogoutModal = true
    },
    cancelLogout() {
      this.showLogoutModal = false
    },
    logout() {
      // Clear any admin session data and navigate to login
      try {
        localStorage.removeItem('admin_token')
        // Optionally clear other admin specific keys
      } catch (e) {
        // ignore
      }
      this.showLogoutModal = false
      // Use router navigation if available
      if (this.$router) this.$router.push('/admin/login')
      else window.location.href = '/admin/login'
    }
    , openMobileMenu() {
      this.mobileMenuOpen = true
      // prevent background scroll
      document.body.style.overflow = 'hidden'
    }
    , closeMobileMenu() {
      this.mobileMenuOpen = false
      document.body.style.overflow = ''
    }
  }
}
</script>

<style scoped>
.navbar {
  background-color: #091D35;
  padding: 8px 16px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

  .nav-brand {
  font-weight: bold;
  font-size: 1.2rem;
  flex: 0 0 auto;
 }

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  padding:12px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: rgb(246, 196, 109);
}

.nav-link.router-link-exact-active {
  text-decoration: underline;
  color: rgb(246, 196, 109);
}

/* Hamburger and mobile overlay styles */
.hamburger {
  background: transparent;
  border: none;
  cursor: pointer;
  display: none; /* hidden by default, shown on smaller screens via media query */
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  z-index: 1500;
}
.hamburger-line {
  width: 24px;
  height: 2px;
  background: white;
  display: block;
  border-radius: 2px;
}

/* Fullscreen mobile menu overlay */
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

/* hide hamburger on desktop; show only on tablet/mobile */
.hamburger { display: none !important; }

/* style for the login/logout button inside mobile overlay */
.mobile-link.btn-plain {
  display: block;
  width: 100%;
  background: rgba(255,255,255,0.08);
  color: #fff;
  padding: 14px 18px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  font-weight: 800;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.mobile-link.btn-plain:hover {
  background: rgba(255,255,255,0.14);
  color: rgb(246, 196, 109);
}

/* Fade transition */
.fade-enter-active, .fade-leave-active { transition: opacity 300ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* responsive rules: show hamburger and hide nav-links on smaller screens */
@media (max-width: 992px) {
  .nav-links { display: none; }
  .hamburger { display: inline-flex !important; }
  .hamburger { margin-left: auto; }
  .nav-brand { font-size: 1rem; max-width: calc(100vw - 120px); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
}

@media (max-width: 576px) {
  .nav-brand { font-size: 0.9rem; }
}
</style>








