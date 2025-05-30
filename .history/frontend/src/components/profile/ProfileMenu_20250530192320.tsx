import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
  DropdownSection,
} from "@nextui-org/react";
import { FC } from "react";
import { Link } from "react-router-dom";

interface Props {
  user?: {
    name: string;
    email: string;
    role: "user" | "author" | "admin";
    avatar?: string;
  };
  onSignOut?: () => void;
}

interface LinkProps {
  title: string;
  to: string;
  className?: string;
}

const DropdownLink: FC<LinkProps> = ({ title, to, className = "" }) => {
  return (
    <Link
      className={`px-2 py-1.5 w-full block hover:bg-default-100 rounded ${className}`}
      to={to}
    >
      {title}
    </Link>
  );
};

const ProfileMenu: FC<Props> = ({ user, onSignOut }) => {
  const defaultUser = {
    name: "Guest",
    email: "guest@example.com",
    role: "user" as const,
    avatar: "",
  };

  const { name, email, role, avatar } = user || defaultUser;

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-start" closeOnSelect={false}>
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              src: avatar || undefined,
              name: name.split(' ').map(n => n[0]).join(''),
            }}
            className="transition-transform hover:scale-105"
            name={name}
            description={role}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownSection showDivider>
            <DropdownItem
              isReadOnly
              key="profile"
              className="h-14 gap-2 cursor-default"
            >
              <div>
                <p className="font-bold">Signed in as</p>
                <p className="font-bold text-default-500">{email}</p>
              </div>
            </DropdownItem>

            <DropdownItem key="my_library" textValue="library" className="p-0">
              <DropdownLink title="My Library" to="/library" />
            </DropdownItem>

            <DropdownItem key="orders" textValue="orders" className="p-0">
              <DropdownLink title="My Orders" to="/orders" />
            </DropdownItem>
          </DropdownSection>

          {role === "author" || role === "admin" ? (
            <DropdownSection showDivider>
              <DropdownItem key="analytics" className="p-0">
                <DropdownLink title="Analytics" to="/analytics" />
              </DropdownItem>
              <DropdownItem key="create_new_book" textValue="Create New Book" className="p-0">
                <DropdownLink title="Create New Book" to="/create-new-book" />
              </DropdownItem>
              {role === "admin" && (
                <DropdownItem key="admin_dashboard" className="p-0">
                  <DropdownLink title="Admin Dashboard" to="/admin" />
                </DropdownItem>
              )}
            </DropdownSection>
          ) : null}

          <DropdownSection showDivider>
            <DropdownItem key="configurations" className="p-0">
              <DropdownLink title="Profile Settings" to="/profile" />
            </DropdownItem>
            <DropdownItem key="help_and_feedback" className="p-0">
              <DropdownLink title="Help & Feedback" to="/help" />
            </DropdownItem>
          </DropdownSection>

          <DropdownItem
            onClick={handleSignOut}
            key="logout"
            color="danger"
            className="text-danger hover:bg-danger-50"
          >
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default ProfileMenu;