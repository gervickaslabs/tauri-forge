import { generateText, type Message } from "ai";
import { useState } from "react";
import { models } from "../openai/models";

export function useChat() {
  const [messages] = useState<Array<Message>>([]);
  const [input, setInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { text } = await generateText({
      model: models.chat,
      prompt: input,
    });

    setInput("");

    messages.push({ role: "user", content: input, id: crypto.randomUUID() });
    messages.push({
      role: "assistant",
      content: text,
      id: crypto.randomUUID(),
    });
  };

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
  };
}
