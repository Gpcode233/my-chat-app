import { useState, useEffect } from 'react';
import styles from './Chat.module.scss';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';

export default function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleDeleteMessage = async (messageId, userId) => {
    if (userId !== user?.uid) return;
    
    const confirmDelete = window.confirm("Delete this message?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'messages', messageId));
        setSelectedMessage(null);
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messages);
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        timestamp: new Date(),
        userId: user?.uid,
        userName: user?.displayName || "Anonymous"
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <span>Logged in as: <strong>{user?.displayName || "Anonymous"}</strong></span>
        <button 
          className={styles.signOutButton}
          onClick={() => auth.signOut()}
        >
          Sign Out
        </button>
      </div>

      <div className={styles.messages}>
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`${styles.message} ${msg.userId === user?.uid ? styles.currentUser : ''}`}
            onMouseEnter={() => setSelectedMessage(msg.id)}
            onMouseLeave={() => setSelectedMessage(null)}
          >
            {msg.userId === user?.uid && (
              <button 
                className={styles.deleteMessageButton}
                onClick={() => handleDeleteMessage(msg.id, msg.userId)}
                style={{ 
                  visibility: selectedMessage === msg.id ? 'visible' : 'hidden' 
                }}
              >
                ×
              </button>
            )}
            <small className={styles.userName}>{msg.userName}</small>
            <p>{msg.text}</p>
            <small className={styles.timestamp}>
              {new Date(msg.timestamp?.toDate()).toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit'
              })}
            </small>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" disabled={!newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}