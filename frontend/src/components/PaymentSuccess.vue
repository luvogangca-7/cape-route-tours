<template>
  <div class="payment-success">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Processing your payment confirmation...</p>
    </div>

    <div v-if="!loading && paymentConfirmed" class="success-container">
      <div class="success-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
        </svg>
      </div>
      
      <h1>🎉 Payment Successful!</h1>
      <p class="subtitle">Your booking has been confirmed and paid.</p>
      
      <div class="booking-summary" v-if="bookingDetails">
        <h3>Booking Confirmation</h3>
        <div class="detail-row">
          <span class="label">Booking Reference:</span>
          <span class="value booking-ref">{{ bookingDetails.reference }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Package:</span>
          <span class="value">{{ bookingDetails.packageName }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Amount Paid:</span>
          <span class="value price">R{{ bookingDetails.totalPrice }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Status:</span>
          <span class="value status-paid">Paid & Confirmed</span>
        </div>
      </div>
      
      <div class="next-steps">
        <h3>What's Next?</h3>
        <ul>
          <li>📧 You'll receive a confirmation email shortly with tour details</li>
          <li>📍 Meeting point and time will be sent 24 hours before your tour</li>
          <li>🆔 Please bring valid ID (passport or driving license)</li>
          <li>📱 Save your booking reference: <strong>{{ bookingRef }}</strong></li>
        </ul>
      </div>
      
      <div class="actions">
        <button @click="goToBookings" class="btn btn-primary">
          📋 Manage My Booking
        </button>
        <button @click="goHome" class="btn btn-secondary">
          🏠 Return Home
        </button>
      </div>
    </div>

    <div v-if="!loading && !paymentConfirmed" class="error-container">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
        </svg>
      </div>
      
      <h1>❌ Payment Confirmation Failed</h1>
      <p class="subtitle">We couldn't confirm your payment at this time.</p>
      
      <div class="error-message">
        <p>{{ errorMessage || 'There was an issue processing your payment confirmation. Please contact us if money was deducted from your account.' }}</p>
      </div>
      
      <div class="actions">
        <button @click="goToBookings" class="btn btn-primary">
          📋 Check My Bookings
        </button>
        <button @click="goHome" class="btn btn-secondary">
          🏠 Return Home
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'PaymentSuccess',
  setup() {
    const router = useRouter()
    const route = useRoute()
    return { router, route }
  },
  
  data() {
    return {
      loading: true,
      paymentConfirmed: false,
      bookingDetails: null,
      bookingRef: null,
      errorMessage: null
    }
  },
  
  async mounted() {
    await this.confirmPayment()
  },
  
  methods: {
    async confirmPayment() {
      try {
        const sessionId = this.route.query.session_id
        const bookingRef = this.route.query.booking_ref
        
        if (!sessionId) {
          throw new Error('No payment session ID provided')
        }
        
        console.log('Confirming payment for session:', sessionId)
        
        // Call your existing payment confirmation endpoint
        const response = await axios.post('http://localhost:5000/api/checkout/confirm-payment', {
          session_id: sessionId
        })
        
        if (response.data.success) {
          this.paymentConfirmed = true
          this.bookingRef = response.data.bookingRef || bookingRef
          
          // Extract booking details from response
          if (response.data.booking) {
            this.bookingDetails = {
              reference: response.data.booking.reference || response.data.bookingRef,
              packageName: response.data.booking.package?.packageName || 'Tour Package',
              totalPrice: response.data.booking.totalPrice || 0
            }
          }
          
          // Clear any stored checkout data
          localStorage.removeItem('checkoutData')
          
          console.log('Payment confirmed successfully')
        } else {
          throw new Error(response.data.message || 'Payment confirmation failed')
        }
        
      } catch (error) {
        console.error('Payment confirmation error:', error)
        this.paymentConfirmed = false
        this.errorMessage = error.response?.data?.message || error.message || 'Payment confirmation failed'
      } finally {
        this.loading = false
      }
    },
    
    goToBookings() {
      // Navigate to bookings page with the booking reference if available
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
.payment-success {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.loading-container {
  text-align: center;
  padding: 3rem 2rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1e3a8a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  color: #6b7280;
  font-size: 1.1rem;
}

.success-container, .error-container {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.success-icon {
  color: #10b981;
  margin-bottom: 1.5rem;
}

.error-icon {
  color: #ef4444;
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

.booking-summary {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  text-align: left;
}

.booking-summary h3 {
  color: #1e3a8a;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  text-align: center;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.label {
  color: #6b7280;
  font-weight: 500;
}

.value {
  color: #1f2937;
  font-weight: 600;
}

.booking-ref {
  font-family: 'Courier New', monospace;
  background: #e2e8f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.95rem;
}

.price {
  color: #10b981;
  font-size: 1.1rem;
}

.status-paid {
  color: #10b981;
  background: #d1fae5;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.9rem;
}

.next-steps {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  text-align: left;
}

.next-steps h3 {
  color: #0c4a6e;
  margin-bottom: 1rem;
  text-align: center;
}

.next-steps ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.next-steps li {
  padding: 0.5rem 0;
  color: #0c4a6e;
  line-height: 1.5;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 2rem 0;
  color: #991b1b;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2.5rem;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
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

/* Responsive Design */
@media (max-width: 768px) {
  .payment-success {
    padding: 1rem;
    margin: 1rem auto;
  }
  
  .success-container, .error-container {
    padding: 1.5rem;
  }
  
  .booking-summary, .next-steps, .error-message {
    padding: 1.5rem;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
  
  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
}
</style>