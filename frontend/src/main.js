import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import '@fortawesome/fontawesome-free/css/all.css';
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'

const app = createApp(App)
app.use(store)
app.use(router)

// set axios default authorization header if admin token present
const adminToken = localStorage.getItem('admin_token')
if (adminToken) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + adminToken
}

async function initStripe() {
  const stripe = await loadStripe('price_1Rt7WoCpnBRvaWSUVXXZK8kJ')
  if (!stripe) {
    console.error('Stripe failed to load!')
    return
  }

  app.config.globalProperties.$stripe = stripe
  console.log('Stripe is set globally:', stripe)

  app.mount('#app')
}

initStripe()
