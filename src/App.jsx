import { useEffect, useState } from 'react';
import styles from './App.module.scss';
import { auth } from './firebase';
import Chat from './components/Chat';
import { SignInWithGoogle } from './components/Sign_in';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

return (
  <div className={styles.appContainer}>
    {user ? (
      <Chat user={user} />
    ) : (
      <div className={styles.authContainer}>
        <h1>Chat App 🔥</h1>
        <SignInWithGoogle />
      </div>
    )}
  </div>
);
}
export default App;