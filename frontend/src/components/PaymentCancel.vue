<template>
  <div class="payment-cancel">
    <div class="cancel-container">
      <div class="cancel-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
        </svg>
      </div>
      
      <h1>Payment Cancelled</h1>
      <p class="subtitle">Your payment was not completed, but your booking is still reserved.</p>
      
      <div class="info-box">
        <h3>🔒 Your Booking is Still Secure</h3>
        <p>Don't worry! Your booking hasn't been lost. You can complete payment anytime using your booking reference.</p>
        
        <div v-if="bookingRef" class="booking-ref-display">
          <strong>Your Booking Reference: </strong>
          <span class="booking-ref">{{ bookingRef }}</span>
        </div>
      </div>
      
      <div class="options">
        <h3>What would you like to do next?</h3>
        
        <div class="option-cards">
          <div class="option-card">
            <div class="option-icon">💳</div>
            <h4>Pay Now</h4>
            <p>Complete your payment immediately</p>
            <button @click="retryPayment" class="btn btn-primary">
              Pay Now
            </button>
          </div>
          
          <div class="option-card">
            <div class="option-icon">📋</div>
            <h4>Manage Booking</h4>
            <p>View, modify, or pay later</p>
            <button @click="goToBookings" class="btn btn-secondary">
              Manage Booking
            </button>
          </div>
          
          <div class="option-card">
            <div class="option-icon">🏠</div>
            <h4>Continue Browsing</h4>
            <p>Return to homepage</p>
            <button @click="goHome" class="btn btn-outline">
              Go Home
            </button>
          </div>
        </div>
      </div>
      
      <div class="help-section">
        <p><strong>Need Help?</strong></p>
        <p>If you experienced any issues during payment, please contact our support team. We're here to help!</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'PaymentCancel',
  setup() {
    const router = useRouter()
    const route = useRoute()
    return { router, route }
  },
  
  data() {
    return {
      bookingRef: null
    }
  },
  
  mounted() {
    // Get booking reference from URL query or localStorage
    this.bookingRef = this.route.query.booking_ref || 
                     JSON.parse(localStorage.getItem('checkoutData') || '{}')?.bookingRef
  },
  
  methods: {
    async retryPayment() {
      if (this.bookingRef) {
        // Navigate to bookings page where they can pay
        this.router.push({
          path: '/bookings',
          query: { ref: this.bookingRef, action: 'pay' }
        })
      } else {
        // If no booking ref, go to bookings lookup
        this.router.push('/bookings')
      }
    },
    
    goToBookings() {
      if (this.bookingRef) {
        this.router.push({
          path: '/bookings',
          query: { ref: this.bookingRef }
        })
      } else {
        this.router.push('/bookings')
      }
    },
    
    goHome() {
      this.router.push('/')
    }
  }
}
</script>

<style scoped>
.payment-cancel {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.cancel-container {
  text-align: center;
  background: white;
  border-radius: 16px;
  padding: 3rem 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.cancel-icon {
  color: #f59e0b;
  margin-bottom: 1.5rem;
}

h1 {
  color: #1f2937;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 700;
}

.subtitle {
  color: #6b7280;
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.info-box {
  background: #fffbeb;
  border: 1px solid #fed7aa;
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  text-align: left;
}

.info-box h3 {
  color: #92400e;
  margin-bottom: 1rem;
  text-align: center;
}

.info-box p {
  color: #92400e;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.booking-ref-display {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #fed7aa;
  text-align: center;
  margin-top: 1rem;
}

.booking-ref {
  font-family: 'Courier New', monospace;
  font-weight: 700;
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  color: #1f2937;
}

.options {
  margin: 2.5rem 0;
}

.options h3 {
  color: #1f2937;
  margin-bottom: 2rem;
}

.option-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.option-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 2rem 1.5rem;
  transition: all 0.2s;
}

.option-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

.option-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.option-card h4 {
  color: #1f2937;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.option-card p {
  color: #6b7280;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.4;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
  width: 100%;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn-outline {
  background: transparent;
  border: 2px solid #d1d5db;
  color: #6b7280;
}

.btn-outline:hover {
  border-color: #9ca3af;
  color: #374151;
  background: #f9fafb;
}

.help-section {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
  color: #0c4a6e;
}

.help-section p {
  margin: 0.5rem 0;
  line-height: 1.5;
}

.help-section p:first-child {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .payment-cancel {
    padding: 1rem;
    margin: 1rem auto;
  }
  
  .cancel-container {
    padding: 2rem 1.5rem;
  }
  
  .option-cards {
    grid-template-columns: 1fr;
  }
  
  .info-box {
    padding: 1.5rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .option-card {
    padding: 1.5rem 1rem;
  }
}
</style>