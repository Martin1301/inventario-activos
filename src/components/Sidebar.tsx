"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { menu } from "@/data/menu";

type User = {
  nombre: string;
  role: string;
};

export default function Sidebar() {

  const pathname = usePathname();

  const [openMenu, setOpenMenu] =
    useState<string | null>(null);

  const [user, setUser] =
    useState<User | null>(null);

  /**
   * LOGOUT
   */
  const handleLogout = async () => {

    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    window.location.href = "/login";
  };

  /**
   * USER
   */
  const loadUser = async () => {

    try {

      const res = await fetch(
        "/api/auth/me"
      );

      const data = await res.json();

      setUser(data);

    } catch (error) {

      console.error(error);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (

    <aside className="fixed top-0 left-0 w-64 h-screen bg-slate-900 text-white p-4 flex flex-col">

      <div>

        {/* HEADER */}
        <div className="mb-6">

          <h1 className="text-xl font-bold">
            Inventario
          </h1>

          {user && (

            <div className="mt-4 bg-slate-800 rounded-lg p-3">

              <p className="text-sm text-gray-400">
                Usuario
              </p>

              <p className="font-semibold">
                {user.nombre}
              </p>

              <p className="text-xs text-blue-400 mt-1">
                {user.role}
              </p>

            </div>

          )}

        </div>

        {/* MENU */}
        {menu.map((item) => {

          const Icon = item.icon;

          const children =
            item.children ?? [];

          const hasChildren =
            children.length > 0;

          const isOpen =
            openMenu === item.title;

          /**
           * MENU CON SUBMENU
           */
          if (hasChildren) {

            return (

              <div
                key={item.title}
                className="mb-2"
              >

                {/* TOGGLE */}
                <div
                  onClick={() =>
                    setOpenMenu(
                      isOpen
                        ? null
                        : item.title
                    )
                  }
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer
                  ${
                    pathname.startsWith(item.path)
                      ? "bg-blue-600"
                      : "hover:bg-slate-800"
                  }`}
                >

                  <Icon size={18} />

                  {item.title}

                </div>

                {/* SUBMENU */}
                {isOpen && (

                  <div className="ml-6 mt-1 flex flex-col">

                    {children.map((child) => {

                      const ChildIcon =
                        child.icon;

                      return (

                        <Link
                          key={child.path}
                          href={child.path}
                          className={`flex items-center gap-2 p-2 rounded text-sm
                          ${
                            pathname === child.path
                              ? "bg-blue-500"
                              : "hover:bg-slate-800"
                          }`}
                        >

                          <ChildIcon size={16} />

                          {child.title}

                        </Link>

                      );
                    })}

                  </div>

                )}

              </div>
            );
          }

          /**
           * MENU NORMAL
           */
          return (

            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 p-2 rounded mb-2
              ${
                pathname === item.path
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }`}
            >

              <Icon size={18} />

              {item.title}

            </Link>
          );
        })}

      </div>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="w-full mt-auto bg-red-500 hover:bg-red-300 p-2 rounded cursor-pointer"
      >
        Logout
      </button>

    </aside>
  );
}