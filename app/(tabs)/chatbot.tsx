import { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Markdown from "react-native-markdown-display";

import { Header } from "@/components/header";
import { Input } from "@/components/input";
import { Button } from "@/components/button";

import { colors } from "@/constants/colors";

export default function Chatbot() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState({ role: "user", message: "" });
  const [loading, setLoading] = useState(false);

  // Simple local chatbot responses
  const getLocalResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("halo") || lowerMessage.includes("hai")) {
      return "Halo! Saya asisten keuangan Anda. Saya dapat membantu Anda dengan pertanyaan tentang pengelolaan keuangan, penganggaran, dan tips menabung.";
    }

    if (lowerMessage.includes("budget") || lowerMessage.includes("anggaran")) {
      return "Tips untuk membuat anggaran:\n\n1. **Catat semua pendapatan** - Ketahui berapa banyak uang yang masuk setiap bulan\n2. **Identifikasi pengeluaran tetap** - Seperti sewa, listrik, dan kebutuhan pokok\n3. **Alokasikan untuk tabungan** - Usahakan minimal 20% dari pendapatan\n4. **Sisihkan untuk dana darurat** - Idealnya 3-6 bulan pengeluaran\n5. **Pantau dan evaluasi** - Tinjau anggaran Anda secara berkala";
    }

    if (lowerMessage.includes("nabung") || lowerMessage.includes("saving")) {
      return "Strategi menabung yang efektif:\n\n1. **Metode 50/30/20** - 50% kebutuhan, 30% keinginan, 20% tabungan\n2. **Otomatisasi** - Set auto-transfer ke rekening tabungan\n3. **Kurangi pengeluaran kecil** - Kopi harian bisa jadi tabungan besar\n4. **Tetapkan tujuan** - Punya target konkret membuat lebih termotivasi\n5. **Cari penghasilan tambahan** - Freelance atau side hustle";
    }

    if (lowerMessage.includes("utang") || lowerMessage.includes("debt")) {
      return "Tips mengelola utang:\n\n1. **List semua utang** - Ketahui total dan bunga masing-masing\n2. **Prioritaskan bunga tinggi** - Lunasi yang bunganya paling besar dulu\n3. **Buat rencana pembayaran** - Konsisten bayar lebih dari minimum\n4. **Hindari utang baru** - Fokus melunasi yang ada\n5. **Pertimbangkan konsolidasi** - Jika punya banyak utang kecil";
    }

    if (lowerMessage.includes("investasi") || lowerMessage.includes("invest")) {
      return "Dasar-dasar investasi:\n\n1. **Pahami profil risiko** - Konservatif, moderat, atau agresif\n2. **Diversifikasi** - Jangan taruh semua telur di satu keranjang\n3. **Mulai dari sekarang** - Waktu adalah teman terbaik investor\n4. **Investasi reguler** - Konsisten lebih baik dari timing pasar\n5. **Pelajari terus** - Edukasi finansial adalah investasi terbaik";
    }

    if (
      lowerMessage.includes("terima kasih") ||
      lowerMessage.includes("thanks")
    ) {
      return "Sama-sama! Senang bisa membantu. Jangan ragu untuk bertanya lagi jika ada yang ingin Anda ketahui tentang keuangan.";
    }

    // Default response
    return "Terima kasih atas pertanyaan Anda. Sebagai asisten keuangan, saya dapat membantu dengan:\n\n- Tips membuat anggaran\n- Strategi menabung\n- Cara mengelola utang\n- Dasar-dasar investasi\n- Pengelolaan keuangan pribadi\n\nSilakan tanyakan topik spesifik yang ingin Anda ketahui!";
  };

  // Send message to local chatbot
  async function sendMessage({ message }: { message: string }) {
    if (!message) return;
    setLoading(true);

    // Add user message to the chat
    const updatedMessages = [...messages, { role: "user", message }];
    setMessages(updatedMessages);

    try {
      // Simulate thinking delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Get local response
      const botResponse = getLocalResponse(message);

      // Add bot response
      setMessages([...updatedMessages, { role: "bot", message: botResponse }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...updatedMessages,
        {
          role: "bot",
          message: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
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
