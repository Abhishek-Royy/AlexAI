// import React from 'react'
// import api from '../../utils/axios'

// async function logOut() {
//     try {
//       const {data}=await api.get("/api/auth/logout")
//       console.log(data);
        
//     } catch (error) {
//         console.log(error);
        
//     }
// }

// export default logOut

import api from "../../utils/axios";

async function logOut() {
  const { data } = await api.post("/api/auth/logout");
  return data;
}

export default logOut;