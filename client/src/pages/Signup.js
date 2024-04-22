import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInWithPhoneNumber, updateProfile } from 'firebase/auth';
import { setDoc, doc, getFirestore } from 'firebase/firestore';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(null);
  const [showPhoneNumberInput, setShowPhoneNumberInput] = useState(false);
  const [role, setRole] = useState('citizen');
  const navigate = useNavigate();

  const handleSignupWithEmail = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: role });

      navigate(getRedirectPath());
    } catch (error) {
      const errorMessage = mapFirebaseErrorToCustomMessage(error.code);
      setError(errorMessage);
    }
  };

  const handleSignupWithGoogle = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const db = getFirestore();
      await setDoc(doc(db, 'users', user.uid), { role });

      navigate(getRedirectPath());
    } catch (error) {
      const errorMessage = mapFirebaseErrorToCustomMessage(error.code);
      setError(errorMessage);
    }
  };

  const handleSignupWithMobile = async () => {
    try {
      const auth = getAuth();
      const recaptchaVerifier = '';
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);

      const db = getFirestore();
      await setDoc(doc(db, 'users', confirmationResult.user.uid), { role });

      navigate(getRedirectPath());
    } catch (error) {
      const errorMessage = mapFirebaseErrorToCustomMessage(error.code);
      setError(errorMessage);
    }
  };

  const mapFirebaseErrorToCustomMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Email is already in use';
      case 'auth/invalid-email':
        return 'Invalid Email';
      case 'auth/weak-password':
        return 'The password is too weak.';
      default:
        return 'An error occurred. Please try again later.';
    }
  };

  const getRedirectPath = () => {
    switch (role) {
      case 'citizen':
        return '/create-patient';
      case 'doctor':
        return '/create-doctor';
      case 'hospital':
        return '/create-hospital';
      default:
        return '/';
    }
  };

  return (
    <body className='body'>
      <div className="MainContainer">
        <div className="blob-section">
          <div className="animated-blob">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-100 -100 300 300" // Adjusted viewBox for the entire range of coordinates
              width="100%"
              height="100%" // Ensure the SVG fills the container
              id="blobSvg"

            >
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'rgb(15, 143, 255)' }}></stop>
                  <stop offset="100%" style={{ stopColor: 'rgb(99, 38, 242)' }}></stop>
                </linearGradient>
              </defs>
              <path
                id="blob"
                fill="url(#gradient)"

              >
                <animate
                  attributeName="d"
                  dur="20s"
                  repeatCount="indefinite"
                  values="
                  M56.3,-60.1C72.3,-53.7,84.1,-35.3,85.3,-16.8C86.5,1.8,77.2,20.5,64.5,32.2C51.7,44,35.6,48.8,18.6,57.9C1.6,67,-16.2,80.3,-30.3,77.6C-44.3,74.9,-54.5,56.1,-58.5,38.8C-62.5,21.5,-60.3,5.6,-55.2,-7.4C-50.1,-20.3,-42,-30.4,-32.3,-37.9C-22.7,-45.4,-11.3,-50.3,4.4,-55.6C20.2,-60.9,40.3,-66.5,56.3,-60.1Z;
                  M42.7,-48.5C54.2,-41.3,61.5,-26.7,67.8,-9.2C74.2,8.3,79.7,28.7,71.3,39.3C63,49.8,40.8,50.5,22,55C3.1,59.5,-12.3,67.9,-27.9,66.6C-43.6,65.4,-59.4,54.4,-67.7,39.4C-76,24.4,-76.8,5.3,-73.9,-13.4C-71.1,-32.1,-64.5,-50.6,-51.6,-57.5C-38.6,-64.5,-19.3,-59.9,-1.8,-57.7C15.6,-55.5,31.3,-55.7,42.7,-48.5Z;
                  M54.1,-60.1C68.8,-52.2,78.3,-33.9,81.5,-14.5C84.8,4.8,81.6,25.1,70.8,38C59.9,51,41.3,56.6,24.1,60.4C6.9,64.2,-8.9,66,-23.2,61.7C-37.5,57.4,-50.3,46.9,-54.4,34.1C-58.5,21.4,-54,6.3,-53.5,-11.7C-53,-29.7,-56.5,-50.6,-48.3,-59.6C-40,-68.6,-20,-65.7,-0.1,-65.5C19.7,-65.4,39.5,-68,54.1,-60.1Z;
                  M44.1,-52.9C54.9,-43.5,60,-27.5,64.4,-10.2C68.9,7.1,72.9,25.7,65.4,36.8C57.9,47.9,39,51.5,23.2,52.2C7.5,52.9,-5.1,50.7,-20.5,48.5C-35.9,46.2,-54.1,44,-65.9,33.3C-77.7,22.6,-83.1,3.5,-77.7,-11.3C-72.3,-26.2,-55.9,-36.7,-41.2,-45.4C-26.4,-54.1,-13.2,-61,1.7,-63.1C16.6,-65.1,33.3,-62.3,44.1,-52.9Z;
                  M40.5,-50.6C50.9,-39.6,56.5,-25.3,58.4,-10.9C60.2,3.5,58.3,18,51.6,30C45,42,33.6,51.5,19.6,58.8C5.6,66,-11,70.9,-26.1,67.3C-41.3,63.8,-54.9,51.7,-60.8,37.2C-66.7,22.7,-64.7,5.8,-59.4,-8C-54,-21.8,-45.1,-32.5,-34.7,-43.5C-24.2,-54.5,-12.1,-65.7,1.5,-67.4C15.1,-69.2,30.1,-61.5,40.5,-50.6Z;
                  M50.3,-64.2C59.4,-52.2,57,-30.9,58.8,-11.7C60.6,7.5,66.5,24.6,61.7,38.1C56.9,51.5,41.4,61.3,24.6,67.2C7.8,73.1,-10.2,75.2,-27.2,70.7C-44.2,66.2,-60.2,55.1,-64.4,40.7C-68.5,26.2,-60.9,8.4,-58.3,-11C-55.8,-30.5,-58.4,-51.6,-49.6,-63.6C-40.7,-75.7,-20.3,-78.6,0.1,-78.8C20.6,-78.9,41.1,-76.2,50.3,-64.2Z;
                  M34,-39.3C45.1,-31.2,55.9,-21.5,63,-7.3C70.1,7,73.5,25.7,66.4,38.7C59.3,51.7,41.7,58.9,25.1,62C8.5,65,-7.2,63.9,-24.2,60.3C-41.2,56.8,-59.5,50.9,-71.8,37.6C-84,24.3,-90.1,3.7,-83,-10.8C-76,-25.4,-55.7,-33.7,-39.6,-41C-23.6,-48.2,-11.8,-54.3,-0.2,-54.1C11.4,-53.9,22.9,-47.4,34,-39.3Z;
                  M52.5,-60.9C63.1,-53.6,63.6,-32.4,67.1,-11.9C70.6,8.6,77.1,28.5,71.6,44.4C66,60.4,48.4,72.4,28.8,80C9.1,87.6,-12.5,90.7,-26.5,81.7C-40.4,72.7,-46.6,51.6,-55.5,33.4C-64.3,15.2,-75.8,-0.1,-73.1,-12.5C-70.4,-24.9,-53.6,-34.4,-39.1,-41C-24.5,-47.7,-12.3,-51.5,4.3,-56.7C20.9,-61.8,41.8,-68.3,52.5,-60.9Z;
                  M43.9,-53.5C54.2,-43.8,57.7,-27.3,63.4,-9.1C69.1,9.1,76.9,29,72.1,45.7C67.3,62.3,49.9,75.7,31.4,79.4C13,83.1,-6.5,77.2,-20.8,67.5C-35.1,57.8,-44.3,44.3,-53.1,30.2C-61.8,16,-70.2,1.1,-71.3,-16.1C-72.5,-33.2,-66.5,-52.6,-53.4,-61.9C-40.3,-71.1,-20.1,-70.1,-1.6,-68.1C16.9,-66.2,33.7,-63.2,43.9,-53.5Z;
                  M53.9,-61.8C66.4,-53.8,70.7,-33.5,73.6,-13.5C76.6,6.6,78.2,26.3,69.3,38.3C60.4,50.4,40.9,54.6,23,59.5C5.1,64.4,-11.2,70,-28.4,68.1C-45.6,66.1,-63.7,56.7,-73.8,41.5C-84,26.3,-86.2,5.3,-80.9,-12.5C-75.6,-30.3,-62.8,-45,-48.1,-52.6C-33.4,-60.2,-16.7,-60.7,2,-63.1C20.7,-65.5,41.4,-69.8,53.9,-61.8Z;
                  M44.6,-53.4C55.5,-44,60.4,-27.8,63.1,-11.3C65.9,5.2,66.4,21.9,60,36.1C53.6,50.3,40.2,62,23.6,70.3C7.1,78.7,-12.6,83.7,-26.1,76.6C-39.6,69.6,-46.9,50.5,-54.3,33.4C-61.6,16.4,-69,1.5,-66.5,-11.6C-64.1,-24.7,-51.9,-36,-39.2,-45.1C-26.4,-54.3,-13.2,-61.2,1.8,-63.4C16.8,-65.5,33.7,-62.9,44.6,-53.4Z;
                  M32.8,-42.1C43.5,-30.1,53.8,-20.7,60.6,-7C67.5,6.8,70.9,24.8,63.3,35.2C55.7,45.5,37.1,48.1,21.7,49.2C6.3,50.3,-5.9,49.9,-17,46.2C-28.2,42.4,-38.4,35.2,-51.1,24.2C-63.8,13.1,-79.1,-1.8,-80.1,-17.2C-81,-32.6,-67.6,-48.6,-51.8,-59.6C-36.1,-70.7,-18,-76.9,-3.5,-72.7C11,-68.5,22.1,-54,32.8,-42.1Z;
                  M43.8,-51.2C60.1,-38.6,78.8,-27.9,80.2,-14.9C81.6,-1.9,65.6,13.4,52.8,25.8C40.1,38.2,30.4,47.7,19.3,50.9C8.1,54,-4.6,50.9,-22.3,49.6C-40,48.2,-62.6,48.7,-73.8,38.3C-85,27.8,-84.7,6.5,-80.4,-13.5C-76.1,-33.5,-67.7,-52.1,-53.6,-65.1C-39.5,-78.1,-19.8,-85.5,-3,-81.9C13.8,-78.4,27.6,-63.9,43.8,-51.2Z;
                  M49.6,-61C60.8,-49.7,63.9,-30.8,66.4,-12.4C68.9,6,70.6,23.9,62.5,34.2C54.3,44.5,36.3,47.3,19.5,53.2C2.8,59.1,-12.7,68.1,-28.5,67.1C-44.3,66.2,-60.4,55.2,-71,39.7C-81.6,24.1,-86.5,4,-80.2,-11.1C-73.8,-26.1,-56.3,-36.1,-41,-46.7C-25.8,-57.3,-12.9,-68.5,3.1,-72.2C19.2,-76,38.4,-72.3,49.6,-61Z;
                  M40.1,-45.7C52.2,-37.7,62.3,-25.2,66.3,-10.5C70.3,4.2,68.2,21.1,59.8,33.6C51.5,46.1,37,54,22.2,58.3C7.3,62.6,-8,63.3,-22.3,59C-36.6,54.8,-50,45.7,-60.8,32.4C-71.7,19.2,-80.1,1.8,-74.9,-10.8C-69.8,-23.3,-51.2,-31,-36.4,-38.6C-21.7,-46.2,-10.8,-53.6,1.6,-55.5C14,-57.4,28,-53.7,40.1,-45.7Z;
                  

          "
                ></animate>
              </path>
            </svg>
          </div>

        </div>

        <div className="introTextContainer">
          <h1>New to Doc Plus? </h1>
          <div className="role-selection">
            <div
              className={`citizen-bar ${role === 'citizen' ? 'glowing-border active' : 'glowing-border'}`}
              onClick={() => setRole('citizen')}
            >
              Patient
            </div>
            <div
              className={`doctor-bar ${role === 'doctor' ? 'glowing-border active' : 'glowing-border'}`}
              onClick={() => setRole('doctor')}
            >
              Doctor
            </div>
            <div
              className={`hospital-bar ${role === 'hospital' ? 'glowing-border active' : 'glowing-border'}`}
              onClick={() => setRole('hospital')}
            >
              Hospital
            </div>
          </div>
          <h4>Already a user ? <Link to="/login" className='Loginlink'> Login </Link> here.</h4>
        </div>
        <div className="loginContainer">
          <h2 className="welcometext">WELCOME</h2>
          <form onSubmit={handleSignupWithEmail}>
            <input
              className='sign-up-input'
              type="email"
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className='sign-up-input'
              type="password"
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" className="signup">Sign Up</button>
          </form>

          <div className="dividerLine">
            <div className="divider"></div>
            <h4 className="or">or</h4>
            <div className="divider"></div>
          </div>
          <div className="social">
            <Link className="social-icons">
              <img src="images/sms.png" alt="sms" className="sms" onClick={handleSignupWithMobile} />
              <h4 onClick={() => setShowPhoneNumberInput(true)}>Sign Up with Mobile</h4>
            </Link>
            <Link className="social-icons" onClick={handleSignupWithGoogle}>
              <img src="images/google-search.png" alt="google" className="google" />
              <h4>Sign Up with Google</h4>
            </Link>
            <Link className="social-icons">
              <img src="images/apple-logo.png" alt="apple" className="apple" />
              <h4>Sign Up with Apple</h4>
            </Link>
          </div>
        </div>
      </div>
    </body>
  );
}

export default Signup;
