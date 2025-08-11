import { useState } from "react";
import { createRoom, joinChatApi } from "../services/RoomService";
import { useChatContext } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const JoinCreateChat = () => {
  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

  const navigate = useNavigate();
  const { setRoomId, setCurrentUser, setConnected } = useChatContext();

  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  const joinChat = async () => {
    if (!detail.roomId || !detail.userName) return toast.error("Enter name and room id");
    try {
      await joinChatApi(detail.roomId);
      setRoomId(detail.roomId);
      setCurrentUser(detail.userName);
      setConnected(true);
      navigate(`/chat/${detail.roomId}`);
    } catch (err) {
      toast.error(err?.response?.data || "Failed to join room");
    }
  };

  const createRoomHandler = async () => {
    if (!detail.roomId || !detail.userName) return toast.error("Enter name and room id");
    try {
      await createRoom(detail.roomId);
      setRoomId(detail.roomId);
      setCurrentUser(detail.userName);
      setConnected(true);
      navigate(`/chat/${detail.roomId}`);
    } catch (err) {
      toast.error(err?.response?.data || "Failed to create room");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ChatRoom
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Join an existing room or create a new one
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <div className="space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={detail.userName}
                onChange={handleFormInputChange}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Room ID Input */}
            <div>
              <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Room ID
              </label>
              <input
                type="text"
                id="roomId"
                name="roomId"
                value={detail.roomId}
                onChange={handleFormInputChange}
                placeholder="Enter or create room ID"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={joinChat}
                disabled={!detail.roomId || !detail.userName}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Join Room
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    or
                  </span>
                </div>
              </div>

              <button
                onClick={createRoomHandler}
                disabled={!detail.roomId || !detail.userName}
                className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Create Room
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter a room ID and your name to get started
          </p>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;
// // import React, { useState } from "react";
// // // before: import { createRoom  as createRoomApi}  from "../services/RoomService";;
// // import { createRoom, joinChatApi } from "../services/RoomService";
// // import useChatContext from "../context/ChatContext";
// // import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { createRoom, joinChatApi } from "../services/RoomService";
// import { useChatContext } from "../context/ChatContext"; // CHANGED: use named import
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// // import chatIcon from "../assets/chat.png";
// // import toast from "react-hot-toast";
// // import { createRoom  as createRoomApi}  from "../services/RoomService";;


//   // function handleFormInputChange(event) {
//   //   setDetail({
//   //     ...detail,
//   //     [event.target.name]: event.target.value,
//   //   });
//   // }
// // const JoinCreateChat = () => {
// //   const [detail, setDetail] = useState({
// //     roomId: "",
// //     userName: "",
// //   });

//   const JoinCreateChat = () => {
//   const [detail, setDetail] = useState({
//     roomId: "",
//     userName: "",
//   });
//    function handleFormInputChange(event) {
//     setDetail({
//       ...detail,
//       [event.target.name]: event.target.value,
//     });
//   }

//   // Placeholder functions for demo
//   // const joinChat = () => console.log("Join chat clicked");const navigate = useNavigate();
// const navigate = useNavigate();
//   const { setRoomId, setCurrentUser, setConnected } = useChatContext(); // CHANGED: use useChatContext// new Additions
// const joinChat = async () => {
//   if (!detail.roomId || !detail.userName) return toast.error("Enter name and room id");
//   try {
//     await joinChatApi(detail.roomId); // verify room exists
//     setRoomId(detail.roomId);
//     setCurrentUser(detail.userName);
//     setConnected(true);
//     // navigate("/chat");
//     navigate(`/chat/${detail.roomId}`);
//   } catch (err) {
//     toast.error(err?.response?.data || "Failed to join room");
//   }
// };
// // New Additions
// const createRoomHandler = async () => {
//   if (!detail.roomId || !detail.userName) return toast.error("Enter name and room id");
//   try {
//     await createRoom(detail.roomId);
//     setRoomId(detail.roomId);
//     setCurrentUser(detail.userName);
//     setConnected(true);
//     // navigate("/chat");
// navigate(`/chat/${detail.roomId}`);
//   } catch (err) {
//     toast.error(err?.response?.data || "Failed to create room");
//   }
// };
//   // const createRoom = () => console.log("Create room clicked");

//   return (
//     <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       {/* Geometric Pattern Background */}
//       <div className="absolute inset-0 opacity-20">
//         <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
//           <defs>
//             <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
//               <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
//             </pattern>
//           </defs>
//           <rect width="100" height="100" fill="url(#grid)" className="text-white"/>
//         </svg>
//       </div>

//       {/* Floating Geometric Shapes */}
//       <div className="absolute inset-0">
//         <div className="absolute top-20 left-20 w-16 h-16 border-2 border-blue-400/30 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
//         <div className="absolute top-40 right-32 w-12 h-12 bg-purple-500/20 rotate-12 animate-pulse"></div>
//         <div className="absolute bottom-32 left-40 w-8 h-8 bg-cyan-400/30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
//         <div className="absolute bottom-20 right-20 w-20 h-20 border-2 border-pink-400/20 rounded-full animate-ping" style={{animationDuration: '3s'}}></div>
//         <div className="absolute top-1/3 left-1/2 w-6 h-6 bg-yellow-400/30 rotate-45 animate-spin" style={{animationDuration: '15s'}}></div>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 p-8 bg-black/40 backdrop-blur-xl border border-white/10 w-full flex flex-col gap-6 max-w-md rounded-3xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-500">
//         {/* Chat Icon */}
//         <div className="flex justify-center">
//           <div className="relative">
//             <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
//               <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
//           </div>
//         </div>

//         <div className="text-center">
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
//             ChatRoom
//           </h1>
//           <p className="text-white/60 mt-2">Join or create a room to start chatting</p>
//         </div>

//         {/* Name Input */}
//         <div className="space-y-2">
//           <label htmlFor="name" className="block text-sm font-medium text-white/80">
//             Your Name
//           </label>
//           <input
//             onChange={handleFormInputChange}
//             value={detail.userName}
//             type="text"
//             id="name"
//             name="userName"
//             placeholder="Enter your name"
//             className="w-full bg-white/5 border border-white/20 text-white placeholder-white/40 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
//           />
//         </div>

//         {/* Room ID Input */}
//         <div className="space-y-2">
//           <label htmlFor="roomId" className="block text-sm font-medium text-white/80">
//             Room ID
//           </label>
//           <input
//             name="roomId"
//             onChange={handleFormInputChange}
//             value={detail.roomId}
//             type="text"
//             id="roomId"
//             placeholder="Enter or create room ID"
//             className="w-full bg-white/5 border border-white/20 text-white placeholder-white/40 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
//           />
//         </div>

//         {/* Buttons */}
//         <div className="flex gap-3 mt-6">
//           <button
//             onClick={joinChat}
//             className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
//           >
//             Join Room
//           </button>
//           <button
//             onClick={createRoomHandler}
//             className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
//           >
//             Create Room
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JoinCreateChat;
