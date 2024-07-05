import { useState } from "react";
import { VscSignOut } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sidebarLinks } from "../../../data/dashboard-links";
import { logout } from "../../../services/operations/authAPI";
import ConfirmationModal from "../../Common/ConfirmationModal";
import SidebarLink from "./SidebarLink";

export default function Sidebar() {
  // Extracting necessary state values from the Redux store
  const { user, loading: profileLoading } = useSelector((state) => state.profile);
  const { loading: authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmationModal, setConfirmationModal] = useState(null);

  // Show a loading spinner if profile or auth data is still loading
  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Sidebar container */}
      <aside className="flex h-[calc(100vh-3.5rem)] min-w-[250px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10">
        {/* Sidebar links */}
        <div className="flex flex-col">
          {sidebarLinks.map((link) => {
            // Render link only if user account type matches or link has no type restriction
            if (link.type && user?.accountType !== link.type) return null;
            return <SidebarLink key={link.id} link={link} iconName={link.icon} />;
          })}
        </div>

        {/* Divider */}
        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />

        {/* Settings and Logout links */}
        <div className="flex flex-col">
          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName="VscSettingsGear"
          />
          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => {
                  dispatch(logout(navigate));
                  setConfirmationModal(null);
                },
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className="px-8 py-2 text-md font-medium text-richblack-300"
          >
            <div className="flex items-center gap-x-2">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
}
