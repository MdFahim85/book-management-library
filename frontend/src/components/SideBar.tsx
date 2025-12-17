import { Link } from "react-router-dom";

import { Book, BookA, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Client_ROUTEMAP from "../misc/Client_ROUTEMAP";

export default function SideBar() {
  return (
    <Sidebar className="w-3/12">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mt-4 mb-10">
            <Link
              to={
                Client_ROUTEMAP.books.root + "/" + Client_ROUTEMAP.books.index
              }
              className="flex items-center "
            >
              <BookA className="me-2" />{" "}
              <p className="text-xl">Book Library Management</p>
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={Client_ROUTEMAP.books.root}>
                    <div className="flex items-center text-lg gap-4">
                      <Book />
                      <span>Books</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={Client_ROUTEMAP.authors.root}>
                    <div className="flex items-center text-lg gap-4">
                      <User />
                      <span>Authors</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
