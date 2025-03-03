import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { notifications } from '@mantine/notifications';
import { auth } from '@/firebase';

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential?.accessToken;
    const user = result.user;

    console.log('User Object from Google Sign-In:', user);

    console.log('User Info:', user);
    notifications.show({
      title: 'Google Sign-In Successful',
      message: `Welcome ${user.displayName || user.email}!`,
      color: 'green',
      autoClose: 3000,
      position: 'bottom-right',
    });
    return user;
  } catch (error: any) {
    notifications.show({
      title: 'Google Sign-In Failed',
      message: error.message || 'An unexpected error occurred. Please try again later.',
      color: 'red',
      autoClose: 3000,
      position: 'top-right',
    });
    throw error;
  }
};
export const signUpWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  try {
    // Sign up with Google
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log('User Object from Google Sign-In:', user);

    notifications.show({
      title: 'Sign-Up Successful',
      message: `Welcome ${user.displayName || user.email}!`,
      color: 'green',
      autoClose: 3000,
      position: 'bottom-right',
    });
    return user;
  } catch (error: any) {
    notifications.show({
      title: 'Google Sign-In Failed',
      message: error.message || 'An unexpected error occurred. Please try again later.',
      color: 'red',
      autoClose: 3000,
      position: 'top-right',
    });
    throw error;
  }
};
