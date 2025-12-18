import SideBar from "../components/SideBar";
import { useUserContext } from "../contexts/UserContext";
import RouteComponent from "../Routes";

export default function MainLayout() {
  const { user } = useUserContext();

  return (
    <div className="grid grid-cols-12 w-full min-h-screen bg-neutral-200">
      <div className={`col-span-2 ${!user && "hidden"}`}>
        <SideBar />
      </div>
      <div
        className={`${user ? "col-span-10" : "col-span-12"} px-5 xl:px-10 py-4`}
      >
        <RouteComponent />
      </div>
    </div>
  );
}
