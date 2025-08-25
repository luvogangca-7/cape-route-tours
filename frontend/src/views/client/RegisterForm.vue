<template>
  <form @submit.prevent="submitForm" class="register-form">
    <div class="form-header">
      <h2>Enter Your Details</h2>
      <p class="form-subtitle">Complete your booking information</p>
    </div>

    <div class="form-body">
      <div class="form-group">
        <input 
          v-model="form.firstName" 
          placeholder="First Name" 
          required 
          class="form-input"
          @input="validateName('firstName')"
        />
        <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
      </div>

      <div class="form-group">
        <input 
          v-model="form.lastName" 
          placeholder="Last Name" 
          required 
          class="form-input"
          @input="validateName('lastName')"
        />
        <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
      </div>

      <div class="form-group">
        <input 
          v-model="form.email" 
          type="email" 
          placeholder="Email" 
          required 
          class="form-input"
          @input="validateEmail"
        />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <input 
          v-model="form.phone" 
          type="tel" 
          placeholder="Phone Number" 
          required 
          class="form-input"
          @input="validatePhone"
        />
        <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
      </div>

      <!-- Action buttons -->
      <div class="button-group">
        <button 
          type="button"
          @click="createBookingOnly" 
          :disabled="loading || hasErrors" 
          class="book-only-btn"
        >
          <span v-if="!loadingBookingOnly">Book Now, Pay Later</span>
          <span v-else>Creating Booking...</span>
          <svg v-if="!loadingBookingOnly" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
        </button>

        <button 
          :disabled="loading || hasErrors" 
          class="submit-btn"
          type="submit"
        >
          <span v-if="!loading">Book & Pay Now</span>
          <span v-else>Processing...</span>
          <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H2zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7z"/>
            <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" class="spinner">
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm0 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2z"/>
            <path d="M8 0a8 8 0 0 1 8 8h-2a6 6 0 0 0-6-6V0z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Booking Success Modal -->
    <div v-if="showBookingSuccess" class="modal-overlay" @click="closeBookingModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>🎉 Booking Created Successfully!</h3>
        </div>
        <div class="modal-body">
          <p><strong>Booking Reference:</strong> {{ createdBookingRef }}</p>
          <p>Your booking has been created. You can pay now or later using your booking reference.</p>
          <div class="modal-actions">
            <button @click="payNow" class="pay-now-btn">Pay Now</button>
            <button @click="payLater" class="pay-later-btn">Pay Later</button>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const loadingBookingOnly = ref(false)
const showBookingSuccess = ref(false)
const createdBookingRef = ref('')

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

const validateName = (field) => {
  const value = form[field].trim()
  if (!value) {
    errors[field] = 'This field is required'
  } else if (!/^[A-Za-z\s-]+$/.test(value)) {
    errors[field] = 'Only letters, spaces and hyphens allowed'
  } else {
    errors[field] = ''
  }
}

const validateEmail = () => {
  const email = form.email.trim()
  if (!email) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email'
  } else {
    errors.email = ''
  }
}

const validatePhone = () => {
  const phone = form.phone.trim()
  if (!phone) {
    errors.phone = 'Phone number is required'
  } else if (!/^[\d\s+-]+$/.test(phone)) {
    errors.phone = 'Only numbers, spaces, + and - allowed'
  } else {
    errors.phone = ''
  }
}

const hasErrors = computed(() => {
  return Object.values(errors).some(error => error !== '') ||
         Object.values(form).some(field => !field.trim())
})

const validateAllFields = () => {
  validateName('firstName')
  validateName('lastName')
  validateEmail()
  validatePhone()
  
  return !hasErrors.value
}

const createBookingPayload = () => {
  const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails'))
  
  console.log('Raw bookingDetails from localStorage:', bookingDetails);
  
  if (!bookingDetails) {
    throw new Error('No booking found. Please book a tour first.')
  }

  // Extract dates based on booking type
  let dates = [];
  if (bookingDetails.bookingType === 'single' && bookingDetails.tours) {
    dates = [bookingDetails.tours[0].date];
  } else if (bookingDetails.bookingType === 'duo' && bookingDetails.tours) {
    dates = bookingDetails.tours.map(tour => tour.date);
  } else if (bookingDetails.tours) {
    // For full package
    dates = bookingDetails.tours.map(t => t.date);
  }

  console.log('Extracted dates:', dates);

  // Create the structured bookingDetails object that the backend expects
  const structuredBookingDetails = {
    packageName: bookingDetails.packageName || 'Tour Package',
    bookingType: bookingDetails.bookingType || 'single',
    townships: bookingDetails.tours ? bookingDetails.tours.map(t => t.township || t.name) : [],
    dates: dates,
    tours: bookingDetails.tours || []
  };

  console.log('Structured booking details:', structuredBookingDetails);

  const payload = {
    full_name: `${form.firstName.trim()} ${form.lastName.trim()}`,
    email: form.email.trim(),
    phone: form.phone.trim(),
    packageId: bookingDetails.packageId,
    number_of_people: bookingDetails.people,
    totalPrice: bookingDetails.total,
    bookingDetails: structuredBookingDetails
  };

  console.log('Final payload:', payload);
  
  return payload;
}

// Create booking only (pay later option)
const createBookingOnly = async () => {
  if (!validateAllFields()) {
    alert('Please correct the errors in the form')
    return
  }

  loadingBookingOnly.value = true

  try {
    const payload = createBookingPayload()
    
    const response = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Booking failed')
    }

    const data = await response.json()
    
    // Store booking reference
    createdBookingRef.value = data.bookingRef
    localStorage.setItem('lastBookingRef', data.bookingRef)
    
    // Show success modal
    showBookingSuccess.value = true

  } catch (error) {
    console.error('Booking error:', error)
    alert(error.message || 'An error occurred during booking')
    
    if (error.message.includes('No booking found')) {
      router.push('/')
    }
  } finally {
    loadingBookingOnly.value = false
  }
}

// Create booking and proceed to payment
const submitForm = async () => {
  if (!validateAllFields()) {
    alert('Please correct the errors in the form')
    return
  }

  // Store customer data for fallback
  localStorage.setItem('customerFirstName', form.firstName);
  localStorage.setItem('customerLastName', form.lastName);
  localStorage.setItem('customerEmail', form.email);
  localStorage.setItem('customerPhone', form.phone);

  loading.value = true

  try {
    // First create the booking
    const payload = createBookingPayload()
    
    const bookingResponse = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!bookingResponse.ok) {
      const errorData = await bookingResponse.json()
      throw new Error(errorData.error || 'Booking failed')
    }

    const bookingData = await bookingResponse.json()
    
    // Then create checkout session
    const checkoutResponse = await fetch(`http://localhost:5000/api/bookings/${bookingData.bookingRef}/checkout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: form.email.trim()
      })
    })

    if (!checkoutResponse.ok) {
      const errorData = await checkoutResponse.json()
      throw new Error(errorData.error || 'Checkout failed')
    }

    const checkoutData = await checkoutResponse.json()
    
    // Store the checkout information
    localStorage.setItem('checkoutData', JSON.stringify({
      checkoutUrl: checkoutData.checkoutUrl,
      bookingRef: bookingData.bookingRef
    }))
    
    // Redirect to Stripe checkout
    window.location.href = checkoutData.checkoutUrl

  } catch (error) {
    console.error('Booking and payment error:', error)
    alert(error.message || 'An error occurred during booking')
    
    if (error.message.includes('No booking found')) {
      router.push('/')
    }
  } finally {
    loading.value = false
  }
}

// Modal actions
const payNow = async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/bookings/${createdBookingRef.value}/checkout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: form.email.trim()
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Checkout failed')
    }

    const data = await response.json()
    window.location.href = data.checkoutUrl

  } catch (error) {
    alert(error.message || 'Failed to create checkout session')
  }
}

const payLater = () => {
  showBookingSuccess.value = false
  router.push('/')
}

const closeBookingModal = () => {
  showBookingSuccess.value = false
}
</script>

<style scoped>
.register-form {
  max-width: 450px;
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
  position: relative;
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

.form-input::placeholder {
  color: #94a3b8;
}

.form-input:focus {
  outline: none;
  border-color: rgb(246, 196, 109);
  box-shadow: 0 0 0 3px rgba(246, 196, 109, 0.2);
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.book-only-btn {
  flex: 1;
  padding: 16px;
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(107, 114, 128, 0.1);
}

.book-only-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
  transform: translateY(-1px);
}

.submit-btn {
  flex: 1;
  padding: 16px;
  background: linear-gradient(135deg, #091d35 0%, #0a2647 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(9, 29, 53, 0.1);
}

.submit-btn:hover:not(:disabled) {
  background: rgb(246, 196, 109);
  color: #091d35;
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(246, 196, 109, 0.3);
}

.submit-btn:disabled, .book-only-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal-header h3 {
  margin: 0 0 20px;
  color: #091d35;
  font-size: 1.5rem;
}

.modal-body p {
  margin: 10px 0;
  color: #64748b;
  line-height: 1.5;
}

.modal-body strong {
  color: #091d35;
  font-size: 1.1rem;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 25px;
}

.pay-now-btn, .pay-later-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pay-now-btn {
  background: linear-gradient(135deg, #091d35 0%, #0a2647 100%);
  color: white;
}

.pay-now-btn:hover {
  background: rgb(246, 196, 109);
  color: #091d35;
}

.pay-later-btn {
  background: #f1f5f9;
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.pay-later-btn:hover {
  background: #e2e8f0;
  color: #475569;
}

.error-message {
  color: #ff4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

@media (max-width: 480px) {
  .register-form {
    margin: 15px;
    border-radius: 12px;
  }
  
  .form-header, .form-body {
    padding: 20px;
  }

  .button-group {
    flex-direction: column;
  }

  .modal-content {
    padding: 25px 20px;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>