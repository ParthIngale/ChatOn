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

  // const joinChat = async () => {
  //   if (!detail.roomId || !detail.userName) return toast.error("Enter name and room id");
  //   try {
  //     await joinChatApi(detail.roomId);
  //     setRoomId(detail.roomId);
  //     setCurrentUser(detail.userName);
  //     setConnected(true);
  //     navigate(`/chat/${detail.roomId}`);
  //   } catch (err) {
  //     toast.error(err?.response?.data || "Failed to join room");
  //   }
  // };
const joinChat = async () => {
  if (!detail.roomId || !detail.userName) return toast.error("Enter name and room id");
  try {
    const roomData = await joinChatApi(detail.roomId);
    
    // Check if the response is an error object
    if (roomData && (roomData.error || roomData.status === 'error' || roomData.timestamp)) {
      toast.error(roomData.message || "Room not found or server error");
      return;
    }
    
    // Only proceed if we have valid room data
    if (roomData && roomData.roomId) {
      setRoomId(detail.roomId);
      setCurrentUser(detail.userName);
      setConnected(true);
      navigate(`/chat/${detail.roomId}`);
    } else {
      toast.error("Invalid room data received");
    }
  } catch (err) {
    console.error("Error joining room:", err);
    if (err.response) {
      // Server responded with error status
      toast.error(err.response.data?.message || err.response.data || "Failed to join room");
    } else if (err.request) {
      // Network error
      toast.error("Cannot connect to server. Please check if backend is running.");
    } else {
      // Other error
      toast.error("Failed to join room");
    }
  }
};
const createRoomHandler = async () => {
  if (!detail.roomId || !detail.userName) return toast.error("Enter name and room id");
  try {
    const roomData = await createRoom(detail.roomId);
    
    // Check if the response is an error object
    if (roomData && (roomData.error || roomData.status === 'error' || roomData.timestamp)) {
      toast.error(roomData.message || "Failed to create room");
      return;
    }
    
    setRoomId(detail.roomId);
    setCurrentUser(detail.userName);
    setConnected(true);
    navigate(`/chat/${detail.roomId}`);
  } catch (err) {
    console.error("Error creating room:", err);
    if (err.response) {
      toast.error(err.response.data?.message || err.response.data || "Failed to create room");
    } else if (err.request) {
      toast.error("Cannot connect to server. Please check if backend is running.");
    } else {
      toast.error("Failed to create room");
    }
  }
};
  // const createRoomHandler = async () => {
  //   if (!detail.roomId || !detail.userName) return toast.error("Enter name and room id");
  //   try {
  //     await createRoom(detail.roomId);
  //     setRoomId(detail.roomId);
  //     setCurrentUser(detail.userName);
  //     setConnected(true);
  //     navigate(`/chat/${detail.roomId}`);
  //   } catch (err) {
  //     toast.error(err?.response?.data || "Failed to create room");
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        {/* <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div> */}
       <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div> */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"style={{ animationDelay: '4s' }}></div></div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(cyan 1px, transparent 1px),
            linear-gradient(90deg, cyan 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          opacity: 0.1,
        }}
      ></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
            {/* Glowing outer ring */}
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-spin"
              style={{ animationDuration: "3s" }}
            ></div>
            <div className="absolute inset-1 rounded-full bg-gray-900"></div>

            {/* Inner icon container */}
            <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50">
              <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {/* Pulse animation */}
            <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-20"></div>
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-green-400 bg-clip-text text-transparent mb-3">
            ChatRoom
          </h1>
          <div className="h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent mb-4"></div>
          <p className="text-gray-300 text-lg">
            Enter the <span className="text-cyan-400 font-semibold">digital realm</span>
          </p>
        </div>

        {/* Main Form Card */}
        <div className="relative group">
          {/* Glowing border effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

          <div className="relative bg-gray-900 bg-opacity-90 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-2xl p-8">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-900/20 to-blue-900/20 pointer-events-none"></div>

            <div className="relative space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label htmlFor="userName" className="block text-sm font-medium text-cyan-400 uppercase tracking-wider">
                  Identity
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    value={detail.userName}
                    onChange={handleFormInputChange}
                    placeholder="Enter your codename"
                    className="w-full px-4 py-4 bg-black bg-opacity-50 border border-gray-600 rounded-lg text-cyan-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 font-mono"
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400/10 to-blue-400/10 pointer-events-none opacity-0 focus-within:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>

              {/* Room ID Input */}
              <div className="space-y-2">
                <label htmlFor="roomId" className="block text-sm font-medium text-cyan-400 uppercase tracking-wider">
                  Portal Access Key
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="roomId"
                    name="roomId"
                    value={detail.roomId}
                    onChange={handleFormInputChange}
                    placeholder="Enter or create access key"
                    className="w-full px-4 py-4 bg-black bg-opacity-50 border border-gray-600 rounded-lg text-cyan-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 font-mono"
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400/10 to-blue-400/10 pointer-events-none opacity-0 focus-within:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-4">
                <button
                  onClick={joinChat}
                  disabled={!detail.roomId || !detail.userName}
                  className="group relative w-full overflow-hidden rounded-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 group-hover:from-cyan-400 group-hover:to-blue-400 group-disabled:from-gray-600 group-disabled:to-gray-600"></div>
                  <div className="relative bg-gray-900 m-0.5 rounded-md py-4 px-6 transition-all duration-300 group-hover:bg-gray-800 group-disabled:bg-gray-800">
                    <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent group-disabled:from-gray-400 group-disabled:to-gray-400 font-mono uppercase tracking-wider">
                      Initialize Connection
                    </span>
                  </div>
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-gray-900 text-cyan-400 font-mono text-sm uppercase tracking-widest">
                      OR
                    </span>
                  </div>
                </div>

                <button
                  onClick={createRoomHandler}
                  disabled={!detail.roomId || !detail.userName}
                  className="group relative w-full overflow-hidden rounded-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-300 group-hover:from-green-400 group-hover:to-cyan-400 group-disabled:from-gray-600 group-disabled:to-gray-600"></div>
                  <div className="relative bg-gray-900 m-0.5 rounded-md py-4 px-6 transition-all duration-300 group-hover:bg-gray-800 group-disabled:bg-gray-800">
                    <span className="font-bold text-lg bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent group-disabled:from-gray-400 group-disabled:to-gray-400 font-mono uppercase tracking-wider">
                      Create New Portal
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 font-mono text-sm">
            <span className="text-cyan-400">[SYSTEM]</span> Authentication required for access
          </p>
          <div className="flex justify-center space-x-2 mt-4 opacity-50">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
<style>{`
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`}</style>
      {/* <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style> */}
    </div>
  );
};

export default JoinCreateChat;


// import { useState } from "react";
// import { createRoom, joinChatApi } from "../services/RoomService";
// import { useChatContext } from "../context/ChatContext";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const JoinCreateChat = () => {
//   const [detail, setDetail] = useState({
//     roomId: "",
//     userName: "",
//   });

//   const navigate = useNavigate();
//   const { setRoomId, setCurrentUser, setConnected } = useChatContext();

//   function handleFormInputChange(event) {
//     setDetail({
//       ...detail,
//       [event.target.name]: event.target.value,
//     });
//   }

//   const joinChat = async () => {
//     if (!detail.roomId || !detail.userName) return toast.error("Enter name and room id");
//     try {
//       await joinChatApi(detail.roomId);
//       setRoomId(detail.roomId);
//       setCurrentUser(detail.userName);
//       setConnected(true);
//       navigate(`/chat/${detail.roomId}`);
//     } catch (err) {
//       toast.error(err?.response?.data || "Failed to join room");
//     }
//   };

//   const createRoomHandler = async () => {
//     if (!detail.roomId || !detail.userName) return toast.error("Enter name and room id");
//     try {
//       await createRoom(detail.roomId);
//       setRoomId(detail.roomId);
//       setCurrentUser(detail.userName);
//       setConnected(true);
//       navigate(`/chat/${detail.roomId}`);
//     } catch (err) {
//       toast.error(err?.response?.data || "Failed to create room");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Header Section */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl mb-4">
//             <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//             ChatRoom
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400">
//             Join an existing room or create a new one
//           </p>
//         </div>

//         {/* Main Form Card */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
//           <div className="space-y-6">
//             {/* Name Input */}
//             <div>
//               <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Your Name
//               </label>
//               <input
//                 type="text"
//                 id="userName"
//                 name="userName"
//                 value={detail.userName}
//                 onChange={handleFormInputChange}
//                 placeholder="Enter your name"
//                 className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//               />
//             </div>

//             {/* Room ID Input */}
//             <div>
//               <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Room ID
//               </label>
//               <input
//                 type="text"
//                 id="roomId"
//                 name="roomId"
//                 value={detail.roomId}
//                 onChange={handleFormInputChange}
//                 placeholder="Enter or create room ID"
//                 className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//               />
//             </div>

//             {/* Action Buttons */}
//             <div className="space-y-3">
//               <button
//                 onClick={joinChat}
//                 disabled={!detail.roomId || !detail.userName}
//                 className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
//               >
//                 Join Room
//               </button>
              
//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
//                     or
//                   </span>
//                 </div>
//               </div>

//               <button
//                 onClick={createRoomHandler}
//                 disabled={!detail.roomId || !detail.userName}
//                 className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
//               >
//                 Create Room
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="text-center mt-8">
//           <p className="text-sm text-gray-500 dark:text-gray-400">
//             Enter a room ID and your name to get started
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JoinCreateChat;
