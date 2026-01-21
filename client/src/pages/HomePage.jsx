import React, { useContext } from "react";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { ChatContext } from "../../context/ChatContext";

const HomePage = () => {

  // We will get the selected user data from the chat context because we had defined the user data in chat context.
  const {selectedUser}=useContext(ChatContext)
  
  

  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
      <div
        className={`backdrop-blur-xl border-2 border-gray-6 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${
          selectedUser
            ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]'
            : 'md:grid-cols-2'
        }`}
      >
        {/* 3 components rhenge home page me. extreme left me sidbar joki active users ko dikhayega. Then chat container jisme hum agar kisi user pe click kiye to uske saath humare chats section khul jayegi, Then extreme right me right sidebar jo ki user ki selected user ki profile  aur other statuses ko show karega aur humara logout buttom bhi isi me rhega. */}
        <Sidebar /> {/* After writing the backend we will remove this dummy props. */}
        <ChatContainer />
        <RightSidebar />
        
      </div>
    </div>
  );
};

export default HomePage;
