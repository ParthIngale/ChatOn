// ChatPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";
import { useChatContext } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxiosHelper";
import { getMessages } from "../services/RoomService";

/* Local timeAgo helper (self-contained) */
const timeAgo = (timestamp) => {
  if (!timestamp) return "";
  const now = new Date();
  const time = new Date(timestamp);
  const diff = Math.floor((now - time) / 1000);

  if (diff < 10) return "now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const ChatPage = () => {
  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setRoomId,
    setCurrentUser,
  } = useChatContext();

  const navigate = useNavigate();

  // Redirect to join if not connected
  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
    // keep same deps as original
  }, [connected, roomId, currentUser, navigate]);

  // refs & state
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [stompClient, setStompClient] = useState(null);

  // load previous messages from backend (original behavior)
  useEffect(() => {
    async function loadMessages() {
      try {
        const msgs = await getMessages(roomId);
        setMessages(Array.isArray(msgs) ? msgs : []);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    }
    if (connected && roomId) {
      loadMessages();
    }
  }, [connected, roomId]);

  // auto scroll to bottom when messages change
  useEffect(() => {
    if (chatBoxRef.current) {
      try {
        chatBoxRef.current.scroll({
          top: chatBoxRef.current.scrollHeight,
          behavior: "smooth",
        });
      } catch (e) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }
  }, [messages]);

  // connect to backend websocket via SockJS + STOMP
  useEffect(() => {
    let client = null;
    let subscription = null;

    const connectWebSocket = () => {
      try {
        const sock = new SockJS(`${baseURL}/chat`);
        client = Stomp.over(sock);

        client.connect(
          {},
          () => {
            setStompClient(client);
            toast.success("connected");

            // subscribe once and save subscription for cleanup
            subscription = client.subscribe(`/topic/room/${roomId}`, (message) => {
              try {
                const newMessage = JSON.parse(message.body);
                setMessages((prev) => [...prev, newMessage]);
              } catch (err) {
                console.error("Failed to parse stomp message:", err);
              }
            });
          },
          (error) => {
            console.error("STOMP connect error:", error);
            toast.error("WebSocket connection failed");
          }
        );
      } catch (err) {
        console.error("connectWebSocket error:", err);
        toast.error("WebSocket error");
      }
    };

    if (connected && roomId) {
      connectWebSocket();
    }

    // cleanup: unsubscribe + disconnect
    return () => {
      try {
        if (subscription) {
          subscription.unsubscribe();
        }
        if (client && client.connected) {
          client.disconnect();
        }
      } catch (err) {
        // ignore disconnect/unsubscribe errors
      }
    };
  }, [roomId, connected]);

  // send message via STOMP (original behavior: don't append locally; server will broadcast)
  const sendMessage = async () => {
    if (!stompClient || !connected) {
      toast.error("Not connected");
      return;
    }
    if (!input.trim()) return;

    const message = {
      sender: currentUser,
      content: input.trim(),
      roomId: roomId,
      timeStamp: new Date().toISOString(),
    };

    try {
      stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
      setInput("");
      if (inputRef.current) inputRef.current.focus();
    } catch (err) {
      console.error("sendMessage error:", err);
      toast.error("Failed to send message");
    }
  };

  // handle logout
  function handleLogout() {
    try {
      if (stompClient && stompClient.disconnect) {
        stompClient.disconnect();
      }
    } catch (err) {
      // ignore
    }
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/");
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex flex-col">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-60 h-60 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(cyan 1px, transparent 1px),
            linear-gradient(90deg, cyan 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          opacity: 0.05,
        }}
      ></div>

      {/* Header */}
      <header className="relative z-10 border-b border-cyan-500/20 backdrop-blur-xl">
        <div className="bg-gray-900/80 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-8">
              {/* Room Status */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-20"></div>
                </div>
                <span className="text-sm text-cyan-400 font-mono uppercase tracking-wider">Portal:</span>
                <span className="font-bold text-cyan-100 font-mono">{roomId}</span>
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-gray-900 text-sm font-bold shadow-lg shadow-cyan-500/30">
                    {currentUser?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-30 animate-pulse"></div>
                </div>
                <span className="font-medium text-cyan-100 font-mono">{currentUser}</span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="group relative overflow-hidden rounded-lg px-6 py-2 transition-all duration-300 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300 group-hover:from-red-400 group-hover:to-red-500"></div>
              <div className="relative bg-gray-900 m-0.5 rounded-md px-4 py-1.5 transition-all duration-300 group-hover:bg-gray-800">
                <span className="font-bold text-sm bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent font-mono uppercase tracking-wider">
                  Disconnect
                </span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main
        ref={chatBoxRef}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-4 relative z-10"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === currentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start space-x-4 max-w-md ${
                  message.sender === currentUser ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-gray-900 text-sm font-bold shadow-lg ${
                      message.sender === currentUser
                        ? "bg-gradient-to-br from-cyan-400 to-blue-500 shadow-cyan-500/30"
                        : "bg-gradient-to-br from-green-400 to-cyan-500 shadow-green-500/30"
                    }`}
                  >
                    {message.sender?.charAt(0).toUpperCase()}
                  </div>
                  <div
                    className={`absolute -inset-0.5 rounded-full opacity-30 animate-pulse ${
                      message.sender === currentUser
                        ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                        : "bg-gradient-to-r from-green-400 to-cyan-500"
                    }`}
                  ></div>
                </div>

                {/* Message Bubble */}
                <div className="relative group">
                  {/* Glowing border effect */}
                  <div
                    className={`absolute -inset-0.5 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500 ${
                      message.sender === currentUser
                        ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                        : "bg-gradient-to-r from-green-400 to-cyan-500"
                    }`}
                  ></div>

                  <div
                    className={`relative px-6 py-4 rounded-2xl backdrop-blur-xl ${
                      message.sender === currentUser
                        ? "bg-gradient-to-br from-cyan-900/80 to-blue-900/80 text-cyan-100 rounded-br-md border border-cyan-500/20"
                        : "bg-gradient-to-br from-gray-800/80 to-gray-900/80 text-gray-100 rounded-bl-md border border-green-500/20"
                    }`}
                  >
                    {message.sender !== currentUser && (
                      <p className="text-xs font-bold text-green-400 mb-2 font-mono uppercase tracking-wider">
                        {message.sender}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed font-mono">{message.content}</p>
                    <p
                      className={`text-xs mt-2 font-mono ${
                        message.sender === currentUser ? "text-cyan-300/70" : "text-green-400/70"
                      }`}
                    >
                      {timeAgo(message.timeStamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Message Input */}
      <div className="relative z-10 border-t border-cyan-500/20 backdrop-blur-xl">
        <div className="bg-gray-900/80 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
              {/* Input Container */}
              <div className="flex-1 relative group">
                {/* Glowing border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur opacity-20 group-hover:opacity-40 group-focus-within:opacity-60 transition duration-500"></div>

                <div className="relative">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    type="text"
                    placeholder="Transmit your message..."
                    className="w-full px-6 py-4 bg-black/50 backdrop-blur-xl border border-gray-600/50 rounded-full text-cyan-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 font-mono"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/5 to-blue-400/5 pointer-events-none opacity-0 focus-within:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>

              {/* Send Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                disabled={!input.trim()}
                className="group relative overflow-hidden rounded-full p-4 transition-all duration-300 transform hover:scale-110 disabled:hover:scale-100 disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:from-cyan-300 group-hover:to-blue-400 group-disabled:from-gray-600 group-disabled:to-gray-600 rounded-full"></div>
                <div className="absolute inset-0 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse"></div>

                <div className="relative text-gray-900">
                  <MdSend size={18} />
                </div>
              </button>
            </div>

            {/* Status Indicators */}
            <div className="flex justify-center items-center space-x-3 mt-4 opacity-50">
              <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
                <div className={`w-2 h-2 rounded-full animate-pulse ${connected ? "bg-green-400" : "bg-red-400"}`}></div>
                <span>{connected ? "CONNECTED" : "DISCONNECTED"}</span>
              </div>
              <div className="w-px h-4 bg-gray-600"></div>
              <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                <span>SECURE CHANNEL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default ChatPage;

// import React, { useEffect, useRef, useState } from "react";
// import { MdSend } from "react-icons/md";
// import { useChatContext } from "../context/ChatContext";
// import { useNavigate } from "react-router-dom";
// import SockJS from "sockjs-client";
// import { Stomp } from "@stomp/stompjs";
// import toast from "react-hot-toast";
// import { baseURL } from "../config/AxiosHelper";
// import { getMessages } from "../services/RoomService";
// import { timeAgo } from "./helper";

// const ChatPage = () => {
//   const {
//     roomId,
//     currentUser,
//     connected,
//     setConnected,
//     setRoomId,
//     setCurrentUser,
//   } = useChatContext();

//   const navigate = useNavigate();
//   useEffect(() => {
//     if (!connected) {
//       navigate("/");
//     }
//   }, [connected, roomId, currentUser]);

//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const inputRef = useRef(null);
//   const chatBoxRef = useRef(null);
//   const [stompClient, setStompClient] = useState(null);

//   useEffect(() => {
//     async function loadMessages() {
//       try {
//         const messages = await getMessages(roomId);
//         setMessages(messages);
//       } catch (error) {
//         console.error(error);
//       }
//     }
//     if (connected && roomId) {
//       loadMessages();
//     }
//   }, [connected, roomId]);

//   useEffect(() => {
//     if (chatBoxRef.current) {
//       chatBoxRef.current.scroll({
//         top: chatBoxRef.current.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//   }, [messages]);

//   useEffect(() => {
//     let client = null;

//     const connectWebSocket = () => {
//       const sock = new SockJS(`${baseURL}/chat`);
//       client = Stomp.over(sock);

//       client.connect({}, () => {
//         setStompClient(client);
//         toast.success("connected");

//         client.subscribe(`/topic/room/${roomId}`, (message) => {
//           console.log(message);
//           const newMessage = JSON.parse(message.body);
//           setMessages((prev) => [...prev, newMessage]);
//         });
//       });
//     };

//     if (connected) {
//       connectWebSocket();
//     }

//     return () => {
//       if (client && client.connected) {
//         client.disconnect();
//       }
//     };
//   }, [roomId]);

//   const sendMessage = async () => {
//     if (stompClient && connected && input.trim()) {
//       console.log(input);

//       const message = {
//         sender: currentUser,
//         content: input,
//         roomId: roomId,
//       };

//       stompClient.send(
//         `/app/sendMessage/${roomId}`,
//         {},
//         JSON.stringify(message)
//       );
//       setInput("");
//     }
//   };

//   function handleLogout() {
//     stompClient.disconnect();
//     setConnected(false);
//     setRoomId("");
//     setCurrentUser("");
//     navigate("/");
//   }

//   return (
//     <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
//       {/* Header */}
//       <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <div className="flex items-center space-x-6">
//             <div className="flex items-center space-x-2">
//               <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//               <span className="text-sm text-gray-600 dark:text-gray-300">Room:</span>
//               <span className="font-semibold text-gray-900 dark:text-white">{roomId}</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
//                 {currentUser?.charAt(0).toUpperCase()}
//               </div>
//               <span className="font-medium text-gray-900 dark:text-white">{currentUser}</span>
//             </div>
//           </div>
          
//           <button
//             onClick={handleLogout}
//             className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
//           >
//             Leave Room
//           </button>
//         </div>
//       </header>

//       {/* Chat Messages */}
//       <main
//         ref={chatBoxRef}
//         className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
//       >
//         <div className="max-w-4xl mx-auto space-y-4">
//           {messages.map((message, index) => (
//             <div
//               key={index}
//               className={`flex ${
//                 message.sender === currentUser ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 className={`flex items-start space-x-3 max-w-md ${
//                   message.sender === currentUser ? "flex-row-reverse space-x-reverse" : ""
//                 }`}
//               >
//                 <img
//                   className="w-8 h-8 rounded-full flex-shrink-0"
//                   src={"https://avatar.iran.liara.run/public/43"}
//                   alt=""
//                 />
//                 <div
//                   className={`px-4 py-3 rounded-2xl ${
//                     message.sender === currentUser
//                       ? "bg-blue-500 text-white rounded-br-md"
//                       : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-md"
//                   }`}
//                 >
//                   {message.sender !== currentUser && (
//                     <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
//                       {message.sender}
//                     </p>
//                   )}
//                   <p className="text-sm leading-relaxed">{message.content}</p>
//                   <p className={`text-xs mt-2 ${
//                     message.sender === currentUser 
//                       ? "text-blue-100" 
//                       : "text-gray-500 dark:text-gray-400"
//                   }`}>
//                     {timeAgo(message.timeStamp)}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>

//       {/* Message Input */}
//       <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
//         <div className="max-w-4xl mx-auto">
//           <div className="flex items-center space-x-3">
//             <div className="flex-1 relative">
//               <input
//                 ref={inputRef}
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     sendMessage();
//                   }
//                 }}
//                 type="text"
//                 placeholder="Type your message..."
//                 className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//               />
//             </div>
//             <button
//               onClick={sendMessage}
//               disabled={!input.trim()}
//               className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-full transition-colors flex items-center justify-center"
//             >
//               <MdSend size={20} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;
