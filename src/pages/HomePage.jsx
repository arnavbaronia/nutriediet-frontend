import { React, useEffect} from "react";
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
import SaveAsIcon from "@mui/icons-material/SaveAs";
import SendIcon from "@mui/icons-material/Send";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FavoriteIcon from "@mui/icons-material/Favorite";

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

  return (
    <>
      <div className="falling-leaves"></div>
      <HomeNavBar />
      <div className="homepage-container">
        <div className="text-section">
          <h1 className="title">Diet. Nutrition.</h1>
          <h2 className="subtitle">And Complete Wellness.</h2>
          <p className="description">
            Dieting is not about eating less. It is about eating right.
            There is no such thing as a “perfect diet plan” until and unless it is personalized.
            Discover what is best for you with Indian Nutritionist. 
            We help you establish the perfect diet with our personalized online dietitian consultation and nutrition coaching in India.
            Get comprehensive meal plans and lifestyle management guidelines for health conditions like PCOS, thyroid, diabetes and many other conditions. 
            Embark on a safe and effective journey to complete wellness.
          </p>
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
              Established by highly reputed professional nutritionist <strong>Shweta Sharma</strong>, 
              Indian Nutritionist is a fully web-based platform offering online health coaching and consultant nutritionist services. 
              Our focus is to bring our expert-led wellness plans closer to people, especially those who cannot visit a clinic due to mobility issues.
            </p>

            <p className="about-text">
              Based in Chandigarh, we work with registered dietitians and consultant nutritionists and cater to individuals and groups all over India with dedicated support. 
              While providing one-to-one diet & nutritionist consultation online for fully customized meal plans, we extend our approach to gain total body and mind wellness for our clients. 
              Each plan is designed according to your medical conditions and unique dietary needs.
            </p>

            <p className="about-text">
              We specialize in **PCOS/PCOD, thyroid, and diabetes management**. However, our constant endeavor is to help more and more people benefit from our all-in-one 
              nutritionist solutions for several other conditions that can be managed with diet and nutrition.
            </p>

            <p className="about-text">
              Take the first step towards a healthier you by scheduling an **online dietitian consultation** with our nutritionists today. 
              Unlock the true potential of your fitness as you embrace a transformative journey towards a healthy life.
            </p>
        </div>
      </div>

      <div className="how-it-works-container">
        <h2 className="how-it-works-heading">How Our Online Dietician & Nutrition Counselling Works?</h2>
        <p className="how-it-works-description">
          The conventional concept is that you must see a doctor or medical professional in person to consult about your health. On the other hand, Indian Nutritionist, an online dietician consultation service in India, customizes your meal plans to suit your needs without requiring face-to-face consultation. So before we get to the part about “how it works,” let’s just make sure that online dietitian consultation works in the first place.
        </p>
        <p className="how-it-works-description">
          We collaborate with highly accredited online nutritionist Shweta Sharma and her entourage of registered dieticians, holistic nutritionists, and specialist online health coaches, each holding prestigious track records for transforming the lives of hundreds of patients. With an organized approach, we intend to bring the convenience of one-touch accessibility to professional nutritionist consultations online.
        </p>

        <div className="how-it-works-content">
          <div className="how-it-works-image">
            <img src={dietonphone} alt="Diet Consultation" className="consultation-image" />
          </div>

          <div className="how-it-works-steps">
            {[
              { icon: <SaveAsIcon />, title: "Getting Started", desc: "Send us your inquiry. Call us, email us, or revert via our contact form. We will arrange a free consultation with one of our consultant nutritionists over the phone." },
              { icon: <SendIcon />, title: "Getting to Know", desc: "Following the preliminary nutritionist consultation online, we will evaluate your lifestyle, food preferences, budget, and medical conditions before recommending plans." },
              { icon: <MenuBookIcon />, title: "Pick Your Plan", desc: "We will recommend a bunch of diet & nutrition plans tailored to your needs. This is the first step to pushing you towards better health and comfort. You get to choose it as you please." },
              { icon: <RestaurantIcon />, title: "Start Dieting", desc: "Once you are ready, our dietician consultants provide weekly meal plans and then gradually progress with more food and lifestyle interventions as you start showing improvements." },
              { icon: <FavoriteIcon />, title: "Keep Going", desc: "Continue your healthy eating endeavor with your online health coach on a close call. We monitor and track your progress via web-based technologies and direct communication." }
            ].map((step, index) => (
              <div className="step" key={index}>
                <div className="step-header">
                  {step.icon}
                  <h3 className="step-title">{step.title}</h3>
                </div>
                <p className="step-description">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="health-plans-container">
        <h2 className="health-plans-heading">Comprehensive Health Plans You Get From Our Online Dietitian</h2>
        <p className="health-plans-description">
          We started off providing online dietitian consultations primarily for thyroid, diabetes, and PCOS/PCOD patients. Over time, we have also ventured into other conditions where our online health coaches have proven effective for many people to achieve a complete lifestyle transformation.
        </p>
        <p className="health-plans-description">
          Now we also address conditions like post-pregnancy weight gain, high blood pressure, stress management and many others. Our dietician consultants work in the areas of regulating blood sugar levels, lipid profiles, hormonal balance, and many other parameters to improve your well-being more holistically.
        </p>

        <div className="health-plans-grid">
          {[
            { img: plan1, title: "Weight Gain Plan", desc: "Are you underweight? Do you always lose your appetite? If you are looking to build body mass and strength, our nutrition counselor can help you with a personalized diet plan to gain a healthy weight. Get tailored nutrition guidance and build a stronger, more confident you." },
            { img: plan2, title: "Lifestyle Management Plan", desc: "Good food habits inspire a good life. But it doesn’t fix all your health needs. Let your online diet counsellor offer guidelines for food, exercise, sleep, relaxation, and recreational needs—tailored strategies to embrace positive changes and enhance your overall lifestyle." },
            { img: plan3, title: "Post Pregnancy Plan", desc: "Postpartum fatigue, hormonal fluctuations, disturbed sleep and many other elements cause weight gain, stress, and lifestyle changes after childbirth. With a consultant nutritionist available on demand, you can get comprehensive wellness plans and enjoy motherhood." },
            { img: plan4, title: "PCOS/PCOD Plan", desc: "Personalized plans for the DASH diet and low-blood pressure management is offered by registered dietitians and holistic nutritionists for different age groups. We will collaborate with your doctors and offer strategic foods compatible with your medications and wellness goals ." }
          ].map((plan, index) => (
            <div className="health-plan-box" key={index}>
              <img src={plan.img} alt={plan.title} className="plan-image" />
              <h3 className="plan-title">{plan.title}</h3>
              <p className="plan-description">{plan.desc}</p>
            </div>
          ))}
        </div>
      </div>

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