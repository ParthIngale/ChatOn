import React, { useEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";
import { useChatContext } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxiosHelper";
import { getMessages } from "../services/RoomService";
import { timeAgo } from "./helper";

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
  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, roomId, currentUser]);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    async function loadMessages() {
      try {
        const messages = await getMessages(roomId);
        setMessages(messages);
      } catch (error) {
        console.error(error);
      }
    }
    if (connected && roomId) {
      loadMessages();
    }
  }, [connected, roomId]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    let client = null;

    const connectWebSocket = () => {
      const sock = new SockJS(`${baseURL}/chat`);
      client = Stomp.over(sock);

      client.connect({}, () => {
        setStompClient(client);
        toast.success("connected");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          console.log(message);
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        });
      });
    };

    if (connected) {
      connectWebSocket();
    }

    return () => {
      if (client && client.connected) {
        client.disconnect();
      }
    };
  }, [roomId]);

  const sendMessage = async () => {
    if (stompClient && connected && input.trim()) {
      console.log(input);

      const message = {
        sender: currentUser,
        content: input,
        roomId: roomId,
      };

      stompClient.send(
        `/app/sendMessage/${roomId}`,
        {},
        JSON.stringify(message)
      );
      setInput("");
    }
  };

  function handleLogout() {
    stompClient.disconnect();
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/");
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Room:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{roomId}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {currentUser?.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-gray-900 dark:text-white">{currentUser}</span>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Leave Room
          </button>
        </div>
      </header>

      {/* Chat Messages */}
      <main
        ref={chatBoxRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
      >
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === currentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start space-x-3 max-w-md ${
                  message.sender === currentUser ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <img
                  className="w-8 h-8 rounded-full flex-shrink-0"
                  src={"https://avatar.iran.liara.run/public/43"}
                  alt=""
                />
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.sender === currentUser
                      ? "bg-blue-500 text-white rounded-br-md"
                      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-md"
                  }`}
                >
                  {message.sender !== currentUser && (
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {message.sender}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === currentUser 
                      ? "text-blue-100" 
                      : "text-gray-500 dark:text-gray-400"
                  }`}>
                    {timeAgo(message.timeStamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Message Input */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                type="text"
                placeholder="Type your message..."
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-full transition-colors flex items-center justify-center"
            >
              <MdSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
// import React, { useEffect, useRef, useState } from "react";
// import { MdAttachFile, MdSend } from "react-icons/md";
// // import ChatContext from "../context/ChatContext";
// import { useChatContext } from "../context/ChatContext";
// import { useNavigate } from "react-router-dom";
// import SockJS from "sockjs-client";
// import { Stomp } from "@stomp/stompjs";
// import toast from "react-hot-toast";
// import { baseURL } from "../config/AxiosHelper";
// import { getMessages } from "../services/RoomService";
// import { timeAgo } from "./helper";
// const ChatPage = () => {
//   // const {
//   //   roomId,
//   //   currentUser,
//   //   connected,
//   //   setConnected,
//   //   setRoomId,
//   //   setCurrentUser,
//   // } = ChatContext();
//   const {
//   roomId,
//   currentUser,
//   connected,
//   setConnected,
//   setRoomId,
//   setCurrentUser,
// } = useChatContext();

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

//   //page init:
//   //messages ko load karne honge

//   // useEffect(() => {
//   //   async function loadMessages() {
//   //     try {
//   //       const messages = await getMessages(roomId);
//   //       // console.log(messages);
//   //       setMessages(messages);
//   //     } catch (error) {}
//   //   }
//   //   if (connected) {
//   //     loadMessages();
//   //   }
//   // }, []);
// // New Addition
// useEffect(() => {
//   async function loadMessages() {
//     try {
//       const messages = await getMessages(roomId);
//       setMessages(messages);
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   if (connected && roomId) {
//     loadMessages();
//   }
// }, [connected, roomId]);

//   //scroll down

//   useEffect(() => {
//     if (chatBoxRef.current) {
//       chatBoxRef.current.scroll({
//         top: chatBoxRef.current.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//   }, [messages]);

//   //stompClient ko init karne honge
//   //subscribe
// useEffect(() => {
//   let client = null;

//   const connectWebSocket = () => {
//     ///SockJS
//     const sock = new SockJS(`${baseURL}/chat`);
//     client = Stomp.over(sock);

//     client.connect({}, () => {
//       setStompClient(client);

//       toast.success("connected");

//       client.subscribe(`/topic/room/${roomId}`, (message) => {
//         console.log(message);

//         const newMessage = JSON.parse(message.body);

//         setMessages((prev) => [...prev, newMessage]);

//         //rest of the work after success receiving the message
//       });
//     });
//   };

//   if (connected) {
//     connectWebSocket();
//   }

//   // CLEANUP FUNCTION:
//   return () => {
//     if (client && client.connected) {
//       client.disconnect();
//     }
//   };
// }, [roomId]);
//   // useEffect(() => {
//   //   const connectWebSocket = () => {
//   //     ///SockJS
//   //     const sock = new SockJS(`${baseURL}/chat`);
//   //     const client = Stomp.over(sock);

//   //     client.connect({}, () => {
//   //       setStompClient(client);

//   //       toast.success("connected");

//   //       client.subscribe(`/topic/room/${roomId}`, (message) => {
//   //         console.log(message);

//   //         const newMessage = JSON.parse(message.body);

//   //         setMessages((prev) => [...prev, newMessage]);

//   //         //rest of the work after success receiving the message
//   //       });
//   //     });
//   //   };

//   //   if (connected) {
//   //     connectWebSocket();
//   //   }

//   //   //stomp client
//   // }, [roomId]);

//   //send message handle

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

//     //
//   };

//   function handleLogout() {
//     stompClient.disconnect();
//     setConnected(false);
//     setRoomId("");
//     setCurrentUser("");
//     navigate("/");
//   }

//   return (
//     <div className="">
//       {/* this is a header */}
//       <header className="dark:border-gray-700  fixed w-full dark:bg-gray-900 py-5 shadow flex justify-around items-center">
//         {/* room name container */}
//         <div>
//           <h1 className="text-xl font-semibold">
//             Room : <span>{roomId}</span>
//           </h1>
//         </div>
//         {/* username container */}

//         <div>
//           <h1 className="text-xl font-semibold">
//             User : <span>{currentUser}</span>
//           </h1>
//         </div>
//         {/* button: leave room */}
//         <div>
//           <button
//             onClick={handleLogout}
//             className="dark:bg-red-500 dark:hover:bg-red-700 px-3 py-2 rounded-full"
//           >
//             Leave Room
//           </button>
//         </div>
//       </header>

//       <main
//         ref={chatBoxRef}
//         className="py-20 px-10   w-2/3 dark:bg-slate-600 mx-auto h-screen overflow-auto "
//       >
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               message.sender === currentUser ? "justify-end" : "justify-start"
//             } `}
//           >
//             <div
//               className={`my-2 ${
//                 message.sender === currentUser ? "bg-green-800" : "bg-gray-800"
//               } p-2 max-w-xs rounded`}
//             >
//               <div className="flex flex-row gap-2">
//                 <img
//                   className="h-10 w-10"
//                   src={"https://avatar.iran.liara.run/public/43"}
//                   alt=""
//                 />
//                 <div className="flex flex-col gap-1">
//                   <p className="text-sm font-bold">{message.sender}</p>
//                   <p>{message.content}</p>
//                   <p className="text-xs text-gray-400">
//                     {timeAgo(message.timeStamp)}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </main>
//       {/* input message container */}
//       <div className=" fixed bottom-4 w-full h-16 ">
//         <div className="h-full  pr-10 gap-4 flex items-center justify-between rounded-full w-1/2 mx-auto dark:bg-gray-900">
//           <input
//             value={input}
//             onChange={(e) => {
//               setInput(e.target.value);
//             }}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 sendMessage();
//               }
//             }}
//             type="text"
//             placeholder="Type your message here..."
//             className=" w-full  dark:border-gray-600 b dark:bg-gray-800  px-5 py-2 rounded-full h-full focus:outline-none  "
//           />

//           <div className="flex gap-1">
//             <button className="dark:bg-purple-600 h-10 w-10  flex   justify-center items-center rounded-full">
//               <MdAttachFile size={20} />
//             </button>
//             <button
//               onClick={sendMessage}
//               className="dark:bg-green-600 h-10 w-10  flex   justify-center items-center rounded-full"
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