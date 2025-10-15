// import { Ionicons } from "@expo/vector-icons";
// import React, { useState } from "react";
// import {
//     FlatList,
//     Image,
//     Pressable,
//     StyleSheet,
//     Text,
//     View,
// } from "react-native";
// import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

// type NotificationItem = {
//   id: string;
//   title: string;
//   message: string;
//   time: string;
//   read: boolean;
// };

// export default function NotificationsPage() {
//   const [notifications, setNotifications] = useState<NotificationItem[]>([
//     {
//       id: "1",
//       title: "Service Request Approved",
//       message: "Your request for plumbing service has been approved!",
//       time: "2 hours ago",
//       read: false,
//     },
//     {
//       id: "2",
//       title: "Payment Received",
//       message: "Your payment for the electrical repair has been confirmed.",
//       time: "1 day ago",
//       read: true,
//     },
//     {
//       id: "3",
//       title: "New Message",
//       message: "Mark Santos sent you a new message.",
//       time: "3 days ago",
//       read: false,
//     },
//   ]);

//   const handleDelete = (id: string) => {
//     setNotifications((prev) => prev.filter((n) => n.id !== id));
//   };

//   const handleMarkAsRead = (id: string) => {
//     setNotifications((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, read: true } : n))
//     );
//   };

//   const renderRightActions = (id: string) => (
//     <View style={styles.actionsContainer}>
//       <Pressable
//         style={[styles.actionButton, { backgroundColor: "#22c55e" }]}
//         onPress={() => handleMarkAsRead(id)}
//       >
//         <Ionicons name="checkmark-done-outline" size={24} color="#fff" />
//       </Pressable>

//       <Pressable
//         style={[styles.actionButton, { backgroundColor: "#ef4444" }]}
//         onPress={() => handleDelete(id)}
//       >
//         <Ionicons name="trash-outline" size={24} color="#fff" />
//       </Pressable>
//     </View>
//   );

//   const renderItem = ({ item }: { item: NotificationItem }) => (
//     <View style={{ overflow: "hidden" }}>
//       <Swipeable
//         key={item.id}
//         renderRightActions={() => renderRightActions(item.id)}
//         overshootRight={false}
//       >
//         <View
//           style={[
//             styles.card,
//             { backgroundColor: item.read ? "#F9FAFB" : "#ffffff" },
//           ]}
//         >
//           <View style={{ flex: 1 }}>
//             <Text style={styles.title}>{item.title}</Text>
//             <Text style={styles.message} numberOfLines={2}>
//               {item.message}
//             </Text>
//             <Text style={styles.time}>{item.time}</Text>
//           </View>
//           {!item.read && <View style={styles.unreadDot} />}
//         </View>
//       </Swipeable>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Notifications</Text>

//       {notifications.length === 0 ? (
//         <View style={styles.placeholderContainer}>
//           <Image
//             source={require("../../../assets/2.png")}
//             style={{ width: 120, height: 120, marginBottom: 10 }}
//             resizeMode="contain"
//           />
//           <Text style={styles.placeholderText}>
//             You have no notifications right now.
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           data={notifications}
//           keyExtractor={(item) => item.id}
//           renderItem={renderItem}
//           contentContainerStyle={{ paddingVertical: 12 }}
//           showsVerticalScrollIndicator={false}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F3F4F6",
//     paddingHorizontal: 16,
//     paddingTop: 60,
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: "#111827",
//     marginBottom: 16,
//   },
//   card: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     borderRadius: 14,
//     marginBottom: 10,
//     backgroundColor: "#fff",
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 1,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 4,
//   },
//   message: {
//     fontSize: 14,
//     color: "#4b5563",
//     marginBottom: 4,
//   },
//   time: {
//     fontSize: 12,
//     color: "#9ca3af",
//   },
//   unreadDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: "#3B82F6",
//     marginLeft: 10,
//   },
//   actionsContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   actionButton: {
//     width: 64,
//     height: "85%",
//     borderRadius: 12,
//     alignItems: "center",
//     justifyContent: "center",
//     marginHorizontal: 4,
//   },
//   placeholderContainer: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   placeholderText: {
//     fontSize: 15,
//     color: "#6b7280",
//     textAlign: "center",
//   },
// });
