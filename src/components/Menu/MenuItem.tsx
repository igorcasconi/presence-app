export interface MenuItemProps {
  text: string;
  href: string;
  isActive: boolean;
}

const MenuItem = ({ text, href, isActive }: MenuItemProps) => {
  return (
    <li className="mt-2 text-md">
      <a
        href={href}
        className={`${isActive ? "text-secondary" : "text-white"}`}
      >
        {text}
      </a>
    </li>
  );
};

export default MenuItem;
