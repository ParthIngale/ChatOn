# ChatOn - Real-time Chat Application Backend

This is the **backend** for the ChatOn project — a real-time chat application built using **Spring Boot**, **MongoDB**, and **WebSockets**.  
It provides REST APIs and WebSocket endpoints for managing chat rooms, sending/receiving messages, and storing chat history.

[Watch the project demo](https://drive.google.com/file/d/1O_viOp2D-XCe7DUijoIgtat5rdrHwc7e/view?usp=sharing)

## 📌 Features
- **Room Management**
  - Create and manage chat rooms.
  - Each room stores its chat history in MongoDB.
- **Messaging**
  - Send and receive messages in real time using WebSockets.
  - Messages are timestamped and stored persistently.
- **MongoDB Integration**
  - Stores chat rooms and messages efficiently.
  - Uses embedded documents for message storage inside room objects.
- **REST Endpoints**
  - For room creation, fetching rooms, and retrieving messages.
- **WebSocket Support**
  - Real-time, low-latency communication between clients.

---

## 📂 Project Structure
```
# Frontend (React + Vite + Tailwind)
CHAT-APP-FRONTNED/
├─ node_modules/
├─ public/
├─ src/
│  ├─ assets/
│  │  ├─ chat.png
│  │  └─ react.svg
│  ├─ components/
│  │  ├─ ChatPage.jsx
│  │  ├─ JoinCreateChat.jsx
│  │  └─ helper.js
│  ├─ config/
│  │  ├─ AxiosHelper.js
│  │  └─ Routes.jsx
│  ├─ context/
│  │  └─ ChatContext.jsx
│  ├─ services/
│  │  └─ RoomService.js
│  ├─ App.css
│  ├─ App.jsx
│  ├─ index.css
│  └─ main.jsx
├─ .env
├─ .gitignore
├─ eslint.config.js
├─ index.html
├─ nginx.conf
├─ package.json
├─ package-lock.json
├─ postcss.config.js
├─ README.md
├─ tailwind.config.js
└─ vite.config.js

# Backend (Spring Boot + MongoDB)
chat_app_backend/
├─ src/
│  ├─ main/
│  │  ├─ java/
│  │  │  └─ com/substring/chat/chat_app_backend/
│  │  │     ├─ ChatAppBackendApplication.java
│  │  │     ├─ config/
│  │  │     │  ├─ AppConstants.java
│  │  │     │  ├─ WebConfig.java
│  │  │     │  └─ WebSocketConfig.java
│  │  │     ├─ controllers/
│  │  │     │  ├─ ChatController.java
│  │  │     │  ├─ MainController.java
│  │  │     │  └─ RoomController.java
│  │  │     ├─ entities/
│  │  │     │  ├─ Message.java
│  │  │     │  └─ Room.java
│  │  │     ├─ playload/            ← (folder name in repo is “playload”)
│  │  │     │  └─ MessageRequest.java
│  │  │     └─ repositories/
│  │  │        └─ RoomRepository.java
│  │  └─ resources/
│  │     └─ application.properties
│  └─ test/
├─ target/
├─ .gitignore
├─ HELP.md
├─ mvnw
├─ mvnw.cmd
└─ pom.xml

````

---

## 🛠️ Technologies Used
- **Java 17+**
- **Spring Boot 3+**
  - Spring Web
  - Spring Data MongoDB
  - Spring WebSocket
- **MongoDB Atlas** (or local MongoDB)
- **Lombok** (to reduce boilerplate code)
- **Maven** (build tool)

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/chaton-backend.git
cd chaton-backend
````

### 2️⃣ Configure MongoDB

Update the `application.properties` file:

```properties
spring.data.mongodb.uri=mongodb+srv://<username>:<password>@<cluster-url>/chaton
spring.data.mongodb.database=chaton
server.port=8080
```

### 3️⃣ Build & Run

```bash
mvn clean install
mvn spring-boot:run
```

---

## 📡 API Endpoints (Sample)

| Method | Endpoint          | Description                    |
| ------ | ----------------- | ------------------------------ |
| POST   | `/rooms`          | Create a new chat room         |
| GET    | `/rooms`          | Get list of all chat rooms     |
| GET    | `/rooms/{roomId}` | Get details of a specific room |
| POST   | `/messages`       | Send a message to a room       |

---

## 🔌 WebSocket Endpoints

* **WebSocket URL:** `ws://localhost:8080/chat`
* **Message Destination:** `/app/message`
* **Subscription Topic:** `/topic/room/{roomId}`

Example message payload:

```json
{
  "sender": "John",
  "content": "Hello everyone!",
  "roomId": "abc123"
}
```

---

## 📜 Entities Overview

### Message.java

* **Fields:** `sender`, `content`, `timeStamp`
* **Purpose:** Represents each chat message in a room.

### Room.java

* **Fields:** `id`, `roomId`, `messages`
* **Purpose:** Represents a chat room with its messages.

### MessageRequest.java

* **Fields:** `content`, `sender`, `roomId`
* **Purpose:** Payload for sending messages via WebSocket/REST.

---

## 🚀 Future Enhancements

* Authentication & Authorization (JWT-based)
* Private messaging between users
* Message delivery/read receipts
* File & media sharing
* Typing indicators

---

## 👨‍💻 Author

**Parth Ingale**
📧 Email: [your.email@example.com](mailto:your.email@example.com)
🔗 [LinkedIn](https://linkedin.com/in/your-linkedin)

---

## 📜 License

This project is licensed under the MIT License.

```

---

If you want, I can **also add WebSocket flow diagrams** and **MongoDB schema diagrams** in this README so it visually explains how messages flow from sender → backend → receiver. That will make it *much more impressive* for GitHub and recruiters.
```
