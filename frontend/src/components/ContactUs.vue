<template>
    <div class="contact-us">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <div class="slide-container">
            <button class="nav-arrow left-arrow" @click="scrollLeft">
                <i class="fas fa-chevron-left"></i>
            </button>
            <div class="contact-slider"  ref="slider">
                <div class="contact-slide">
                    <div class = "contact-method">
                        <div class = "icon">
                            <i class ="fas fa-map-marker-alt"></i>
                        </div>
                        <div class = "text">
                                <h4>Address</h4>
                                <u><h5>Everyone is welcome, you can find us here.</h5></u>
                                <p>314 Imam Haron Rd<br> Cape Town<br> 7780<br>Western Cape</p>
                        </div>
                    <div class="map-container">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.041834726101!2d18.4652093152125!3d-33.99834598061914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1dcc42e1c3d7e6a5%3A0x9e7c5a7b0d0b0b0b!2s314%20Imam%20Haron%20Rd%2C%20Claremont%2C%20Cape%20Town%2C%207700%2C%20South%20Africa!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                            width="100%"
                            height="450"
                            style="border:0;"
                            allowfullscreen
                            loading="lazy"
                            title="Cape Route Tours Location">
                        </iframe>
                    </div>
                </div>
            </div>
            <div class="contact-slide">
                <div class = "contact-method">
                    <div class = "icon">
                        <i class = "fas fa-phone"></i>
                    </div>
                    <div class ="details">
                        <h4>Call or Whatsapp Us</h4>
                        <p>Call: (+27) 71 005 3360<br> Whatsapp (+27) 71 234 5678</p>
                    </div>
                
                    <div class= "icon">
                        <i class = "fas fa-envelope"></i>
                    </div>
                    <div class = "details">
                        <h4>Email</h4>
                        <p>caperoutetours@gmail.com</p>
                    </div>
                </div>
            </div>
            <div class="contact-slide">
                <div class = "contact-method">
                    <div class= "icon">
                            <i class = "fas fa-clock"></i>
                    </div>
                    <div class = "details">
                        <h4>Business Open Hours</h4>
                        <table border="1" cellspacing="1" cellpadding="15"align ="center">
                            <thead>
                                <tr>
                                    <th>Days</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Monday</td>
                                    <td>08:00 - 16:30</td>
                                </tr>
                                <tr>
                                    <td>Tuesday</td>
                                    <td>08:00 - 16:30</td>
                                </tr>
                                <tr>
                                    <td>Wednesday</td>
                                    <td>08:00 - 16:30</td>
                                </tr>
                                <tr>
                                    <td>Thursday</td>
                                    <td>08:00 - 16:30</td>
                                </tr>
                                <tr>
                                    <td>Friday</td>
                                    <td>08:00 - 16:30</td>
                                </tr>
                                <tr>
                                    <td>Saturday</td>
                                    <td>08:00 - 16:30</td>
                                </tr>
                                <tr>
                                    <td>Sunday</td>
                                    <td>08:00 - 14:40</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="contact-slide">
               <div class = "social-links">
                    <h3>Follow us </h3> 
                    <div class = "social-icons">
                        <a href = "https://www.facebook.com/profile.php?id=100070328852245" aria-label = "Facebook" ><i class="fab fa-facebook"></i></a><br><br>
                        <a href = "#" aria-label = "Instagram"><i class="fab fa-instagram"></i></a><br><br>
                    </div>
                </div> 
            </div>
        </div>
            <button class="nav-arrow right-arrow" @click="scrollRight">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    </div>
</template>
<script>
 export default{
    methods:{
        scrollLeft(){
            const slider = this.$refs.slider;
            slider.scrollBy({
                left: -slider.offsetWidth,
                behavior: 'smooth'
            });
        },
        scrollRight(){
            const slider = this.$refs.slider;
            slider.scrollBy({
                left: slider.offsetWidth,
                behavior: 'smooth'
            }); 
        }
    }
 }
</script>
<style>
   .contact-us {
    overflow: hidden;
    padding: 20px;
}
.slide-container {
    display: flex;
    align-items: center;
    position: relative;
    max-width: 1000px;
    margin: 0 auto;
}
.contact-slider {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    width: 90%;
    margin: 0 auto;
    scrollbar-width: none; /* Firefox */
}
.contact-slider::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
}
.contact-slide {
    flex: 0 0 100%;
    scroll-snap-align: start;
    padding: 20px;
    box-sizing: border-box;
    min-height: 700px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.nav-arrow {
    background: #091d35;
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    z-index: 10;
}
.nav-arrow:hover {
    background: #f6c46d;
    transform: scale(1.1);
}
.left-arrow {
    margin-right: 10px;
}
.right-arrow {
    margin-left: 10px;
}
.contact-method {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
}
.icon {
    font-size: 40px;
    margin-bottom: 15px;
    color: #f6c46d;
}
.map-container {
    width: 100%;
    max-width: 800px;
}
.social-icons a {
    display: block;
    padding: 20px;
    margin: 0px ;
    background-color: #f0f0f0;
    border-radius: 5px;
    transition: all 0.3s ease;
}
.social-icons a:hover {
    background-color: #f6c46d;
    color: white;
    transform: translateY(-3px);
}
table {
    width: 100%;
    max-width: 400px;
    border-collapse: collapse;
    margin: 0 auto;
}
a {
    color: #091d35;
    text-decoration: none;
}
a:hover {
    text-decoration: underline;
}
@media (max-width: 768px) {
    .slider-container {
        width: 100%;
    }
    
    .contact-slide {
        min-height: 400px;
    }
    
    .nav-arrow {
        width: 40px;
        height: 40px;
        font-size: 16px;
    }
} 
</style>