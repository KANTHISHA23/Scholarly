import { useState } from "react";
import { useForm } from "react-hook-form";
import Container from "../../../components/Container/Container";
import { Link, useLocation, useNavigate } from "react-router";
import SocialBtn from "../../../components/SocialBtn";
import Lottie from "lottie-react";
import loginAnimation from '../../../assets/animations/Login.json';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import useAxios from "../../../hooks/useAxios";

const SignIn = () => {
  const axiosInstance = useAxios();
  const [showPassword, setShowPassword] = useState(false);
  const {
    setAuthLoading,
    authLoading,
    signInWithEmailPassFunc,
    setUser,
    googleSignInFunc,
  } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setAuthLoading(true);
    const { email, password } = data;
    try {
      const { user } = await signInWithEmailPassFunc(email, password);
      setUser(user);
      navigate(state || "/");
      reset();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    try {
      const { user } = await googleSignInFunc();
      setUser(user);
      const userInfo = {
        email: user.email,
        photoURL: user.photoURL,
        displayName: user.displayName,
      };
      const { data } = await axiosInstance.post("/users", userInfo);

      if (data.insertedId || data.message === "user already exits") {
        navigate(state || "/");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <Container
      className={
        'min-h-[calc(100vh-72px)] flex items-center justify-center py-8'
      }
    >
      <div className='card bg-base-100 w-full max-w-4xl shrink-0 shadow-2xl'>
        <div className='card-body'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
            {/* Lottie Animation Section - Desktop */}
            <div className='hidden lg:flex justify-center items-center order-2 lg:order-1'>
              <Lottie
                animationData={loginAnimation}
                loop={true}
                autoplay={true}
                style={{ width: '100%', maxWidth: '400px' }}
              />
            </div>

            {/* Form Section */}
            <div className='order-1 lg:order-2'>
              <form onSubmit={handleSubmit(onSubmit)}>
                <h3 className='text-center text-2xl font-semibold mb-2'>
                  Welcome back, Future Engineer!
                </h3>
                <p className='text-center text-gray-500 mb-4'>
                  Sign in to continue to your account
                </p>

                {/* Mobile Lottie - Shows only on small screens */}
                <div className='lg:hidden flex justify-center mb-4'>
                  <Lottie
                    animationData={loginAnimation}
                    loop={true}
                    autoplay={true}
                    style={{ width: '180px', height: '180px' }}
                  />
                </div>

                <fieldset className='fieldset space-y-3'>
                  {/* Email Field */}
                  <div>
                    <label className='custom-label'>
                      Email <span className='text-error'>*</span>
                    </label>
                    <input
                      type='email'
                      className={`input focus:border-primary focus:outline-none w-full ${
                        errors.email ? 'input-error' : ''
                      }`}
                      placeholder='Enter your email'
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Please enter a valid email address',
                        },
                      })}
                    />
                    {errors.email && (
                      <span className='text-error text-sm mt-1 block'>
                        {errors.email.message}
                      </span>
                    )}
                  </div>

                  {/* Password Field with Toggle */}
                  <div>
                    <label className='custom-label'>
                      Password <span className='text-error'>*</span>
                    </label>
                    <div className='relative'>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`input focus:border-primary focus:outline-none w-full pr-12 ${
                          errors.password ? 'input-error' : ''
                        }`}
                        placeholder='Enter your password'
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters',
                          },
                        })}
                      />
                      <button
                        type='button'
                        className='z-10 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaEyeSlash size={20} />
                        ) : (
                          <FaEye size={20} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <span className='text-error text-sm mt-1 block'>
                        {errors.password.message}
                      </span>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className='flex items-center justify-between'>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='checkbox'
                        className='checkbox checkbox-primary checkbox-sm'
                        {...register('rememberMe')}
                      />
                      <span className='text-sm'>Remember me</span>
                    </label>
                    <Link
                      to='/forgot-password'
                      className='text-sm text-primary hover:underline'
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button type='submit' className='btn btn-primary mt-2 w-full'>
                    {authLoading ? (
                      <>
                        <span className='loading loading-spinner loading-sm'></span>
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </fieldset>
              </form>

              {/* Divider */}
              <div className='divider my-4'>OR</div>

              {/* Social Login */}
              <div className='space-y-3'>
                <SocialBtn onClick={handleGoogleSignIn}>
                  Sign in with Google
                </SocialBtn>
              </div>

              {/* Sign Up Link */}
              <p className='text-center mt-4'>
                Don't have an account?{' '}
                <Link
                  to='/signUp'
                  className='text-primary font-medium hover:underline'
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SignIn;
