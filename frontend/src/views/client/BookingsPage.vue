<template>
  <div class="booking-management">
    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p>{{ loadingMessage }}</p>
    </div>

    <!-- Booking Lookup Form -->
    <div v-if="!currentBooking" class="booking-lookup">
      <div class="lookup-container">
        <h2>Manage Your Bookings</h2>
        <p>Enter your booking details below to view, modify, cancel, or pay for your reservation.</p>
        
        <form @submit.prevent="lookupBooking" class="lookup-form">
          <div class="form-group">
            <label for="email">Email Address:</label>
            <input 
              id="email"
              v-model="lookupForm.email" 
              type="email" 
              required
              :disabled="loading"
              class="form-control"
              placeholder="Enter your email address"
              autocomplete="email"
            />
          </div>
          
          <div class="form-group">
            <label for="bookingRef">Booking Reference:</label>
            <input 
              id="bookingRef"
              v-model="lookupForm.bookingRef" 
              type="text" 
              required
              :disabled="loading"
              class="form-control"
              placeholder="CRT-ABC12345"
              style="text-transform: uppercase;"
              maxlength="12"
              @input="formatBookingRef"
            />
            <small>Format: CRT-ABC12345 (e.g., CRT-H7K9M2N5)</small>
          </div>
          
          <button 
            type="submit" 
            :disabled="loading || !isFormValid"
            class="btn btn-primary btn-view-booking"
          >
            {{ loading ? 'Searching...' : 'Find My Booking' }}
          </button>
        </form>
        
        <!-- Error Message -->
        <div v-if="error" class="alert alert-error">
          <strong>⚠️ {{ error }}</strong>
        </div>

        <!-- Help Text -->
        <div class="help-text">
          <p><strong>Need help?</strong></p>
          <ul>
            <li>Your booking reference was sent to your email when you booked</li>
            <li>Make sure to use the same email address you used when booking</li>
            <li>Booking references follow the format: CRT-ABC12345</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Booking Details Display -->
    <div v-if="currentBooking && !showModifyForm && !showCancelForm" class="booking-details">
      <div class="booking-header">
        <h2>Your Booking Details</h2>
        <button @click="goBack" class="btn btn-secondary btn-back">
          ← Look Up Another Booking
        </button>
      </div>
      
      <div class="booking-card">
        <div class="booking-info">
          <h3>{{ currentBooking.packageName }}</h3>
          
          <div class="info-grid">
            <div class="info-item">
              <strong>Booking Reference:</strong>
              <span class="booking-ref">{{ currentBooking.bookingId }}</span>
            </div>
            <div class="info-item">
              <strong>Status:</strong>
              <span :class="['status', currentBooking.status.toLowerCase()]">
                {{ formatStatus(currentBooking.status) }}
              </span>
            </div>
            <div class="info-item">
              <strong>Customer Name:</strong>
              <span>{{ currentBooking.customerName }}</span>
            </div>
            <div class="info-item">
              <strong>Email:</strong>
              <span>{{ currentBooking.email }}</span>
            </div>
            <div class="info-item">
              <strong>Phone:</strong>
              <span>{{ currentBooking.phone }}</span>
            </div>
            <div class="info-item">
              <strong>Tour Date:</strong>
              <span class="tour-date">{{ formatDate(currentBooking.tourDate) }}</span>
            </div>
            <div class="info-item">
              <strong>Number of People:</strong>
              <span>{{ currentBooking.numberOfPeople }}</span>
            </div>
            <div class="info-item">
              <strong>Total Amount:</strong>
              <span class="price">R{{ currentBooking.totalAmount.toLocaleString() }}</span>
            </div>
            <div class="info-item">
              <strong>Booked On:</strong>
              <span>{{ formatDate(currentBooking.createdAt) }}</span>
            </div>
            <div v-if="currentBooking.townships && currentBooking.townships.length > 0" class="info-item">
              <strong>Township(s):</strong>
              <span>{{ currentBooking.townships.join(', ') }}</span>
            </div>
            <div v-if="currentBooking.specialRequests" class="info-item full-width">
              <strong>Special Requests:</strong>
              <span>{{ currentBooking.specialRequests }}</span>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="booking-actions">
          <!-- Pay Now Button - Show if booking is pending and can be paid -->
          <button 
            v-if="currentBooking.canPay && currentBooking.status === 'pending'"
            @click="payNow"
            :disabled="loading"
            class="btn btn-success btn-pay-now"
          >
            <span v-if="!loadingPayment">💳 Pay Now</span>
            <span v-else>Processing Payment...</span>
          </button>
          
          <button 
            v-if="currentBooking.canModify && currentBooking.status !== 'cancelled'"
            @click="showModifyForm = true"
            class="btn btn-primary"
          >
            📝 Modify Booking
          </button>
          
          <button 
            v-if="currentBooking.canCancel && currentBooking.status !== 'cancelled'"
            @click="showCancelForm = true"
            class="btn btn-danger"
          >
            ❌ Cancel Booking
          </button>
          
          <div v-if="!currentBooking.canModify && !currentBooking.canCancel && !currentBooking.canPay && currentBooking.status !== 'cancelled'" class="modification-notice">
            <p><strong>ℹ️ Notice:</strong></p>
            <p>Modifications and cancellations are not available within 24-48 hours of your tour date. Please contact us directly for assistance.</p>
          </div>

          <!-- Payment Status Messages -->
          <div v-if="currentBooking.status === 'paid'" class="payment-success-notice">
            <p><strong>✅ Payment Completed</strong></p>
            <p>Your booking has been paid and confirmed. You will receive tour details closer to your date.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modify Booking Form -->
    <div v-if="showModifyForm" class="modify-booking">
      <div class="form-header">
        <h3>Modify Your Booking</h3>
        <button @click="closeModifyForm" class="btn btn-secondary">
          ← Back to Details
        </button>
      </div>
      
      <form @submit.prevent="modifyBooking" class="modify-form">
        <div class="form-group">
          <label for="tourDate">Tour Date:</label>
          <input 
            id="tourDate"
            v-model="modifyForm.tourDate" 
            type="date" 
            required
            :min="tomorrow"
            class="form-control"
          />
          <small>Select a new date for your tour (must be at least tomorrow)</small>
        </div>
        
        <div class="form-group">
          <label for="numberOfPeople">Number of People:</label>
          <input 
            id="numberOfPeople"
            v-model.number="modifyForm.numberOfPeople" 
            type="number" 
            min="1" 
            max="20"
            required
            class="form-control"
          />
          <small>Price will be recalculated: R{{ calculateNewPrice() }}</small>
        </div>
        
        <div class="form-group">
          <label for="specialRequests">Special Requests:</label>
          <textarea 
            id="specialRequests"
            v-model="modifyForm.specialRequests"
            class="form-control"
            rows="3"
            maxlength="500"
            placeholder="Dietary requirements, accessibility needs, special occasions, etc."
          ></textarea>
          <small>{{ modifyForm.specialRequests.length }}/500 characters</small>
        </div>
        
        <div class="form-actions">
          <button type="submit" :disabled="loading || !isModifyFormValid" class="btn btn-primary">
            {{ loading ? 'Updating...' : 'Update Booking' }}
          </button>
          <button type="button" @click="closeModifyForm" class="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Cancel Booking Form -->
    <div v-if="showCancelForm" class="cancel-booking">
      <div class="form-header">
        <h3>Cancel Booking</h3>
        <button @click="showCancelForm = false" class="btn btn-secondary">
          ← Back to Details
        </button>
      </div>
      
      <div class="cancellation-warning">
        <p><strong>⚠️ Important:</strong> This action cannot be undone.</p>
        <p>You are about to cancel your booking for <strong>{{ currentBooking?.packageName }}</strong> on {{ formatDate(currentBooking?.tourDate) }}.</p>
        <p>Please review our cancellation policy regarding refunds.</p>
      </div>
      
      <form @submit.prevent="cancelBooking" class="cancel-form">
        <div class="form-group">
          <label for="cancellationReason">Reason for Cancellation (Optional):</label>
          <textarea 
            id="cancellationReason"
            v-model="cancelForm.reason"
            class="form-control"
            rows="3"
            maxlength="500"
            placeholder="Please let us know why you're cancelling. This helps us improve our service."
          ></textarea>
          <small>{{ cancelForm.reason.length }}/500 characters</small>
        </div>
        
        <div class="confirmation-checkbox">
          <label>
            <input type="checkbox" v-model="cancelForm.confirmed" required>
            I understand this action cannot be undone and I want to cancel my booking
          </label>
        </div>
        
        <div class="form-actions">
          <button 
            type="submit" 
            :disabled="loading || !cancelForm.confirmed" 
            class="btn btn-danger"
          >
            {{ loading ? 'Cancelling...' : 'Confirm Cancellation' }}
          </button>
          <button type="button" @click="showCancelForm = false" class="btn btn-secondary">
            Keep My Booking
          </button>
        </div>
      </form>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="alert alert-success">
      <strong>✅ {{ successMessage }}</strong>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'BookingManagement',
  data() {
    return {
      loading: false,
      loadingPayment: false,
      loadingMessage: 'Processing...',
      error: null,
      successMessage: null,
      currentBooking: null,
      accessToken: null,
      showModifyForm: false,
      showCancelForm: false,
      
      // Form data
      lookupForm: {
        email: '',
        bookingRef: ''
      },
      
      modifyForm: {
        tourDate: '',
        numberOfPeople: 1,
        specialRequests: ''
      },
      
      cancelForm: {
        reason: '',
        confirmed: false
      }
    }
  },
  
  computed: {
    tomorrow() {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      return tomorrow.toISOString().split('T')[0]
    },
    
    isFormValid() {
      return this.lookupForm.email.trim() && this.lookupForm.bookingRef.trim()
    },
    
    isModifyFormValid() {
      return this.modifyForm.tourDate && 
             this.modifyForm.numberOfPeople >= 1 && 
             this.modifyForm.numberOfPeople <= 20
    }
  },
  
  methods: {
    formatBookingRef() {
      // Auto-format booking ID for your format: CRT-ABC12345
      let value = this.lookupForm.bookingRef.replace(/[^A-Z0-9-]/g, '')
      
      // Remove any existing CRT- prefix to avoid duplication
      if (value.startsWith('CRT-')) {
        value = value.substring(4)
      }
      
      // Add CRT- prefix
      if (value.length > 0) {
        value = 'CRT-' + value.substring(0, 8) // Limit to 8 chars after CRT-
      }
      
      this.lookupForm.bookingRef = value.toUpperCase()
    },
    
    async lookupBooking() {
      this.clearMessages()
      this.loading = true
      this.loadingMessage = 'Searching for your booking...'
      
      try {
        // ✅ Use POST instead of GET
        const response = await axios.post('http://localhost:5000/api/booking-management/lookup', {
          email: this.lookupForm.email.trim(),
          bookingRef: this.lookupForm.bookingRef.trim()
        })
        
        if (response.data.success) {
          this.currentBooking = response.data.booking
          this.accessToken = response.data.accessToken
          this.populateModifyForm()
          console.log('Booking loaded successfully:', this.currentBooking)
        } else {
          this.error = response.data.message
        }
      } catch (error) {
        console.error('Booking lookup error:', error)
        console.error('Error response:', error.response?.data)
        if (error.response?.status === 404) {
          this.error = 'Booking not found. Please check your email and booking reference number.'
        } else if (error.response?.data?.message) {
          this.error = error.response.data.message
        } else {
          this.error = 'Unable to connect to server. Please check your internet connection and try again.'
        }
      } finally {
        this.loading = false
      }
    },

    // NEW: Pay Now functionality
async payNow() {
  this.clearMessages()
  this.loadingPayment = true
  this.loadingMessage = 'Creating payment session...'
  
  try {
    const response = await axios.post(`http://localhost:5000/api/booking-management/pay/${this.accessToken}`)
    
    if (response.data.success) {
      // Store checkout data for reference
      localStorage.setItem('checkoutData', JSON.stringify({
        checkoutUrl: response.data.checkoutUrl,
        bookingRef: response.data.bookingRef,
        sessionId: response.data.sessionId
      }))
      
      // Set flag to check payment status when returning
      localStorage.setItem('pendingPayment', 'true')
      
      console.log('Redirecting to Stripe checkout:', response.data.checkoutUrl)
      
      // Redirect to Stripe checkout
      window.location.href = response.data.checkoutUrl
    } else {
      this.error = response.data.message || 'Failed to create payment session'
    }
  } catch (error) {
    console.error('Payment creation error:', error)
    
    if (error.response?.status === 401) {
      this.error = 'Your session has expired. Please look up your booking again.'
      this.goBack()
    } else if (error.response?.status === 400) {
      this.error = error.response.data?.message || 'This booking cannot be paid at the moment.'
    } else if (error.response?.data?.message) {
      this.error = error.response.data.message
    } else {
      this.error = 'Unable to create payment session. Please try again.'
    }
  } finally {
    this.loadingPayment = false
    this.loading = false
  }
},
    
    async modifyBooking() {
      this.clearMessages()
      this.loading = true
      this.loadingMessage = 'Updating your booking...'
      
      try {
        const response = await axios.put(`http://localhost:5000/api/booking-management/modify/${this.accessToken}`, {
          tourDate: this.modifyForm.tourDate,
          numberOfPeople: parseInt(this.modifyForm.numberOfPeople),
          specialRequests: this.modifyForm.specialRequests.trim()
        })
        
        if (response.data.success) {
          this.currentBooking = response.data.booking
          this.showModifyForm = false
          this.successMessage = 'Booking updated successfully! You will receive a confirmation email shortly.'
          this.scrollToTop()
          
          // Clear success message after 5 seconds
          setTimeout(() => {
            this.successMessage = null
          }, 5000)
        } else {
          this.error = response.data.message
        }
      } catch (error) {
        console.error('Booking modification error:', error)
        if (error.response?.status === 401) {
          this.error = 'Your session has expired. Please look up your booking again.'
          this.goBack()
        } else if (error.response?.data?.message) {
          this.error = error.response.data.message
        } else {
          this.error = 'Unable to update booking. Please try again.'
        }
      } finally {
        this.loading = false
      }
    },
    
    async cancelBooking() {
      this.clearMessages()
      this.loading = true
      this.loadingMessage = 'Cancelling your booking...'
      
      try {
        const response = await axios.delete(`http://localhost:5000/api/booking-management/cancel/${this.accessToken}`, {
          data: { reason: this.cancelForm.reason.trim() }
        })
        
        if (response.data.success) {
          this.successMessage = 'Booking cancelled successfully. You will receive a confirmation email shortly.'
          this.showCancelForm = false
          
          // Update booking status locally
          if (this.currentBooking) {
            this.currentBooking.status = 'cancelled'
            this.currentBooking.canCancel = false
            this.currentBooking.canModify = false
            this.currentBooking.canPay = false
          }
          
          this.scrollToTop()
          
          // Redirect after 3 seconds
          setTimeout(() => {
            this.goBack()
          }, 3000)
        } else {
          this.error = response.data.message
        }
      } catch (error) {
        console.error('Booking cancellation error:', error)
        if (error.response?.status === 401) {
          this.error = 'Your session has expired. Please look up your booking again.'
          this.goBack()
        } else if (error.response?.data?.message) {
          this.error = error.response.data.message
        } else {
          this.error = 'Unable to cancel booking. Please try again.'
        }
      } finally {
        this.loading = false
      }
    },
    
    populateModifyForm() {
      if (this.currentBooking) {
        this.modifyForm.tourDate = this.currentBooking.tourDate.split('T')[0]
        this.modifyForm.numberOfPeople = this.currentBooking.numberOfPeople
        this.modifyForm.specialRequests = this.currentBooking.specialRequests || ''
      }
    },
    
    closeModifyForm() {
      this.showModifyForm = false
      this.populateModifyForm() // Reset form to original values
      this.clearMessages()
    },
    
    calculateNewPrice() {
      if (this.currentBooking && this.modifyForm.numberOfPeople) {
        const pricePerPerson = this.currentBooking.totalAmount / this.currentBooking.numberOfPeople
        return (pricePerPerson * this.modifyForm.numberOfPeople).toLocaleString()
      }
      return '0'
    },
    
    goBack() {
      this.currentBooking = null
      this.accessToken = null
      this.showModifyForm = false
      this.showCancelForm = false
      this.lookupForm.email = ''
      this.lookupForm.bookingRef = ''
      this.cancelForm.reason = ''
      this.cancelForm.confirmed = false
      this.clearMessages()
    },
    
    clearMessages() {
      this.error = null
      this.successMessage = null
    },
    
    formatDate(dateString) {
      const options = { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'Africa/Johannesburg'
      }
      return new Date(dateString).toLocaleDateString('en-ZA', options)
    },
    
    formatStatus(status) {
      const statusMap = {
        'confirmed': 'Confirmed',
        'pending': 'Pending Payment',
        'paid': 'Paid & Confirmed',
        'cancelled': 'Cancelled',
        'completed': 'Completed'
      }
      return statusMap[status.toLowerCase()] || status
    },
    
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    async checkPaymentStatus() {
  try {
    // Check if we have a pending payment in localStorage
    const pendingPayment = localStorage.getItem('pendingPayment');
    if (pendingPayment && this.currentBooking) {
      localStorage.removeItem('pendingPayment');
      
      // Refresh the booking data
      await this.lookupBooking();
      
      // Show success message if payment was completed
      if (this.currentBooking.status === 'paid') {
        this.successMessage = 'Payment completed successfully!';
        setTimeout(() => {
          this.successMessage = null;
        }, 5000);
      }
    }
  } catch (error) {
    console.error('Error checking payment status:', error);
  }
 }
  },
  mounted() {
  // Check if we're returning from a payment
  const pendingPayment = localStorage.getItem('pendingPayment')
  if (pendingPayment) {
    localStorage.removeItem('pendingPayment')
    
    // Refresh the booking data to check if payment was completed
    if (this.currentBooking) {
      this.lookupBooking()
    }
  }

  this.checkPaymentStatus();
}
}
</script>

<style scoped>
.booking-management {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1e3a8a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-overlay p {
  color: white;
  font-size: 1.2rem;
  font-weight: 500;
}

/* Lookup Section */
.lookup-container {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 3rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.lookup-container h2 {
  color: #1e3a8a;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 700;
}

.lookup-container > p {
  color: #64748b;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.lookup-form {
  max-width: 450px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.form-control {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background: white;
}

.form-control:focus {
  outline: none;
  border-color: #1e3a8a;
  box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1);
}

.form-control:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
  opacity: 0.6;
}

.form-group small {
  color: #6b7280;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  display: block;
}

/* Buttons */
.btn {
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn:not(:disabled):hover {
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

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
}

.btn-danger {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
  color: white;
}

.btn-success, .btn-pay-now {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  color: white;
  font-size: 1.1rem;
  padding: 1rem 2rem;
}

.btn-success:hover:not(:disabled), .btn-pay-now:hover:not(:disabled) {
  background: linear-gradient(135deg, #047857 0%, #059669 100%);
  box-shadow: 0 6px 16px rgba(5, 150, 105, 0.3);
}

.btn-view-booking {
  width: 100%;
  margin-top: 1rem;
  font-size: 1.1rem;
  padding: 1rem;
}

/* Help Text */
.help-text {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
  text-align: left;
  border: 1px solid #e5e7eb;
}

.help-text p {
  margin: 0 0 0.5rem 0;
  color: #374151;
  font-weight: 600;
}

.help-text ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #6b7280;
}

.help-text li {
  margin-bottom: 0.25rem;
}

/* Booking Details */
.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.booking-header h2 {
  color: #1e3a8a;
  margin: 0;
  font-size: 1.8rem;
}

.booking-card {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.booking-card h3 {
  color: #1e3a8a;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 700;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-item strong {
  color: #374151;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.info-item span {
  color: #1f2937;
  font-size: 1rem;
}

.booking-ref {
  font-family: 'Courier New', monospace;
  font-weight: 700;
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  width: fit-content;
}

.tour-date {
  font-weight: 600;
  color: #1e3a8a;
}

.price {
  font-weight: 700;
  color: #059669;
  font-size: 1.1rem;
}

.status {
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  text-align: center;
  width: fit-content;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status.confirmed, .status.paid {
  background: #d1fae5;
  color: #065f46;
}

.status.pending {
  background: #fef3c7;
  color: #92400e;
}

.status.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.status.completed {
  background: #ddd6fe;
  color: #5b21b6;
}

/* Booking Actions */
.booking-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-start;
}

.modification-notice {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  padding: 1.5rem;
  border-radius: 8px;
  flex: 1;
  min-width: 300px;
}

.modification-notice p {
  margin: 0;
  color: #0c4a6e;
}

.modification-notice p:first-child {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.payment-success-notice {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 1.5rem;
  border-radius: 8px;
  flex: 1;
  min-width: 300px;
}

.payment-success-notice p {
  margin: 0;
  color: #166534;
}

.payment-success-notice p:first-child {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

/* Forms */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.form-header h3 {
  color: #1e3a8a;
  margin: 0;
  font-size: 1.4rem;
}

.modify-form, .cancel-form {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
  margin-top: 2rem;
  flex-wrap: wrap;
}

/* Cancel Form Specific */
.cancellation-warning {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.cancellation-warning p {
  margin: 0.5rem 0;
  color: #991b1b;
}

.cancellation-warning p:first-child {
  margin-top: 0;
  font-weight: 600;
}

.confirmation-checkbox {
  margin: 1.5rem 0;
}

.confirmation-checkbox label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  color: #374151;
}

.confirmation-checkbox input[type="checkbox"] {
  margin-top: 0.125rem;
  flex-shrink: 0;
}

/* Alerts */
.alert {
  padding: 1rem 1.25rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  font-weight: 500;
}

.alert-error {
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

.alert-success {
  background: #d1fae5;
  border: 1px solid #a7f3d0;
  color: #065f46;
}

/* Responsive Design */
@media (max-width: 768px) {
  .booking-management {
    padding: 1rem;
  }
  
  .lookup-container {
    padding: 2rem 1.5rem;
  }
  
  .booking-header {
    flex-direction: column;
    text-align: center;
  }
  
  .booking-card {
    padding: 1.5rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .booking-actions {
    flex-direction: column;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
  
  .form-header {
    flex-direction: column;
    text-align: center;
  }
  
  .modify-form, .cancel-form {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .lookup-container {
    padding: 1.5rem 1rem;
  }
  
  .booking-card {
    padding: 1rem;
  }
  
  .modification-notice {
    min-width: auto;
  }
}
</style>