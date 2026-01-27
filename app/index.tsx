import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const BLUE = "#1E88E5";

// Small helper: clamp a value between min/max
const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

export default function AuthLanding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  // “Base scale” relative to common phone width (375)
  const s = width / 375;

  const CARD_RADIUS = clamp(32 * s, 22, 36);
  const HEADER_HEIGHT = clamp(height * 0.26, 180, 260);

  // Responsive spacing/padding
  const H_PADDING = clamp(24 * s, 16, 28);
  const V_PADDING = clamp(24 * s, 16, 28);

  // Responsive typography
  const titleSize = clamp(18 * s, 16, 22);
  const descSize = clamp(13 * s, 12, 15);

  // Responsive logo size
  const logoSize = clamp(width * 0.5, 150, 240);

  // Responsive button height
  const BUTTON_HEIGHT = clamp(56 * s, 48, 62);

  // If device is short, allow scroll to avoid cut-off
  const isShort = height < 700;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View
        style={[styles.root, { paddingBottom: Math.max(insets.bottom, 12) }]}
      >
        {/* HEADER */}
        <View
          style={[
            styles.header,
            { height: HEADER_HEIGHT, paddingHorizontal: H_PADDING },
          ]}
        >
          <View style={styles.logoShadow}>
            <Image
              source={require("../image/jdklogoalterwhite.png")}
              style={{
                width: logoSize,
                height: logoSize,
                resizeMode: "contain",
              }}
            />
          </View>
        </View>

        {/* CARD AREA */}
        <View style={[styles.cardWrapper, { marginTop: -CARD_RADIUS }]}>
          <View style={[styles.card, { borderRadius: CARD_RADIUS }]}>
            {isShort ? (
              <ScrollView
                contentContainerStyle={[
                  styles.cardContent,
                  {
                    paddingHorizontal: H_PADDING,
                    paddingVertical: V_PADDING,
                  },
                ]}
                showsVerticalScrollIndicator={false}
              >
                <TopContent titleSize={titleSize} descSize={descSize} />

                <Dots />

                <Buttons
                  buttonHeight={BUTTON_HEIGHT}
                  onSignUp={() => router.push("./role/role")}
                  onLogin={() => router.push("./login/login")}
                />
              </ScrollView>
            ) : (
              <View
                style={[
                  styles.cardContent,
                  {
                    paddingHorizontal: H_PADDING,
                    paddingVertical: V_PADDING,
                  },
                ]}
              >
                {/* Use space-between so buttons naturally sit lower without hard-coded gaps */}
                <View style={{ width: "100%", alignItems: "center", gap: 16 }}>
                  <TopContent titleSize={titleSize} descSize={descSize} />
                  <Dots />
                </View>

                <Buttons
                  buttonHeight={BUTTON_HEIGHT}
                  onSignUp={() => router.push("./role/role")}
                  onLogin={() => router.push("./login/login")}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function TopContent({
  titleSize,
  descSize,
}: {
  titleSize: number;
  descSize: number;
}) {
  return (
    <>
      <Text style={[styles.cardTitle, { fontSize: titleSize }]}>
        All your home services in one place
      </Text>

      <Text
        style={[
          styles.cardDescription,
          { fontSize: descSize, lineHeight: descSize * 1.55 },
        ]}
      >
        Organize, book, and enjoy trusted local helpers for car wash, repairs,
        cleaning, and more — all in just a few taps.
      </Text>
    </>
  );
}

function Dots() {
  return (
    <View style={styles.dotsContainer}>
      <View style={[styles.dot, styles.dotActive]} />
      <View style={styles.dot} />
      <View style={styles.dot} />
    </View>
  );
}

function Buttons({
  buttonHeight,
  onSignUp,
  onLogin,
}: {
  buttonHeight: number;
  onSignUp: () => void;
  onLogin: () => void;
}) {
  return (
    <View style={styles.buttonsContainer}>
      <TouchableOpacity
        style={[
          styles.primaryButton,
          { height: buttonHeight, borderRadius: buttonHeight / 2 },
        ]}
        onPress={onSignUp}
        activeOpacity={0.9}
      >
        <Text style={styles.primaryButtonText}>SIGN UP</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.secondaryButton,
          { height: buttonHeight, borderRadius: buttonHeight / 2 },
        ]}
        onPress={onLogin}
        activeOpacity={0.9}
      >
        <Text style={styles.secondaryButtonText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f3f5f9" },
  root: {
    flex: 1,
    backgroundColor: "#f3f5f9",
  },

  header: {
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },

  logoShadow: {
    shadowColor: "#ffffff",
    shadowOpacity: 0.9,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },

  cardWrapper: {
    flex: 1,
    paddingHorizontal: 0, // full width
  },
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 6,
    overflow: "hidden",
  },

  // When not scrolling, we space content so buttons sit lower naturally
  cardContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },

  cardTitle: {
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
  },
  cardDescription: {
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
    paddingTop: 8,
    paddingBottom: 4,
  },
  primaryButton: {
    backgroundColor: BLUE,
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
    borderColor: BLUE,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: BLUE,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
});
