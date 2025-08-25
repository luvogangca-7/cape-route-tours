<template>
  <div class="cancel-page">
    <div class="cancel-container">
      <div class="icon-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="#d9534f">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      </div>
      <h1 class="title">Payment Cancelled</h1>
      <p class="message">Your transaction was not completed.</p>
      
      <div class="button-container">
        <router-link to="/tours" class="retry-button">
          Try Again
        </router-link>
        <router-link to="/" class="home-button">
          Back to Home
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CancelPage'
}
</script>
<style scoped>
.cancel-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.cancel-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(9, 29, 53, 0.1);
  padding: 3rem;
  text-align: center;
  max-width: 500px;
  width: 100%;
  border: 2px solid rgba(217, 83, 79, 0.2);
}
.icon-container {
  margin-bottom: 1.5rem;
}
.title {
  color: #d9534f;
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 700;
}
.message {
  color: #091d35;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}
.button-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
.retry-button {
  background-color: #091d35;
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid #091d35;
}
.retry-button:hover {
  background-color: #f6c46d;
  color: #091d35;
  border-color: #f6c46d;
}
.home-button {
  background-color: white;
  color: #091d35;
  padding: 0.8rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid #091d35;
}
.home-button:hover {
  background-color: #f6c46d;
  border-color: #f6c46d;
}
@media (max-width: 600px) {
  .cancel-container {
    padding: 2rem;
  }
  
  .button-container {
    flex-direction: column;
  }
  
  .retry-button,
  .home-button {
    width: 100%;
  }
}
</style>