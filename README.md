# Cape Route Tours
Cape Route Tours is a tourism booking and management platform built with **Vue.js** (front-end), **Node.js + Express** (back-end), and **MySQL** (database).
The system allows tourists to explore Cape Town’s townships, book cultural tours, read blogs, and contact the company — while the admin can manage tours, bookings, and content.
---
## :sparkles: Features
- :earth_africa: Explore township tours (Bo-Kaap, Langa, Gugulethu, Mitchells Plain, Khayelitsha, Philippi, and more)
- :label: Tour packages: single township, duo tours, multi-day experiences
- :date: Secure booking system with Stripe payment integration
- :receipt: Automatic booking reference generation (CRT-XXXXXXX)
- :octagonal_sign: Booking cancellation with reason logging
- :book: Blog section with stories from Cape Town’s neighborhoods
- :mailbox_with_mail: Contact form for customer inquiries
- :mobile_phone: Responsive front-end design (mobile/tablet ready)
- :closed_lock_with_key: Admin dashboard for managing bookings, tours, blogs, and messages
---
## :hammer_and_spanner: Technologies Used
### Front-End
- Vue.js (Vue CLI)
- Vue Router
- Axios
- Bootstrap
- Animate.css
- Font Awesome
### Back-End
- Node.js
- Express.js
- MySQL (via `mysql2/promise`)
- bcrypt (secure password hashing)
- dotenv (environment variables)
- Stripe API (payment handling)
- CORS (cross-origin access)
---
## :card_index_dividers: Database Structure (`crt_db`)
### Core Tables
- **blogs** – blog posts with `title`, `author`, `location`, `content`, `image_url`
- **bookings** – customer bookings (with `status`, `bookingRef`, `specialRequests`, Stripe session ID, JSON tour details)
- **categories** – categories for organizing tours
- **contact_messages** – stores inquiries sent through the contact form
- **customers** – customer details (`name`, `email`, `phone`, etc.)
- **packages** – different tour packages (single, duo, group, etc.)
- **township** – township/tour location metadata
- **users / admin** – login credentials with secure hashed passwords
> Each table uses **foreign keys** for relational integrity (e.g., `bookings.customerId → customers.customerId`, `bookings.packageId → packages.packageId`).
---
## :rocket: Setup Instructions
### 1. Clone the repository
```bash
git clone https://github.com/luvogangca-7/cape-route-tours.git
cd cape-route-tours
2. Install front-end dependencies
bash
Copy
Edit
cd frontend
npm install
3. Install back-end dependencies
bash
Copy
Edit
cd ../backend
npm install
4. Import the database
Create a MySQL database (e.g. crt_db).
Import the provided SQL dump:
bash
Copy
Edit
mysql -u root -p crt_db < crt_db.sql
5. Configure .env in backend
Create a .env file inside /backend:
env
Copy
Edit
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=urpssword
DB_NAME=tour_booking
DB_DIALECT=mysql
PORT=5000
STRIPE_SECRET_KEY=sk_test_51Rt7PRCpnBRvaWSUSuXmLi8aff0mhDaJCQfAHMlLiVOuhfA2mgpfQEzQypgeoDuYUYYJSeSOJDFaVJN6CX59URyd00boDK69Qu
GMAIL_USER=caperoutetour@gmail.com
GMAIL_PASS=spspjtdepngotpkj
# Add these new environment variables
FRONTEND_URL=http://localhost:8080  # For development
# FRONTEND_URL=https://yourdomain.com  # For production (uncomment when deploying)
NODE_ENV=development
6. Start servers
Back-End (Node.js)
bash
Copy
Edit
cd backend
npm run dev
Front-End (Vue.js)
bash
Copy
Edit
cd frontend
npm run serve
:key: Demo Admin Login
Email: admin@caperoute.com
Password: admin123
:silhouettes: Team
Luvo Gangca
Aisha Kabanga
Nieshaan De Beer
Emihle Maxengana
Enrique Kanyemba
:scroll: License
This project is for educational and portfolio purposes only