<template>
  <footer class="footer">
    <div class="footer-inner container">
      <div class="footer-grid">
        <div class="col contact">
          <h4 class="section-title">Contact</h4>
          <p class="muted contact-item"><i class="fas fa-envelope fa-fw" aria-hidden="true"></i><a href="mailto:caperoutetours@gmail.com">caperoutetours@gmail.com</a></p>
          <p class="muted contact-item"><i class="fas fa-phone fa-fw" aria-hidden="true"></i><a href="tel:+27123456789">+27 12 345 6789</a></p>
          <p class="muted contact-item"><i class="fas fa-map-marker-alt fa-fw" aria-hidden="true"></i><span>Cape Town, South Africa</span></p>
        </div>

        <div class="col explore">
          <h4 class="section-title">Explore</h4>
          <ul class="links-list">
            <li><router-link to="/tour">Tours</router-link></li>
            <li><router-link to="/blog">Blog</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
            <li><router-link to="/bookings">Bookings</router-link></li>
          </ul>
        </div>

        <div class="col connect">
          <h4 class="section-title">Connect</h4>
          <p class="muted mb-2">Follow our journey — share, tag, and join the conversation</p>
          <div class="social-icons">
            <a class="social-btn" href="https://www.facebook.com/profile.php?id=100070328852245" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-facebook-f" aria-hidden="true"></i>
            </a>
            <a class="social-btn" href="https://www.instagram.com/caperoutetour_?igsh=MWRxZ3U1cmRtamNxZw%3D%3D&utm_source=qr" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-instagram" aria-hidden="true"></i>
            </a>
            <a class="social-btn" href="https://www.youtube.com/" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-youtube" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom-row">
        <div class="terms">
          <router-link to="/terms" aria-label="terms">Terms & Conditions</router-link>
        </div>
        <div class="credits">
          <p>&copy; {{ new Date().getFullYear() }} Cape Route Tours — Developed by Luvo Gangca, Aisha Kabanga, Enrique Kanyemba, Emihle Maxengana, Nieshaan de Beer</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'SiteFooter'
}
</script>

<style scoped>
.footer {
  background-color: #091d35;
  color: white;
  padding: 2.5rem 1rem;
  font-size: 0.95rem;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.col { min-width: 0 }

/* Ensure every column and heading matches Contact's left justification */
.footer-grid .col,
.section-title {
  text-align: left;
}

.section-title {
  color: #f6c46d;
  margin-bottom: 0.75rem;
  font-size: 1.05rem;
  font-weight: 700;
}

.muted { color: #dcdcdc; margin: 0.4rem 0 }

/* Contact items: align icon + text */
.contact-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0.4rem 0;
}
.contact-item i {
  width: 20px;
  text-align: center;
  color: #f6c46d;
  font-size: 1.05rem;
}
.contact a { color: #e6e6e6; text-decoration: none }
.contact a:hover { color: rgb(246, 196, 109) }

.links-list { list-style: none; padding: 0; margin: 0 }
.links-list li { margin: 0.4rem 0 }
.links-list a { color: #e6e6e6; text-decoration: none }
.links-list a:hover { color: rgb(246, 196, 109) }

.social-icons { display:flex; gap:0.8rem; align-items:center }
.social-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255,255,255,0.06);
  color: white;
  font-size: 1.1rem;
  transition: transform .16s ease, background .16s ease, color .16s ease;
  text-decoration: none;
}
.social-btn:hover { transform: translateY(-4px); background: rgba(255,255,255,0.12); color: rgb(246, 196, 109) }

.footer-bottom-row {
  display:flex;
  gap:1rem;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.terms a { color: #e6e6e6; text-decoration: none }
.terms a:hover { color: rgb(246, 196, 109) }
.credits p { color: rgba(255,255,255,0.7); margin: 0; font-size: 0.9rem }

@media (max-width: 768px) {
  .footer-grid { grid-template-columns: 1fr; }
  /* keep same left alignment on small screens per request */
  .footer-grid .col,
  .section-title { text-align: left; }
  .footer-bottom-row { flex-direction: column; gap: .5rem }
  .social-icons { justify-content: center }
  .credits p { font-size: 0.85rem }
}
</style>