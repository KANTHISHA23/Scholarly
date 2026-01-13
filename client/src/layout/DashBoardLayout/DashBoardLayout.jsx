// src/layouts/DashBoardLayout.jsx
import {
  Award,
  User,
  Home,
  LogOut,
  ChevronRight,
  Menu,
  Edit3,
  Users,
  BarChart2,
  FileCheck,
  MessageSquareText,
  ClipboardList,
} from "lucide-react";
import { NavLink, Outlet, Link } from "react-router";
import useAuth from "../../hooks/useAuth";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import toast from "react-hot-toast";
import ScrollToTop from "../../components/ScrollToUp/ScrollToUp";
import { useState } from "react";
import useRole from "../../hooks/useRole";

const DashBoardLayout = () => {
  const { user, signOutFunc } = useAuth();
  const [imageError, setImageError] = useState(false);
  const { role } = useRole();

  const userMenu = [
    {
      path: "/dashboard/me",
      label: "Profile",
      icon: User,
      role: ["student", "admin"],
    },
    {
      path: "/dashboard/my-application",
      label: "My Application",
      icon: ClipboardList,
      role: ["student"],
    },
    {
      path: "/dashboard/my-reviews",
      label: "My Reviews",
      icon: MessageSquareText,
      role: ["student"],
    },
    {
      path: "/dashboard/manage-applications",
      label: "Manage Applications",
      icon: FileCheck,
      role: ["admin"],
    },
    {
      path: "/dashboard/manage-reviews",
      label: "Manage Reviews",
      icon: MessageSquareText,
      role: ["admin"],
    },
    {
      path: "/dashboard/add-scholarship",
      label: "Add Scholarships",
      icon: Award,
      role: ["admin"],
    },
    {
      path: "/dashboard/manage-scholarships",
      label: "Manage Scholarships",
      icon: Edit3,
      role: ["admin"],
    },
    {
      path: "/dashboard/manage-users",
      label: "Manage Users",
      icon: Users,
      role: ["admin"],
    },
  ];

  const handleLogout = () => {
    signOutFunc().then(() => {});
    toast.success("Sign out successfully.");
  };

  return (
    <div className='drawer lg:drawer-open'>
      <input id='dashboard-drawer' type='checkbox' className='drawer-toggle' />

      {/* Main Content */}
      <div className='drawer-content flex flex-col bg-base-200 min-h-screen'>
        {/* Navbar */}
        <nav className='navbar bg-base-100 shadow-sm sticky top-0 z-30 px-3 md:px-6'>
          {/* Mobile Menu Toggle */}
          <label
            htmlFor='dashboard-drawer'
            className='btn btn-ghost btn-circle lg:hidden'
          >
            <Menu className='size-5' />
          </label>

          {/* Logo */}
          <div className='flex-1'>
            <Link to='/' className='text-xl font-bold text-primary'>
              Scholarly
            </Link>
          </div>

          {/* Right Side */}
          <div className='flex items-center gap-3 '>
            {/* User Avatar Dropdown - Using ProfileIcon */}
            <div className='dropdown dropdown-end'>
              <ProfileIcon user={user} iconPosition='right-0' />
              <ul
                tabIndex={0}
                className='dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow-lg mt-4'
              >
                {/* User Info Header */}
                <li className='px-4 py-2 pointer-events-none'>
                  <div className='flex flex-col items-start'>
                    <span className='font-semibold'>
                      {user?.displayName || 'User'}
                    </span>
                    <span className='text-xs text-gray-500 truncate w-full'>
                      {user?.email}
                    </span>
                  </div>
                </li>
                <div className='divider my-0'></div>
                <li>
                  <Link to='/dashboard/me'>
                    <User className='size-4' />
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to='/'>
                    <Home className='size-4' />
                    Home
                  </Link>
                </li>
                <div className='divider my-0'></div>
                <li>
                  <button onClick={handleLogout} className='text-error'>
                    <LogOut className='size-4' />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className='flex-1 p-4 md:p-6 lg:p-8'>
          <ScrollToTop />
          <Outlet />
        </main>
      </div>

      {/* Sidebar */}
      <div className='drawer-side z-40'>
        <label htmlFor='dashboard-drawer' className='drawer-overlay'></label>

        <aside className='bg-base-100 min-h-screen w-72 flex flex-col'>
          {/* Sidebar Header */}
          <div className='p-4 border-b border-base-200'>
            <Link to='/' className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-primary rounded-lg flex items-center justify-center'>
                <Award className='text-primary-content size-6' />
              </div>
              <div>
                <h1 className='text-lg font-bold'>Scholarly</h1>
                <p className='text-xs text-gray-500 capitalize'>
                  {role} Dashboard
                </p>
              </div>
            </Link>
          </div>

          {/* User Info */}
          <div className='p-4 border-b border-base-200'>
            <div className='flex items-center gap-3'>
              {/* User Avatar */}
              <div className='avatar'>
                <div className='w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1'>
                  {imageError ? (
                    <div className='w-full h-full bg-primary flex items-center justify-center text-primary-content text-2xl font-bold'>
                      {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  ) : (
                    <img
                      src={user?.photoURL || '/profile.png'}
                      alt={user?.displayName || 'User'}
                      onError={() => setImageError(true)}
                    />
                  )}
                </div>
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='font-semibold truncate'>
                  {user?.displayName || 'User'}
                </h3>
                <p className='text-xs text-gray-500 truncate'>{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className='flex-1 p-4'>
            <ul className='space-y-2'>
              {role &&
                userMenu
                  .filter((link) => link.role.includes(role)) // Filter by role first
                  .map((link, index) => (
                    <li key={index}>
                      <NavLink
                        to={link.path}
                        end
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-primary text-primary-content shadow-md'
                              : 'hover:bg-base-200'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <link.icon className='size-5' />
                            <span className='flex-1'>{link.label}</span>
                            {isActive && <ChevronRight className='size-4' />}
                          </>
                        )}
                      </NavLink>
                    </li>
                  ))}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className='p-4 border-t border-base-200'>
            <button
              onClick={handleLogout}
              className='btn btn-outline btn-error btn-block gap-2'
            >
              <LogOut className='size-4' />
              Logout
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashBoardLayout;
