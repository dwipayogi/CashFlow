import { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Markdown from "react-native-markdown-display";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Header } from "@/components/header";
import { Input } from "@/components/input";
import { Button } from "@/components/button";

import { colors } from "@/constants/colors";

export default function Chatbot() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState({ role: "user", message: "" });
  const [loading, setLoading] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);
  // No message history persistence - messages will be lost on refresh
  // Send message to chatbot API with streaming support
  async function sendMessage({ message }: { message: string }) {
    if (!message) return;
    setLoading(true);

    // Add user message to the chat
    const updatedMessages = [...messages, { role: "user", message }];
    setMessages(updatedMessages);

    try {
      // Get token for authenticated requests (optional according to API docs)
      const token = await AsyncStorage.getItem("userToken");

      // Create a temporary bot message for streaming
      setMessages([
        ...updatedMessages,
        { role: "bot", message: "", isStreaming: true },
      ]);

      // Use streaming endpoint
      const response = await fetch(
        "http://localhost:3000/api/chatbot/message?stream=true",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ message }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("ReadableStream not supported");
      }

      // Process the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedContent = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // Decode the received chunk
        const chunk = decoder.decode(value, { stream: true });

        // Parse SSE data
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data:")) {
            try {
              const eventData = line.substring(5).trim();

              // Check for end of stream
              if (eventData === "[DONE]") {
                continue;
              }

              const parsedData = JSON.parse(eventData);
              if (parsedData.content) {
                // Append the new content to our accumulated content
                streamedContent += parsedData.content;

                // Update the message in real-time
                setMessages((currentMessages) => {
                  const newMessages = [...currentMessages];
                  newMessages[newMessages.length - 1] = {
                    role: "bot",
                    message: streamedContent,
                    isStreaming: true,
                  };
                  return newMessages;
                });
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }

      // Mark the message as complete (not streaming anymore)
      setMessages((currentMessages) => {
        const newMessages = [...currentMessages];
        newMessages[newMessages.length - 1] = {
          role: "bot",
          message: streamedContent || "No response received.",
        };
        return newMessages;
      });
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle errors
      setMessages((currentMessages) => {
        // Find and replace the streaming message
        const newMessages = [...currentMessages];
        const lastIndex = newMessages.findIndex((m) => m.isStreaming);
        if (lastIndex !== -1) {
          newMessages[lastIndex] = {
            role: "bot",
            message: "Sorry, an error occurred. Please try again later.",
          };
        } else {
          newMessages.push({
            role: "bot",
            message: "Sorry, an error occurred. Please try again later.",
          });
        }
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  }

  // Get financial insights
  async function getInsights() {
    setLoadingInsights(true);

    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        throw new Error("Authentication required for insights");
      }

      const response = await fetch(
        "http://localhost:3000/api/chatbot/insights",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();

      // Add insights message to the chat
      const insightsMessage =
        data.data?.insights || "No insights available at this time.";
      setMessages([...messages, { role: "bot", message: insightsMessage }]);
    } catch (error) {
      console.error("Error getting insights:", error);
      setMessages([
        ...messages,
        {
          role: "bot",
          message:
            "Sorry, couldn't retrieve financial insights. Please make sure you're logged in.",
        },
      ]);
    } finally {
      setLoadingInsights(false);
    }
  }

  return (
    <View style={styles.container}>
      {" "}
      <Header title="Asisten Keuangan" />
      <ScrollView
        style={styles.chatContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 && (
          <View style={styles.welcomeContainer}>
            <Markdown style={markdownStyles}>
              {`# Selamat datang di Asisten Keuangan!\n\nSaya bisa membantu Anda dengan:\n- Saran keuangan\n- Tips penganggaran\n- Strategi menabung\n- Memahami pola pengeluaran Anda\n\nSilakan tanyakan apa saja tentang keuangan Anda.`}
            </Markdown>
          </View>
        )}

        {/* Messages */}
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              message.role === "user" ? styles.userMessage : styles.botMessage,
            ]}
          >
            <Markdown style={markdownStyles}>{message.message}</Markdown>
          </View>
        ))}
      </ScrollView>
      {/* Input Field */}
      {/* <View style={styles.buttonContainer}>        <Button
          onPress={getInsights}
          disabled={loadingInsights}
          loading={loadingInsights}
          style={styles.insightsButton}
        >
          Dapatkan Wawasan Keuangan
        </Button>
      </View> */}
      <View style={styles.inputContainer}>
        <Input
          placeholder="Tanyakan apa saja tentang keuangan..."
          value={input.message}
          onChangeText={(message) => setInput({ ...input, message })}
          style={{ flex: 1 }}
        />
        <Button
          onPress={() => {
            sendMessage(input);
            setInput({ ...input, message: "" });
          }}
          disabled={loading || !input.message.trim()}
          loading={loading}
        >
          Kirim
        </Button>
      </View>
    </View>
  );
}

const markdownStyles = {
  body: {
    color: colors.light,
  },
  heading1: {
    color: colors.light,
    fontSize: 20,
    marginBottom: 12,
  },
  heading2: {
    color: colors.light,
    fontSize: 18,
    marginTop: 10,
    marginBottom: 8,
  },
  paragraph: {
    color: colors.light,
    marginBottom: 8,
  },
  list_item: {
    color: colors.light,
  },
  bullet_list: {
    color: colors.light,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
    padding: 20,
  },
  chatContainer: {
    flex: 1,
    marginBottom: 10,
  },
  welcomeContainer: {
    backgroundColor: colors.gray,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonContainer: {
    marginBottom: 12,
  },
  insightsButton: {
    backgroundColor: colors.success,
  },
});
