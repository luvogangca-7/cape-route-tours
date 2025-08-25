<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>Contact</h3>
        <p><i class="fas fa-envelope"></i> caperoutetours@gmail.com</p>
        <p><i class="fas fa-phone"></i> +27 12 345 6789</p>
      </div>

      <div class="footer-section">
        <h3>Explore</h3>
        <router-link to="/tour">Tours</router-link>
        <router-link to="/contact">Contact</router-link>
        <router-link to="blog">Blog</router-link>
      </div>

      <div class="footer-section">
        <h3>Connect</h3>
        <div class="social-icons">
          <a href="https://www.facebook.com/profile.php?id=100070328852245" aria-label="Facebook" target="_blank"><i class="fab fa-facebook-f"></i></a>
          <a href="https://www.instagram.com/caperoutetour_?igsh=MWRxZ3U1cmRtamNxZw%3D%3D&utm_source=qr" aria-label="Instagram" target="_blank"><i class="fab fa-instagram"></i></a>
        </div>
      </div>
    </div>
    <div class="terms">
      <router-link to="/terms" aria-label="terms">
          Terms & Conditions
        </router-link>
    </div>

    <div class="footer-bottom">
      <p>&copy; {{ new Date().getFullYear() }} Cape Route Tours</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'SiteFooter'
};
</script>

<style scoped>
.footer {
  background-color: #091d35;
  color: white;
  padding: 2rem 1rem 1rem;
  font-size: 0.9rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-section {
  margin-bottom: 1rem;
}

.footer-section h3 {
  color: #f6c46d;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.footer-section p, 
.footer-section a {
  color: #e0e0e0;
  margin-bottom: 0.6rem;
  display: block;
  transition: all 0.2s ease;
  text-decoration: none;
}

.footer-section a:hover {
  color: #f6c46d;
}

.footer-section i {
  margin-right: 8px;
  color: #f6c46d;
  width: 16px;
  text-align: center;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.social-icons a {
  color: #f6c46d;
  font-size: 1.2rem;
  transition: transform 0.2s;
 
}

.social-icons a:hover {
  transform: translateY(-2px);
}

.footer-bottom {
  text-align: center;
  padding-top: 1.5rem;
  margin-top: 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.6);
  font-size: 0.8rem;
}

.terms a {
  color: #e0e0e0;
  margin-bottom: 0.6rem;
  display: block;
  transition: all 0.2s ease;
  text-decoration: none;
}

.terms a:hover {
  color: #f6c46d;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .footer-section {
    text-align: center;
  }
  
  .social-icons {
    justify-content: center;
  }
}
</style>