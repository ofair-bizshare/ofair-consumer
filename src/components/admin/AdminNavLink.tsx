
import React from 'react';
import { NavLink } from 'react-router-dom';

interface AdminNavLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  exact?: boolean;
}

const AdminNavLink: React.FC<AdminNavLinkProps> = ({ to, icon, text, exact }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
            isActive
              ? 'text-white bg-blue-600 hover:bg-blue-700'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
          }`
        }
        end={exact}
      >
        <span className="mr-2">{icon}</span>
        <span>{text}</span>
      </NavLink>
    </li>
  );
};

export default AdminNavLink;
