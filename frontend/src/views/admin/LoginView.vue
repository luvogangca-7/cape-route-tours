<!-- file path: frontend/ src/ views/ LoginView.vue -->
<template>
    <div class="login-container">
        <div class="login-box">
            <img src="@/assets/logo.jpg" alt="Cape Route Tours logo" class="logo" />
            <h2>Welcome Admin User</h2>
            <form @submit.prevent="handleLogin">
                <input type="email" placeholder="Email" v-model="email" required />
                <input type="password" placeholder="Password" v-model="password" required />
                <button type="submit">Login</button>
            </form>
            <!-- Link to open client site in new tab -->
            <div class="open-client mt-3">
                <a :href="clientUrl" target="_blank" rel="noopener" class="btn btn-link-client">Open Client Site</a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoginView',
    data() {
        return {
            email: '',
            password: '',
            ValidEmail: "admin@tour.com",
            ValidPassword: "tour123"
        };
    },
    methods: {
        async handleLogin() {
            try {
                const res = await fetch((process.env.VUE_APP_API_BASE || 'http://localhost:5000') + '/api/admin/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: this.email, password: this.password })
                });
                const data = await res.json();
                if (data.success && data.token) {
                    // store token
                    localStorage.setItem('admin_token', data.token);
                    localStorage.setItem('admin_token_expiry', Date.now() + (parseExpiry(data.expiresIn) || 2 * 60 * 60 * 1000));
                    const redirectPath = this.$route.query.redirect || "/admin/dashboard";
                    this.$router.push(redirectPath);
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch (err) {
                console.error('Login error', err);
                alert('Login failed — check console for details');
            }
        },
        handleForgotPassword() {
            alert('A password reset link has been sent to your email address. If it exists in our system.');
        },
        handleSignUp() {
            alert('Please contact Admin manager')
        },
        checkAuth() {
            const token = localStorage.getItem('admin_token');
            const expiry = parseInt(localStorage.getItem('admin_token_expiry') || '0', 10);

            if (token && Date.now() < expiry) {
                this.$router.push('/admin/dashboard');
            } else {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_token_expiry');
            }
        }
    },
    computed: {
        clientUrl() {
            return '/'
        }
    },
    created() {
        this.checkAuth();
    }
}

function parseExpiry(exp) {
    // exp can be like '2h' or '120m' — naive parse for common patterns
    if (!exp) return null;
    if (typeof exp === 'number') return exp;
    if (exp.endsWith('h')) return parseInt(exp) * 60 * 60 * 1000;
    if (exp.endsWith('m')) return parseInt(exp) * 60 * 1000;
    if (exp.endsWith('s')) return parseInt(exp) * 1000;
    return null;
}
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(to right, #d0e8ff, #a6c8ff);
    padding: 20px;
}

.login-box {
    background-color: white;
    padding: 40px 30px;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
    text-align: center;
}

.logo {
    width: 90px;
    margin-bottom: 30px;
    font-weight: 600;
    font-size: 20px;
}

input {
    width: 100%;
    padding: 12px 14px;
    margin-bottom: 16px;
    border: 1px solid #c6d6f0;
    border-radius: 8px;
    font-size: 1rem;
    background-color: white;
    color: #333;
    transition: border-color 0.3s ease;
}

input:focus {
    outline: none;
    border-color: #6aaeff;
}

input::placeholder {
    color: #999;
}

button {
    width: 100%;
    padding: 12px;
    background-color: #4d9fff;
    color: white;
    font-size: 1rem;
    font-weight: 500;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #3585e0;
}

.extra-links {
    margin-top: 10px;
    font-size: 0.9rem;
}

.extra-link a {
    color: #4d9fff;
    text-decoration: none;
}

.extra-links a:hover {
    text-decoration: underline;
}

.signup-promp {
    margin-top: 20px;
    font-size: 14px;
    color: #666;
}

.singup-promp a {
    color: #4d9fff;
    text-decoration: none;
}

.signup-promp a:hover {
    text-decoration: none;
}

/* Open client site button */
.open-client { text-align: center; }
.btn-link-client {
    display: inline-block;
    margin-top: 8px;
    padding: 8px 14px;
    border-radius: 8px;
    background: rgba(77,159,255,0.08);
    color: #2b6cb0;
    border: 1px solid rgba(77,159,255,0.12);
    text-decoration: none;
    font-weight: 600;
}
.btn-link-client:hover { background: rgba(77,159,255,0.12); }
</style>