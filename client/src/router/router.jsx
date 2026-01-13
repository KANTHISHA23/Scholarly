import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout/RootLayout";
import Home from "../pages/Home/Home";
import AllScholarships from "../pages/AllScholarships/AllScholarships";
import SignUp from "../pages/Authentication/SignUp/SignUp";
import SignIn from "../pages/Authentication/SignIn/SignIn";
import ForgotPassword from "../pages/Authentication/ForgotPassword/ForgotPassowrd";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import ScholarshipDetails from "../pages/ScholarshipDetails/ScholarshipDetails";
import DashBoardLayout from "../layout/DashBoardLayout/DashBoardLayout";
import AddScholarship from "../pages/DashBoard/AddScholarship/AddScholarship";
import DashBoardHome from "../pages/DashBoard/DashBoardHome/DashBoardHome";
import UserProfile from "../pages/DashBoard/UserProfile/UserProfile";
import ManageScholarships from "../pages/DashBoard/ManageScholarships/ManageScholarships";
import EditScholarship from "../pages/DashBoard/ManageScholarships/EditScholarship/EditScholarship";
import AdminRoute from "./AdminRoute/AdminRoute";
import ManageApplications from "../pages/DashBoard/Admin/ManageApplications/ManageApplications";
import ManageReviews from "../pages/DashBoard/Admin/ManageReviews/ManageReviews";
import MyApplications from "../pages/DashBoard/Student/MyApplications/MyApplications";
import ApplyScholarship from "../pages/ScholarshipDetails/ApplyScholarship";
import EditApplication from "../pages/DashBoard/Student/EditApplication/EditApplication";
import MyReviews from "../pages/DashBoard/Student/MyReviews/MyReviews";
import SuccessStories from "../pages/SuccessStories/SuccessStories";
import WishList from "../pages/WishList/WishList";
import ManageUsers from "../pages/DashBoard/Admin/ManageUsers/ManageUsers";
import ErrorPage from "../pages/ErrorPage/ErrorPage";

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: '/scholarships',
        Component: AllScholarships,
      },
      {
        path: '/success-stories',
        Component: SuccessStories,
      },
      {
        path: '/wishlists',
        element: (
          <PrivateRoute>
            <WishList />
          </PrivateRoute>
        ),
      },
      {
        path: '/signUp',
        Component: SignUp,
      },
      {
        path: '/signIn',
        Component: SignIn,
      },
      {
        path: '/forgot-password',
        Component: ForgotPassword,
      },
      {
        path: '/scholarships/:id',
        element: (
          <PrivateRoute>
            <ScholarshipDetails />
          </PrivateRoute>
        ),
      },
      {
        path: '/scholarships/:id/apply',
        element: (
          <PrivateRoute>
            <ApplyScholarship />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashBoardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: '/dashboard',
        Component: DashBoardHome,
      },
      //! Admin route
      {
        path: '/dashboard/add-scholarship',
        element: (
          <AdminRoute>
            <AddScholarship />
          </AdminRoute>
        ),
      },
      {
        path: '/dashboard/manage-scholarships',
        element: (
          <AdminRoute>
            <ManageScholarships />
          </AdminRoute>
        ),
      },
      {
        path: '/dashboard/edit-scholarship/:id',
        element: (
          <AdminRoute>
            <EditScholarship />
          </AdminRoute>
        ),
      },
      //! Admin Route
      {
        path: '/dashboard/me',
        Component: UserProfile,
      },
      {
        path: '/dashboard/manage-applications',
        element: (
          <AdminRoute>
            <ManageApplications />
          </AdminRoute>
        ),
      },
      {
        path: '/dashboard/manage-reviews',
        element: (
          <AdminRoute>
            <ManageReviews />
          </AdminRoute>
        ),
      },
      {
        path: '/dashboard/manage-users',
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: '/dashboard/edit-application/:id',
        element: (
          <PrivateRoute>
            <EditApplication />
          </PrivateRoute>
        ),
      },

      // Student
      {
        path: '/dashboard/my-application',
        Component: MyApplications,
      },
      {
        path: '/dashboard/my-reviews',
        Component: MyReviews,
      },
      // Student
    ],
  },
  {
    path: '*',
    Component: ErrorPage,
  },
]);
export default router;
