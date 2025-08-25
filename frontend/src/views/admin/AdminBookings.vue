<!-- file path: frontend/src/views/AdminBookings.vue -->
<template>
  <div class="container-fluid py-4" style="background-color: #f8f9fa; min-height: 100vh;">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1 class="display-5 fw-bold text-dark mb-1">Booking Management</h1>
            <p class="text-muted fs-5">Manage all bookings across all destinations</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards - Horizontal Layout -->
    <div class="row g-4 mb-4" v-if="stats">
      <div class="col-md-2 col-sm-6">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body text-center p-4">
            <div class="d-flex align-items-center justify-content-center mb-2">
              <i class="bi bi-calendar-check text-primary fs-2 me-2"></i>
            </div>
            <h3 class="fw-bold text-primary mb-1">{{ totalBookings }}</h3>
            <p class="text-muted mb-0 small">Total Bookings</p>
          </div>
        </div>
      </div>
      
      <div class="col-md-2 col-sm-6">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body text-center p-4">
            <div class="d-flex align-items-center justify-content-center mb-2">
              <i class="bi bi-clock text-warning fs-2 me-2"></i>
            </div>
            <h3 class="fw-bold text-warning mb-1">{{ getStatusCount('pending') }}</h3>
            <p class="text-muted mb-0 small">Pending</p>
          </div>
        </div>
      </div>
      
      <div class="col-md-2 col-sm-6">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body text-center p-4">
            <div class="d-flex align-items-center justify-content-center mb-2">
              <i class="bi bi-check-circle text-success fs-2 me-2"></i>
            </div>
            <h3 class="fw-bold text-success mb-1">{{ getStatusCount('confirmed') }}</h3>
            <p class="text-muted mb-0 small">Confirmed</p>
          </div>
        </div>
      </div>
      
      <div class="col-md-2 col-sm-6">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body text-center p-4">
            <div class="d-flex align-items-center justify-content-center mb-2">
              <i class="bi bi-credit-card text-info fs-2 me-2"></i>
            </div>
            <h3 class="fw-bold text-info mb-1">{{ getStatusCount('paid') }}</h3>
            <p class="text-muted mb-0 small">Paid</p>
          </div>
        </div>
      </div>
      
      <div class="col-md-2 col-sm-6">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body text-center p-4">
            <div class="d-flex align-items-center justify-content-center mb-2">
              <i class="bi bi-x-circle text-danger fs-2 me-2"></i>
            </div>
            <h3 class="fw-bold text-danger mb-1">{{ getStatusCount('cancelled') }}</h3>
            <p class="text-muted mb-0 small">Cancelled</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div class="d-flex gap-2 flex-wrap">
                <button
                  @click="clearFilters"
                  class="btn btn-outline-secondary d-flex align-items-center"
                >
                  <i class="bi bi-arrow-clockwise me-2"></i>
                  Clear Filters
                </button>
                <button
                  @click="exportBookings"
                  class="btn btn-success d-flex align-items-center"
                >
                  <i class="bi bi-download me-2"></i>
                  Export CSV
                </button>
              </div>
              <button
                v-if="hasCancelledBookings"
                @click="openDeleteAllModal"
                class="btn btn-danger d-flex align-items-center"
              >
                <i class="bi bi-trash me-2"></i>
                Delete All Cancelled
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-bottom">
            <h5 class="mb-0 fw-semibold">
              <i class="bi bi-funnel me-2"></i>
              Filters
            </h5>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-lg-3 col-md-6">
                <label class="form-label fw-semibold">Search</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-search"></i></span>
                  <input
                    v-model="filters.search"
                    type="text"
                    class="form-control"
                    placeholder="Name, email, booking ref..."
                  />
                </div>
              </div>
              
              <div class="col-lg-3 col-md-6">
                <label class="form-label fw-semibold">Status</label>
                <select v-model="filters.status" class="form-select">
                  <option value="all">All Statuses</option>
                  <option v-for="status in filterOptions.statuses" :key="status" :value="status">
                    {{ capitalizeFirst(status) }}
                  </option>
                </select>
              </div>
              
              <div class="col-lg-3 col-md-6">
                <label class="form-label fw-semibold">From Date</label>
                <input
                  v-model="filters.dateFrom"
                  type="date"
                  class="form-control"
                />
              </div>
              
              <div class="col-lg-3 col-md-6">
                <label class="form-label fw-semibold">To Date</label>
                <input
                  v-model="filters.dateTo"
                  type="date"
                  class="form-control"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bookings Table -->
    <div class="row">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-bottom">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0 fw-semibold">
                <i class="bi bi-table me-2"></i>
                Bookings ({{ filteredBookings.length }})
              </h5>
            </div>
          </div>
          
          <div class="card-body p-0">
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-3 text-muted">Loading bookings...</p>
            </div>
            
            <!-- Error State -->
            <div v-else-if="error" class="text-center py-5">
              <i class="bi bi-exclamation-triangle text-danger fs-1"></i>
              <p class="text-danger mt-2">{{ error }}</p>
              <button @click="fetchBookings" class="btn btn-primary">
                <i class="bi bi-arrow-retry me-2"></i>
                Retry
              </button>
            </div>
            
            <!-- Empty State -->
            <div v-else-if="filteredBookings.length === 0" class="text-center py-5">
              <i class="bi bi-inbox fs-1 text-muted"></i>
              <p class="text-muted mt-2">No bookings found matching your criteria.</p>
            </div>
            
            <!-- Table -->
            <div v-else class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th scope="col" class="fw-semibold">
                      <i class="bi bi-receipt me-2"></i>
                      Booking Details
                    </th>
                    <th scope="col" class="fw-semibold">
                      <i class="bi bi-person me-2"></i>
                      Customer
                    </th>
                    <th scope="col" class="fw-semibold">
                      <i class="bi bi-geo-alt me-2"></i>
                      Package & Destination
                    </th>
                    <th scope="col" class="fw-semibold">
                      <i class="bi bi-info-circle me-2"></i>
                      Details
                    </th>
                    <th scope="col" class="fw-semibold">
                      <i class="bi bi-flag me-2"></i>
                      Status
                    </th>
                    <th scope="col" class="fw-semibold">
                      <i class="bi bi-gear me-2"></i>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="booking in paginatedBookings" :key="booking.bookingId">
                    <td class="align-middle">
                      <div class="fw-bold text-primary">{{ booking.bookingRef }}</div>
                      <small class="text-muted">{{ formatDate(booking.createdAt) }}</small>
                      <div class="fw-bold text-success mt-1">R{{ booking.totalPrice }}</div>
                    </td>
                    
                    <td class="align-middle">
                      <div class="fw-semibold">{{ booking.customerName }}</div>
                      <small class="text-muted d-block">{{ booking.customerEmail }}</small>
                      <small class="text-muted">{{ booking.customerPhone }}</small>
                    </td>
                    
                    <td class="align-middle">
                      <div class="fw-semibold">{{ getPackageName(booking) }}</div>
                      <small class="text-muted d-block">{{ getTownships(booking) }}</small>
                      <small class="text-primary">{{ getTourDates(booking) }}</small>
                    </td>
                    
                    <td class="align-middle">
                      <div class="d-flex align-items-center mb-1">
                        <i class="bi bi-people me-2 text-muted"></i>
                        <span>{{ booking.numberOfPeople }} people</span>
                      </div>
                      <div v-if="booking.specialRequests" class="small text-muted" style="max-width: 200px;">
                        <i class="bi bi-chat-square-text me-1"></i>
                        <span class="text-truncate d-inline-block" style="max-width: 180px;">
                          {{ booking.specialRequests }}
                        </span>
                      </div>
                    </td>
                    
                    <td class="align-middle">
                      <span :class="getStatusBadgeClass(booking.status)" class="badge fs-6 px-3 py-2">
                        <i :class="getStatusIcon(booking.status)" class="me-1"></i>
                        {{ capitalizeFirst(booking.status) }}
                      </span>
                      <div v-if="booking.status === 'cancelled' && booking.cancellationReason" 
                           class="small text-muted mt-1 fst-italic">
                        {{ booking.cancellationReason }}
                      </div>
                      <div v-if="booking.status === 'cancelled' && booking.cancelledAt" 
                           class="small text-muted">
                        Cancelled: {{ formatDate(booking.cancelledAt) }}
                      </div>
                    </td>
                    
                    <td class="align-middle">
                      <div class="btn-group" role="group">
                        <button
                          v-if="booking.status !== 'cancelled'"
                          @click="openCancelModal(booking)"
                          class="btn btn-sm btn-outline-warning"
                          title="Cancel Booking"
                        >
                          <i class="bi bi-x"></i> Cancel
                        </button>
                        <button
                          v-if="booking.status === 'cancelled'"
                          @click="openDeleteModal(booking)"
                          class="btn btn-sm btn-outline-danger"
                          title="Delete Permanently"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Pagination -->
            <div v-if="filteredBookings.length > 0" class="card-footer bg-white">
              <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <small class="text-muted">
                  Showing {{ (currentPage - 1) * pageSize + 1 }} to 
                  {{ Math.min(currentPage * pageSize, filteredBookings.length) }} of 
                  {{ filteredBookings.length }} results
                </small>
                <nav aria-label="Pagination">
                  <ul class="pagination pagination-sm mb-0">
                    <li class="page-item" :class="{ disabled: currentPage <= 1 }">
                      <button 
                        class="page-link" 
                        @click="currentPage--" 
                        :disabled="currentPage <= 1"
                      >
                        <i class="bi bi-chevron-left"></i>
                      </button>
                    </li>
                    <li class="page-item active">
                      <span class="page-link">{{ currentPage }} / {{ totalPages }}</span>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage >= totalPages }">
                      <button 
                        class="page-link" 
                        @click="currentPage++" 
                        :disabled="currentPage >= totalPages"
                      >
                        <i class="bi bi-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Update Modal -->
    <div v-if="statusModal.show" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-semibold">
              <i class="bi bi-pencil-square me-2"></i>
              Update Booking Status
            </h5>
            <button type="button" class="btn-close" @click="closeStatusModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-semibold">Status</label>
              <select v-model="statusModal.newStatus" class="form-select">
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div v-if="statusModal.newStatus === 'cancelled'" class="mb-3">
              <label class="form-label fw-semibold">Cancellation Reason</label>
              <textarea
                v-model="statusModal.cancellationReason"
                class="form-control"
                rows="3"
                placeholder="Optional reason for cancellation..."
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeStatusModal">
              Cancel
            </button>
            <button type="button" class="btn btn-primary" @click="updateBookingStatus">
              <i class="bi bi-check me-2"></i>
              Update
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel Confirmation Modal -->
    <div v-if="cancelModal.show" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-semibold text-warning">
              <i class="bi bi-exclamation-triangle me-2"></i>
              Cancel Booking
            </h5>
            <button type="button" class="btn-close" @click="closeCancelModal"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-warning d-flex align-items-center" role="alert">
              <i class="bi bi-exclamation-triangle me-2"></i>
              <div>
                Are you sure you want to cancel booking <strong>{{ cancelModal.booking?.bookingRef }}</strong>? 
                This action will mark the booking as cancelled.
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Reason (Optional)</label>
              <textarea
                v-model="cancelModal.reason"
                class="form-control"
                rows="3"
                placeholder="Reason for cancellation..."
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeCancelModal">
              <i class="bi bi-x me-2"></i>
              No, Keep Booking
            </button>
            <button type="button" class="btn btn-warning" @click="cancelBooking">
              <i class="bi bi-exclamation-triangle me-2"></i>
              Yes, Cancel Booking
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteModal.show" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-semibold text-danger">
              <i class="bi bi-trash me-2"></i>
              Delete Booking
            </h5>
            <button type="button" class="btn-close" @click="closeDeleteModal"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-danger d-flex align-items-center" role="alert">
              <i class="bi bi-exclamation-triangle me-2"></i>
              <div>
                Are you sure you want to permanently delete booking <strong>{{ deleteModal.booking?.bookingRef }}</strong>?
                <div class="fw-bold mt-2">This action cannot be undone.</div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDeleteModal">
              <i class="bi bi-x me-2"></i>
              No, Keep Booking
            </button>
            <button type="button" class="btn btn-danger" @click="deleteBookingPermanently">
              <i class="bi bi-trash me-2"></i>
              Yes, Delete Permanently
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete All Confirmation Modal -->
    <div v-if="deleteAllModal.show" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-semibold text-danger">
              <i class="bi bi-trash me-2"></i>
              Delete All Cancelled Bookings
            </h5>
            <button type="button" class="btn-close" @click="closeDeleteAllModal"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-danger d-flex align-items-center" role="alert">
              <i class="bi bi-exclamation-triangle me-2"></i>
              <div>
                Are you sure you want to permanently delete all <strong>{{ cancelledBookingsCount }}</strong> cancelled bookings?
                <div class="fw-bold mt-2">This action cannot be undone.</div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDeleteAllModal">
              <i class="bi bi-x me-2"></i>
              No, Keep Bookings
            </button>
            <button type="button" class="btn btn-danger" @click="deleteAllCancelledBookings">
              <i class="bi bi-trash me-2"></i>
              Yes, Delete All
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"

export default {
  name: "AdminBookings",
  data() {
    return {
      bookings: [],
      filteredBookings: [],
      stats: null,
      filterOptions: {
        statuses: ['pending', 'confirmed', 'paid', 'cancelled']
      },
      filters: {
        search: "",
        status: "all",
        dateFrom: "",
        dateTo: ""
      },
      loading: false,
      error: null,
      currentPage: 1,
      pageSize: 20,
      
      // Modals
      statusModal: {
        show: false,
        booking: null,
        newStatus: "",
        cancellationReason: ""
      },
      cancelModal: {
        show: false,
        booking: null,
        reason: ""
      },
      deleteModal: {
        show: false,
        booking: null
      },
      deleteAllModal: {
        show: false
      }
    }
  },
  
  computed: {
    totalBookings() {
      return this.bookings.length || 0
    },
    
    totalPages() {
      return Math.ceil(this.filteredBookings.length / this.pageSize)
    },
    
    paginatedBookings() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredBookings.slice(start, end)
    },
    
    hasCancelledBookings() {
      return this.getStatusCount('cancelled') > 0
    },
    
    cancelledBookingsCount() {
      return this.getStatusCount('cancelled')
    }
  },
  
  watch: {
    filters: {
      handler() {
        this.applyFilters()
        this.currentPage = 1
      },
      deep: true
    }
  },
  
  methods: {
    async fetchBookings() {
      this.loading = true
      this.error = null
      
      try {
        console.log('Fetching bookings...');
        
        const [bookingsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/admin/bookings`)
        ])
        
        console.log('Bookings data:', bookingsRes.data);
        this.bookings = bookingsRes.data || []
        
        // Get status counts for stats
        this.calculateStats()
        
        this.applyFilters()
        
      } catch (err) {
        console.error("Failed to fetch bookings:", err)
        this.error = "Failed to fetch bookings. Please try again later."
      } finally {
        this.loading = false
      }
    },
    
    calculateStats() {
      const statusStats = {
        pending: 0,
        confirmed: 0,
        paid: 0,
        cancelled: 0
      }
      
      this.bookings.forEach(booking => {
        if (statusStats.hasOwnProperty(booking.status)) {
          statusStats[booking.status]++
        }
      })
      
      this.stats = { statusStats }
    },
    
    applyFilters() {
      let filtered = [...this.bookings];
      
      // Apply status filter
      if (this.filters.status && this.filters.status !== 'all') {
        filtered = filtered.filter(booking => booking.status === this.filters.status);
      }
      
      // Apply date range filter
      if (this.filters.dateFrom) {
        const fromDate = new Date(this.filters.dateFrom);
        filtered = filtered.filter(booking => new Date(booking.createdAt) >= fromDate);
      }
      
      if (this.filters.dateTo) {
        const toDate = new Date(this.filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter(booking => new Date(booking.createdAt) <= toDate);
      }
      
      // Apply search filter
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase();
        filtered = filtered.filter(booking => 
          (booking.customerName?.toLowerCase() || '').includes(search) ||
          (booking.customerEmail?.toLowerCase() || '').includes(search) ||
          (booking.bookingRef?.toLowerCase() || '').includes(search) ||
          (this.getTownships(booking)?.toLowerCase() || '').includes(search) ||
          (this.getPackageName(booking)?.toLowerCase() || '').includes(search)
        );
      }
      
      this.filteredBookings = filtered;
    },
    
    getPackageName(booking) {
      if (booking.bookingDetails?.packageName) {
        return booking.bookingDetails.packageName;
      }
      return booking.packageName || 'N/A';
    },
    
    getTownships(booking) {
      if (booking.bookingDetails?.townships) {
        return booking.bookingDetails.townships.join(', ');
      }
      return booking.townName || 'N/A';
    },
    
    getTourDates(booking) {
      if (booking.bookingDetails?.dates) {
        return booking.bookingDetails.dates.join(', ');
      }
      return 'No dates specified';
    },
    
    clearFilters() {
      this.filters = {
        search: "",
        status: "all",
        dateFrom: "",
        dateTo: ""
      }
    },
    
    openStatusModal(booking) {
      this.statusModal = {
        show: true,
        booking: booking,
        newStatus: booking.status,
        cancellationReason: booking.cancellationReason || ""
      }
    },
    
    closeStatusModal() {
      this.statusModal = {
        show: false,
        booking: null,
        newStatus: "",
        cancellationReason: ""
      }
    },
    
    async updateBookingStatus() {
      try {
        await axios.put(`http://localhost:5000/api/admin/bookings/${this.statusModal.booking.bookingId}/status`, {
          status: this.statusModal.newStatus,
          cancellationReason: this.statusModal.cancellationReason
        })
        
        this.closeStatusModal()
        await this.fetchBookings()
        
      } catch (err) {
        console.error("Failed to update booking status:", err)
        alert("Failed to update booking status. Please try again.")
      }
    },
    
    openCancelModal(booking) {
      this.cancelModal = {
        show: true,
        booking: booking,
        reason: ""
      }
    },
    
    closeCancelModal() {
      this.cancelModal = {
        show: false,
        booking: null,
        reason: ""
      }
    },
    
    async cancelBooking() {
      try {
        await axios.delete(`http://localhost:5000/api/admin/bookings/${this.cancelModal.booking.bookingId}`, {
          data: { reason: this.cancelModal.reason }
        })
        
        this.closeCancelModal()
        await this.fetchBookings()
        
      } catch (err) {
        console.error("Failed to cancel booking:", err)
        alert("Failed to cancel booking. Please try again.")
      }
    },
    
    openDeleteModal(booking) {
      this.deleteModal = {
        show: true,
        booking: booking
      }
    },
    
    closeDeleteModal() {
      this.deleteModal = {
        show: false,
        booking: null
      }
    },
    
    async deleteBookingPermanently() {
      try {
        await axios.delete(`http://localhost:5000/api/admin/bookings/${this.deleteModal.booking.bookingId}/permanent`)
        
        this.closeDeleteModal()
        await this.fetchBookings()
        alert('Booking permanently deleted successfully!')
        
      } catch (err) {
        console.error("Failed to delete booking:", err)
        alert("Failed to delete booking. Please try again.")
      }
    },
    
    openDeleteAllModal() {
      this.deleteAllModal = {
        show: true
      }
    },
    
    closeDeleteAllModal() {
      this.deleteAllModal = {
        show: false
      }
    },
    
    async deleteAllCancelledBookings() {
      try {
        await axios.delete('http://localhost:5000/api/admin/bookings/cancelled/all')
        
        this.closeDeleteAllModal()
        await this.fetchBookings()
        alert('All cancelled bookings deleted successfully!')
        
      } catch (err) {
        console.error("Failed to delete cancelled bookings:", err)
        alert("Failed to delete cancelled bookings. Please try again.")
      }
    },
    
    async exportBookings() {
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/bookings/export`, {
          responseType: 'blob'
        })
        
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `bookings-${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        
      } catch (err) {
        console.error("Failed to export bookings:", err)
        alert("Failed to export bookings. Please try again.")
      }
    },
    
    getStatusCount(status) {
      if (!this.stats?.statusStats) return 0
      return this.stats.statusStats[status] || 0
    },
    
    getStatusBadgeClass(status) {
      const classes = {
        pending: 'bg-warning text-dark',
        confirmed: 'bg-primary text-white',
        paid: 'bg-success text-white',
        cancelled: 'bg-danger text-white'
      }
      return classes[status] || 'bg-secondary text-white'
    },
    
    getStatusIcon(status) {
      const icons = {
        pending: 'bi-clock',
        confirmed: 'bi-check-circle',
        paid: 'bi-credit-card',
        cancelled: 'bi-x-circle'
      }
      return icons[status] || 'bi-question-circle'
    },
    
    capitalizeFirst(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  },
  
  mounted() {
    this.fetchBookings()
  }
}
</script>

<style scoped>
/* Custom styles for enhanced appearance */
.card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
}

.table th {
  border-top: none;
  font-weight: 600;
  color: #495057;
  background-color: #f8f9fa !important;
}

.table tbody tr {
  transition: background-color 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.btn {
  transition: all 0.2s ease-in-out;
}

.btn:hover {
  transform: translateY(-1px);
}

.badge {
  font-weight: 500;
  letter-spacing: 0.5px;
}

.modal {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Custom scrollbar for table */
.table-responsive::-webkit-scrollbar {
  height: 8px;
}

.table-responsive::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>