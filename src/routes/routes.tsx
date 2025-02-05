import { createBrowserRouter } from "react-router-dom";
import {LoginPage} from "../pages/login";
import {SignupPage} from "../pages/singup";
import {HomePage} from "../pages/home";
import pagePaths from "./page-paths";
import ProtectedRoute from "./protectedRoutes";

export const router = createBrowserRouter([
    {
        path: pagePaths.DASHBOARD_PAGE,
        element: <ProtectedRoute component={HomePage}/>,
    },
    {
        path: pagePaths.LOGIN_PAGE,
        element: <LoginPage />,
    },
    {
        path: pagePaths.SIGNUP_PAGE,
        element: <SignupPage />,
    },
]);
