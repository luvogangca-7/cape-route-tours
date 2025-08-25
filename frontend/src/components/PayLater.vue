<template>
  <div class="pay-later-form">
    <div class="form-header">
      <h2>💳 Complete Your Payment</h2>
      <p class="form-subtitle">Enter your booking reference to pay</p>
    </div>

    <div class="form-body">
      <div class="form-group">
        <label for="bookingRef">Booking Reference:</label>
        <input 
          id="bookingRef"
          v-model="bookingRef" 
          placeholder="e.g., CRT-ABC12345" 
          required 
          class="form-input"
          @input="validateBookingRef"
          :class="{ 'error': errors.bookingRef }"
        />
        <span v-if="errors.bookingRef" class="error-message">{{ errors.bookingRef }}</span>
      </div>

      <div class="form-group">
        <label for="email">Email Address:</label>
        <input 
          id="email"
          v-model="email" 
          type="email" 
          placeholder="your@email.com" 
          required 
          class="form-input"
          @input="validateEmail"
          :class="{ 'error': errors.email }"
        />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>

      <!-- Booking Details Display -->
      <div v-if="bookingDetails" class="booking-details">
        <h3>Booking Details</h3>
        <div class="detail-row">
          <span class="label">Package:</span>
          <span class="value">{{ bookingDetails.package.packageName }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Customer:</span>
          <span class="value">{{ bookingDetails.customer.name }}</span>
        </div>
        <div class="detail-row">
          <span class="label">People:</span>
          <span class="value">{{ bookingDetails.numberOfPeople }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Status:</span>
          <span class="value" :class="statusClass">{{ bookingDetails.status.toUpperCase() }}</span>
        </div>
        <div class="detail-row total">
          <span class="label">Total Amount:</span>
          <span class="value">R{{ bookingDetails.totalPrice }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="button-group">
        <button 
          v-if="!bookingDetails"
          @click="findBooking" 
          :disabled="loadingFind || hasValidationErrors" 
          class="find-btn"
        >
          <span v-if="!loadingFind">Find Booking</span>
          <span v-else>Searching...</span>
          <svg v-if="!loadingFind" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </button>

        <button 
          v-if="bookingDetails && canPay"
          @click="proceedToPayment" 
          :disabled="loadingPayment" 
          class="pay-btn"
        >
          <span v-if="!loadingPayment">Pay Now - R{{ bookingDetails.totalPrice }}</span>
          <span v-else>Creating Checkout...</span>
          <svg v-if="!loadingPayment" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H2zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7z"/>
          </svg>
        </button>

        <div v-if="bookingDetails && !canPay" class="status-message">
          <p v-if="bookingDetails.status === 'paid'" class="success-message">
            ✅ This booking has already been paid for!
          </p>
          <p v-if="bookingDetails.status === 'cancelled'" class="error-message">
            ❌ This booking has been cancelled.
          </p>
        </div>
      </div>

      <!-- Reset Button -->
      <button 
        v-if="bookingDetails" 
        @click="resetForm" 
        class="reset-btn"
      >
        Search Another Booking
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const bookingRef = ref('')
const email = ref('')
const bookingDetails = ref(null)
const loadingFind = ref(false)
const loadingPayment = ref(false)

const errors = ref({
  bookingRef: '',
  email: ''
})

const validateBookingRef = () => {
  const ref = bookingRef.value.trim().toUpperCase()
  if (!ref) {
    errors.value.bookingRef = 'Booking reference is required'
  } else if (!/^CRT-[A-Z0-9]{8}$/.test(ref)) {
    errors.value.bookingRef = 'Invalid format. Should be like: CRT-ABC12345'
  } else {
    errors.value.bookingRef = ''
    // Auto-format the input
    bookingRef.value = ref
  }
}

const validateEmail = () => {
  const emailValue = email.value.trim()
  if (!emailValue) {
    errors.value.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
    errors.value.email = 'Please enter a valid email'
  } else {
    errors.value.email = ''
  }
}

const hasValidationErrors = computed(() => {
  return Object.values(errors.value).some(error => error !== '') ||
         !bookingRef.value.trim() ||
         !email.value.trim()
})

const canPay = computed(() => {
  return bookingDetails.value && 
         bookingDetails.value.status === 'pending'
})

const statusClass = computed(() => {
  if (!bookingDetails.value) return ''
  
  switch (bookingDetails.value.status) {
    case 'paid': return 'status-paid'
    case 'pending': return 'status-pending'
    case 'cancelled': return 'status-cancelled'
    default: return ''
  }
})

const findBooking = async () => {
  validateBookingRef()
  validateEmail()
  
  if (hasValidationErrors.value) {
    alert('Please correct the errors in the form')
    return
  }

  loadingFind.value = true

  try {
    const response = await fetch(`http://localhost:5000/api/bookings/${bookingRef.value}?email=${encodeURIComponent(email.value)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Booking not found')
    }

    const data = await response.json()
    bookingDetails.value = data.booking

  } catch (error) {
    console.error('Find booking error:', error)
    alert(error.message || 'Failed to find booking')
    bookingDetails.value = null
  } finally {
    loadingFind.value = false
  }
}

const proceedToPayment = async () => {
  if (!bookingDetails.value) return

  loadingPayment.value = true

  try {
    const response = await fetch(`http://localhost:5000/api/bookings/${bookingRef.value}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value.trim()
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create checkout session')
    }

    const data = await response.json()
    
    // Redirect to Stripe checkout
    window.location.href = data.checkoutUrl

  } catch (error) {
    console.error('Payment error:', error)
    alert(error.message || 'Failed to proceed to payment')
  } finally {
    loadingPayment.value = false
  }
}

const resetForm = () => {
  bookingRef.value = ''
  email.value = ''
  bookingDetails.value = null
  errors.value = {
    bookingRef: '',
    email: ''
  }
}

// Check for booking reference in URL or localStorage on mount
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
  // Check URL parameters
  if (route.query.booking_ref) {
    bookingRef.value = route.query.booking_ref
  } else {
    // Check localStorage
    const savedRef = localStorage.getItem('lastBookingRef')
    if (savedRef) {
      bookingRef.value = savedRef
    }
  }
})
</script>

<style scoped>
.pay-later-form {
  max-width: 500px;
  margin: 30px auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(9, 29, 53, 0.15);
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.form-header {
  background: #091d35;
  color: white;
  padding: 25px;
  text-align: center;
}

.form-header h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.form-subtitle {
  margin: 8px 0 0;
  color: rgb(246, 196, 109);
  font-size: 1rem;
}

.form-body {
  padding: 25px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #091d35;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8fafc;
  color: #091d35;
}

.form-input.error {
  border-color: #ff4444;
}

.form-input:focus {
  outline: none;
  border-color: rgb(246, 196, 109);
  box-shadow: 0 0 0 3px rgba(246, 196, 109, 0.2);
}

.booking-details {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  margin: 25px 0;
  border: 1px solid #e2e8f0;
}

.booking-details h3 {
  margin: 0 0 15px;
  color: #091d35;
  font-size: 1.2rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e2e8f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row.total {
  font-weight: 600;
  font-size: 1.1rem;
  border-top: 2px solid #e2e8f0;
  padding-top: 12px;
  margin-top: 8px;
}

.label {
  color: #64748b;
}

.value {
  color: #091d35;
  font-weight: 500;
}

.status-paid { color: #059669; }
.status-pending { color: #d97706; }
.status-cancelled { color: #dc2626; }

.button-group {
  margin: 25px 0;
}

.find-btn, .pay-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  margin-bottom: 10px;
}

.find-btn {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
  box-shadow: 0 4px 6px rgba(107, 114, 128, 0.1);
}

.find-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
  transform: translateY(-2px);
}

.pay-btn {
  background: linear-gradient(135deg, #091d35 0%, #0a2647 100%);
  color: white;
  box-shadow: 0 4px 6px rgba(9, 29, 53, 0.1);
}

.pay-btn:hover:not(:disabled) {
  background: rgb(246, 196, 109);
  color: #091d35;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(246, 196, 109, 0.3);
}

.find-btn:disabled, .pay-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.reset-btn {
  width: 100%;
  padding: 12px;
  background: transparent;
  color: #64748b;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #475569;
}

.status-message {
  text-align: center;
  padding: 15px;
  border-radius: 8px;
  margin: 10px 0;
}

.success-message {
  background: #d1fae5;
  color: #065f46;
  margin: 0;
}

.error-message {
  background: #fee2e2;
  color: #991b1b;
  margin: 0;
}

@media (max-width: 480px) {
  .pay-later-form {
    margin: 15px;
    border-radius: 12px;
  }
  
  .form-header, .form-body {
    padding: 20px;
  }

  .detail-row {
    flex-direction: column;
    gap: 4px;
  }
}
</style>