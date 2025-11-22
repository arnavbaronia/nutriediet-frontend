import React, { useState } from "react";
import "../styles/TestimonialsPageUpdated.css";

const reviews = [
  {
    name: "Harika",
    plan: "Weight Loss Plan",
    content: `I am happy to share that am part of Ankita Gupta's diet program and reduced 9 kgs in 4 months. Special thanks to Vibha who guided me throughout the journey and suggested me very good diet plans. here the recipes are very simple and all the items are very much available in our kitchen. All the diet plans kept me full throughout the day without having any cravings. My Thyroid levels are also down and am very happy about it.
I strongly recommend to join Ankita Gupta's Nutri Diet program for healthy weight loss.`
  },
  {
    name: "Ashok Dhulipalla",
    plan: "Diabetes Reversal Plan",
    content: `I joined the program on June 16th, 2025, with a commitment to Ankita and Swapna to work on reversing my glucose levels in 3 months. On September 17th, 2025, my results speak for themselves — my sugar levels reduced from 8.8 to 6.6, and this was achieved without any medicines.

The approach was focused only on diet control and simple exercises (despite many days I couldn’t exercise). Along with better glucose control, I also reduced my weight from 79 kg to 74 kg.

I am very happy with the guidance and support I received.`
  },
  {
    name: "Shweta",
    plan: "Weight Loss Plan",
    content: `I achieved a significant weight loss of 9.2 kg in just 3 months, thanks to the effective diet plan and support by Ankita maam and Rutu maam. The recipes provided were quick, easy to cook, and truly made the journey seamless. Great results!`
  },
  {
    name: "Thanmaya",
    plan: "Gut Cleanse Plan",
    content: `I've have had acid reflux on and off for years now and I've been struggling with digestion issues lately. I came across Dt Ankita Gupta on Google and decided to give it a try. Within the first week I felt much better, they made sure my food didn't trigger my acid reflux. Their diet was easy to follow, and whenever I didn't like something they would switch my options. And follow up done by Dt Vibha was top notch - she's friendly and pays attention to detail, she always took note of all my concerns and made changes accordingly. Within a month I lost 2kgs along with better digestive health! I'd Definitely recommend.`
  },
  {
    name: "Sunil Samson",
    plan: "Weight Loss Plan",
    content: `I subscribed to a 3-month package and lost 12 kgs through a healthy diet and workout plan. The diet was very structured and well-planned, and I highly recommend it.`
  },
  {
    name: "Purnima",
    plan: "21 Days Transformation Challenge",
    content: `Joining the 21 days challenge has been a truly rewarding experience. The well-structured plan—detox in the first week, metabolism improvement in the second, and a weight-sustainable plan in the third—proved to be both practical and effective.

What makes this program stand out are the daily follow-ups and personalized suggestions for food additions or replacements. I really appreciate their consistent support.

The workout plan is simple and practical for everyone—no rigorous routines, just what fits into a busy lifestyle. 

The recipes are easy to make and tasty. Even my kids love to eat them sometimes.

I would look forward to continuing this journey.
Thank you Dietitian Ankita and Swapna for your guidance, support, and motivation! 😊`
  }
];

const TRUNCATE_LENGTH = 260;

function Paragraphs({ text }) {
  // preserve paragraph breaks
  return text.split(/\n{2,}/).map((para, idx) => (
    <p className="review-paragraph" key={idx}>{para.trim()}</p>
  ));
}

const TestimonialsPageUpdated = () => {
  const [expanded, setExpanded] = useState({});

  const toggle = (i) => setExpanded(prev => ({ ...prev, [i]: !prev[i] }));

  return (
    <section className="testimonials-section" aria-label="Testimonials">
      <div className="testimonials-inner">
        <h2 className="testimonials-heading">What Our Clients Say</h2>
        <p className="testimonials-subheading">Real stories, real results — heartfelt feedback from our clients.</p>

        <div className="testimonials-grid">
          {reviews.map((r, i) => {
            const text = r.content.trim();
            const needsTruncate = text.length > TRUNCATE_LENGTH;
            const isExpanded = Boolean(expanded[i]);

            const displayText = needsTruncate && !isExpanded
              ? text.slice(0, TRUNCATE_LENGTH).trim() + "..."
              : text;

            return (
              <article className="testimonial-card" key={i}>
                <div className="avatar-and-meta">
                  <div className="avatar" aria-hidden>
                    <span className="avatar-initial">{r.name?.[0]?.toUpperCase() || "U"}</span>
                  </div>
                  <div className="meta">
                    <h3 className="client-name">{r.name}</h3>
                    <div className="client-plan">{r.plan}</div>
                  </div>
                </div>

                <div className="review-content">
                  <div className="review-text">
                    <Paragraphs text={displayText} />
                  </div>

                  {needsTruncate && (
                    <button
                      className="read-more-btn"
                      onClick={() => toggle(i)}
                      aria-expanded={isExpanded}
                      aria-controls={`testimonial-${i}`}
                    >
                      {isExpanded ? "Read less" : "Read more"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsPageUpdated;