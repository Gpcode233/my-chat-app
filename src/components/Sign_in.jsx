import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';// Optional for redirects

export function SignInWithGoogle() {
  const handleClick = async () => {
    console.log('Button clicked'); // Test if this logs
    try {
      await signInWithPopup(auth, googleProvider);
      console.log('Success!'); // Check if this appears
    } catch (err) {
      console.log('ERROR CODE:', err.code); // Share this
    }
  };

  return <button onClick={handleClick}>Test Google Sign-In</button>;
}