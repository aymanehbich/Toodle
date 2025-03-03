import React from "react";
import {
  IconLayoutDashboard,
  IconList,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import { signOut } from "firebase/auth";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Anchor,
  AppShell,
  Avatar,
  Burger,
  Group,
  Menu,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CustomLogo } from "@/components/Logo/CustomLogo";
import { useAuth } from "@/context/AuthProvider";
import { auth } from "@/firebase";
import classes from "./NavbarSimple.module.css";

const MainLayout: React.FC = () => {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  // Updated navigation links for todo app
  const navLinks = [
    { link: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
    { link: "/todos", label: "Todos", icon: IconList },
    // { link: '/calendar', label: 'Calendar', icon: IconCalendar },
  ];

  const navItems = navLinks.map((item) => (
    <Anchor
      key={item.label}
      component={Link}
      to={item.link}
      className={classes.link}
      data-active={isActive(item.link) || undefined}
      mb="xs"
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Anchor>
  ));

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      header={{ height: 60 }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <UnstyledButton component={Link} to={"/dashboard"}>
            <CustomLogo size={40} />
          </UnstyledButton>
          <Group>
            <Menu shadow="md" width={170}>
              <Menu.Target>
                <Avatar
                  style={{ border: "1px solid grey", cursor: "pointer" }}
                  src={user?.photoURL}
                  alt={user?.displayName || "User"}
                  size={37}
                />
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  component={Link}
                  to="profile"
                  leftSection={<IconUser size={15} />}
                >
                  Profile
                </Menu.Item>
                {/* <Menu.Item leftSection={<IconSettings size={15} />}>Settings</Menu.Item> */}
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<IconLogout size={15} />}
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <div className={classes.navbarMain}>{navItems}</div>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default MainLayout;
