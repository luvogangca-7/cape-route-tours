<template>
  <div class="contact-card">
    <div class="contact-form">
      <div v-if="successMessage" class="success-message">
        <i class="fas fa-check-circle"></i> {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="error-message">
        <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
      </div>
      
      <form @submit.prevent="submitForm">
        <h2>Talk To Us</h2>
        
        <div class="form-group">
          <label for="name">Full Name:</label>
          <input type="text" id="name" v-model="messages.name" required placeholder="John Doe"/>
        </div>
        
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="messages.email" required placeholder="johndoe@gmail.com"/>
        </div>
        
        <div class="form-group">
          <label for="phone">Phone Number:</label>
          <input type="tel" id="phone" v-model="messages.phone" required placeholder="012 345 6789"/> 
        </div>
        
        <div class="form-group">
          <label for="subject">Subject:</label>
          <select id="subject" v-model="messages.subject" required>
            <option value="" disabled selected>Select a subject</option>
            <option value="general">General Inquiry</option>
            <option value="support">Technical Support</option>
            <option value="sales">Sales Question</option>
            <option value="feedback">Feedback</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="message">Message:</label>
          <textarea id="message" v-model="messages.message" required rows="5" placeholder="Tell us something"></textarea>
        </div>
        
        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="isLoading">
            <i class="fas fa-spinner fa-spin"></i> Sending...
          </span>
          <span v-else>
            <i class="fas fa-paper-plane"></i> Send Message
          </span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      messages: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      },
      isLoading: false,
      successMessage: '',
      errorMessage: ''
    }
  },
  methods: {
    async submitForm() {
      if (!this.validateForm()) return;

      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';

      try {
        const response = await axios.post('http://localhost:5000/api/messages', {
          name: this.messages.name,
          email: this.messages.email,
          phone: this.messages.phone,
          subject: this.messages.subject,
          message: this.messages.message
        });

        if (response.data.success) {
          this.successMessage = 'Your message has been sent successfully!';
          this.resetForm();
          setTimeout(() => this.successMessage = '', 5000);
        } else {
          throw new Error(response.data.message || 'Submission failed');
        }
      } catch (error) {
        console.error('Submission error:', error);
        this.errorMessage = error.response?.data?.message || error.message || 'Failed to submit message';
      } finally {
        this.isLoading = false;
      }
    },
    validateForm() {
      if (!this.messages.name.trim()) {
        this.errorMessage = 'Name is required';
        return false;
      }
      if (!this.messages.email.trim()) {
        this.errorMessage = 'Email is required';
        return false;
      }
      if (!this.validateEmail(this.messages.email)) {
        this.errorMessage = 'Please enter a valid email';
        return false;
      }
      if (!this.messages.message.trim()) {
        this.errorMessage = 'Message is required';
        return false;
      }
      return true;
    },
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    resetForm() {
      this.messages = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      };
    }
  }
}
</script>

<style scoped>
.contact-card {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  max-width: 700px;
  margin: 2rem auto;
  box-shadow: 0 8px 20px rgba(9, 29, 53, 0.1);
}

.contact-form h2 {
  color: #091D35;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #091D35;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group textarea {
  min-height: 150px;
  resize: vertical;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #f6c46d;
  box-shadow: 0 0 0 3px rgba(246, 196, 109, 0.2);
}

.submit-btn {
  background-color: #091D35;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn:hover {
  background-color: rgb(246, 196, 109);
  transform: translateY(-2px);
  color: #091D35;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
}

.success-message {
  color: #2e7d32;
  background-color: #edf7ed;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-message {
  color: #d32f2f;
  background-color: #fde8e8;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.fa-spinner {
  animation: fa-spin 1s infinite linear;
}

@keyframes fa-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .contact-card {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .contact-form h2 {
    font-size: 1.5rem;
  }
}
</style>