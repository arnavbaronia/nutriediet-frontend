import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import "../styles/TestimonialsPageUpdated.css"; 
import client1 from "../assets/client1.png"; 
import client2 from "../assets/client2.png"; 

const testimonialsData = [
  {
    text: "Nutriediet completely changed my perspective on food. I used to struggle with meal planning, but their customized approach made it easy and sustainable. Within three months, I felt more energetic, my digestion improved, and I even lost a few pounds effortlessly!",
    name: "John Doe",
    plan: "Keto Plan",
    image: client1,
  },
  {
    text: "I always believed eating healthy meant boring meals, but Nutriediet proved me wrong! Their recipes were both nutritious and delicious, making my weight loss journey enjoyable. I never felt deprived, and I now have a much better relationship with food.",
    name: "Jane Smith",
    plan: "Weight Loss Plan",
    image: client2,
  },
  {
    text: "My goal was to gain muscle while staying lean, and Nutriediet helped me achieve exactly that. The diet plans were structured, with the right balance of protein and carbs. Their support and guidance made the process smooth, and I saw real results within weeks!",
    name: "David Johnson",
    plan: "Muscle Gain Plan",
    image: client1,
  },
  {
    text: "Being a vegetarian, I always found it hard to meet my protein requirements, but Nutriediet’s vegan plan gave me excellent alternatives. I feel stronger and healthier than ever, and my energy levels have drastically improved!",
    name: "Emily Brown",
    plan: "Balanced Diet",
    image: client2,
  },
  {
    text: "Intermittent fasting always seemed complicated, but Nutriediet made it super simple. Their plan ensured I was eating nutritious meals at the right times, and the results were amazing. My metabolism improved, and I shed extra weight without stress!",
    name: "Michael Lee",
    plan: "Intermittent Fasting",
    image: client1,
  },
  {
    text: "I struggled with unhealthy cravings, but Nutriediet provided structured meal plans that kept me satisfied throughout the day. Their approach made it easy to stick to healthy eating without feeling restricted!",
    name: "Sophia Wilson",
    plan: "Vegan Plan",
    image: client2,
  },
];

const TestimonialsPageUpdated = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (testimonialsData.length - 2));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="testimonials-page-updated">
      <div className="testimonials-content-wrapper">
        <h2 className="testimonials-heading">What Our Clients Say</h2>
        <p className="testimonials-description">
          At Nutriediet, we take pride in guiding individuals toward lasting health and wellness. But don’t just take our word for it — hear from the clients whose lives have been transformed through our personalized nutrition programs.
        </p>
        <p className="testimonials-description">
          Each story reflects not only improved health but also renewed confidence, balance, and vitality — the essence of what we aim to achieve with every plan.
        </p>
        <div className="testimonials-slider">
          <motion.div
            className="testimonials-boxes-container"
            animate={{ x: `-${currentIndex * 33.33}%` }}
            transition={{ ease: "easeInOut", duration: 0.8 }}
          >
            {testimonialsData.map((testimonial, i) => (
              <motion.div key={i} className="testimonial-card">
                <p className="testimonial-text">"{testimonial.text}"</p>
                <img src={testimonial.image} alt={testimonial.name} className="client-avatar" />
                <h3 className="client-name">{testimonial.name}</h3>
                <p className="client-plan">{testimonial.plan}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      <a
        href="https://wa.me/+919391450725"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float-button"
      >
        <FaWhatsapp className="whatsapp-icon" />
        Chat on WhatsApp
      </a>
    </div>
  );
};

export default TestimonialsPageUpdated;