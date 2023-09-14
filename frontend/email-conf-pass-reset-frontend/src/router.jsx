import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import HomePage from "./components/HomePage.jsx";
import EmailActivationPage from "./components/EmailActivatePage.jsx";
import PasswordResetPage from "./components/PasswordResetPage.jsx";
import Error404Page from "./components/Error404Page.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "validation/:token",
        element: <EmailActivationPage />
      },
      {
        path: "reset/:token",
        element: <PasswordResetPage />
      }
    ],
    errorElement: <Error404Page />,
  },
]);

export default router;
