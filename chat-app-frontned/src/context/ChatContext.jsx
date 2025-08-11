import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [roomId, setRoomId] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [connected, setConnected] = useState(false);

  return (
    <ChatContext.Provider
      value={{
        roomId,
        currentUser,
        connected,
        setRoomId,
        setCurrentUser,
        setConnected,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Named hook
export const useChatContext = () => useContext(ChatContext);

// Default export (your components import default)
export default useChatContext;

// import { createContext, useContext, useState } from "react";

// const ChatContext = createContext();

// export const ChatProvider = ({ children }) => {
//   const [roomId, setRoomId] = useState("");
//   const [currentUser, setCurrentUser] = useState("");
//   const [connected, setConnected] = useState(false);

//   return (
//     <ChatContext.Provider
//       value={{
//         roomId,
//         currentUser,
//         connected,
//         setRoomId,
//         setCurrentUser,
//         setConnected,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// // const useChatContext = () => useContext(ChatContext);
// export default ChatContext;