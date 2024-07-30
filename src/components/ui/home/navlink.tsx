import Link from "next/link";
import { LinkProps } from "next/link";
import { ReactNode } from "react";

interface NavLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({
  children,
  href,
  className,
  ...props
}) => (
  <Link
    href={href}
    {...props}
    className={`py-2.5 px-4 text-center rounded-full duration-150 ${
      className || ""
    }`}
  >
    {children}
  </Link>
);

export default NavLink;
