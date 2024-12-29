package ro.tuc.ds2020;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.socket.TextMessage;

import java.io.IOException;
import java.util.*;

@Component
public class MyWebSocketHandler extends TextWebSocketHandler {

    private final Set<WebSocketSession> sessions = new HashSet<>();
    private final Map<String, Message> messages = new HashMap<>(); // Store messages by ID
    private final Map<String, Set<String>> messageSeenByUsers = new HashMap<>(); // Track users who have seen each message

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("New connection established: " + session.getId());
        sessions.add(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();

        if (payload.startsWith("TYPING")) {
            broadcastTyping(session);
        } else if (payload.startsWith("STOP_TYPING")) {
            broadcastStopTyping(session);
        } else if (payload.startsWith("SEEN:")) {
            // Extract the message ID and mark it as seen by the user
            String messageId = payload.substring(5);
            markMessageAsSeen(session, messageId);
        } else {
            // Handle sending a new message
            String messageId = UUID.randomUUID().toString(); // Generate a unique ID for the message
            Message newMessage = new Message(messageId, session.getId(), payload);
            messages.put(messageId, newMessage);
            messageSeenByUsers.put(messageId, new HashSet<>());
            broadcastMessage(session, newMessage);
        }
    }

    private void broadcastMessage(WebSocketSession sender, Message message) throws IOException {
        for (WebSocketSession session : sessions) {
            if (session != sender && session.isOpen()) {
                session.sendMessage(new TextMessage("Message: " + message.getContent()));
            }
        }
    }

    private void broadcastTyping(WebSocketSession sender) throws IOException {
        for (WebSocketSession session : sessions) {
            if (session != sender && session.isOpen()) {
                session.sendMessage(new TextMessage("TYPING"));
            }
        }
    }

    private void broadcastStopTyping(WebSocketSession sender) throws IOException {
        for (WebSocketSession session : sessions) {
            if (session != sender && session.isOpen()) {
                session.sendMessage(new TextMessage("STOP_TYPING"));
            }
        }
    }

    private void markMessageAsSeen(WebSocketSession session, String messageId) throws IOException {
        // Add the user to the list of users who have seen the message
        Set<String> seenUsers = messageSeenByUsers.get(messageId);
        if (seenUsers != null) {
            seenUsers.add(session.getId());

            // If all users have seen the message, notify the sender
            if (seenUsers.size() == sessions.size()) {
                notifySenderMessageSeen(messageId);
            }
        }
    }

    private void notifySenderMessageSeen(String messageId) throws IOException {
        Message message = messages.get(messageId);
        if (message != null) {
            WebSocketSession senderSession = getSessionById(message.getSenderId());
            if (senderSession != null && senderSession.isOpen()) {
                senderSession.sendMessage(new TextMessage("SEEN:" + messageId));
            }
        }
    }

    private WebSocketSession getSessionById(String userId) {
        for (WebSocketSession session : sessions) {
            if (session.getId().equals(userId)) {
                return session;
            }
        }
        return null;
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
        System.out.println("Connection closed: " + session.getId());
    }

    // Message class to store message content and seen users
    private static class Message {
        private final String messageId;
        private final String senderId;
        private final String content;

        public Message(String messageId, String senderId, String content) {
            this.messageId = messageId;
            this.senderId = senderId;
            this.content = content;
        }

        public String getMessageId() {
            return messageId;
        }

        public String getSenderId() {
            return senderId;
        }

        public String getContent() {
            return content;
        }
    }
}
