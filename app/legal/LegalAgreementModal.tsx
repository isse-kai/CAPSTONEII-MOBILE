// ./legal/LegalAgreementModal.tsx
import { Ionicons } from "@expo/vector-icons"
import { Pressable, Text } from "dripsy"
import React, { useEffect, useMemo, useState } from "react"
import { Modal, ScrollView, TouchableOpacity, View } from "react-native"

type Props = {
  visible: boolean
  title: string
  body: string
  onClose: () => void
  onAgree: () => void
  accentColor?: string
}

export default function LegalAgreementModal({
  visible,
  title,
  body,
  onClose,
  onAgree,
  accentColor = "#008CFC",
}: Props) {
  const [ack, setAck] = useState(false)

  useEffect(() => {
    if (!visible) setAck(false)
  }, [visible])

  const canAgree = useMemo(() => ack, [ack])

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "center",
          paddingHorizontal: 16,
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 14,
            overflow: "hidden",
            maxHeight: "85%",
          }}
        >
          {/* Header */}
          <View
            style={{
              paddingHorizontal: 14,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderColor: "#eee",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text sx={{ fontSize: 16, fontFamily: "Poppins-Bold", color: "#000", pr: 10 }}>
              {title}
            </Text>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={22} color="#111" />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <ScrollView
            style={{ paddingHorizontal: 14, paddingVertical: 12 }}
            showsVerticalScrollIndicator
          >
            <Text sx={{ fontSize: 13, fontFamily: "Poppins-Regular", color: "#111", lineHeight: 18 }}>
              {body}
            </Text>
            <View style={{ height: 12 }} />
          </ScrollView>

          {/* Footer */}
          <View style={{ borderTopWidth: 1, borderColor: "#eee", padding: 14 }}>
            <Pressable
              onPress={() => setAck((p) => !p)}
              sx={{ flexDirection: "row", alignItems: "center", mb: 12 }}
            >
              {/* ✅ changed sx -> style because this is RN View */}
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderWidth: 1,
                  borderColor: "#000",
                  borderRadius: 4,
                  backgroundColor: ack ? accentColor : "transparent",
                  marginRight: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {ack ? <Text sx={{ color: "#fff", fontSize: 12 }}>✓</Text> : null}
              </View>

              <Text sx={{ fontSize: 12, fontFamily: "Poppins-Regular", color: "#000" }}>
                I have read and agree.
              </Text>
            </Pressable>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                onPress={onClose}
                sx={{ flex: 1, bg: "#E5E7EB", borderRadius: 10, py: 12, alignItems: "center" }}
              >
                <Text sx={{ fontSize: 14, fontFamily: "Poppins-Bold", color: "#111" }}>Cancel</Text>
              </Pressable>

              <Pressable
                disabled={!canAgree}
                onPress={() => {
                  if (!canAgree) return
                  onAgree()
                  onClose()
                }}
                sx={{
                  flex: 1,
                  bg: canAgree ? accentColor : "#D1D5DB",
                  borderRadius: 10,
                  py: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  sx={{
                    fontSize: 14,
                    fontFamily: "Poppins-Bold",
                    color: canAgree ? "#fff" : "#6B7280",
                  }}
                >
                  I Agree
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}
