package com.substring.chat.chat_app_backend.controllers;

import com.substring.chat.chat_app_backend.entities.Message;
import com.substring.chat.chat_app_backend.entities.Room;
import com.substring.chat.chat_app_backend.repositories.RoomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
public class RoomController {

    private final RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Room Controller is working!");
    }

    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody String roomId) {
        System.out.println("Creating room with ID: '" + roomId + "'");

        if (roomRepository.findByRoomId(roomId) != null) {
            return ResponseEntity.badRequest().body("Room already exists!");
        }

        Room room = new Room();
        room.setRoomId(roomId);
        Room savedRoom = roomRepository.save(room);
        System.out.println("Room saved with ID: '" + savedRoom.getRoomId() + "' and MongoDB ID: " + savedRoom.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId) {
        System.out.println("Searching for room with ID: '" + roomId + "'");

        Room room = roomRepository.findByRoomId(roomId);
        if (room == null) {
            System.out.println("Room not found in database!");
            return ResponseEntity.badRequest().body("Room not found!!");
        }
        System.out.println("Room found: " + room.getRoomId());
        return ResponseEntity.ok(room);
    }

    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getMessages(
            @PathVariable String roomId,
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "20", required = false) int size
    ) {
        System.out.println("Getting messages for room: '" + roomId + "'");

        Room room = roomRepository.findByRoomId(roomId);
        if (room == null) {
            System.out.println("Room not found when getting messages!");
            return ResponseEntity.badRequest().build();
        }

        List<Message> messages = room.getMessages();
        int start = Math.max(0, messages.size() - (page + 1) * size);
        int end = Math.min(messages.size(), start + size);
        List<Message> paginatedMessages = messages.subList(start, end);
        return ResponseEntity.ok(paginatedMessages);
    }
}
//package com.substring.chat.chat_app_backend.controllers;
//
//import com.substring.chat.chat_app_backend.config.AppConstants;
//import com.substring.chat.chat_app_backend.entities.Message;
//import com.substring.chat.chat_app_backend.entities.Room;
//import com.substring.chat.chat_app_backend.repositories.RoomRepository;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/v1/rooms")
//@CrossOrigin(AppConstants.FRONT_END_BASE_URL)
//
//public class RoomController {
//
//    private RoomRepository roomRepository;
//
//    @GetMapping("/")
//    public ResponseEntity<String> home() {
//        return ResponseEntity.ok("Chat App Backend is running! Try /api/v1/rooms");
//    }
//    public RoomController(RoomRepository roomRepository) {
//        this.roomRepository = roomRepository;
//    }
//
//@PostMapping
//public ResponseEntity<?> createRoom(@RequestBody String roomId) {
//    System.out.println("Creating room with ID: '" + roomId + "'"); // ADD THIS DEBUG LINE
//
//    if (roomRepository.findByRoomId(roomId) != null) {
//        //room is already there
//        return ResponseEntity.badRequest().body("Room already exists!");
//    }
//    Room room = new Room();
//    room.setRoomId(roomId);
//    Room savedRoom = roomRepository.save(room);
//    System.out.println("Room saved with ID: '" + savedRoom.getRoomId() + "' and MongoDB ID: " + savedRoom.getId()); // ADD THIS DEBUG LINE
//    return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);
//}
//
//    @GetMapping("/{roomId}")
//    public ResponseEntity<?> joinRoom(@PathVariable String roomId) {
//        System.out.println("Searching for room with ID: '" + roomId + "'"); // ADD THIS DEBUG LINE
//
//        Room room = roomRepository.findByRoomId(roomId);
//        if (room == null) {
//            System.out.println("Room not found in database!"); // ADD THIS DEBUG LINE
//            return ResponseEntity.badRequest().body("Room not found!!");
//        }
//        System.out.println("Room found: " + room.getRoomId()); // ADD THIS DEBUG LINE
//        return ResponseEntity.ok(room);
//    }
//
//    //get messages of room
//    @GetMapping("/{roomId}/messages")
//    public ResponseEntity<List<Message>> getMessages(
//            @PathVariable String roomId,
//            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
//            @RequestParam(value = "size", defaultValue = "20", required = false) int size
//    ) {
//        System.out.println("Getting messages for room: '" + roomId + "'"); // ADD THIS DEBUG LINE
//
//        Room room = roomRepository.findByRoomId(roomId);
//        if (room == null) {
//            System.out.println("Room not found when getting messages!"); // ADD THIS DEBUG LINE
//            return ResponseEntity.badRequest().build();
//        }
//        //get messages :
//        //pagination
//        List<Message> messages = room.getMessages();
//        int start = Math.max(0, messages.size() - (page + 1) * size);
//        int end = Math.min(messages.size(), start + size);
//        List<Message> paginatedMessages = messages.subList(start, end);
//        return ResponseEntity.ok(paginatedMessages);
//    }
//
//
//
//}
