const ChatBubble = ({ role, content }) => {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-primary text-black rounded-br-sm"
            : "bg-surface text-textPrimary rounded-bl-sm"
        }`}
      >
        {content}
      </div>
    </div>
  );
};

export default ChatBubble;