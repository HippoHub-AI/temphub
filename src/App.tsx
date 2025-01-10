import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes/appRoutes";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "../src/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { useEffect } from "react";
import { selectUser, updateToken } from "@redux/slices/userSlice";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../firebaseConfig"; // ✅ Import the initialized Firebase instance

async function exchangeCustomToken(
  customToken: string,
): Promise<string | null> {
  try {
    const userCredential = await signInWithCustomToken(auth, customToken);
    const idToken = await userCredential.user.getIdToken();
    console.log("✅ Successfully exchanged for ID Token:");
    return idToken;
  } catch (error) {
    console.error("❌ Error exchanging custom token:", error);
    return null;
  }
}

function useCustomFunction() {
  //  const location = useLocation();
  //  const userApi = new UserApi();

  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectUser);

  useEffect(() => {
    const executeCustomFunction = async () => {
      console.log("📦 Logged In User:", loggedInUser.user_info.email);
      const fireBaseToken = loggedInUser?.firebase_token;

      // ✅ Prevent repeated token exchange
      if (!fireBaseToken) {
        console.warn("⚠️ Firebase token not found");
        return;
      }

      try {
        // ✅ Exchange the custom token for an ID token
        const idToken = await exchangeCustomToken(fireBaseToken);
        if (idToken) {
          dispatch(updateToken(idToken)); // ✅ Update the token in Redux store
          console.log("✅ Updated Redux with ID Token");
        } else {
          console.error("❌ Failed to retrieve a valid ID token");
        }
      } catch (error) {
        console.error("❌ Token exchange error:", error);
      }
    };

    executeCustomFunction();
  }, [loggedInUser?.firebase_token]); // ✅ Only trigger when the token changes
}

function App() {
  let persitor = persistStore(store);
  const queryClient = new QueryClient();

  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persitor}>
          <ToastContainer />
          <QueryClientProvider client={queryClient}>
            <Router>
              <RouteWatcher />
              <AppRoutes />
            </Router>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </>
  );
}
function RouteWatcher() {
  useCustomFunction();
  return null; // This component doesn't render anything
}
export default App;
