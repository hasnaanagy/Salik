import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Alert,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { useRouter } from "expo-router";
import { getChatResponse } from "../api/chatbot";
import ServiceData from "../Service.json";

const ChatInterface = () => {
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      text: "مرحبًا! أنا مساعد سالك الذكي. كيف يمكنني مساعدتك اليوم؟",
      isUser: false,
      timestamp: new Date().toLocaleTimeString("ar-SA", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();

  const serviceSuggestions = [
    {
      title: "مشاركة الركوب",
      icon: "car",
      questions: [
        "كيف أطلب رحلة؟",
        "كيف أكون سائق؟",
        "ما هي شروط مشاركة الركوب؟",
      ],
    },
    {
      title: "ميكانيكي",
      icon: "construct",
      questions: [
        "كيف أطلب ميكانيكي؟",
        "كيف أكون ميكانيكي؟",
        "ما هي خدمات الميكانيكي؟",
      ],
    },
    {
      title: "بنزين",
      icon: "water",
      questions: [
        "كيف أطلب بنزين؟",
        "كيف أكون مزود بنزين؟",
        "ما هي أسعار البنزين؟",
      ],
    },
  ];

  const handleSuggestionPress = (service) => {
    const question = `كيف يمكنني استخدام خدمة ${service.title}؟`;
    setInputText(question);
    handleSend(question);
  };

  const handleQuestionPress = (question) => {
    setInputText(question);
    handleSend(question);
  };

  const handleSend = async (message = null) => {
    const textToSend = message || inputText.trim();
    if (!textToSend) return;

    if (!message) {
      setInputText("");
    }

    const newUserMessage = {
      text: textToSend,
      isUser: true,
      timestamp: new Date().toLocaleTimeString("ar-SA", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    setIsLoading(true);

    try {
      const response = await getChatResponse(textToSend);
      if (response) {
        const newBotMessage = {
          text: response,
          isUser: false,
          timestamp: new Date().toLocaleTimeString("ar-SA", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, newBotMessage]);
      } else {
        throw new Error("Empty response from chatbot");
      }
    } catch (error) {
      console.error("Chat error:", error);
      Alert.alert(
        "خطأ",
        "حدث خطأ في الاتصال بخادم الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.",
        [{ text: "حسنًا" }]
      );
      setMessages((prev) => [
        ...prev,
        {
          text: "عذرًا، حدث خطأ في الرد. يرجى المحاولة مرة أخرى!",
          isUser: false,
          timestamp: new Date().toLocaleTimeString("ar-SA", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderServiceSuggestion = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceSuggestion}
      onPress={() => handleSuggestionPress(item)}
      activeOpacity={0.8}
    >
      <Animatable.View animation="pulse" iterationCount={1}>
        <Ionicons name={item.icon} size={24} color="#FFB800" />
        <Text style={styles.serviceTitle}>{item.title}</Text>
      </Animatable.View>
    </TouchableOpacity>
  );

  const renderQuestionSuggestion = ({ item }) => (
    <TouchableOpacity
      style={styles.questionSuggestion}
      onPress={() => handleQuestionPress(item)}
      activeOpacity={0.8}
    >
      <Text style={styles.questionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message, index) => (
          <Animatable.View
            key={index}
            animation="fadeInUp"
            duration={300}
            style={[
              styles.messageBubble,
              message.isUser ? styles.userBubble : styles.botBubble,
              { alignSelf: message.isUser ? "flex-end" : "flex-start" },
            ]}
          >
            {!message.isUser && (
              <View style={styles.botAvatarContainer}>
                <Image
                  source={require("../assets/logo.jpg")}
                  style={styles.botAvatar}
                />
              </View>
            )}
            <View style={styles.messageContent}>
              <Text
                style={[
                  styles.messageText,
                  message.isUser ? styles.userText : styles.botText,
                ]}
              >
                {message.text}
              </Text>
              <Text style={styles.timestamp}>{message.timestamp}</Text>
            </View>
          </Animatable.View>
        ))}
        {isLoading && (
          <Animatable.View
            animation="bounceIn"
            style={[styles.loadingBubble, { alignSelf: "flex-start" }]}
          >
            <ActivityIndicator size="small" color="#FFB800" />
            <Text style={styles.typingText}>جارٍ الكتابة...</Text>
          </Animatable.View>
        )}
      </ScrollView>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>خدمات سالك المتاحة:</Text>
          <FlatList
            data={serviceSuggestions}
            renderItem={renderServiceSuggestion}
            keyExtractor={(item) => item.title}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesList}
          />

          <Text style={styles.questionsTitle}>أسئلة شائعة:</Text>
          <FlatList
            data={serviceSuggestions.flatMap((service) => service.questions)}
            renderItem={renderQuestionSuggestion}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.questionsList}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="اكتب رسالتك هنا..."
            placeholderTextColor="#999"
            multiline
            textAlign="right"
            onSubmitEditing={() => handleSend()}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() === "" && styles.sendButtonDisabled,
            ]}
            onPress={() => handleSend()}
            disabled={isLoading || inputText.trim() === ""}
          >
            <Ionicons
              name="send"
              size={24}
              color={isLoading || inputText.trim() === "" ? "#ccc" : "#FFB800"}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    marginBottom: Platform.OS === "ios" ? 30 : 0,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 15,
    zIndex: 10,
  },
  messagesContainer: {
    marginTop: Platform.OS === "ios" ? 70 : 0,
    flex: 1,
  },
  messagesContent: {
    padding: 15,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: "80%",
    marginVertical: 8,
    padding: 12,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: "#FFB800",
    marginLeft: 50,
    flexDirection: "row-reverse",
  },
  botBubble: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginRight: 50,
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Platform.OS === "ios" ? "Tajawal-Regular" : "Tajawal Regular",
    textAlign: "right",
  },
  userText: {
    color: "white",
  },
  botText: {
    color: "#333",
  },
  timestamp: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
    textAlign: "right",
    fontFamily: Platform.OS === "ios" ? "Tajawal-Regular" : "Tajawal Regular",
  },
  botAvatarContainer: {
    marginRight: 8,
  },
  botAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#FFB800",
  },
  loadingBubble: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    flexDirection: "row",
    alignItems: "center",
  },
  typingText: {
    fontSize: 12,
    color: "#333",
    marginLeft: 8,
    fontFamily: Platform.OS === "ios" ? "Tajawal-Regular" : "Tajawal Regular",
  },
  inputContainer: {
    height: 200,
    flexDirection: "row",
    padding: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginLeft: 10,
    fontSize: 16,
    maxHeight: 100,
    minHeight: 40,
    textAlign: "right",
    fontFamily: Platform.OS === "ios" ? "Tajawal-Regular" : "Tajawal Regular",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  suggestionsContainer: {
    padding: 15,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "right",
    fontFamily: Platform.OS === "ios" ? "Tajawal-Bold" : "Tajawal Bold",
  },
  questionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    color: "#333",
    textAlign: "right",
    fontFamily: Platform.OS === "ios" ? "Tajawal-Bold" : "Tajawal Bold",
  },
  servicesList: {
    paddingLeft: 10,
  },
  questionsList: {
    paddingLeft: 10,
  },
  serviceSuggestion: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 15,
    margin: 7,
    alignItems: "center",
    width: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceTitle: {
    color: "#FFB800",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Tajawal-Regular" : "Tajawal Regular",
  },
  questionSuggestion: {
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 10,
    margin: 4,
    width: Dimensions.get("window").width / 4.5, // Show ~4 questions
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionText: {
    color: "#333",
    fontSize: 12,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Tajawal-Regular" : "Tajawal Regular",
  },
});

export default ChatInterface;
