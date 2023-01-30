import { IconType } from "react-icons";
import { MdOutlineDashboard } from "react-icons/md";
import { HiOutlineUser } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";

export enum MENU_TYPE {
  NONE = "NONE",
  PROFILE = "PROFILE",
  ACTIVITIES = "ACTIVITIES",
}

export interface NavigationInterface {
  title: string;
  url: string;
}

export interface SideNavigationInterface {
  title: string;
  url: string;
  icon: IconType;
  label: string;
  menu_type: MENU_TYPE;
}

/**
 * @description Appear allways
 * @done_by Emmy
 */
export const PUBLIC: NavigationInterface[] = [
  {
    title: "Login",
    url: "/login",
  },
];

/**
 * @description Appear once the user is not logged in
 * @done_by Emmy
 */
export const NON_AUTHENTICATED_MENUS: NavigationInterface[] = [
  {
    title: "About",
    url: "/about",
  },
  {
    title: "Login",
    url: "/login",
  },
];

/**
 * @description Appear once the user is logged in
 * @done_by Emmy
 */
export const AUTHENTICATED_MENUS: SideNavigationInterface[] = [
  {
    icon: MdOutlineDashboard,
    title: "Dashboard",
    label: "Dashboard",
    url: "/dashboard",
    menu_type: MENU_TYPE.NONE,
  },
  {
    icon: HiOutlineUser,
    title: "Profile",
    label: "Profile",
    url: "/profile",
    menu_type: MENU_TYPE.PROFILE,
  },
  {
    icon: RiLockPasswordLine,
    title: "Change Password",
    label: "Change Password",
    url: "/change-password",
    menu_type: MENU_TYPE.PROFILE,
  },
];

export const menus_categories = (): { key: MENU_TYPE; title: string }[] => {
  const response: { key: MENU_TYPE; title: string }[] = [];
  for (const menu in MENU_TYPE) {
    response.push({
      key: menu as MENU_TYPE,
      title:
        menu === MENU_TYPE.PROFILE
          ? "Profile"
          : menu === MENU_TYPE.ACTIVITIES
          ? "Activities"
          : "",
    });
  }
  return response.filter((element) =>
    response.find((itm) => itm.key === element.key)
  );
};
