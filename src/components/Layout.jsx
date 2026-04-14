import { Outlet, useNavigation } from "react-router-dom";
import Navbar from "./NavBar";
import Loading from "./Loading";

export default function Layout() {
  const navigation = useNavigation();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        {navigation.state === "loading" && <Loading />}
        <Outlet />
      </div>
    </div>
  );
}
