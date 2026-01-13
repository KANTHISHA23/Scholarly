import ProfileIcon from "../ProfileIcon/ProfileIcon";

const ProfileNav = ({ user, userLinks, className }) => {
  return (
    <div className={`dropdown ${className}`}>
      <ProfileIcon user={user} />
      <ul
        tabIndex="-1"
        className="dropdown-content menu menu-base bg-base-100 rounded-box z-20 w-52 p-4 shadow-sm font-semibold tracking-wide divide-y divide-gray-400 divide-dashed space-y-2 border border-gray-200"
      >
        {userLinks}
      </ul>
    </div>
  );
};

export default ProfileNav;
