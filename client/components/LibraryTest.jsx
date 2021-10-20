// import React, { useContext } from "react";
// import { GlobalContext } from "./GlobalContextProvider";
// import { BrowserRouter } from "react-router-dom";
// import axios from 'axios';

// const Library = () => {
//   const { value, setValue } = useContext(GlobalContext);

//   const pickMeUpBrother = () => {
//     const params = {
//       email: value
//     };
//     axios.get('/library', { params })
//     .then(res => console.log(res.data))
//     .catch(err => console.log(err))
//   }

//   return (
//     <BrowserRouter>
//       <div>{value}</div>
//     </BrowserRouter>
//   );
// };

// export default Library

