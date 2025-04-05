
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { UserDropdown } from "./UserDropdown";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  label: string;
  active?: boolean;
}

const NavLink = ({ href, label, active }: NavLinkProps) => (
  <li>
    <Link
      to={href}
      className={cn(
        "block px-3 py-2 text-[16px] transition hover:text-blue-600",
        active ? "font-semibold text-blue-700" : "text-gray-800"
      )}
    >
      {label}
    </Link>
  </li>
);

interface DesktopNavProps {
  pathname: string;
}

export const DesktopNav = ({ pathname }: DesktopNavProps) => {
  const { user, loading } = useAuth();
  const isLogin = pathname === "/login";
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <div className="hidden lg:flex items-center gap-2">
      <nav className="flex-1">
        <ul className="flex space-x-1 space-x-reverse">
          <NavLink href="/" label="ראשי" active={isActive('/')} />
          <NavLink href="/search" label="בעלי מקצוע" active={isActive('/search')} />
          <NavLink href="/articles" label="מאמרים" active={isActive('/articles')} />
          <NavLink href="/referrals" label="הפניות" active={isActive('/referrals')} />
          <NavLink href="/contact" label="צור קשר" active={isActive('/contact')} />
          <NavLink href="/about" label="אודות" active={isActive('/about')} />
          <NavLink href="/faq" label="שאלות נפוצות" active={isActive('/faq')} />
        </ul>
      </nav>
      
      {loading ? (
        <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-md"></div>
      ) : user ? (
        <UserDropdown />
      ) : isLogin ? (
        <Button asChild size="sm" variant="outline">
          <Link to="/register">הרשמה</Link>
        </Button>
      ) : (
        <Button asChild size="sm">
          <Link to="/login">כניסה / הרשמה</Link>
        </Button>
      )}
    </div>
  );
};
