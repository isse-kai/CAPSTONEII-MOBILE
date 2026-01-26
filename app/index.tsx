import { useRouter } from "expo-router"; // ✅ add this
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");
const BLUE = "#1E88E5";

const HEADER_HEIGHT = Math.min(height * 0.26, 240);
const CARD_RADIUS = 32;
const BUTTON_HEIGHT = Math.max(52, height * 0.065);
const CONTENT_BUTTON_GAP = 120;

export default function AuthLanding() {
  const router = useRouter(); // ✅ add this

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.logoShadow}>
          <Image
            source={require("../image/jdklogoalterwhite.png")}
            style={styles.logo}
          />
        </View>
      </View>

      <View style={styles.cardWrapper}>
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              All your home services in one place
            </Text>

            <Text style={styles.cardDescription}>
              Organize, book, and enjoy trusted local helpers for car wash,
              repairs, cleaning, and more — all in just a few taps.
            </Text>

            <View style={styles.dotsContainer}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.push("/role/role")} // ✅ change to your signup route
              >
                <Text style={styles.primaryButtonText}>SIGN UP</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.push("/login/login")} // ✅ goes to app/login/login.tsx
              >
                <Text style={styles.secondaryButtonText}>LOGIN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Light grey so card radius is visible where possible
  root: {
    flex: 1,
    backgroundColor: "#f3f5f9",
  },

  /* HEADER: blue box with logo only */
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  logoShadow: {
    shadowColor: "#ffffff",
    shadowOpacity: 0.9,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },

  logo: {
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: "contain",
  },

  /* WHITE CARD */
  cardWrapper: {
    flex: 1,
    marginTop: -CARD_RADIUS, // slight overlap into the blue area
    paddingHorizontal: 0, // 👈 full width (touch edges of phone)
    paddingBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: CARD_RADIUS, // radius on all corners
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 6,
    overflow: "hidden",
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    rowGap: 16,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: "#666",
    textAlign: "center",
  },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 4,
  },
  dotActive: {
    width: 12,
    borderRadius: 6,
    backgroundColor: BLUE,
  },

  buttonsContainer: {
    width: "100%",
    marginTop: CONTENT_BUTTON_GAP,
  },
  primaryButton: {
    backgroundColor: "#1E88E5",
    borderRadius: BUTTON_HEIGHT / 2,
    height: BUTTON_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  secondaryButton: {
    borderColor: "#1E88E5",
    borderWidth: 2,
    borderRadius: BUTTON_HEIGHT / 2,
    height: BUTTON_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#1E88E5",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
});
