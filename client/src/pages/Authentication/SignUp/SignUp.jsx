import { useForm } from "react-hook-form";
import Container from "../../../components/Container/Container";
import { Link, useLocation, useNavigate } from "react-router";
import SocialBtn from "../../../components/SocialBtn";
import Lottie from "lottie-react";
import loginAnimation from '../../../assets/animations/Login.json';
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import useAxios from "../../../hooks/useAxios";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  const axiosInstance = useAxios();
  const {
    signUpWithEmailPassFunc,
    authLoading,
    setAuthLoading,
    setUser,
    updateProfileFunc,
    googleSignInFunc,
  } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setAuthLoading(true);
    const { image, email, password, name } = data;

    try {
      const { user } = await signUpWithEmailPassFunc(email, password);
      setUser(user);
      await updateProfileFunc(name, image);
      const userInfo = { email, photoURL: image, displayName: name };
      const { data } = await axiosInstance.post("/users", userInfo);
      if (data.insertedId) {
        navigate(state || "/");
      }
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
        'min-h-[calc(100vh-72px)] flex items-center justify-center py-15'
      }
    >
      <div className='card bg-base-100 w-full max-w-4xl shrink-0 shadow-2xl'>
        <div className='card-body'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
            {/* Lottie Animation Section */}
            <div className='hidden lg:flex justify-center items-center'>
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
                  Join the Scholarly Community!
                </h3>
                <p className='text-center text-gray-500 mb-4'>
                  Create your account to continue
                </p>

                {/* Mobile Lottie - Shows only on small screens */}
                <div className='lg:hidden flex justify-center mb-4'>
                  <Lottie
                    animationData={loginAnimation}
                    loop={true}
                    autoplay={true}
                    style={{ width: '200px', height: '200px' }}
                  />
                </div>

                <fieldset className='fieldset space-y-2'>
                  {/* Name Field */}
                  <div>
                    <label className='custom-label'>
                      Name<span className='text-error'>*</span>
                    </label>
                    <input
                      type='text'
                      className={`input focus:border-primary focus:outline-none w-full ${
                        errors.name ? 'input-error' : ''
                      }`}
                      placeholder='Name'
                      {...register('name', {
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters',
                        },
                        maxLength: {
                          value: 50,
                          message: 'Name must not exceed 50 characters',
                        },
                      })}
                    />
                    {errors.name && (
                      <span className='text-error text-sm'>
                        {errors.name.message}
                      </span>
                    )}
                  </div>

                  {/* Image URL Field */}
                  <div>
                    <label className='custom-label'>Image URL</label>
                    <input
                      type='url'
                      className={`input focus:border-primary focus:outline-none w-full ${
                        errors.image ? 'input-error' : ''
                      }`}
                      placeholder='https://example.com/your-image.jpg'
                      {...register('image', {
                        pattern: {
                          value:
                            /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i,
                          message:
                            'Please enter a valid image URL (jpg, jpeg, png, gif, webp, svg)',
                        },
                      })}
                    />
                    {errors.image && (
                      <span className='text-error text-sm mt-1 block'>
                        {errors.image.message}
                      </span>
                    )}
                    <p className='text-xs text-gray-400 mt-1'>
                      Enter a direct link to your profile image
                    </p>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className='custom-label'>
                      Email<span className='text-error'>*</span>
                    </label>
                    <input
                      type='email'
                      className={`input focus:border-primary focus:outline-none w-full ${
                        errors.email ? 'input-error' : ''
                      }`}
                      placeholder='Email'
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Please enter a valid email address',
                        },
                      })}
                    />
                    {errors.email && (
                      <span className='text-error text-sm'>
                        {errors.email.message}
                      </span>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className='custom-label'>
                      Password<span className='text-error'>*</span>
                    </label>
                    <div className='relative flex items-center'>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`input focus:border-primary focus:outline-none w-full ${
                          errors.password ? 'input-error' : ''
                        }`}
                        placeholder='Password'
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 8 characters',
                          },
                          validate: {
                            hasUppercase: (value) =>
                              /[A-Z]/.test(value) ||
                              'Password must contain at least one uppercase letter',
                            hasLowercase: (value) =>
                              /[a-z]/.test(value) ||
                              'Password must contain at least one lowercase letter',
                            hasNumber: (value) =>
                              /\d/.test(value) ||
                              'Password must contain at least one number',
                            hasSpecialChar: (value) =>
                              /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                              'Password must contain at least one special character',
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
                      <span className='text-error text-sm'>
                        {errors.password.message}
                      </span>
                    )}
                  </div>

                  {/* Terms & Conditions */}
                  <div>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='checkbox'
                        className={`checkbox checkbox-primary checkbox-sm mt-1 ${
                          errors.terms ? 'checkbox-error' : ''
                        }`}
                        {...register('terms', {
                          required: 'You must accept the terms and conditions',
                        })}
                      />
                      <span className='text-sm'>
                        I agree to the{' '}
                        <Link to='#' className='text-primary hover:underline'>
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to='#' className='text-primary hover:underline'>
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                    {errors.terms && (
                      <span className='text-error text-sm mt-1 block'>
                        {errors.terms.message}
                      </span>
                    )}
                  </div>

                  <button type='submit' className='btn btn-primary mt-2 w-full'>
                    {authLoading ? (
                      <>
                        <span className='loading loading-spinner loading-sm'></span>
                        Signing Up...
                      </>
                    ) : (
                      'Sign Up'
                    )}
                  </button>
                </fieldset>
              </form>

              {/* Divider */}
              <div className='divider my-4'>OR</div>

              {/* Social Login */}
              <div className='space-y-3'>
                <SocialBtn onClick={handleGoogleSignIn}>
                  Sign up with Google
                </SocialBtn>
              </div>

              {/* Sign Up Link */}
              <p className='text-center mt-4'>
                Don't have an account?{' '}
                <Link
                  to='/signIn'
                  className='text-primary font-medium hover:underline'
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SignUp;
