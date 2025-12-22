import SideBar from "../components/SideBar";
import { useUserContext } from "../contexts/UserContext";
import RouteComponent from "../Routes";

export default function MainLayout() {
  const { user } = useUserContext();

  return (
    <div className="grid grid-cols-12 w-full min-h-screen bg-neutral-200 dark:bg-neutral-950 px-5 gap-4 py-4 ">
      <div className={`col-span-3 ${!user && "hidden"} mt-2`}>
        <SideBar />
      </div>
      <div className={`${user ? "col-span-9" : "col-span-12"} `}>
        <RouteComponent />
      </div>
    </div>
  );
}
