import { useState } from "react";
import Loading from "../../../assets/animations/Loading.json";
import {
  User,
  Calendar,
  Clock,
  Shield,
  CheckCircle,
  XCircle,
  Camera,
  Edit,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import Container from "../../../components/Container/Container";
import Lottie from "lottie-react";
import useRole from "../../../hooks/useRole";
import EditProfileModal from "./EditProfileModal";

const UserProfile = () => {
  const { user, signOutFunc, authLoading } = useAuth();
  const [imageError, setImageError] = useState(false);
  const { role, roleLoading } = useRole();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get role badge color
  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return "badge-error";
      case "moderator":
        return "badge-warning";
      default:
        return "badge-primary";
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await signOutFunc();
    toast.success("Logged out successfully!");
  };

  // Handle EditProfile
  const handleEditProfile = () => {
    setIsEditModalOpen(true);
    console.log("Edit");
  };
  // Loading state
  if (authLoading || roleLoading) {
    return (
      <Container className="min-h-[calc(100vh-128px)] flex items-center justify-center">
        <Lottie animationData={Loading} loop />
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-500 mt-2">
            Manage your account information and settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Avatar Card */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                {/* Avatar */}
                <div className="avatar relative">
                  <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
                    {imageError ? (
                      <div className="w-full h-full bg-primary flex items-center justify-center text-primary-content text-4xl font-bold">
                        {user?.displayName?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    ) : (
                      <img
                        src={user?.photoURL || "/profile.png"}
                        alt={user?.displayName || "User"}
                        onError={() => setImageError(true)}
                      />
                    )}
                  </div>
                </div>

                {/* Name */}
                <h2 className="card-title mt-4">
                  {user?.displayName || "User"}
                </h2>

                {/* Email */}
                <p className="text-gray-500 text-sm">{user?.email}</p>

                {/* Role Badge */}
                <div
                  className={`badge ${getRoleBadge(role)} badge-lg gap-1 mt-2`}
                >
                  <Shield className="size-3" />
                  {role?.charAt(0).toUpperCase() + role?.slice(1)}
                </div>

                {/* Email Verification Status */}
                <div className="mt-4">
                  {user?.emailVerified ? (
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="size-4" />
                      <span className="text-sm">Email Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-warning">
                      <XCircle className="size-4" />
                      <span className="text-sm">Email Not Verified</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="card-actions mt-6 w-full">
                  <button
                    onClick={handleEditProfile}
                    className="btn btn-outline btn-primary btn-block gap-2"
                  >
                    <Edit className="size-4" />
                    Edit Profile
                  </button>
                  <EditProfileModal
                    isOpen={isEditModalOpen}
                    user={user}
                    onClose={() => setIsEditModalOpen(false)}
                  />
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline btn-error btn-block gap-2"
                  >
                    <LogOut className="size-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information Card */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg mb-4">
                  <User className="size-5 text-primary" />
                  Account Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Display Name */}
                  <div className="bg-base-200 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Full Name
                    </p>
                    <p className="font-semibold mt-1">
                      {user?.displayName || "Not set"}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="bg-base-200 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Email Address
                    </p>
                    <p className="font-semibold mt-1 truncate">{user?.email}</p>
                  </div>

                  {/* UID */}
                  <div className="bg-base-200 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      User ID
                    </p>
                    <p className="font-mono text-sm mt-1 truncate">
                      {user?.uid}
                    </p>
                  </div>

                  {/* Role */}
                  <div className="bg-base-200 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Account Role
                    </p>
                    <div className="mt-1">
                      <span className={`badge ${getRoleBadge(role)}`}>
                        {role?.charAt(0).toUpperCase() + role?.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Card */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg mb-4">
                  <Clock className="size-5 text-primary" />
                  Account Activity
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Account Created */}
                  <div className="bg-base-200 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="size-3" />
                      Account Created
                    </p>
                    <p className="font-semibold mt-1">
                      {formatDate(user?.metadata?.creationTime)}
                    </p>
                  </div>

                  {/* Last Sign In */}
                  <div className="bg-base-200 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="size-3" />
                      Last Sign In
                    </p>
                    <p className="font-semibold mt-1">
                      {formatDate(user?.metadata?.lastSignInTime)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default UserProfile;
