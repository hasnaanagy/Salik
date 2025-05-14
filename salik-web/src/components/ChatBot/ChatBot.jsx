import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
  Stack,
  Chip,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { styled } from "@mui/material/styles";
import { getChatResponse } from "../../services/chatbotService";

const MessageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  padding: "20px",
  height: "500px",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#ffb800",
    borderRadius: "10px",
  },
}));

const MessageBubble = styled(Paper)(({ theme, isUser }) => ({
  padding: "12px 18px",
  maxWidth: "70%",
  alignSelf: isUser ? "flex-end" : "flex-start",
  backgroundColor: isUser ? "#ffb800" : "#f8f9fa",
  color: isUser ? "#000" : "#000",
  borderRadius: isUser ? "20px 20px 0 20px" : "20px 20px 20px 0",
  direction: "rtl",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  position: "relative",
  transition: "all 0.3s ease",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    bottom: 0,
    [isUser ? "right" : "left"]: -8,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderWidth: isUser ? "0 0 8px 8px" : "0 8px 8px 0",
    borderColor: isUser
      ? `transparent transparent transparent #ffb800`
      : `transparent #f8f9fa transparent transparent`,
  },
}));

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "25px",
    "&:hover fieldset": {
      borderColor: "#ffb800",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ffb800",
    },
  },
});

const StyledChip = styled(Chip)({
  backgroundColor: "#fff",
  border: "1px solid #ffb800",
  color: "#000",
  "&:hover": {
    backgroundColor: "#ffb800",
    color: "#000",
  },
  "&:active": {
    backgroundColor: "#e6a600",
  },
});

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      text: "مرحبًا! أنا مساعد سالك الذكي. كيف يمكنني مساعدتك اليوم؟",
      isUser: false,
      timestamp: new Date().toLocaleTimeString("ar-SA"),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const serviceSuggestions = [
    {
      title: "مشاركة الركوب",
      questions: [
        "كيف أطلب رحلة؟",
        "كيف أكون سائق؟",
        "ما هي شروط مشاركة الركوب؟",
      ],
    },
    {
      title: "ميكانيكي",
      questions: [
        "كيف أطلب ميكانيكي؟",
        "كيف أكون ميكانيكي؟",
        "ما هي خدمات الميكانيكي؟",
      ],
    },
    {
      title: "بنزين",
      questions: [
        "كيف أطلب بنزين؟",
        "كيف أكون مزود بنزين؟",
        "ما هي أسعار البنزين؟",
      ],
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage = {
      text: inputText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString("ar-SA"),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await getChatResponse(inputText);
      setMessages((prev) => [
        ...prev,
        {
          text: response,
          isUser: false,
          timestamp: new Date().toLocaleTimeString("ar-SA"),
        },
      ]);
    } catch (error) {
      console.error("Error getting response:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.",
          isUser: false,
          timestamp: new Date().toLocaleTimeString("ar-SA"),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (question) => {
    setInputText(question);
    handleSend();
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", p: 2 }}>
      <Paper
        elevation={3}
        sx={{
          height: "700px",
          display: "flex",
          flexDirection: "column",
          borderRadius: "20px",
          overflow: "hidden",
          bgcolor: "#fff",
        }}
      >
        <Box
          sx={{
            p: 2,
            bgcolor: "#ffb800",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            src="/images/logo.svg"
            alt="Bot Avatar"
            sx={{ width: 40, height: 40 }}
          />
          <Typography variant="h6" sx={{ color: "#000", fontWeight: "bold" }}>
            مساعد سالك الذكي
          </Typography>
        </Box>

        <MessageContainer>
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "flex-end",
                gap: 1,
                flexDirection: message.isUser ? "row-reverse" : "row",
                mb: 2,
              }}
            >
              {!message.isUser && (
                <Avatar
                  src="/images/logo.svg"
                  alt="Bot Avatar"
                  sx={{
                    width: 30,
                    height: 30,
                    mb: 1,
                    bgcolor: "#ffb800",
                  }}
                />
              )}
              <Box sx={{ maxWidth: "70%" }}>
                <MessageBubble isUser={message.isUser}>
                  <Typography
                    sx={{
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      letterSpacing: "0.01em",
                      fontWeight: 400,
                    }}
                  >
                    {message.text.split("\n").map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < message.text.split("\n").length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.7,
                      display: "block",
                      textAlign: message.isUser ? "left" : "right",
                      fontSize: "0.75rem",
                      mt: 1,
                      direction: "ltr",
                    }}
                  >
                    {message.timestamp}
                  </Typography>
                </MessageBubble>
              </Box>
              {message.isUser && (
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "#ffb800",
                    mb: 1,
                  }}
                />
              )}
            </Box>
          ))}
          {isLoading && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                p: 2,
              }}
            >
              <Avatar
                src="/images/logo.svg"
                alt="Bot Avatar"
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: "#ffb800",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  gap: 0.5,
                  p: 2,
                  bgcolor: "#f8f9fa",
                  borderRadius: "15px",
                }}
              >
                <CircularProgress size={8} sx={{ color: "#ffb800" }} />
                <CircularProgress
                  size={8}
                  sx={{ color: "#ffb800", animationDelay: "0.2s" }}
                />
                <CircularProgress
                  size={8}
                  sx={{ color: "#ffb800", animationDelay: "0.4s" }}
                />
              </Box>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </MessageContainer>

        <Box
          sx={{
            p: 3,
            borderTop: "1px solid #eee",
            bgcolor: "#f8f9fa",
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              mb: 2,
              flexWrap: "wrap",
              gap: 1,
              justifyContent: "center",
            }}
          >
            {serviceSuggestions.map((service) =>
              service.questions.map((question, index) => (
                <StyledChip
                  key={index}
                  label={question}
                  onClick={() => handleQuestionClick(question)}
                  sx={{ direction: "rtl" }}
                />
              ))
            )}
          </Stack>
          <Box sx={{ display: "flex", gap: 1 }}>
            <StyledTextField
              fullWidth
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              sx={{ direction: "rtl" }}
              multiline
              maxRows={3}
            />
            <IconButton
              onClick={handleSend}
              sx={{
                bgcolor: "#ffb800",
                color: "#000",
                "&:hover": {
                  bgcolor: "#e6a600",
                },
                "&:disabled": {
                  bgcolor: "#ffd966",
                  color: "#666",
                },
                width: 50,
                height: 50,
              }}
              disabled={isLoading || !inputText.trim()}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatBot;
