"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu,
  LayoutDashboard,
  ImageIcon,
  Ruler,
  ListOrdered,
  Mail,
  Settings,
  Palette,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MainNav({ ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Overview",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "Billboards",
      icon: <ImageIcon className="h-4 w-4 mr-2" />,
      active: pathname === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categories",
      icon: <Tag className="h-4 w-4 mr-2" />,
      active: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/sizes`,
      label: "Sizes",
      icon: <Ruler className="h-4 w-4 mr-2" />,
      active: pathname === `/${params.storeId}/sizes`,
    },
    {
      href: `/${params.storeId}/colors`,
      label: "Colors",
      icon: <Palette className="h-4 w-4 mr-2" />,
      active: pathname === `/${params.storeId}/colors`,
    },
    {
      href: `/${params.storeId}/products`,
      label: "Products",
      icon: <ShoppingBag className="h-4 w-4 mr-2" />,
      active: pathname === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: "Orders",
      icon: <ListOrdered className="h-4 w-4 mr-2" />,
      active: pathname === `/${params.storeId}/orders`,
      // badge: orderCount,
    },
    {
      href: `/${params.storeId}/contacts`,
      label: "Contacts",
      icon: <Mail className="h-4 w-4 mr-2" />,
      active: pathname === `/${params.storeId}/contacts`,
      // badge: contactCount,
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      icon: <Settings className="h-4 w-4 mr-2" />,
      active: pathname === `/${params.storeId}/settings`,
    },
  ];

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full border-b bg-card shadow-sm" {...props}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center -ml-7">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 overflow-x-auto">
              {routes.slice(0, 8).map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
                    route.active
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent/50 text-muted-foreground"
                  )}
                >
                  {route.icon}
                  {route.label}
                </Link>
              ))}

              <Link
                href={routes[8].href}
                className={cn(
                  "flex items-center p-2 text-sm rounded-md transition-colors",
                  routes[8].active
                    ? "bg-accent/60 text-accent-foreground"
                    : "hover:bg-accent/50 text-muted-foreground"
                )}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </nav>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
                <SheetHeader className="border-b p-4">
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <div className="space-y-1 px-3">
                    {routes.map((route) => (
                      <Link
                        key={route.href}
                        href={route.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-3 text-sm rounded-md transition-colors",
                          route.active
                            ? "bg-primary text-primary-foreground font-medium"
                            : "hover:bg-accent/50 text-muted-foreground"
                        )}
                      >
                        <div className="flex items-center">
                          {route.icon}
                          {route.label}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}
