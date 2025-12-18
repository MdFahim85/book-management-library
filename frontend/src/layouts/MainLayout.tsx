import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import { useUserContext } from "../contexts/UserContext";
import RouteComponent from "../Routes";

export default function MainLayout() {
  const { user } = useUserContext();

  return (
    <div className="grid grid-cols-12 w-full min-h-screen pt-4">
      <div className={`col-span-3 ${!user && "hidden"} `}>
        <SideBar />
      </div>
      <div className={`${user ? "col-span-9" : "col-span-12"} px-5 xl:px-10`}>
        <Navbar />
        <RouteComponent />
      </div>
    </div>
  );
}
