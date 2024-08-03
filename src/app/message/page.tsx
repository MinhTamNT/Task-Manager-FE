import Chat from "../components/Message/Chat";
import Conversation from "../components/Message/Conversation";

export default function Message() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 h-full">
      <div className="col-span-1 shadow-md rounded-md h-[calc(100vh - 60px)] max-w-full bg-white p-4 overflow-auto">
        <Conversation />
      </div>
      <div className="col-span-1 md:col-span-2 bg-white shadow-md rounded-xl p-4 h-[calc(100vh - 60px)] overflow-auto">
        <Chat />
      </div>
    </div>
  );
}
