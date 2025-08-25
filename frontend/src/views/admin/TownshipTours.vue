<!-- file path: frontend/src/views/TownshipTours.vue -->
<template>
    <div>
        <!-- Page title based on township -->
        <h2 class="title">{{ township }} Tours</h2>

        <!-- Reusable table component -->
        <ToursTable :tours="tours" :loading="loading" :error="error" />
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import ToursTable from '@/components/ToursTable.vue';

const route = useRoute();

// Reactive township name from route
const township = ref(route.params.township);

// State variables
const tours = ref([]);
const loading = ref(true);
const error = ref(null);

// Fetch tours filtered by township
const fetchTours = async () => {
    try {
        loading.value = true;
        error.value = null;

        // API call with query param for township
        const response = await axios.get(
            `http://localhost:5000/api/bookings?township=${encodeURIComponent(township.value)}`
        );

        // tours.value = response.data;
    } catch (err) {
        error.value = 'Failed to load tours: ' + err.message;
        tours.value = [];
    } finally {
        loading.value = false;
    }
};

// Fetch on mount
onMounted(fetchTours);

// Refetch if user navigates to a different township
watch(() => route.params.township, (newTownship) => {
    township.value = newTownship;
    fetchTours();
});
</script>

<style scoped>
.title {
    margin: 1rem 0;
    font-size: 1.5rem;
    font-weight: bold;
    color: #004080;
}
</style>
