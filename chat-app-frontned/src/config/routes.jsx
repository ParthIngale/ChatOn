import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "../App";
import ChatPage from "../components/ChatPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/chat/:roomId" element={<ChatPage />} />
     {/* <Route path="/chat" element={<ChatPage />} /> */}
      <Route path="/about" element={<h1>This is about page</h1>} />
      <Route path="*" element={<h1>404 Page Not Found</h1>} />
    </Routes>
  );
};

export default AppRoutes;

// import React from "react";
// // import { Routes, Route } from "react-router-dom";
// import { Routes, Route } from "react-router-dom"
// import App from "../App";
// import ChatPage from "../components/ChatPage";
// const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<App />} />
//       <Route path="/chat" element={<ChatPage />} />
//       <Route path="/about" element={<h1>This is about page</h1>} />
//       <Route path="*" element={<h1>404 Page Not Found</h1>} />
//     </Routes>
//   );
// };

// export default AppRoutes;