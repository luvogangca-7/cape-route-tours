import Checkout from '@/components/Checkout.vue'
import PaymentCancel from '@/components/PaymentCancel.vue'
import PaymentSuccess from '@/components/PaymentSuccess.vue'
import TourPackages from '@/components/TourPackages.vue'
import AdminBlogView from '@/views/admin/AdminBlogView.vue'
import AdminInquiriesView from '@/views/admin/AdminInquiriesView.vue'
import BoKaapTours from '@/views/admin/BoKaapTours.vue'
import Dashboard from '@/views/admin/Dashboard.vue'
import KhayelitshaTours from '@/views/admin/KhayelitshaTours.vue'
import LangaTours from '@/views/admin/LangaTours.vue'
import LoginView from '@/views/admin/LoginView.vue'
import MitchellsPlainTours from '@/views/admin/MitchellsPlainTours.vue'
import BlogDetails from '@/views/client/BlogDetails.vue'
import BlogsView from '@/views/client/BlogsView.vue'
import BookingsPage from '@/views/client/BookingsPage.vue'
import Cancel from '@/views/client/Cancel.vue'
import ContactPage from '@/views/client/ContactPage.vue'
import FullCapeCulture from '@/views/client/FullCapeCulture.vue'
import HomeView from '@/views/client/HomeView.vue'
import RegisterForm from '@/views/client/RegisterForm.vue'
import Success from '@/views/client/Success.vue'
import Terms from '@/views/client/Terms.vue'
import TourView from '@/views/client/TourView.vue'
import TownshipDuo from '@/views/client/TownshipDuo.vue'
import AdminBookings from '@/views/admin/AdminBookings.vue'
import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {path: '/',name: 'home',component: HomeView},
  {path: '/tour',name: 'TourView',component: TourView},
  {path: '/blog',name: 'blog',component: BlogsView},
  {path:'/duo',component:TownshipDuo},
  {path: '/single-township',name: 'SingleTownship',component: () => import('@/views/client/SingleTownship.vue')},
  {path:'/full',component:FullCapeCulture},
  {path:'/success',component:Success},
  {path:'/cancel',component:Cancel},
  {path:'/tours',component:TourPackages},
  {path:'/register',component:RegisterForm},
  {path:'/checkout',component:Checkout},
  {path: '/tours/langa',name: 'Langa',component: ()=> import('../views/client/LangaTour.vue')},
  {path: '/tours/khayelitsha',name: 'Khayelitsha',component: ()=> import('@/views/client/KhayelitshaTour.vue')},
  {path: '/tours/bokaap',name: 'BoKaapTour',component: () =>import('@/views/client/BokaapTour.vue')},
  {path: '/tours/mitchellsplain',name: 'MitchellsPlain',component: ()=> import('../views/client/MitchellsplainTour.vue')},
  {path: '/blog/:id',name: 'BlogDetails',component: BlogDetails,props: true},
  {path: '/admin/blog',name: 'AdminBlog',component: AdminBlogView, meta: { requiresAuth: true }},
  {path: '/contact',name: 'contact',component:ContactPage},
  {path: '/admin/inquiries',name: 'AdminInquiries',component: AdminInquiriesView, meta: { requiresAuth: true }},
  {path: '/bookings',name: 'Bookings',component: BookingsPage},
  {path: '/terms', name: 'Terms',component: Terms},
  {path: '/paysuccess', component:PaymentSuccess},
  {path: '/paycancel', component: PaymentCancel},
  {path: '/admin/login',name:'Login',component: LoginView},
  {path: '/admin/dashboard',name: 'Dashboard',component: Dashboard, meta: { requiresAuth: true }},
  // {path: '/admin/Khayelitsha',name: 'KhayelitshaTours',component: KhayelitshaTours, meta: { requiresAuth: true }},
  {path: '/admin/bookings' , name: 'BookingsAdmin', component: AdminBookings, meta: { requiresAuth: true }},
  // {path: '/admin/Langa',name: 'LangaTours',component: LangaTours, meta: { requiresAuth: true }},
  // {path: '/admin/Mitchellsplain',name: 'MitchellsPLainTours',component: MitchellsPlainTours, meta: { requiresAuth: true }},
  // {path: '/admin/BoKaap',name: 'BoKaapTours',component: BoKaapTours, meta: { requiresAuth: true }}
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

function isAdminAuthenticated() {
  return localStorage.getItem("role") === "admin";
}

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
  const authTimestamp = sessionStorage.getItem("authTimestamp");
  const oneHour = 60 * 60 * 1000;

  if (authTimestamp && (Date.now() - parseInt(authTimestamp)) > oneHour) {
    // Session expired
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("authTimestamp");
  }

  if (to.meta.requiresAuth && sessionStorage.getItem("isAuthenticated") !== "true") {
    next("/admin/login");
  } else {
    next();
  }
});

export default router
