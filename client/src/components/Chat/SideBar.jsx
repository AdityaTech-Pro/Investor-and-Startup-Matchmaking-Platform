import React from "react";
import assets, { userDummyData } from "../../assets/assets";

const SideBar = ({ selectedUser, setSelectedUser }) => {

  return (
    <div
      className={`bg-[#818582]/10 h-full p-5 rounded-r-x1 overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ""
        }`}
    >
      <div className="pb-5">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">Chatiao</span>
          
        </div>

        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="Search" className="w-3" />
          <input type="text" className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1" placeholder="Search User..." />
        </div>

      </div>

      <div className="flex flex-col">
        {userDummyData.map((user, idx) => (
          <div onClick={() => setSelectedUser(user)} key={idx} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user?._id && 'bg-[#282142]/50'}`}>
            <img src={user?.profilePic || assets.avatar_icon} alt="" className="w-[35px] aspect-[1/1] rounded-full" />
            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>
              {
                idx < 3
                  ? <span className="text-green-400 text-xs">Online</span>
                  : <span className="text-neutral-400 text-xs">Offline</span>
              }
            </div>
            {idx > 2 && <p className="absolute top-4 right-4 text-xs h-5 w-5 flex items-center justify-center rounded-full bg-violet-500/50">{idx}</p>}
          </div>
        ))}
      </div>

    </div>
  );
};

export default SideBar;