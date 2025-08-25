import { createStore } from 'vuex'

export default createStore({
  state: {
    contactInfo: {
      email: 'support@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Business St, City, Country'
    },
    user: {
      isAdmin: false
    },
    notifications: []
  },
  getters: {
    isAdmin: state => state.user.isAdmin,
    contactEmail: state => state.contactInfo.email,
    contactPhone: state => state.contactInfo.phone,
    contactAddress: state => state.contactInfo.address,
    unreadNotifications: state => state.notifications.filter(n => !n.read)
  },
  mutations: {
    SET_ADMIN_STATUS(state, status) {
      state.user.isAdmin = status
    },
    SET_CONTACT_INFO(state, info) {
      state.contactInfo = info
    },
    ADD_NOTIFICATION(state, notification) {
      state.notifications.push({
        ...notification,
        id: Date.now(),
        read: false,
        timestamp: new Date()
      })
    },
    MARK_NOTIFICATION_READ(state, id) {
      const notification = state.notifications.find(n => n.id === id)
      if (notification) notification.read = true
    }
  },
  actions: {
    async fetchContactInfo({ commit }) {
      try { 
        const contactInfo = {
          email: 'support@example.com',
          phone: '+1 (555) 123-4567',
          address: '123 Business St, City, Country'
        }
        commit('SET_CONTACT_INFO', contactInfo)
        return contactInfo
      } catch (error) {
        console.error('Failed to fetch contact info:', error)
        throw error
      }
    },
    async checkAdminStatus({ commit }) {
      try {
        // In a real app, verify admin status with backend
        const isAdmin = false // Default to false, check with your auth system
        commit('SET_ADMIN_STATUS', isAdmin)
        return isAdmin
      } catch (error) {
        console.error('Failed to check admin status:', error)
        throw error
      }
    },
    notify({ commit }, { message, type = 'info' }) {
      commit('ADD_NOTIFICATION', {
        message,
        type
      })
    }
  },
  modules: {
    // You can add modules here if your store grows
  }
})

