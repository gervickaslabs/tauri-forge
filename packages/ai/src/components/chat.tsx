import { Thread } from "./thread";

import { Message } from "./message";

import { Card } from "@repo/ui/components/card";

import { useChat } from "../lib/hooks/useChat";

export const Chat: React.FC = () => {
  const { messages, handleSubmit, handleInputChange, input } = useChat();

  return (
    <Card title="My Chatbot">
      <Thread>
        {messages.map((message) => (
          <Message key={message.id} data={message} />
        ))}
      </Thread>
      <form className="row" onSubmit={handleSubmit}>
        <input
          id="input"
          onChange={handleInputChange}
          value={input}
          placeholder="Type"
        />
        <button type="submit">Submit</button>
      </form>
    </Card>
  );
};
