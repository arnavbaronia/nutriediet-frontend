// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import { getToken } from '../../auth/token'; 
// import '../../styles/DietPage.css';

// const DietPage = () => {
//   const { clientId } = useParams(); 
//   const [diet, setDiet] = useState(null);
//   const [selectedDiet, setSelectedDiet] = useState('Regular Diet');
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     console.log('Client ID:', clientId); 
//     const token = getToken();
//     axios.get(`http://localhost:8081/clients/${clientId}/diet`, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       },
//       withCredentials: true
//     })
//       .then(response => {
//         setDiet(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching diet:', error);
//         setError(error);
//       });
//   }, [clientId]);

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   if (!diet) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="diet-page">
//       <div className="diet-content">
//         {Object.keys(diet).map(time => (
//           <div key={time} className="meal-section">
//             <h2 className="meal-time">{time}</h2>
//             <div className="meal-category">
//               <h3 className="meal-category-heading">Primary</h3>
//               <div className="meal-items">
//                 {diet[time].Primary.map(item => (
//                   <div key={item.ID} className={`meal-box ${diet[time].Primary.length === 1 ? 'single-box' : ''}`}>
//                     <p><strong>{item.Name}</strong></p>
//                     <p>{item.Quantity}</p>
//                     <p>{item.Preparation}</p>
//                     {item.Consumption && <p>{item.Consumption}</p>}
//                   </div>
//                 ))}
//               </div>
//             </div>
//             {diet[time].Alternative && (
//               <div className="meal-category">
//                 <h3 className="meal-category-heading">Alternatives</h3>
//                 <div className="meal-items">
//                   {diet[time].Alternative.map(item => (
//                     <div key={item.ID} className={`meal-box ${diet[time].Alternative.length === 1 ? 'single-box' : ''}`}>
//                       <p><strong>{item.Name}</strong></p>
//                       <p>{item.Quantity}</p>
//                       <p>{item.Preparation}</p>
//                       {item.Consumption && <p>{item.Consumption}</p>}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//       <div className="diet-buttons">
//         <button
//           className={`diet-type-button ${selectedDiet === 'Regular Diet' ? 'active-diet' : ''}`}
//           onClick={() => setSelectedDiet('Regular Diet')}
//         >
//           Regular Diet
//         </button>
//         <button
//           className={`diet-type-button ${selectedDiet === 'Detox Diet' ? 'active-diet' : ''}`}
//           onClick={() => setSelectedDiet('Detox Diet')}
//         >
//           Detox Diet
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DietPage;
import React, { useEffect, useState } from "react";
import axios from "axios";

const DietPage = () => {
  const [diet, setDiet] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiet = async () => {
      const token = localStorage.getItem("token");
      const clientId = localStorage.getItem("clientId");
      const userType = localStorage.getItem("user_type");
      
      console.log("Stored user_type:", userType);
      console.log("Stored clientId:", clientId);
      console.log("Stored token:", token);

      if (!token || !clientId || userType !== "CLIENT") {
        setError("You must be logged in as a client to view this page.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8081/clients/${clientId}/diet`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDiet(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          // localStorage.clear();
          // window.location.href = "/login";
        } else {
          setError("Failed to fetch diet. Please try again later.");
        }
      }
    };

    fetchDiet();
  }, []);

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  if (!diet) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Your Diet</h1>
      <pre>{JSON.stringify(diet, null, 2)}</pre>
    </div>
  );
};

export default DietPage;