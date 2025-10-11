<template>
  <div class="card shadow-sm h-100">
    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="card-title text-muted mb-0">Tour Packages</h5>
        <small class="text-muted">Available packages</small>
      </div>

      <!-- Package List: make it grow and scroll if long; match chart height -->
      <div class="flex-grow-1" style="min-height:300px; max-height:360px; overflow:auto;">
        <div class="list-group">
          <button
            v-for="packageItem in packages"
            :key="packageItem.packageId"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
            @click="showPackageDetails(packageItem.packageId)"
          >
            <div class="ms-2 me-auto">
              <div class="fw-semibold">{{ packageItem.packageName }}</div>
              <div class="text-muted small">{{ packageItem.description }}</div>
            </div>
            <div class="text-end">
              <div class="fw-bold">R{{ formatNumber(packageItem.price) }}</div>
              <div class="small text-muted">{{ packageItem.duration_days || packageItem.duration || 'N/A' }} day(s)</div>
            </div>
          </button>
        </div>
      </div>
    </div>
    </div>

    <!-- Package Details Modal -->
    <div v-if="selectedPackage" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-900">{{ selectedPackage.package.packageName }}</h3>
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
            <p class="text-lg font-semibold">{{ selectedPackage.stats?.totalSold || 0 }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Revenue</p>
            <p class="text-lg font-semibold">R{{ formatNumber(selectedPackage.stats?.totalRevenue || 0) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Tickets</p>
            <p class="text-lg font-semibold">{{ selectedPackage.stats?.totalTickets || 0 }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Duration</p>
            <p class="text-lg font-semibold">{{ selectedPackage.package.duration_days || selectedPackage.package.duration || 'N/A' }} days</p>
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import API_URL from '@/config/api.js';

import axios from 'axios'

const packages = ref([])
const selectedPackage = ref(null)

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-ZA').format(num)
}

const fetchPackages = async () => {
  try {
  const response = await axios.get(`${API_URL}/api/dashboard/packages`)
    packages.value = response.data
  } catch (error) {
    console.error('Error fetching packages:', error)
  }
}

const showPackageDetails = async (packageId) => {
  try {
    const response = await axios.get(`${API_URL}/api/dashboard/package/${packageId}`)
    selectedPackage.value = response.data
  } catch (error) {
    console.error('Error fetching package details:', error)
  }
}

onMounted(() => {
  fetchPackages()
})
</script>