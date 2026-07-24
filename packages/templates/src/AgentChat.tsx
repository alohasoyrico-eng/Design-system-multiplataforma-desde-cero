import { useState } from "react";
import { Inline, Text, FlowIcon } from "@flow/primitives";
import { FlowChatThread, FlowChatMessage, FlowChatComposer, FlowAvatar } from "@flow/components";
import "../css/AgentChat.css";

interface Msg {
  id: number;
  role: "user" | "assistant";
  text: string;
  time: string;
}

const now = () => new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });

/** AgentChat — conversational assistant screen: thread + composer. */
export function AgentChat() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 1,
      role: "assistant",
      text: "Hola, soy tu asistente de flota. ¿En qué te ayudo?",
      time: now(),
    },
  ]);
  const [input, setInput] = useState("");
  const counter = messages.length;

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const id = counter + 1;
    setMessages((m) => [...m, { id, role: "user", text, time: now() }]);
    setInput("");
    window.setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: id + 1,
          role: "assistant",
          text: "Reviso tu flota… la unidad 214 está en ruta y llega en 6 min.",
          time: now(),
        },
      ]);
    }, 600);
  };

  return (
    <div className="flow-agent">
      <header className="flow-agent__header">
        <Inline gap="3" align="center">
          <FlowAvatar name="Flow AI" presence="online" />
          <div>
            <Text variant="body-strong" as="span">
              Asistente de flota
            </Text>
            <Text variant="caption" color="muted" as="p">
              Siempre en línea
            </Text>
          </div>
          <span className="flow-agent__spark" aria-hidden="true">
            <FlowIcon name="bolt" size="md" filled />
          </span>
        </Inline>
      </header>

      <FlowChatThread ariaLabel="Chat con el asistente">
        {messages.map((m) => (
          <FlowChatMessage key={m.id} role={m.role} time={m.time}>
            {m.text}
          </FlowChatMessage>
        ))}
      </FlowChatThread>

      <div className="flow-agent__composer">
        <FlowChatComposer value={input} onChange={setInput} onSend={send} />
      </div>
    </div>
  );
}
