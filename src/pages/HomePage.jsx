import { React, useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import dietimage from "../assets/dietimage.jpg";
import aboutus from "../assets/aboutus.jpg";
import dietonphone from "../assets/dietonphone.jpg";
import plan1 from "../assets/plan1.svg";
import plan2 from "../assets/plan2.svg";
import plan3 from "../assets/plan3.svg";
import plan4 from "../assets/plan4.svg";
import "../styles/HomePage.css";
import HomeNavBar from "../components/HomeNavBar";
import TestimonialsPageUpdated from "./TestimonialsPageUpdated";
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import PermPhoneMsgIcon from '@mui/icons-material/PermPhoneMsg';
import RamenDiningRoundedIcon from '@mui/icons-material/RamenDiningRounded';
import Face3RoundedIcon from '@mui/icons-material/Face3Rounded';

const HomePage = () => {
  useEffect(() => {
    const createLeaves = () => {
      const leafContainer = document.querySelector(".falling-leaves");
      for (let i = 0; i < 5; i++) {
        let leaf = document.createElement("div");
        leaf.classList.add("leaf");
        leaf.style.left = `${Math.random() * 100}vw`;
        leaf.style.animationDuration = `${Math.random() * 5 + 5}s`;
        leaf.style.animationDelay = `${Math.random() * 5}s`;
        leafContainer.appendChild(leaf);
      }
    };
    createLeaves();
  }, []);

  const [descExpanded, setDescExpanded] = useState(false);
  const TRUNCATE_LENGTH = 281; 

  const fullDescription = `Dieting is not about eating less - It’s about eating right. 
There is no one-size-fits-all  “perfect diet plan”.  The best diet is the one personalized for you. At Nutriediet, we design customized diet plans through expert in-person or online consultations & nutritional coaching. 
Wellness in not just about what you eat - it’s also about how do you feel. At Nutriediet, we consider your emotional and mental well-being as part of your health journey, offering mindful counceling to help you find balance inside & out.
Get comprehensive meal plans & lifestyle guidance for conditions like Obesity, PCOS, Diabetes, Hypertension,Thyroid, Kidney & Liver Disease.
Begin your Journey to safe, sustainable & complete wellness today.`;

  const needsTruncate = fullDescription.length > TRUNCATE_LENGTH;
  const previewText = needsTruncate ? fullDescription.slice(0, TRUNCATE_LENGTH).trim() + "..." : fullDescription;

  const handleToggleDesc = () => setDescExpanded(prev => !prev);

  return (
    <>
      <div className="falling-leaves"></div>
      <HomeNavBar />
      <div className="homepage-container">
        <div className="text-section">
          <h1 className="title">
            <span className="word word-diet">Diet.</span>
            <span className="word word-nutrition">Nutrition.</span>
            <span className="word word-mindfulness">Mindfulness.</span>
          </h1>
          <h2 className="subtitle">And Complete Wellness.</h2>

          <div className="description-wrapper">
            <p className="description" style={{ whiteSpace: "pre-wrap" }}>
              {descExpanded || !needsTruncate ? fullDescription : previewText}
            </p>

            {needsTruncate && (
              <button
                className="read-more-hero"
                onClick={handleToggleDesc}
                aria-expanded={descExpanded}
                aria-label={descExpanded ? "Show less description" : "Read more about Nutriediet"}
              >
                {descExpanded ? "Read less" : "Read more..."}
              </button>
            )}
          </div>
        </div>

        <div className="image-section">
          <img src={dietimage} alt="Healthy Diet" className="diet-image" />
        </div>
      </div>

      <div className="about-container">
        <div className="about-image-section">
          <img src={aboutus} alt="Nutritionist" className="about-image" />
          <h3 className="founder-title">Founder & Head Nutritionist</h3>
          <h3 className="founder-name">Ankita Gupta</h3>
        </div>

        <div className="about-text-box">
          <h2 className="about-heading">About Us</h2>
          <p className="about-text">
            Welcome to Nutriediet, where nutrition meets care.
          </p>
          <p className="about-text">
            We are a passionate team of dedicated professionals committed to helping you achieve lasting health through personalized and sustainable dietary solutions.
          </p>
          <p className="about-text">
            Led by an experienced and qualified dietitian with over 20 years of expertise, our clinic specializes in customized nutrition plans tailored to your unique needs, preferences, and health goals.
          </p>
          <p className="about-text">
            At <strong>Nutriediet</strong>, we believe that food is not just fuel—it’s medicine for the body, mind, and soul. Our approach blends scientific evidence with compassionate care, empowering you with the knowledge and guidance to take charge of your well-being.
            Over the years, we have helped individuals across diverse backgrounds manage weight, diabetes, PCOS, hypertension, and kidney and liver conditions, transforming not just their health but their entire approach to living well.
            Every plan we create is practical, science-backed, and deeply personalized—because your journey to wellness should be as unique as you are.
          </p>
          <p className="about-text">
            Let’s work together to turn your health goals into lasting achievements.
          </p>
        </div>
      </div>

      <div className="health-plans-container">
        <h2 className="health-plans-heading">Our Expertise</h2>
        <p className="health-plans-description">
          At <strong>Nutriediet</strong>, we go beyond conventional diet plans. Our work is rooted in personalized nutrition, emotional balance, and sustainable lifestyle transformation.
          We design programs that nourish your body, calm your mind, and restore natural harmony — helping you look, feel, and live your best.
        </p>

        <div className="health-plans-grid">
          {[
            {
              img: plan1,
              title: "Weight Management",
              desc: (
                <>
                  <p>Achieve your ideal body composition through balanced, sustainable, and customized nutrition strategies.</p>
                  <ul>
                    <li><strong>Weight Loss Programs</strong> – Scientifically designed plans to help you shed fat, preserve muscle, and improve metabolism.</li>
                    <li><strong>Weight Gain Programs</strong> – Nourishing plans to promote healthy muscle and weight gain.</li>
                    <li><strong>Maintenance Diets</strong> – Personalized diets to help you maintain your results with long-term balance.</li>
                  </ul>
                </>
              )
            },
            {
              img: plan2,
              title: "Lifestyle Nutrition Programs",
              desc: (
                <>
                  <p>Restore hormonal balance, improve energy, and build lifelong healthy habits through tailored lifestyle programs.</p>
                  <ul>
                    <li><strong>PCOS / PCOD Nutrition</strong></li>
                    <li><strong>Prenatal & Postnatal Nutrition</strong></li>
                    <li><strong>Child & Adolescent Nutrition</strong></li>
                  </ul>
                </>
              )
            },
            {
              img: plan3,
              title: "Therapeutic Diets",
              desc: (
                <>
                  <p>Targeted dietary interventions for medical and metabolic conditions, supporting healing and better quality of life.</p>
                  <ul>
                    <li><strong>Diabetes Management</strong></li>
                    <li><strong>Hypertension & Heart Health</strong></li>
                    <li><strong>Kidney Health Support</strong></li>
                  </ul>
                </>
              )
            },
            {
              img: plan4,
              title: "Specialized Wellness Services",
              desc: (
                <>
                  <p>For those seeking advanced or performance-focused nutrition solutions.</p>
                  <ul>
                    <li><strong>Sports Nutrition</strong> – Optimize endurance, recovery, and performance.</li>
                    <li><strong>Detox Diet Plans</strong> – Gentle, natural detoxification for renewed vitality.</li>
                    <li><strong>Immunity-Boosting Plans</strong> – Strengthen your body's defenses with nutrient-rich, science-backed meal plans.</li>
                  </ul>
                </>
              )
            }
          ].map((plan, index) => (
            <div className="health-plan-box" key={index}>
              <img src={plan.img} alt={plan.title} className="plan-image" />
              <h3 className="plan-title">{plan.title}</h3>
              <div className="plan-description">{plan.desc}</div>
            </div>
          ))}
        </div>

        <p className="health-plans-description">
          All our meal plans are supported by practical, easy-to-follow recipes, available in the dedicated Recipes section.
        </p>
        <p className="health-plans-description">
          To complement your nutrition plan, we also provide guidance on appropriate workouts for your fitness level and goals. You can access exercise videos and routines in the Exercise section for a complete wellness experience.
        </p>
      </div>

      <div className="how-it-works-container">
        <h2 className="how-it-works-heading">How It All Comes Together</h2>
        <p className="how-it-works-description">
         At Nutriediet, every consultation is a personalized journey — carefully designed to understand you before designing your plan. Whether you choose an online or in-person consultation, our process ensures a holistic, compassionate, and science-backed approach.
        </p>

        <div className="how-it-works-content">
          <div className="how-it-works-image">
            <img src={dietonphone} alt="Diet Consultation" className="consultation-image" />
          </div>

          <div className="how-it-works-steps">
            {[
              { icon: <Face3RoundedIcon />, title: "Understanding You", desc: "We begin with an in-depth consultation to understand your lifestyle, medical history, eating habits, emotional health, and goals. This helps us identify the root causes and design a plan that fits seamlessly into your daily life." },
              { icon: <RamenDiningRoundedIcon />, title: "Personalized Nutrition Planning", desc: "Based on your assessment, we create a tailor-made nutrition plan — focusing on balance, sustainability, and variety. Your plan is not just about food; it also includes guidance on hydration, activity, sleep, and mindfulness." },
              { icon: <PermPhoneMsgIcon />, title: "Regular Follow-ups & Adjustments", desc: "We stay connected through regular reviews to track progress, review & update your plan based on progress, and keep you motivated. This dynamic approach ensures that your program evolves with your needs." },
              {
                icon: <LaptopMacIcon />,
                title: "Flexible Consultation Options",
                desc: (
                  <>
                    <p>Choose the format that suits you best:</p>
                    <ul>
                      <li><strong>Online Consultations</strong> – Connect from anywhere for complete diet and wellness guidance.</li>
                      <li><strong>In-Person Consultations</strong> – Visit our clinic for detailed assessments and personalized counseling sessions.</li>
                    </ul>
                    <p>Every interaction at Nutriediet is built on trust, empathy, and expertise — ensuring your path to wellness is as rewarding as your results.</p>
                  </>
                )
              },
            ].map((step, index) => (
              <div className="step" key={index}>
                <div className="step-header">
                  {step.icon}
                  <h3 className="step-title">{step.title}</h3>
                </div>
                <div className="step-description">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TestimonialsPageUpdated />
      <a
        href="https://wa.me/+919391450725 "
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button"
      >
        <FaWhatsapp className="whatsapp-icon" />
        Chat on WhatsApp
      </a>
    </>
  );
};

export default HomePage;