import { useState } from "react";

const ProfileIcon = ({ user }) => {
  const [imageError, setImageError] = useState(false);
  return (
    <div
      tabIndex={0}
      role="button"
      className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden cursor-pointer relative"
    >
      {imageError ? (
        <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-primary-content text-2xl font-bold">
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
  );
};

export default ProfileIcon;
