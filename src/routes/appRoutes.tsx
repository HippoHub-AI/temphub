import { Route, Routes } from "react-router-dom";
import {
  ROUTE__UPDATE_VAULT,
  ROUTE_ADMIN,
  ROUTE_CHAT,
  ROUTE_CREATE_FILE,
  ROUTE_EARNING,
  ROUTE_HOME,
  ROUTE_LOGIN,
  ROUTE_PRESS,
  ROUTE_QNA,
  ROUTE_SIGNUP,
  ROUTE_VAULT,
  VERIFY_USER,
} from "./constants";
import HomeLayout from "@components/layouts/Homelayout/Homelayout";
import Login from "@pages/login_page/Login";
import Signup from "@pages/signup_page/Signup";
import Chatbox from "@pages/chatbox/Chatbox";
import Admin from "@pages/admin_page/Admin";
import VerifyPage from "@pages/verify/verify";
import Chat from "@pages/chat/Chat";
import UpdatedChat from "@pages/updateChat/updateChat";
import MyVault from "@components/vault/MyVault";
import UpdateVault from "@components/update-vault/UpdateVault";
import CreateFile from "@pages/create-file/createFile";

const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path={ROUTE_LOGIN} element={<Login />} />
        <Route path={ROUTE_SIGNUP} element={<Signup />} />
        <Route
          path={ROUTE_HOME}
          element={
            <HomeLayout>
              <Chatbox />
            </HomeLayout>
          }
        />
        <Route
          path={ROUTE_CHAT}
          element={
            <HomeLayout>
              <Chat />
            </HomeLayout>
          }
        />
        <Route
          path={ROUTE_PRESS}
          element={
            <HomeLayout>
              <UpdatedChat />
            </HomeLayout>
          }
        />
        <Route
          path={ROUTE_EARNING}
          element={
            <HomeLayout>
              <UpdatedChat />
            </HomeLayout>
          }
        />
        <Route
          path={ROUTE_QNA}
          element={
            <HomeLayout>
              <UpdatedChat />
            </HomeLayout>
          }
        />
        <Route
          path={ROUTE_ADMIN}
          element={
            <HomeLayout>
              <Admin />
            </HomeLayout>
          }
        />
        <Route
          path={ROUTE_VAULT}
          element={
            <HomeLayout>
              <MyVault />
            </HomeLayout>
          }
        />
        <Route
          path={ROUTE__UPDATE_VAULT}
          element={
            <HomeLayout>
              <UpdateVault />
            </HomeLayout>
          }
        />
        <Route
          path={ROUTE_CREATE_FILE}
          element={
            <HomeLayout>
              <CreateFile />
            </HomeLayout>
          }
        />
        <Route path={VERIFY_USER} element={<VerifyPage />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
