import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Animated,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const slides = [
  {
    id: "1",
    title: "Your All-in-One Mobility App",
    subtitle: "Car sharing, courier services, and roadside assistance—everything \n in one place!",
    image: require("../../assets/ride share.jpg"),
  },
  {
    id: "2",
    title: "Car Sharing & Ride",
    subtitle: "Ride or Share a Car.Need a ride? Book one instantly. Own a car? Share it and earn money.",
    image: require("../../assets/mechanic-slider.jpg"),
  },
  {
    id: "3",
    title: "Emergency Help",
    subtitle: "Roadside Assistance:Fuel delivery, towing, and mechanic support—whenever you need it.",
    image: require("../../assets/petrol1.jpg"),
  },
  {
    id: "4",
    title: "Choose your role and join us",
    subtitle: "As a Customer – Book rides, or get road side help. \n\nAs a Provider – Offer rides, or provide assistance.",

    image: require("../../assets/petrol1.jpg"),
  },
];

const OnboardingScreen = () => {
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const titleLetterAnims = useRef(slides.map(() => [])).current;
  const subtitleLetterAnims = useRef(slides.map(() => [])).current;
  const textPosition = useRef(slides.map(() => new Animated.Value(0))).current;
  const welcomeBounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Bounce animation for welcome screen
    Animated.sequence([
      Animated.timing(welcomeBounce, {
        toValue: 10,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(welcomeBounce, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      setShowWelcome(false);
      animateText(0);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const animateText = (index) => {
    const title = slides[index]?.title || "";
    const subtitle = slides[index]?.subtitle || "";

    if (!titleLetterAnims[index].length) {
      titleLetterAnims[index] = title.split("").map(() => new Animated.Value(0));
      subtitleLetterAnims[index] = subtitle.split("").map(() => new Animated.Value(0));
    }

    slides.forEach((_, i) => {
      if (i !== index) {
        textPosition[i].setValue(0);
        titleLetterAnims[i].forEach(anim => anim.setValue(0));
        subtitleLetterAnims[i].forEach(anim => anim.setValue(0));
      }
    });

    Animated.sequence([
      Animated.timing(textPosition[index], {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.stagger(
        50,
        titleLetterAnims[index].map(anim =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          })
        )
      ),
      Animated.stagger(
        30,
        subtitleLetterAnims[index].map(anim =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          })
        )
      )
    ]).start();
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      const nextIndex = currentSlide + 1;
      flatListRef.current.scrollToIndex({ 
        index: nextIndex, 
        animated: true 
      });
      setCurrentSlide(nextIndex);
      animateText(nextIndex);
    } else {
      router.replace("/joinUs");
    }
  };

  const handleSkip = () => {
    router.replace("/joinUs");
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      const prevIndex = currentSlide - 1;
      flatListRef.current.scrollToIndex({ 
        index: prevIndex, 
        animated: true 
      });
      setCurrentSlide(prevIndex);
      animateText(prevIndex);
    }
  };

  const handleScrollEnd = (event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (newIndex !== currentSlide) {
      setCurrentSlide(newIndex);
      animateText(newIndex);
    }
  };

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const imageTranslateX = scrollX.interpolate({
      inputRange,
      outputRange: [width, 0, -width],
      extrapolate: "clamp",
    });

    const titleLetters = (item.title || "").split("");
    const subtitleLetters = (item.subtitle || "").split("");

    if (!titleLetterAnims[index].length) {
      titleLetterAnims[index] = titleLetters.map(() => new Animated.Value(0));
      subtitleLetterAnims[index] = subtitleLetters.map(() => new Animated.Value(0));
    }

    const translateY = textPosition[index].interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0],
    });

    return (
      <View style={styles.slide}>
        <Animated.View style={{ transform: [{ translateX: imageTranslateX }] }}>
          <Image source={item.image} style={styles.image} />
        </Animated.View>

        <Animated.View style={[styles.textContainer, { transform: [{ translateY }] }]}>
          <View style={styles.titleContainer}>
            {titleLetters.map((letter, i) => (
              <Animated.Text
                key={`${index}-title-${i}`}
                style={[styles.title, { 
                  opacity: titleLetterAnims[index][i],
                  marginHorizontal: letter === " " ? 3 : 0,
                }]}
              >
                {letter}
              </Animated.Text>
            ))}
          </View>

          <View style={styles.subtitleContainer}>
            {subtitleLetters.map((letter, i) => (
              <Animated.Text
                key={`${index}-subtitle-${i}`}
                style={[styles.subtitle, { 
                  opacity: subtitleLetterAnims[index][i],
                  marginHorizontal: letter === " " ? 2 : 0,
                }]}
              >
                {letter}
              </Animated.Text>
            ))}
          </View>
        </Animated.View>
      </View>
    );
  };

  if (showWelcome) {
    return (
      <View style={styles.welcomeContainer}>
        <Animated.View 
          style={[
            styles.welcomeBox,
            { transform: [{ translateY: welcomeBounce }] }
          ]}
        >
          <Text style={styles.welcomeText}>Welcome to SALIK</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AnimatedFlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={handleScrollEnd}
      />

      <View style={styles.dotsContainer}>
        {slides.map((_, index) => {
          const opacity = scrollX.interpolate({
            inputRange: slides.map((_, i) => i * width),
            outputRange: slides.map((_, i) => (i === index ? 1 : 0.3)),
            extrapolate: "clamp",
          });
          return <Animated.View key={index} style={[styles.dot, { opacity }]} />;
        })}
      </View>

      <View style={styles.buttonContainer}>
        {currentSlide === slides.length - 1 ? (
          // Last slide: show both Back and Next
          <>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          </>
        ) : (
          // Other slides: show Skip and Next
          <>
            {currentSlide < slides.length - 1 && (
              <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  welcomeBox: {
    
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
  slide: {
    width,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    resizeMode: "contain",
    marginBottom: 20,
  },
  textContainer: {
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 5,
    width: width * 0.9,
    flexShrink: 1, // Prevents single word on new line
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  subtitleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 20,
    width: width * 0.9,
    flexShrink: 1, // Prevents single word on new line
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "#333",
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    position: "absolute",
    bottom: 30,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    color: "#333",
  },
  backButton: {
    padding: 10,
  },
  backText: {
    fontSize: 16,
    color: "#333",
  },
  nextButton: {
    backgroundColor: "#FFB800",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  nextText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OnboardingScreen;