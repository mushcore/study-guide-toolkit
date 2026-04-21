import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import AboutPage from '../pages/AboutPage';
import StudentListPage from '../pages/StudentListPage';
import StudentDetailPage from '../pages/StudentDetailPage';
import NotFoundPage from "../components/NotFoundPage";

import App from "../App";

/**
 * The router configuration for the application.
 */
export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: (
                    <HomePage
                        title={"Hello, welcome to students-react with Typescript!"}
                        subtitle={"You can view some of your favorite students here."}
                    >
                        Surely, school is fun.
                    </HomePage>
                ),
            },
            {
                path: "/about",
                element: <AboutPage message={"Application that uses student data."} />,
            },
            {
                path: "/list",
                element: <StudentListPage />,
            },
            {
                path: "/detail/:id",
                element: <StudentDetailPage />,
            },
            {
                path: "*",
                element: <NotFoundPage />,
            },

        ],
    },
]);
