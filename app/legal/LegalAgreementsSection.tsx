// ./legal/LegalAgreementsSection.tsx
import { Text } from "dripsy"
import React, { useEffect, useMemo, useState } from "react"
import { View } from "react-native"
import LegalAgreementModal from "./LegalAgreementModal"
import type { LegalDoc, LegalDocKey } from "./legalTexts"

type Props = {
  docs: Record<LegalDocKey, LegalDoc>
  accentColor?: string
  onAllAgreedChange: (agreed: boolean) => void
}

export default function LegalAgreementsSection({
  docs,
  accentColor = "#008CFC",
  onAllAgreedChange,
}: Props) {
  const [agreedPrivacy, setAgreedPrivacy] = useState(false)
  const [agreedPolicy, setAgreedPolicy] = useState(false)
  const [agreedNda, setAgreedNda] = useState(false)

  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<LegalDocKey>("privacy")

  const policyAndNdaAgreed = useMemo(() => agreedPolicy && agreedNda, [agreedPolicy, agreedNda])
  const allAgreed = useMemo(() => agreedPrivacy && policyAndNdaAgreed, [agreedPrivacy, policyAndNdaAgreed])

  useEffect(() => {
    onAllAgreedChange(allAgreed)
  }, [allAgreed, onAllAgreedChange])

  const openDoc = (key: LegalDocKey) => {
    setActive(key)
    setOpen(true)
  }

  const markAgreed = (key: LegalDocKey) => {
    if (key === "privacy") setAgreedPrivacy(true)
    if (key === "policy") setAgreedPolicy(true)
    if (key === "nda") setAgreedNda(true)
  }

  const Checkbox = ({ checked }: { checked: boolean }) => (
    <View
      style={{
        width: 18,
        height: 18,
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 4,
        backgroundColor: checked ? accentColor : "transparent",
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 2,
      }}
    >
      {checked ? <Text sx={{ color: "#fff", fontSize: 12 }}>✓</Text> : null}
    </View>
  )

  const LinkText = ({ label, onPress }: { label: string; onPress: () => void }) => (
    <Text
      onPress={onPress}
      sx={{
        color: accentColor,
        textDecorationLine: "underline",
        fontFamily: "Poppins-Regular",
      }}
    >
      {label}
    </Text>
  )

  return (
    <View style={{ marginTop: 12 }}>
      {/* Checkbox 1 */}
      <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 10 }}>
        <Checkbox checked={agreedPrivacy} />
        <View style={{ flex: 1 }}>
          <Text sx={{ fontSize: 12, fontFamily: "Poppins-Regular", color: "#000" }}>
            JDK HOMECARE’s <LinkText label="Privacy Policy" onPress={() => openDoc("privacy")} />.
          </Text>
          <Text sx={{ fontSize: 11, fontFamily: "Poppins-Regular", color: "#6B7280", marginTop: 2 }}>
            Please read the Privacy Policy to enable this checkbox.
          </Text>
        </View>
      </View>

      {/* Checkbox 2 */}
      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        <Checkbox checked={policyAndNdaAgreed} />
        <View style={{ flex: 1 }}>
          <Text sx={{ fontSize: 12, fontFamily: "Poppins-Regular", color: "#000" }}>
            JDK HOMECARE’s <LinkText label="Policy Agreement" onPress={() => openDoc("policy")} /> and{" "}
            <LinkText label="Non-Disclosure Agreement" onPress={() => openDoc("nda")} />.
          </Text>
          <Text sx={{ fontSize: 11, fontFamily: "Poppins-Regular", color: "#6B7280", marginTop: 2 }}>
            Please read and agree to both links to enable this checkbox.
          </Text>
        </View>
      </View>

      <LegalAgreementModal
        visible={open}
        title={docs[active].title}
        body={docs[active].body}
        accentColor={accentColor}
        onClose={() => setOpen(false)}
        onAgree={() => markAgreed(active)}
      />
    </View>
  )
}
