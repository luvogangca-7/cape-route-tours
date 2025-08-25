<!-- file path: frontend/ src/ components/ Navbar.vue -->
<template>
  <div class="navbar">
    <div class="nav-brand">
      <span>Cape Route Tours ADMIN</span>
    </div>
    <nav class="nav-links">
      <!-- Dashboard -->
      <router-link to="/admin/dashboard" class="nav-link">Dashboard</router-link>
      <!-- Bo-Kaap -->
      <!-- <router-link to="/admin/BoKaap" class="nav-link">BoKaap</router-link>
      <!-- khayelitsha -->
      <!-- <router-link to="/admin/Khayelitsha" class="nav-link">Khayelitsha</router-link>
      <!-- Langa -->
      <!-- <router-link to="/admin/Langa" class="nav-link">Langa</router-link> -->
      <!-- Mitchells plain -->
      <!-- <router-link to="/admin/Mitchellsplain" class="nav-link">Mitchellsplain</router-link> -->

      <router-link to="/admin/bookings" class="nav-link">Bookings</router-link>
      <router-link to="/admin/blog" class="nav-link">Blogs</router-link>

      <router-link to="/admin/inquiries" class="nav-link">Inquiries</router-link>
      <!-- Log-out -->
      <a href="#" @click.prevent="logout" class="nav-link">Logout</a>
    </nav>
  </div>
</template>

<script>
export default {
  methods: {
logout() {
  sessionStorage.removeItem('isAuthenticated');
  sessionStorage.removeItem('authTimestamp');
  this.$router.push('/admin/login'); // ✅ send back to login
}
  }
}
</script>

<style scoped>
.navbar {
  background-color: #091D35;
  padding: 10px 30px;
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
  background-color: rgba(255, 255, 255, 0.2);
  color: rgb(246, 196, 109);
}
</style>








