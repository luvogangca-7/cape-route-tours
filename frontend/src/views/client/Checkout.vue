<template>
  <div class="checkout">
    <h2>Booking Confirmation</h2>

    <div v-if="loading">Loading...</div>

    <div v-else-if="session">
      <p><strong>Package:</strong> {{ session.display_items[0].custom.name }}</p>
      <p><strong>Quantity:</strong> {{ session.display_items[0].quantity }}</p>
      <p><strong>Total Paid:</strong> R{{ (session.amount_total / 100).toFixed(2) }}</p>
      <p><strong>Status:</strong> {{ session.payment_status }}</p>
      <p><strong>Email:</strong> {{ session.customer_email }}</p>
      <p v-if="session.payment_status === 'paid'" class="success-msg">
        Payment successful! Thank you for your booking.
      </p>
      <p v-else class="error-msg">
        Payment not completed or pending. Please check your payment.
      </p>
    </div>

    <div v-else>
      <p>No session information found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)
const session = ref(null)

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const sessionId = urlParams.get('session_id')

  if (!sessionId) {
    loading.value = false
    return
  }

  try {
    // Call your backend API to retrieve session details from Stripe
    const res = await fetch(`http://localhost:5000/api/checkout-session?sessionId=${sessionId}`)
    const data = await res.json()

    if (res.ok) {
      session.value = data.session
    } else {
      console.error('Failed to fetch session:', data.error)
    }
  } catch (err) {
    console.error('Error fetching session:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.checkout {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  text-align: center;
}
.success-msg {
  color: green;
  font-weight: bold;
  margin-top: 20px;
}
.error-msg {
  color: red;
  font-weight: bold;
  margin-top: 20px;
}
</style>