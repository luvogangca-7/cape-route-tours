<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Customer Inquiries</h1>

    <!-- Search & Filters -->
    <div class="flex gap-3 mb-4">
      <input
        v-model="searchQuery"
        placeholder="Search by name, email, or subject..."
        class="border p-2 rounded w-1/3"
      />
      <select v-model="statusFilter" class="border p-2 rounded">
        <option value="">All Statuses</option>
        <option value="New">New</option>
        <option value="In Progress">In Progress</option>
        <option value="Resolved">Resolved</option>
      </select>
    </div>

    <!-- Inquiries Table -->
    <table class="w-full border-collapse border">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-2">#</th>
          <th class="border p-2">Name</th>
          <th class="border p-2">Email</th>
          <th class="border p-2">Subject</th>
          <th class="border p-2">Date</th>
          <th class="border p-2">Status</th>
          <th class="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(inquiry, index) in filteredInquiries"
          :key="inquiry.id"
          :class="inquiry.status === 'New' ? 'bg-yellow-50' : ''"
        >
          <td class="border p-2">{{ index + 1 }}</td>
          <td class="border p-2">{{ inquiry.name }}</td>
          <td class="border p-2">{{ inquiry.email }}</td>
          <td class="border p-2">{{ inquiry.subject }}</td>
          <td class="border p-2">{{ inquiry.date }}</td>
          <td class="border p-2">
            <span
              class="px-2 py-1 rounded text-white text-sm"
              :class="{
                'bg-red-500': inquiry.status === 'New',
                'bg-yellow-500': inquiry.status === 'In Progress',
                'bg-green-500': inquiry.status === 'Resolved'
              }"
            >
              {{ inquiry.status }}
            </span>
          </td>
          <td class="border p-2">
            <button
              @click="openInquiry(inquiry)"
              class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              View
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Inquiry Detail Modal -->
    <div
      v-if="selectedInquiry"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
    >
      <div class="bg-white w-2/3 rounded shadow-lg p-6">
        <h2 class="text-xl font-bold mb-2">Inquiry Details</h2>
        <p><strong>Name:</strong> {{ selectedInquiry.name }}</p>
        <p><strong>Email:</strong> {{ selectedInquiry.email }}</p>
        <p><strong>Date:</strong> {{ selectedInquiry.date }}</p>
        <p><strong>Subject:</strong> {{ selectedInquiry.subject }}</p>
        <p class="mt-2"><strong>Message:</strong></p>
        <p class="bg-gray-50 border p-3 rounded">{{ selectedInquiry.message }}</p>

        <!-- Reply Box -->
        <textarea
          v-model="replyMessage"
          placeholder="Type your reply..."
          class="border w-full p-2 rounded mt-4"
          rows="4"
        ></textarea>

        <!-- Status Change -->
        <div class="mt-3">
          <label class="block font-semibold mb-1">Update Status:</label>
          <select v-model="selectedInquiry.status" class="border p-2 rounded">
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-2 mt-4">
          <button @click="selectedInquiry = null" class="px-4 py-2 border rounded">
            Close
          </button>
          <button
            @click="sendReply"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Send Reply
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      searchQuery: "",
      statusFilter: "",
      inquiries: [],
      selectedInquiry: null,
      replyMessage: "",
      loading: {
        inquiries: false,
        reply: false,
        status: false
      },
      error: null
    }
  },
  computed: {
    filteredInquiries() {
      return this.inquiries.filter(inq => {
        const matchesSearch = 
          inq.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          inq.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          inq.subject.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesStatus = this.statusFilter 
          ? inq.status === this.statusFilter 
          : true;
        return matchesSearch && matchesStatus;
      });
    }
  },
  methods: {
    async fetchInquiries() {
      this.loading.inquiries = true;
      this.error = null;
      try {
        const response = await axios.get('http://localhost:5000/api/messages');
        if (response.data.success) {
          this.inquiries = response.data.data.map(inquiry => ({
            ...inquiry,
            status: inquiry.is_read ? 'Resolved' : 'New',
            date: new Date(inquiry.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          }));
        } else {
          throw new Error(response.data.message || 'Failed to load inquiries');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        this.error = error.response?.data?.message || error.message || 'Failed to load inquiries';
      } finally {
        this.loading.inquiries = false;
      }
    },
    async openInquiry(inquiry) {
      this.selectedInquiry = { ...inquiry };
      this.replyMessage = "";
      
      // Mark as read if it's new
      if (this.selectedInquiry.status === 'New') {
        await this.updateInquiryStatus(this.selectedInquiry.id, 'In Progress');
      }
    },
    async sendReply() {
      if (!this.replyMessage.trim()) {
        this.error = 'Please enter a reply message';
        return;
      }

      this.loading.reply = true;
      this.error = null;
      try {
        const response = await axios.post(
          `http://localhost:5000/api/messages/${this.selectedInquiry.id}/reply`,
          {
            reply: this.replyMessage,
            status: this.selectedInquiry.status,
            email: this.selectedInquiry.email,
            name: this.selectedInquiry.name
          }
        );

        if (response.data.success) {
          await this.updateInquiryStatus(this.selectedInquiry.id, 'Resolved');
          this.$notify({
            title: 'Success',
            message: `Reply sent to ${this.selectedInquiry.email}`,
            type: 'success'
          });
          this.fetchInquiries();
          this.selectedInquiry = null;
        } else {
          throw new Error(response.data.message || 'Failed to send reply');
        }
      } catch (error) {
        console.error('Reply error:', error);
        this.error = error.response?.data?.message || error.message || 'Failed to send reply';
      } finally {
        this.loading.reply = false;
      }
    },
    async updateInquiryStatus(id, status) {
      this.loading.status = true;
      try {
        const response = await axios.patch(
          `http://localhost:5000/api/messages/${id}/status`,
          { status }
        );
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to update status');
        }
        // Update local data
        const inquiry = this.inquiries.find(i => i.id === id);
        if (inquiry) {
          inquiry.status = status;
          inquiry.is_read = status === 'Resolved';
        }
      } catch (error) {
        console.error('Status update error:', error);
        this.error = error.response?.data?.message || error.message || 'Failed to update status';
      } finally {
        this.loading.status = false;
      }
    },
    async deleteInquiry(id) {
      if (!confirm('Are you sure you want to delete this inquiry?')) return;
      
      try {
        const response = await axios.delete(`http://localhost:5000/api/messages/${id}`);
        if (response.data.success) {
          this.inquiries = this.inquiries.filter(inquiry => inquiry.id !== id);
          this.$notify({
            title: 'Success',
            message: 'Inquiry deleted successfully',
            type: 'success'
          });
        } else {
          throw new Error(response.data.message || 'Failed to delete inquiry');
        }
      } catch (error) {
        console.error('Delete error:', error);
        this.error = error.response?.data?.message || error.message || 'Failed to delete inquiry';
      }
    }
  },
  mounted() {
    this.fetchInquiries();
  }
}
</script>
