import { Link, NavLink } from 'react-router-dom';
import Container from '../../../components/Container/Container';
import useAuth from '../../../hooks/useAuth';
import {
  GraduationCap,
  Heart,
  Home,
  LayoutDashboard,
  LogOut,
  Trophy,
  UserCog,
} from 'lucide-react';
import ProfileNav from '../../../components/ProfileNav/ProfileNav';
import MyLink from '../../../components/MyLink/MyLink';
import toast from 'react-hot-toast';
import profileLoading from '../../../assets/animations/profileLoading.json';
import Lottie from 'lottie-react';
const publicLinks = [
  {
    label: 'Home',
    link: '/',
    icon: Home,
  },
  {
    label: 'Explore Schemes',
    link: '/scholarships',
    icon: GraduationCap,
  },
  {
    label: "Achiever's Corner",
    link: '/success-stories',
    icon: Trophy,
  },
];

const Navbar = () => {
  const { user, signOutFunc, authLoading } = useAuth();

  const handleSign = async () => {
    await signOutFunc();
    toast.success('Sign out Successfully!');
  };

  const userLinks = (
    <>
      <li>
        <Link
          className={'mb-2.5 bg-base-100 text-[#000000]'}
          to={'/dashboard/me'}
        >
          <UserCog size={18} />
          Profile
        </Link>
      </li>
      <li>
        <Link className={'mb-2.5 bg-base-100 text-[#000000]'} to={'/dashboard'}>
          <LayoutDashboard size={18} />
          Dashboard
        </Link>
      </li>
      <li>
        <button
          onClick={handleSign}
          className='text-red-500 flex items-center gap-2 mb-2.5 bg-base-100'
        >
          <LogOut size={18} />
          Log out
        </button>
      </li>
    </>
  );
  return (
    <nav className='bg-base-100 shadow-sm py-1 sticky top-0 z-20'>
      <Container className='navbar'>
        <div className='navbar-start gap-2'>
          {user && (
            <div className='block lg:hidden'>
              <ProfileNav
                user={user}
                userLinks={userLinks}
                className={'dropdown-start mr-2'}
              />
            </div>
          )}
          <Link
            to={'/'}
            className='flex items-center gap-2 text-xl font-extrabold text-purple-500 uppercase'
          >
            <GraduationCap className='size-8' />
            Scholarly
          </Link>
        </div>
        <div className='navbar-center hidden lg:flex'>
          <ul className='flex items-center gap-5 text-accent text-base font-semibold tracking-wide'>
            {publicLinks.map((link) => (
              <li key={link.label}>
                <MyLink link={link} />
              </li>
            ))}
            {user && (
              <li>
                <NavLink
                  to={'/wishlists'}
                  className={({ isActive }) =>
                    isActive
                      ? 'btn btn-primary border-none'
                      : 'btn btn-ghost border-none hover:btn-primary'
                  }
                >
                  <Heart size={18} />
                  WishList
                </NavLink>
              </li>
            )}
          </ul>
        </div>
        <div className='navbar-end gap-5'>
          {!user && (
            <div className='lg:hidden gap-4'>
              <Link to={'/signIn'} className='btn'>
                Login
              </Link>
            </div>
          )}
          <div className='dropdown dropdown-end lg:hidden'>
            <div tabIndex={0} role='button' className='mr-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                {' '}
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 6h16M4 12h8m-8 6h16'
                />{' '}
              </svg>
            </div>
            <ul
              tabIndex='-1'
              className='menu menu-lg dropdown-content bg-base-100 rounded-box z-10 mt-3 w-56 font-medium tracking-wide p-2 shadow divide-y divide-gray-400 divide-dashed space-y-2 border border-gray-200'
            >
              {publicLinks.map((link) => (
                <li key={link.label}>
                  <MyLink link={link} />
                </li>
              ))}
            </ul>
          </div>
          <div className='hidden lg:flex gap-4'>
            {authLoading ? (
              <Lottie animationData={profileLoading} loop className='h-12' />
            ) : user ? (
              <ProfileNav
                className={'dropdown-end'}
                user={user}
                userLinks={userLinks}
              />
            ) : (
              <>
                <Link to={'/signIn'} className='btn'>
                  Login
                </Link>
                <Link to={'/signUp'} className='btn btn-primary'>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
