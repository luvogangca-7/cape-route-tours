<template>
  <nav class="navbar">
    <router-link to="/">
    <div class="logo-container">
        <img
          src="@/assets/logo.jpg"
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
  </nav>
</template>

<style scoped>
.navbar {
  background-color: #091d35;
  padding: 10px 30px;
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
  height: 60px;
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
}

.logo-container h1 {
  text-decoration: none;
  color: white;
}
/* Optional: Add hover effect for the logo */
.logo-container a:hover {
  opacity: 0.8;
}

.nav-links a.router-link-exact-active {
  background-color: rgba(255, 255, 255, 0.2);
  color: rgb(246, 196, 109);
}
</style>