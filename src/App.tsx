import { Route, Routes } from "react-router-dom";

import AuthLayout from "./_auth/AuthLayout";
import SigninForm from "./_auth/forms/SigninForm";
import "./globals.css";
import RootLayout from "./_root/RootLayout";
import { Home, Test, VideoCall } from "./_root/pages";
import SignupForm from "./_auth/forms/SignupForm";
import { Toaster } from "./components/ui/toaster";
import MessagePage from "./components/shared/MessagePage";

function App() {
  return (
    <>
      <main className="flex h-screen">
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/sign-in" element={<SigninForm />} />
            <Route path="/sign-up" element={<SignupForm />} />
          </Route>

          {/* Private Routes */}
          <Route element={<RootLayout />}>
            <Route path="/" element={<Home />}>
              <Route path=":userId" element={<MessagePage />} />
            </Route>
            <Route path="/videocall" element={<VideoCall />} />
            <Route path="/test" element={<Test />} />
          </Route>
        </Routes>

        <Toaster />
      </main>
    </>
  );
}

export default App;
