// Authentication Service
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// Create a new user account
export const registerWithEmail = async (email, password, displayName, language = "en") => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, { displayName });
    
    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email,
      displayName,
      createdAt: new Date(),
      preferences: {
        language,
        notifications: true,
        defaultTimeAllocation: {
          workStudy: 6, // hours
          socialFriends: 1.5,
          socialPartner: 2,
          entertainment: 8,
          sleep: 8
        }
      },
      stats: {
        tasksCreated: 0,
        tasksCompleted: 0,
        totalTimeTracked: 0
      }
    });
    
    return user;
  } catch (error) {
    console.error("Error registering with email:", error);
    throw error;
  }
};

// Sign in with email and password
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in with email:", error);
    throw error;
  }
};

// Sign in with Google
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    // Check if user document exists
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (!userDoc.exists()) {
      // Create user document if it doesn't exist
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        createdAt: new Date(),
        preferences: {
          language: "en",
          notifications: true,
          defaultTimeAllocation: {
            workStudy: 6,
            socialFriends: 1.5,
            socialPartner: 2,
            entertainment: 8,
            sleep: 8
          }
        },
        stats: {
          tasksCreated: 0,
          tasksCompleted: 0,
          totalTimeTracked: 0
        }
      });
    }
    
    return user;
  } catch (error) {
    console.error("Error logging in with Google:", error);
    throw error;
  }
};

// Sign in with Facebook
export const loginWithFacebook = async () => {
  try {
    const provider = new FacebookAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    // Check if user document exists
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (!userDoc.exists()) {
      // Create user document if it doesn't exist
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        createdAt: new Date(),
        preferences: {
          language: "en",
          notifications: true,
          defaultTimeAllocation: {
            workStudy: 6,
            socialFriends: 1.5,
            socialPartner: 2,
            entertainment: 8,
            sleep: 8
          }
        },
        stats: {
          tasksCreated: 0,
          tasksCompleted: 0,
          totalTimeTracked: 0
        }
      });
    }
    
    return user;
  } catch (error) {
    console.error("Error logging in with Facebook:", error);
    throw error;
  }
};

// Sign out
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

// Update user preferences
export const updateUserPreferences = async (uid, preferences) => {
  try {
    await updateDoc(doc(db, "users", uid), {
      "preferences": preferences
    });
    return true;
  } catch (error) {
    console.error("Error updating user preferences:", error);
    throw error;
  }
};

// Get user data
export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};

// Auth state listener
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
