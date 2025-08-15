import {createBrowserRouter, Navigate} from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import CartPage from "../pages/books/CartPage";
import CheckoutPage from "../pages/books/CheckoutPage";
import SingleBook from '../pages/books/SingleBook';
import ContactUs from '../pages/contact/ContactUs';
import PrivateRoute from "./PrivateRoute";
import OrderPage from "../pages/books/OrderPage";
import AdminRoute from "./AdminRoute";
import AdminLogin from "../components/AdminLogin";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import ManageBooks from "../pages/dashboard/ManageBooks/ManageBooks";
import AddBook from "../pages/dashboard/AddBook/AddBook";
import UpdateBook from "../pages/dashboard/EditBook/UpdateBook";
import UserDashboard from "../pages/dashboard/users/UserDashboard";
import AdminOrders from "../pages/dashboard/orders/AdminOrders";
import ManageUsers from '../pages/dashboard/users/ManageUsers';
import ManageReviews from '../pages/dashboard/reviews/ManageReviews';
import ManageMessages from '../pages/dashboard/messages/ManageMessages';
import Settings from '../pages/dashboard/Settings';
import Profile from "../pages/profile/Profile";
import Search from "../pages/books/Search";
// removed direct MyMessages route; using ContactUs as unified messages hub

const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {
            path: "/",
            element: <Home/>,
        },
        {
            path: "/orders",
            element: <PrivateRoute><OrderPage/></PrivateRoute>
        },
        {
            path: "/about",
            element: <div>About</div>
        },
        {
          path: "/login",
          element: <Login/>
        },
        {
          path: "/register",
          element: <Register/>
        },
        {
          path: "/cart",
          element: <CartPage/>
        },
        {
          path: "/checkout",
          element: <PrivateRoute><CheckoutPage/></PrivateRoute>
        },
        {
          path: "/books/:id",
          element: <SingleBook/>
        },
        {
          path: "/search",
          element: <Search/>
        },
        {
          path: "/contact-us",
          element: <PrivateRoute><ContactUs/></PrivateRoute>
        },
        {
          path: "/user-dashboard",
          element: <PrivateRoute><UserDashboard/></PrivateRoute>
        },
        {
          path: "/profile",
          element: <PrivateRoute><Profile/></PrivateRoute>
        },
        {
          path: "/messages",
          element: <Navigate to="/contact-us" replace />
        }

      ]
    },
    {
      path: "/admin",
      element: <AdminLogin/>
    },
    {
      path: "/dashboard",
      element: <AdminRoute>
        <DashboardLayout/>
      </AdminRoute>,
      children:[
        {
          path: "",
          element: <AdminRoute><Dashboard/></AdminRoute>
        },
        {
          path: "add-new-book",
          element: <AdminRoute>
            <AddBook/>
          </AdminRoute>
        },
        {
          path: "edit-book/:id",
          element: <AdminRoute>
            <UpdateBook/>
          </AdminRoute>
        },
        {
          path: "manage-books",
          element: <AdminRoute>
            <ManageBooks/>
          </AdminRoute>
        },
        {
          path: "orders",
          element: <AdminRoute>
            <AdminOrders/>
          </AdminRoute>
        },
        {
          path: "users",
          element: <AdminRoute>
            <ManageUsers/>
          </AdminRoute>
        },
        {
          path: "reviews",
          element: <AdminRoute><ManageReviews /></AdminRoute>
        },
        {
          path: "messages",
          element: <AdminRoute><ManageMessages /></AdminRoute>
        },
        {
          path: "settings",
          element: <AdminRoute><Settings /></AdminRoute>
        }
      ]
    }
  ]);

  export default router;