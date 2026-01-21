import { createContext, useState, useContext, useEffect} from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext=createContext();

export const ChatProvider=({children})=>{

    const [messages,setMessages]=useState([]);
    const [users,setUsers]=useState([]);
    const [selectedUser,setSelectedUser]=useState(null);
    const [unseenMessages,setUnseenMessages]=useState({});

    const {socket,axios}=useContext(AuthContext); // inhe hum AuthContext file se import kar ke isme use karenge.

    // Ab jitne bhi functions ham banayenge un sabhi ke api endpoints hum backend me bana chuke hain.

    //function to get all users for sidebar.
     const getUsers=async ()=>{
      try {
        const {data}=await axios.get("/api/messages/users"); // saare data messages ke baare aake data variable me store ho jayenge.
        if(data.success)
        {
          setUsers(data.users) // saare users ko sidebar pe show karega.
          setUnseenMessages(data.unseenMessages) // key value pair ki form me aayega.
        }
      } catch (error) {
        toast.error(error.message)
      }
     }


     // function to get messages for selected user.
     const getMessages=async(userId)=>{
      try {
        const {data}=await axios.get(`/api/messages/${userId}`);
        if(data.success)
        {
          setMessages(data.messages)
        }
      } catch (error) {
        toast.error(error.message)
      }
     }


     // function to send message to selected user
     const sendMessage=async (messageData)=>{
      try {
        const {data}=await axios.post(`/api/messages/send/${selectedUser._id}`,messageData); // is api end point hume jo messageData mila hai use send karenge.
        if(data.success)
        {
          setMessages((prevMessages)=>[...prevMessages,data.newMessage]) //... is spread operator.
        }
        else{
          toast.error(data.message);
        }

      } catch (error) {
        toast.error(error.message);
      }
     }


     // function to subscribe to messages for selected user ---> we will subscribe the messages so that we will get the messages in real time.
     
     const subscribeToMessages=async()=>{
      if(!socket) return; // agar socket on nhi hai to wapas jao.

      socket.on("newMessage", (newMessage)=>{

        // jab jis user ne message bheja hai ussi user ka chats opened hai.
        if(selectedUser && newMessage.senderId===selectedUser._id)
        {
            newMessage.seen=true;
            setMessages((prevMessages)=> [...prevMessages, newMessage]); // simple chat area me saara message show kar do.
            axios.put(`/api/messages/mark/${newMessage._id}`);
        }
        else // jab us user ka chat na khula ho jisne message bheja hai----> to us case me number of unseen message sko badha denge--> usme bhi cases hain ki pahele se bhi unseen messages pade hin ya nhi.
        {
           setUnseenMessages((prevUnseenMessages)=>({
            ...prevUnseenMessages, [newMessage.senderId]:prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId]+1 : 1
           }))
        }
      })
     }



     // function to unsubscribe from messages
     const unsubscribeFromMessages=()=>{
      if(socket) socket.off("newMessage");
     }

     useEffect(()=>{
         subscribeToMessages();
         return ()=> unsubscribeFromMessages();
     },[socket, selectedUser]) // because we have to execute these messages when we connect or disconnect to the socket----> Whenever the selected use changes these functions will be called.



     // now lets pass all these functions using value object so that we can use them in any component.
    const value={
         messages,users,selectedUser,getUsers,getMessages,sendMessage,
         setSelectedUser,unseenMessages,setUnseenMessages
  }

  return (
    <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
  )
}