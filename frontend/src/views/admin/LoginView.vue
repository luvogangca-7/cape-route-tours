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
                <div class="extra-links">
                    <a href="#" @click.prevent="handleForgotPassword" placeholder="Forgot Password?">Forgot
                        Password?</a>
                </div>
            </form>
            <div class="signup-promp">
                <p>Don't have an account?
                    <a href="#" @click.prevent="handleSignUp">Sign Up</a>
                </p>
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
            ValidEmail: "Admin@CpTours",
            ValidPassword: "Tour123"
        };
    },
    methods: {
        handleLogin() {
            if (this.email === this.ValidEmail && this.password === this.ValidPassword) {
                sessionStorage.setItem("isAuthenticated", "true");
                sessionStorage.setItem("authTimestamp", Date.now());

                // ✅ Redirect to admin dashboard
                const redirectPath = this.$route.query.redirect || "/admin/dashboard";
                this.$router.push(redirectPath);
            } else {
                alert("Invalid e-mail or password entered. Please try again.");
                this.password = "";
            }
        },
        handleForgotPassword() {
            alert('A password reset link has been sent to your email address. If it exists in our system.');
        },
        handleSignUp() {
            alert('Please contact Admin manager')
        },
        checkAuth() {
            const authTimestamp = sessionStorage.getItem('authTimestamp');
            const oneHour = 60 * 60 * 1000; // One hour in milliseconds

            if (authTimestamp && (Date.now() - parseInt(authTimestamp) < oneHour)) {
                this.$router.push('/dashboard');
            } else {
                sessionStorage.removeItem('isAuthenticated');
                sessionStorage.removeItem('authTimestamp');
            }
        }
    },
    created() {
        this.checkAuth();
    }
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
</style>