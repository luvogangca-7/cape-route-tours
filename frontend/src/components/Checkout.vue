<!-- src/components/Checkout.vue -->
<template>
  <div class="checkout">
    <h2>Select Tour Package</h2>
    
    <select v-model="selectedPackage">
      <option disabled value="">Choose a package</option>
      <option value="single">Single Township</option>
      <option value="duo">Township Duo</option>
      <option value="full">Full Cape Culture</option>
    </select>

    <button @click="handleCheckout" :disabled="!selectedPackage">Pay Now</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { loadStripe } from '@stripe/stripe-js'

// Load Stripe
const stripePromise = loadStripe('pk_test_51Rt7PRCpnBRvaWSUf1MvcSdjYBY1LHk3YaLhXZdpibKGMo4qzru3OxQvWwfPl6LEkGGJAeTM0f5UPoWe8QulkBq000l57EV9Gd')

// Map package to Stripe price_id
const priceMap = {
  single: 'price_1RtSxxCpnBRvaWSUfOQgieaI',
  duo: 'price_1RtSuKCpnBRvaWSULMnhrj3q',   // <-- Replace with actual Duo price_id
  full: 'price_1RtT0LCpnBRvaWSUtXLjjCSY'   // <-- Replace with actual Full price_id
}

// State
const selectedPackage = ref('')

// Checkout function
const handleCheckout = async () => {
  const stripe = await stripePromise
  const priceId = priceMap[selectedPackage.value]

  if (!priceId) {
    alert('Invalid package selected.')
    return
  }

  const { error } = await stripe.redirectToCheckout({
    lineItems: [{ price: priceId, quantity: 1 }],
    mode: 'payment',
    successUrl: 'http://localhost:8080/success',
    cancelUrl: 'http://localhost:8080/cancel'
  })

  if (error) {
    console.error('Stripe error:', error)
  }
}
</script>

<style scoped>
.checkout {
  padding: 2rem;
  max-width: 400px;
  margin: auto;
}
select, button {
  margin-top: 1rem;
  padding: 10px;
  width: 100%;
}
button {
  background-color: #635bff;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: bold;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>