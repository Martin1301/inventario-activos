"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { menu } from "@/data/menu";

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    window.location.href = "/login";
  };

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-slate-900 text-white p-4 flex flex-col">
      <div>
        <h1 className="text-xl font-bold mb-6">Inventario</h1>

        {menu.map((item) => {
          const Icon = item.icon;

          const children = item.children ?? [];
          const hasChildren = children.length > 0;
          const isOpen = openMenu === item.title;

          // 👉 SI TIENE SUBMENU
          if (hasChildren) {
            return (
              <div key={item.title} className="mb-2">

                {/* SOLO TOGGLE */}
                <div
                  onClick={() =>
                    setOpenMenu(isOpen ? null : item.title)
                  }
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer
                    ${pathname.startsWith(item.path)
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
                      const ChildIcon = child.icon;

                      return (
                        <Link
                          key={child.path}
                          href={child.path}
                          className={`flex items-center gap-2 p-2 rounded text-sm
                            ${pathname === child.path
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

          // 👉 SI NO TIENE SUBMENU (IMPORTANTE)
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 p-2 rounded mb-2
                ${pathname === item.path
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

      <button
        onClick={handleLogout}
        className="w-full mt-auto bg-red-500 hover:bg-red-300 p-2 rounded cursor-pointer"
      >
        Logout
      </button>
    </aside>
  );
}