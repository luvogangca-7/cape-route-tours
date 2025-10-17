# 🌍 Cape Route Tours  
Cape Route Tours is a **tourism booking and management platform** designed to give travelers an authentic experience of Cape Town’s vibrant townships. Built with **Vue.js** (front-end), **Node.js + Express** (back-end), and **MySQL** (database), the system allows tourists to book cultural tours, read local stories, and connect with the company — while providing an **admin dashboard** for efficient management of tours, bookings, and content.  

---

## ✨ Features  

- 🌐 **Explore Township Tours** – Bo-Kaap, Langa, Gugulethu, Mitchells Plain, Khayelitsha  
- 🏷️ **Tour Packages** – single township, duo tours, and multi-day cultural experiences  
- 💳 **Secure Payments** – integrated with **Stripe** for safe online bookings  
- 🧾 **Automatic Booking References** – generated in the format `CRT-XXXXXXX`  
- ❌ **Booking Cancellations** – with reason logging for better insights  
- 📖 **Blog Section** – stories and insights from Cape Town’s neighborhoods  
- 📬 **Contact Form** – for direct customer inquiries  
- 📱 **Responsive Design** – optimized for mobile, tablet, and desktop  
- 🔑 **Admin Dashboard** – manage tours, bookings, blogs, and customer messages  

---

## 🛠️ Technologies Used  

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
- MySQL (`mysql2/promise`)  
- bcrypt (secure password hashing)  
- dotenv (environment variables)  
- Stripe API (payment integration)  
- CORS (cross-origin access)  

---

## 🗄️ Database Structure (`crt_db`)  

### Core Tables  
- **blogs** – blog posts (`title`, `author`, `location`, `content`, `image_url`)  
- **bookings** – booking details (`status`, `bookingRef`, `specialRequests`, Stripe session ID, tour details JSON)  
- **categories** – organizes tours into groups  
- **contact_messages** – customer inquiries  
- **customers** – customer data (`name`, `email`, `phone`)  
- **packages** – tour packages (single, duo, group, etc.)  
- **township** – township/tour metadata  
- **users / admin** – admin login credentials (hashed passwords)  

> All tables are linked using **foreign keys** for relational integrity.  
> Example: `bookings.customerId → customers.customerId`, `bookings.packageId → packages.packageId`.  

---

## 🚀 Setup Instructions  

```bash
# 1. Clone the Repository
git clone https://github.com/enriquekanyemba/cape-route-tour.git
cd cape-route-tours

# 2. Install Front-End Dependencies
cd frontend
npm install

# 3. Install Back-End Dependencies
cd ../backend
npm install

# 4. Import the Database
mysql -u root -p crt_db < crt_db.sql

# 5. Configure Environment Variables (inside /backend/.env)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=crt_db
DB_DIALECT=mysql
PORT=5000
STRIPE_SECRET_KEY=sk_test_xxxxx
GMAIL_USER=caperoutetour@gmail.com
GMAIL_PASS=spspjtdepngotpkj
FRONTEND_URL=http://localhost:8080
NODE_ENV=development


# 6. Start the Servers
# Back-End (Node.js)
cd backend
npm run dev

# Front-End (Vue.js)
cd frontend
npm run serve

🔑 Demo Admin Login
Email: admin@caperoute.com
Password: admin123

👥 Team
Enrique Kanyemba
Luvo Gangca
Nieshaan De Beer
Emihle Maxengana

📜 License
This project was built for educational and portfolio purposes.












