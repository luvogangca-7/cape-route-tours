<template>
  <div class="container-fluid py-4" style="min-height: 100vh; background-color: #f8f9fa;">
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1 class="display-5 fw-bold text-dark mb-1">Customer Inquiries</h1>
            <p class="text-muted fs-5">Manage messages and respond to customers</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters / Actions -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex gap-2 flex-wrap align-items-center">
              <div class="input-group w-50">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search by name, email or subject..." />
              </div>

              <select v-model="statusFilter" class="form-select w-auto">
                <option value="">All Statuses</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <div class="ms-auto d-flex gap-2">
                <button @click="fetchInquiries" class="btn btn-outline-secondary">Refresh</button>
                <button @click="deleteSelected" class="btn btn-danger" v-if="selectedIds.length">Delete Selected</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="row">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-bottom">
            <h5 class="mb-0 fw-semibold">
              <i class="bi bi-envelope me-2"></i>
              Inquiries ({{ filteredInquiries.length }})
            </h5>
          </div>
          <div class="card-body p-0">
            <div v-if="loading.inquiries" class="text-center py-5">
              <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>
              <p class="mt-3 text-muted">Loading inquiries...</p>
            </div>

            <div v-else-if="error" class="text-center py-5">
              <i class="bi bi-exclamation-triangle text-danger fs-1"></i>
              <p class="text-danger mt-2">{{ error }}</p>
            </div>

            <div v-else-if="filteredInquiries.length === 0" class="text-center py-5">
              <i class="bi bi-inbox fs-1 text-muted"></i>
              <p class="text-muted mt-2">No inquiries found.</p>
            </div>

            <div v-else class="table-responsive">
              <table class="table table-hover mb-0 inquiries-table" style="min-width:90vw;">
                <thead class="table-light">
                  <tr>
                    <th scope="col" class="fw-semibold px-3" style="width:5%"><input type="checkbox" @change="toggleAll($event)" :checked="allSelected" /></th>
                    <th scope="col" class="fw-semibold px-3" style="width:18%">Name</th>
                    <th scope="col" class="fw-semibold px-3" style="width:18%">Email</th>
                    <th scope="col" class="fw-semibold px-3" style="width:34%">Subject</th>
                    <th scope="col" class="fw-semibold px-3" style="width:10%">Date</th>
                    <th scope="col" class="fw-semibold px-3" style="width:7%">Status</th>
                    <th scope="col" class="fw-semibold px-3" style="width:8%">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(inquiry, idx) in filteredInquiries" :key="inquiry.id">
                    <td class="align-middle px-3"><input type="checkbox" :value="inquiry.id" v-model="selectedIds" /></td>
                    <td class="align-middle fw-semibold px-3">{{ inquiry.name }}</td>
                    <td class="align-middle small text-muted px-3">{{ inquiry.email }}</td>
                    <td class="align-middle px-3">{{ inquiry.subject }}</td>
                    <td class="align-middle small text-muted px-3">{{ inquiry.date }}</td>
                    <td class="align-middle px-3">
                      <span :class="statusClass(inquiry.status)" class="badge px-3 py-2">
                        {{ inquiry.status }}
                      </span>
                    </td>
                    <td class="align-middle px-3">
                      <div class="btn-group" role="group">
                        <button @click="openInquiry(inquiry)" class="btn btn-sm btn-primary mx-1">View</button>
                        <button @click="deleteInquiry(inquiry.id)" class="btn btn-sm btn-outline-danger mx-1">Delete</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Inquiry Modal (reuse existing UI) -->
    <div v-if="selectedInquiry" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Inquiry Details</h5>
            <button type="button" class="btn-close" @click="selectedInquiry = null"></button>
          </div>
          <div class="modal-body">
            <p><strong>Name:</strong> {{ selectedInquiry.name }}</p>
            <p><strong>Email:</strong> {{ selectedInquiry.email }}</p>
            <p><strong>Date:</strong> {{ selectedInquiry.date }}</p>
            <p><strong>Subject:</strong> {{ selectedInquiry.subject }}</p>
            <p class="mt-2"><strong>Message:</strong></p>
            <p class="bg-light border p-3 rounded">{{ selectedInquiry.message }}</p>

            <div class="mt-3">
              <label class="form-label fw-semibold">Update Status</label>
              <select v-model="selectedInquiry.status" class="form-select w-50">
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div class="mt-3">
              <label class="form-label fw-semibold">Reply</label>
              <textarea v-model="replyMessage" class="form-control" rows="4" placeholder="Type your reply..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="selectedInquiry = null">Close</button>
            <button type="button" class="btn btn-success" @click="sendReply">Send Reply</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      searchQuery: '',
      statusFilter: '',
      inquiries: [],
      selectedInquiry: null,
      replyMessage: '',
      loading: { inquiries: false, reply: false, status: false },
      error: null,
      selectedIds: []
    }
  },
  computed: {
    filteredInquiries() {
      return this.inquiries.filter(inq => {
        const search = this.searchQuery.trim().toLowerCase()
        const matchesSearch = !search || [inq.name, inq.email, inq.subject].some(v => (v || '').toLowerCase().includes(search))
        const matchesStatus = this.statusFilter ? inq.status === this.statusFilter : true
        return matchesSearch && matchesStatus
      })
    },
    allSelected() {
      return this.filteredInquiries.length > 0 && this.selectedIds.length === this.filteredInquiries.length
    }
  },
  methods: {
    statusClass(status) {
      const classes = {
        New: 'bg-danger text-white',
        'In Progress': 'bg-warning text-dark',
        Resolved: 'bg-success text-white'
      }
      return classes[status] || 'bg-secondary text-white'
    },
    toggleAll(e) {
      if (e.target.checked) this.selectedIds = this.filteredInquiries.map(i => i.id)
      else this.selectedIds = []
    },
    async fetchInquiries() {
      this.loading.inquiries = true
      this.error = null
      try {
        const token = localStorage.getItem('admin_token')
        const headers = token ? { Authorization: 'Bearer ' + token } : {}
        const response = await axios.get('http://localhost:5000/api/messages', { headers })
        if (response.data.success) {
          this.inquiries = response.data.data.map(inquiry => ({
            ...inquiry,
            status: inquiry.is_read ? 'Resolved' : 'New',
            date: new Date(inquiry.created_at).toLocaleDateString('en-ZA', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          }))
        } else throw new Error(response.data.message || 'Failed to load inquiries')
      } catch (err) {
        console.error('Fetch error:', err)
        this.error = err.response?.data?.message || err.message || 'Failed to load inquiries'
      } finally {
        this.loading.inquiries = false
      }
    },
    async openInquiry(inquiry) {
      this.selectedInquiry = { ...inquiry }
      this.replyMessage = ''
      if (this.selectedInquiry.status === 'New') await this.updateInquiryStatus(this.selectedInquiry.id, 'In Progress')
    },
    async sendReply() {
      if (!this.replyMessage.trim()) { this.error = 'Please enter a reply message'; return }
      this.loading.reply = true; this.error = null
      try {
        const token = localStorage.getItem('admin_token')
        const headers = token ? { Authorization: 'Bearer ' + token } : {}
        const response = await axios.post(`http://localhost:5000/api/messages/${this.selectedInquiry.id}/reply`, { reply: this.replyMessage, status: this.selectedInquiry.status, email: this.selectedInquiry.email, name: this.selectedInquiry.name }, { headers })
        if (response.data.success) {
          await this.updateInquiryStatus(this.selectedInquiry.id, 'Resolved')
          this.fetchInquiries()
          this.selectedInquiry = null
        } else throw new Error(response.data.message || 'Failed to send reply')
      } catch (err) {
        console.error('Reply error:', err)
        this.error = err.response?.data?.message || err.message || 'Failed to send reply'
      } finally { this.loading.reply = false }
    },
    async updateInquiryStatus(id, status) {
      this.loading.status = true
      try {
        const token = localStorage.getItem('admin_token')
        const headers = token ? { Authorization: 'Bearer ' + token } : {}
        const response = await axios.patch(`http://localhost:5000/api/messages/${id}/status`, { status }, { headers })
        if (!response.data.success) throw new Error(response.data.message || 'Failed to update status')
        const inquiry = this.inquiries.find(i => i.id === id)
        if (inquiry) { inquiry.status = status; inquiry.is_read = status === 'Resolved' }
      } catch (err) {
        console.error('Status update error:', err)
        this.error = err.response?.data?.message || err.message || 'Failed to update status'
      } finally { this.loading.status = false }
    },
    async deleteInquiry(id) {
      if (!confirm('Are you sure you want to delete this inquiry?')) return
      try {
        const token = localStorage.getItem('admin_token')
        const headers = token ? { Authorization: 'Bearer ' + token } : {}
        const response = await axios.delete(`http://localhost:5000/api/messages/${id}`, { headers })
        if (response.data.success) this.inquiries = this.inquiries.filter(inq => inq.id !== id)
        else throw new Error(response.data.message || 'Failed to delete inquiry')
      } catch (err) {
        console.error('Delete error:', err)
        this.error = err.response?.data?.message || err.message || 'Failed to delete inquiry'
      }
    },
    async deleteSelected() {
      if (!confirm('Delete selected inquiries?')) return
      try {
        const token = localStorage.getItem('admin_token')
        const headers = token ? { Authorization: 'Bearer ' + token } : {}
        await Promise.all(this.selectedIds.map(id => axios.delete(`http://localhost:5000/api/messages/${id}`, { headers })))
        this.inquiries = this.inquiries.filter(i => !this.selectedIds.includes(i.id))
        this.selectedIds = []
      } catch (err) { console.error('Bulk delete error:', err); this.error = 'Failed to delete some inquiries' }
    }
  },
  mounted() { this.fetchInquiries() }
}
</script>

<style scoped>
.card { transition: transform 0.15s ease, box-shadow 0.15s ease; }
.card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.08); }
.table th { border-top: none; font-weight: 600; }
.badge { font-weight: 600; }
.modal { animation: fadeIn .2s ease; }
.inquiries-table td, .inquiries-table th { vertical-align: middle; }
/* allow wrapping similar to bookings table so long content flows and the table occupies the viewport width */
.inquiries-table td { white-space: normal; }
</style>
