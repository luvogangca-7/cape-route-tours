<template>
  <div class="terms-container">
    <h1>Terms & Conditions</h1>

    <section>
      <h2>1. Booking Policy</h2>
      <p>All bookings must be made through the Cape Route Tours website or official agents.</p>
      <p>A booking is only confirmed once full payment has been received.</p>
      <p>Prices are subject to change without prior notice.</p>
    </section>

    <section>
      <h2>2. Payment</h2>
      <p>We accept secure online payments via Stripe.</p>
      <p>All payments must be completed before the tour date.</p>
      <p>Failed or pending transactions may result in cancellation.</p>
    </section>

    <section>
      <h2>3. Cancellation & Refunds</h2>
      <p>Cancellations made 7 days before the tour will receive a full refund.</p>
      <p>Cancellations made less than 7 days before the tour are non-refundable.</p>
      <p>No-shows will not be refunded.</p>
    </section>

    <section>
      <h2>4. Safety & Security</h2>
      <p><strong>Your safety is our top priority.</strong> Cape Route Tours provides professional security personnel for all township tours in the Cape Flats and surrounding areas.</p>
      <p>All tours are conducted with trained local guides who know the communities intimately and ensure safe passage throughout the experience.</p>
      <p>Security measures are discreet and respectful to the communities we visit, maintaining an authentic and welcoming atmosphere.</p>
      <p>Customers must follow all safety instructions provided by guides and security personnel at all times.</p>
      <p>We reserve the right to modify or cancel tours if safety conditions change unexpectedly.</p>
    </section>

    <section>
      <h2>5. Customer Responsibilities</h2>
      <p>Customers must provide accurate personal information when booking.</p>
      <p>Customers are responsible for being on time at the agreed pick-up location.</p>
      <p>Any misconduct or damage caused during the tour may result in removal without refund.</p>
      <p>The food provided is cultural; if you cannot enjoy it, fast food will be available at your leisure.</p>
      <p>Respect local communities, customs, and photography guidelines as directed by your guide.</p>
    </section>

    <section>
      <h2>6. Liability</h2>
      <p>Cape Route Tours is not liable for personal injury, loss, or damage to personal belongings.</p>
      <p>Customers are advised to have their own travel/health insurance.</p>
      <p>While we provide security measures, customers participate in tours at their own risk.</p>
    </section>

    <section>
      <h2>7. Changes to Itinerary</h2>
      <p>Cape Route Tours reserves the right to change or cancel tours due to weather, safety concerns, or unforeseen circumstances.</p>
      <p>Alternative arrangements will be made where possible.</p>
    </section>

    <section>
      <h2>8. Governing Law</h2>
      <p>These Terms & Conditions are governed by the laws of South Africa.</p>
    </section>
  </div>
</template>

<script setup>
</script>

<style scoped>
.terms-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
}

h2 {
  margin-top: 1.5rem;
  font-size: 1.3rem;
  color: #2c3e50;
  border-bottom: 2px solid #f6c46d;
  padding-bottom: 0.5rem;
}

section {
  margin-bottom: 1.5rem;
}

p {
  margin: 0.8rem 0;
  line-height: 1.6;
  color: #555;
}

strong {
  color: #2c3e50;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .terms-container {
    margin: 1rem;
    padding: 1.5rem;
  }

  h1 {
    font-size: 1.8rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  p {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .terms-container {
    margin: 0.5rem;
    padding: 1rem;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: 1.1rem;
    margin-top: 1rem;
  }
}
</style>