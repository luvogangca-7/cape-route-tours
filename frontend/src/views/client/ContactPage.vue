<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <section class="contact-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>Get in Touch With Us</h1>
        <p>We'd love to hear from you. Let's plan your perfect Cape Town experience.</p>
      </div>
    </section>

    <!-- Main Content -->
    <div class="contact-content">
      <!-- Quick Info Cards -->
      <section class="quick-info">
        <div class="info-card">
          <div class="icon-wrapper">
            <i class="fas fa-shield-alt"></i>
          </div>
          <h3>Safe & Secure Tours</h3>
          <p>Professional security on all township experiences</p>
        </div>

        <div class="info-card">
          <div class="icon-wrapper">
            <i class="fas fa-clock"></i>
          </div>
          <h3>Quick Response</h3>
          <p>We respond within 24 hours</p>
        </div>

        <div class="info-card">
          <div class="icon-wrapper">
            <i class="fas fa-headset"></i>
          </div>
          <h3>24/7 Support</h3>
          <p>Always here to help you</p>
        </div>
      </section>

      <!-- Message Form Section -->
      <section class="form-section">
        <div class="section-header">
          <h2>Send Us a Message</h2>
          <p>Have a question? We're here to help. Fill out the form below and we'll get back to you soon.</p>
        </div>
        <message-us/>
      </section>

      <!-- Contact Information Section -->
      <section class="contact-info-section">
        <div class="section-header">
          <h2>Contact Information</h2>
          <p>Reach out to us through any of these channels or visit us in person.</p>
        </div>
        <contact-us/>
      </section>

      <!-- Why Choose Us Section -->
      <section class="why-choose-us">
        <h2>Why Book With Cape Route Tours?</h2>
        <div class="features-grid">
          <div class="feature-item">
            <i class="fas fa-users"></i>
            <h4>Local Expertise</h4>
            <p>Our guides are from the communities we visit</p>
          </div>
          <div class="feature-item">
            <i class="fas fa-car"></i>
            <h4>Transport Included</h4>
            <p>Pickup and drop-off from your accommodation</p>
          </div>
          <div class="feature-item">
            <i class="fas fa-utensils"></i>
            <h4>Authentic Meals</h4>
            <p>Experience real local cuisine</p>
          </div>
          <div class="feature-item">
            <i class="fas fa-camera"></i>
            <h4>Memorable Moments</h4>
            <p>Create lasting memories and connections</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import ContactUs from '@/components/ContactUs.vue';
import MessageUs from '@/components/MessageUs.vue'

export default {
  components: {
    MessageUs,
    ContactUs
  }
}
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  background: #f8f9fa;
}

/* Hero Section */
.contact-hero {
  position: relative;
  background: linear-gradient(135deg, #091D35 0%, #1a3a5c 100%);
  height: 45vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.contact-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.5;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}

.hero-content {
  position: relative;
  text-align: center;
  z-index: 2;
  padding: 0 2rem;
  animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.hero-content p {
  font-size: 1.3rem;
  opacity: 0.95;
  max-width: 600px;
  margin: 0 auto;
}

/* Main Content */
.contact-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

/* Quick Info Cards */
.quick-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: -4rem;
  margin-bottom: 4rem;
  position: relative;
  z-index: 10;
}

.info-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.icon-wrapper {
  background: linear-gradient(135deg, #f6c46d 0%, #ce9833 100%);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 28px;
}

.info-card h3 {
  color: #091D35;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.info-card p {
  color: #666;
  font-size: 0.95rem;
}

/* Section Headers */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  color: #091D35;
  font-size: 2.2rem;
  margin-bottom: 0.8rem;
  position: relative;
  display: inline-block;
}

.section-header h2::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(135deg, #f6c46d 0%, #ce9833 100%);
  border-radius: 2px;
}

.section-header p {
  color: #666;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 1.5rem auto 0;
}

/* Form Section */
.form-section {
  margin-bottom: 5rem;
}

/* Contact Info Section */
.contact-info-section {
  margin-bottom: 5rem;
}

/* Why Choose Us Section */
.why-choose-us {
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.why-choose-us h2 {
  color: #091D35;
  font-size: 2rem;
  margin-bottom: 3rem;
  position: relative;
  display: inline-block;
}

.why-choose-us h2::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(135deg, #f6c46d 0%, #ce9833 100%);
  border-radius: 2px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2.5rem;
  margin-top: 2rem;
}

.feature-item {
  padding: 1.5rem;
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
}

.feature-item i {
  font-size: 3rem;
  color: #f6c46d;
  margin-bottom: 1rem;
}

.feature-item h4 {
  color: #091D35;
  margin-bottom: 0.8rem;
  font-size: 1.1rem;
}

.feature-item p {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Tablet Styles */
@media (max-width: 1024px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }

  .hero-content p {
    font-size: 1.1rem;
  }

  .section-header h2 {
    font-size: 2rem;
  }

  .contact-content {
    padding: 2.5rem 1.5rem;
  }
}

/* Mobile Styles */
@media (max-width: 768px) {
  .contact-hero {
    height: 35vh;
  }

  .hero-content h1 {
    font-size: 2rem;
  }

  .hero-content p {
    font-size: 1rem;
  }

  .contact-content {
    padding: 2rem 1rem;
  }

  .quick-info {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: -3rem;
  }

  .section-header {
    margin-bottom: 2rem;
  }

  .section-header h2 {
    font-size: 1.8rem;
  }

  .section-header p {
    font-size: 1rem;
  }

  .form-section,
  .contact-info-section {
    margin-bottom: 3rem;
  }

  .why-choose-us {
    padding: 2rem 1.5rem;
  }

  .why-choose-us h2 {
    font-size: 1.6rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .feature-item i {
    font-size: 2.5rem;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .contact-hero {
    height: 30vh;
  }

  .hero-content h1 {
    font-size: 1.6rem;
  }

  .hero-content p {
    font-size: 0.9rem;
  }

  .contact-content {
    padding: 1.5rem 0.5rem;
  }

  .icon-wrapper {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }

  .info-card {
    padding: 1.5rem;
  }

  .section-header h2 {
    font-size: 1.5rem;
  }

  .why-choose-us {
    padding: 1.5rem 1rem;
  }

  .why-choose-us h2 {
    font-size: 1.4rem;
    margin-bottom: 2rem;
  }
}
</style>