
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

interface NavLinkProps {
  href: string;
  label: string;
  onClick: () => void;
  active?: boolean;
}

const NavLink = ({ href, label, active, onClick }: NavLinkProps) => (
  <li>
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        "block py-3 text-lg transition hover:text-blue-600 border-b border-gray-100",
        active ? "font-semibold text-blue-700" : "text-gray-800"
      )}
    >
      {label}
    </Link>
  </li>
);

interface MobileMenuProps {
  pathname: string;
}

export const MobileMenu = ({ pathname }: MobileMenuProps) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  
  const isActive = (path: string) => pathname === path;
  
  const handleNavClick = () => {
    setOpen(false);
  };
  
  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };
  
  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Menu className="h-5 w-5" />
            <span className="sr-only">פתח תפריט</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-72" dir="rtl">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <div className="text-lg font-semibold">תפריט</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">סגור</span>
              </Button>
            </div>
            <nav className="flex-1">
              <ul className="space-y-1">
                <NavLink href="/" label="ראשי" active={isActive('/')} onClick={handleNavClick} />
                <NavLink href="/search" label="בעלי מקצוע" active={isActive('/search')} onClick={handleNavClick} />
                <NavLink href="/articles" label="מאמרים" active={isActive('/articles')} onClick={handleNavClick} />
                <NavLink href="/referrals" label="הפניות" active={isActive('/referrals')} onClick={handleNavClick} />
                <NavLink href="/contact" label="צור קשר" active={isActive('/contact')} onClick={handleNavClick} />
                <NavLink href="/about" label="אודות" active={isActive('/about')} onClick={handleNavClick} />
                <NavLink href="/faq" label="שאלות נפוצות" active={isActive('/faq')} onClick={handleNavClick} />
              </ul>
            </nav>
            <div className="mt-auto pt-4 border-t">
              {user ? (
                <>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full mb-2"
                  >
                    <Link to="/dashboard" onClick={handleNavClick}>
                      האזור האישי
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    התנתק
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    className="w-full mb-2"
                  >
                    <Link to="/login" onClick={handleNavClick}>
                      כניסה / התחברות
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                  >
                    <Link to="/register" onClick={handleNavClick}>
                      הרשמה
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
