import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
    Animated,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Animated.View style={[styles.animatedWrapper, { opacity: fadeAnim }]}>
        {/* Hero Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome to JDK Homecare 👋</Text>
          <Text style={styles.headerSubtitle}>
            Your trusted partner for home services and care
          </Text>

          {/* Logout Button (Top Right) */}
          <Pressable
            style={styles.logoutButton}
            onPress={() => router.push("/login/login")}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome / CTA */}
          <Text style={styles.sectionTitle}>What You Need to Know</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              We provide reliable and affordable homecare services to make your
              life easier. From cleaning and repairs to health & safety
              assistance — we’ve got you covered.
            </Text>
          </View>

          {/* Advantages */}
          <Text style={styles.sectionTitle}>Why Choose Us</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>✔ Professional & trained staff</Text>
            <Text style={styles.infoText}>✔ Affordable, transparent pricing</Text>
            <Text style={styles.infoText}>✔ Available 24/7 for emergencies</Text>
            <Text style={styles.infoText}>✔ 100% satisfaction guaranteed</Text>
          </View>

          {/* Services */}
          <Text style={styles.sectionTitle}>Our Services</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>🧹 House Cleaning</Text>
            <Text style={styles.infoText}>🔧 Plumbing & Repairs</Text>
            <Text style={styles.infoText}>💡 Electrical Support</Text>
            <Text style={styles.infoText}>🏡 General Home Maintenance</Text>
          </View>

          {/* Testimonials */}
          <Text style={styles.sectionTitle}>What Our Clients Say</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              ⭐⭐⭐⭐⭐ “JDK Homecare made my life so much easier! Highly
              recommended.”
            </Text>
            <Text style={styles.infoText}>
              ⭐⭐⭐⭐⭐ “Professional team, quick service, and affordable rates.”
            </Text>
          </View>

          {/* Call to Action */}
          <Text style={styles.sectionTitle}>Ready to Get Started?</Text>
          <Pressable
            onPress={() => router.push("/screen/bookscreen")}
            style={styles.bookCard}
          >
            <Text style={styles.bookCardText}>📅 Book a Service Now</Text>
          </Pressable>
        </ScrollView>

        {/* Floating Navigation */}
        <View style={styles.floatingNav}>
          <Pressable
            onPress={() => router.push("/screen/homescreen")}
            style={styles.navButton}
          >
            <Text style={styles.navText}>🏠</Text>
            <Text style={styles.navLabel}>Home</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/screen/notificationscreen")}
            style={styles.navButton}
          >
            <Text style={styles.navText}>🔔</Text>
            <Text style={styles.navLabel}>Notifications</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/screen/profilescreen")}
            style={styles.navButton}
          >
            <Text style={styles.navText}>👤</Text>
            <Text style={styles.navLabel}>Profile</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  animatedWrapper: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: "#0685f4",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    position: "relative",
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Poppins-ExtraBold",
    color: "#fff",
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#e6f0ff",
  },
  logoutButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    right: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#0685f4",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 140,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    color: "#001a33",
    marginBottom: 12,
  },
  bookCard: {
    height: 120,
    backgroundColor: "#0685f4",
    borderRadius: 16,
    justifyContent: "center" as ViewStyle["justifyContent"],
    alignItems: "center" as ViewStyle["alignItems"],
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  bookCardText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: "#fff",
  },
  infoCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoText: {
    fontFamily: "Poppins-Regular",
    color: "#001a33",
    marginBottom: 6,
  },
  floatingNav: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#ffffff",
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  navButton: {
    justifyContent: "center" as ViewStyle["justifyContent"],
    alignItems: "center" as ViewStyle["alignItems"],
  },
  navText: {
    fontSize: 22,
    marginBottom: 2,
  },
  navLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
    color: "#001a33",
  },
});