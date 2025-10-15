// import React, { useState } from "react";
// import {
//     FlatList,
//     Image,
//     ListRenderItem,
//     Text,
//     TextInput,
//     View,
// } from "react-native";

// // ---- 1️⃣ Define a Type for each chat ----
// type ChatItem = {
//   id: string;
//   name: string;
//   message: string;
//   time: string;
//   avatar: any; // can be 'ImageSourcePropType' if you want to be strict
//   unread: number;
// };

// // ---- 2️⃣ Placeholder Chat Data ----
// const chats: ChatItem[] = [
//   {
//     id: "1",
//     name: "Sebastian Rudiger",
//     message: "Perfect! Will check it 🔥",
//     time: "09:34 PM",
//     avatar: require("../../assets/user1.png"),
//     unread: 0,
//   },
//   {
//     id: "2",
//     name: "Caroline Varsaha",
//     message: "Thanks, Jimmy! Talk later",
//     time: "08:12 PM",
//     avatar: require("../../assets/user2.png"),
//     unread: 2,
//   },
//   {
//     id: "3",
//     name: "Darshan Patelchi",
//     message: "Sound good for me too!",
//     time: "02:29 PM",
//     avatar: require("../../assets/user3.png"),
//     unread: 3,
//   },
//   {
//     id: "4",
//     name: "Mohammed Arnold",
//     message: "No rush, mate! Just let ...",
//     time: "01:08 PM",
//     avatar: require("../../assets/user4.png"),
//     unread: 0,
//   },
//   {
//     id: "5",
//     name: "Tamara Schipchinskaya",
//     message: "Okay. I'll tell him about it",
//     time: "11:15 AM",
//     avatar: require("../../assets/user5.png"),
//     unread: 0,
//   },
//   {
//     id: "6",
//     name: "Ariana Amberline",
//     message: "Good nite, Honey!",
//     time: "Yesterday",
//     avatar: require("../../assets/user6.png"),
//     unread: 0,
//   },
// ];

// export default function ChatListScreen() {
//   const [search, setSearch] = useState("");

//   const filteredChats = chats.filter((chat) =>
//     chat.name.toLowerCase().includes(search.toLowerCase())
//   );

//   // ---- 3️⃣ Explicitly type renderItem ----
//   const renderItem: ListRenderItem<ChatItem> = ({ item }) => (
//     <View
//       style={{
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#fff",
//         borderRadius: 16,
//         padding: 12,
//         marginBottom: 12,
//         shadowColor: "#000",
//         shadowOpacity: 0.05,
//         shadowRadius: 3,
//         elevation: 1,
//       }}
//     >
//       <Image
//         source={item.avatar}
//         style={{
//           width: 50,
//           height: 50,
//           borderRadius: 25,
//           marginRight: 12,
//         }}
//       />
//       <View style={{ flex: 1 }}>
//         <View
//           style={{
//             flexDirection: "row",
//             justifyContent: "space-between",
//             marginBottom: 2,
//           }}
//         >
//           <Text
//             style={{
//               fontSize: 16,
//               fontWeight: "600",
//               color: "#111827",
//             }}
//           >
//             {item.name}
//           </Text>
//           <Text style={{ fontSize: 12, color: "#6b7280" }}>{item.time}</Text>
//         </View>
//         <Text
//           style={{
//             fontSize: 14,
//             color: "#6b7280",
//           }}
//           numberOfLines={1}
//         >
//           {item.message}
//         </Text>
//       </View>

//       {item.unread > 0 && (
//         <View
//           style={{
//             backgroundColor: "#7C3AED",
//             width: 24,
//             height: 24,
//             borderRadius: 12,
//             alignItems: "center",
//             justifyContent: "center",
//             marginLeft: 10,
//           }}
//         >
//           <Text
//             style={{
//               color: "#fff",
//               fontSize: 12,
//               fontWeight: "600",
//             }}
//           >
//             {item.unread}
//           </Text>
//         </View>
//       )}
//     </View>
//   );

//   return (
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: "#F9FAFB",
//         paddingHorizontal: 16,
//         paddingTop: 40,
//       }}
//     >
//       {/* === Search Bar === */}
//       <View
//         style={{
//           backgroundColor: "#fff",
//           borderRadius: 16,
//           paddingVertical: 10,
//           paddingHorizontal: 14,
//           marginBottom: 20,
//           borderWidth: 1,
//           borderColor: "#E5E7EB",
//         }}
//       >
//         <TextInput
//           placeholder="Search message..."
//           placeholderTextColor="#9CA3AF"
//           value={search}
//           onChangeText={setSearch}
//           style={{
//             fontSize: 15,
//             color: "#111827",
//           }}
//         />
//       </View>

//       {/* === Chat List === */}
//       <FlatList
//         data={filteredChats}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// }
