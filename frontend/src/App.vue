<template>
  <AdminNav v-if="showAdminNav" />
  <NavBar v-if="showClientNav" />
  <router-view/>
  <SiteFooter/>
</template>

<script>
import NavBar from './components/NavBar.vue';
import SiteFooter from './components/SiteFooter.vue';
import AdminNav from './components/AdminNav.vue';

export default{
  components:{
    NavBar,
    AdminNav,
    SiteFooter
  },
computed: {
    showAdminNav() {
      // Show admin navbar only if we're inside /admin AND not on /admin/login
      return this.$route.path.startsWith("/admin") && this.$route.path !== "/admin/login";
    },
    showClientNav() {
      // Show client navbar ONLY if we're NOT inside /admin
      return !this.$route.path.startsWith("/admin");
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
}
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  /* overflow-x: hidden; */
  
}

/* Remove gaps from all elements */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: poppins, arial;
}

nav {
  padding: 30px;
  padding-left: 0%;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
