<template>
    <div>
       <h1>Get in Touch With Us</h1>
       
       <message-us/>
       <contact-us/>
    </div>
</template>
<script>

import ContactUs from '@/components/ContactUs.vue';
import MessageUs from '@/components/MessageUs.vue'

export default {
  components: {
    MessageUs,
    ContactUs
  }
}
</script>
<style>
    
</style>