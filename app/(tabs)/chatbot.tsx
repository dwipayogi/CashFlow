import { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Markdown from "react-native-markdown-display";
// import AsyncStorage from "@react-native-async-storage/async-storage";

import { Header } from "@/components/header";
import { Input } from "@/components/input";
import { Button } from "@/components/button";

import { colors } from "@/constants/colors";

export default function Chatbot() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState({ role: "user", message: "" });

  // const loadMessages = async () => {
  //   const messages = await AsyncStorage.getItem("messages");
  //   if (messages) setMessages(JSON.parse(messages));
  // };

  // const saveMessages = async (message: any) => {
  //   await AsyncStorage.setItem("messages", JSON.stringify(messages));
  // };

  // Panggil `loadMessages` saat komponen pertama kali dimuat:
  // useEffect(() => {
  //   loadMessages();
  // }, []);

  // Simpan pesan setiap kali state `messages` berubah:
  // useEffect(() => {
  //   saveMessages(messages);
  // }, [messages]);

  async function sendMessage({ message }: { message: string }) {
    if (!message) return;
    setMessages((prevMessages) => [...prevMessages, { role: "user", message }]);
    const response = await fetch("http://103.59.160.200:8080/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chat: message }),
    });
    const data = await response.json();
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "bot", message: data.content },
    ]);
  }

  return (
    <View style={styles.container}>
      <Header title="ChatBot" />

      <ScrollView
        style={styles.chatContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Message */}
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              message.role === "user" ? styles.userMessage : styles.botMessage,
            ]}
          >
            <Markdown>{message.message}</Markdown>
          </View>
        ))}
      </ScrollView>

      {/* Input Field */}
      <View style={styles.inputContainer}>
        <Input
          placeholder="Enter your message here..."
          value={input.message}
          onChangeText={(message) => setInput({ ...input, message })}
          style={{ flex: 1 }}
        />
        <Button
          onPress={() => {
            sendMessage(input);
            setInput({ ...input, message: "" });
          }}
        >
          Send
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
    padding: 20,
  },
  chatContainer: {
    flex: 1,
    padding: 20,
  },
  messageBubble: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  userMessage: {
    backgroundColor: colors.primary,
    alignSelf: "flex-end",
    maxWidth: "80%",
  },
  botMessage: {
    backgroundColor: colors.gray,
    alignSelf: "flex-start",
    maxWidth: "80%",
  },
  messageText: {
    fontSize: 14,
    color: colors.white,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});