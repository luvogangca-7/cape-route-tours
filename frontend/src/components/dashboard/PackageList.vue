<template>
  <div class="card bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-semibold text-gray-700 mb-4">Tour Packages</h3>
    
    <!-- Package List -->
    <div class="space-y-4">
      <div 
        v-for="packageItem in packages" 
        :key="packageItem.package_id"
        class="package-item p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
        @click="showPackageDetails(packageItem.package_id)"
      >
        <div class="flex justify-between items-center">
          <div>
            <h4 class="font-semibold text-gray-900">{{ packageItem.name }}</h4>
            <p class="text-sm text-gray-600">{{ packageItem.description }}</p>
          </div>
          <div class="text-right">
            <p class="text-lg font-bold text-gray-900">R{{ formatNumber(packageItem.price) }}</p>
            <p class="text-sm text-gray-500">{{ packageItem.duration_days }} day(s)</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Package Details Modal -->
    <div v-if="selectedPackage" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-900">{{ selectedPackage.package.name }}</h3>
          <button @click="selectedPackage = null" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <p class="text-gray-600 mb-4">{{ selectedPackage.package.description }}</p>
        
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p class="text-sm text-gray-500">Total Sold</p>
            <p class="text-lg font-semibold">{{ selectedPackage.stats.totalSold || 0 }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Revenue</p>
            <p class="text-lg font-semibold">R{{ formatNumber(selectedPackage.stats.totalRevenue || 0) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Tickets</p>
            <p class="text-lg font-semibold">{{ selectedPackage.stats.totalTickets || 0 }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Duration</p>
            <p class="text-lg font-semibold">{{ selectedPackage.package.duration_days }} days</p>
          </div>
        </div>

        <h4 class="font-semibold mb-2">Townships Included:</h4>
        <div class="space-y-2">
          <div v-for="township in selectedPackage.townships" :key="township.township" class="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span class="font-medium">{{ township.township }}</span>
            <span class="text-sm text-gray-600">{{ township.ticketsSold }} tickets sold</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const packages = ref([])
const selectedPackage = ref(null)

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-ZA').format(num)
}

const fetchPackages = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/packages')
    packages.value = response.data
  } catch (error) {
    console.error('Error fetching packages:', error)
  }
}

const showPackageDetails = async (packageId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/dashboard/package/${packageId}`)
    selectedPackage.value = response.data
  } catch (error) {
    console.error('Error fetching package details:', error)
  }
}

onMounted(() => {
  fetchPackages()
})
</script>