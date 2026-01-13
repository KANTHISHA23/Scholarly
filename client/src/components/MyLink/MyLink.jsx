import { NavLink } from "react-router-dom";

const MyLink = ({ link }) => {
  return (
    <NavLink
      to={link.link}
      className={({ isActive }) =>
        isActive
          ? "btn btn-primary border-none w-full"
          : "btn btn-ghost border-none hover:btn-primary"
      }
    >
      <link.icon size={18} />
      {link.label}
    </NavLink>
  );
};

export default MyLink;
