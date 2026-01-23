import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Activity,
    BadgeCheck,
    FileUp,
    IdCard,
    MapPin,
    ShieldCheck,
} from "lucide-react-native";
import React, { useMemo } from "react";
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const BLUE = "#1E88E5";

// Map a primary service type to TESDA certificate text
function getTesdaCertificateLabel(service: string | undefined): string {
  if (!service) return "TESDA Certificate (if applicable)";

  switch (service.toLowerCase()) {
    case "carpenter":
    case "carpentry":
      return "TESDA Carpentry NC II Certificate";
    case "plumber":
      return "TESDA Plumbing NC II Certificate";
    case "laundry":
      return "TESDA Laundry Services NC II Certificate";
    case "electrician":
      return "TESDA Electrical Installation & Maintenance NC II Certificate";
    case "carwasher":
    case "car washer":
      return "TESDA Automotive Servicing / Detailing Certificate";
    case "appliance":
    case "appliances":
      return "TESDA Consumer Electronics Servicing NC II Certificate";
    default:
      return "TESDA Certificate (based on your selected service type)";
  }
}

export default function WorkerRequiredDocsStep3() {
  const router = useRouter();
  const { personal, work, services } = useLocalSearchParams<{
    personal?: string;
    work?: string;
    services?: string;
  }>();

  // services is expected as a comma-separated string from Step 2
  const selectedServices = useMemo(
    () =>
      services
        ? decodeURIComponent(services)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    [services],
  );

  const primaryService = selectedServices[0];

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    console.log("Proceed to Step 4 – Review & Submit");

    router.push({
      pathname: "/workerforms/WorkerReviewStep4",
      params: {
        personal: personal ?? "",
        work: work ?? "",
        services: services ?? "",
      },
    });
  };

  const mockUpload = (name: string) => {
    console.log("Upload tapped:", name);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Logo header (centered, same as Step 1 & 2) */}
      <View style={styles.header}>
        <Image
          source={require("../../image/jdklogo.png")}
          style={styles.logo}
        />
      </View>

      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress text */}
        <Text style={styles.progressText}>
          3 of 4 • Post a Worker Application
        </Text>

        {/* Titles */}
        <Text style={styles.stepTitle}>Step 3: Required Documents</Text>
        <Text style={styles.stepSubtitle}>Please upload your documents</Text>

        {/* Main card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Required Documents</Text>
          <Text style={styles.cardHint}>
            Upload clear photos or scans of the documents listed below.
          </Text>

          {/* Primary ID front */}
          <UploadSection
            label="Primary ID (Front)"
            required
            icon={<IdCard size={20} color={BLUE} />}
            hint="Valid ID such as UMID, Passport, Driver’s License, etc."
            onPress={() => mockUpload("Primary ID Front")}
          />

          {/* Primary ID back */}
          <UploadSection
            label="Primary ID (Back)"
            required
            icon={<IdCard size={20} color={BLUE} />}
            hint="Back side of the same valid ID."
            onPress={() => mockUpload("Primary ID Back")}
          />

          {/* Secondary ID */}
          <UploadSection
            label="Secondary ID"
            required
            icon={<IdCard size={20} color={BLUE} />}
            hint="Any supporting ID if available."
            onPress={() => mockUpload("Secondary ID")}
          />

          {/* NBI / Police clearance */}
          <UploadSection
            label="NBI / Police Clearance"
            required
            icon={<ShieldCheck size={20} color={BLUE} />}
            hint="Recent clearance document."
            onPress={() => mockUpload("NBI / Police Clearance")}
          />

          {/* Proof of Address */}
          <UploadSection
            label="Proof of Address"
            required
            icon={<MapPin size={20} color={BLUE} />}
            hint="Barangay certificate, utility bill, or similar."
            onPress={() => mockUpload("Proof of Address")}
          />

          {/* Medical Certificate */}
          <UploadSection
            label="Medical Certificate"
            required
            icon={<Activity size={20} color={BLUE} />}
            hint="Latest medical fit-to-work certificate."
            onPress={() => mockUpload("Medical Certificate")}
          />

          {/* TESDA requirements card */}
          <View style={styles.subCard}>
            <Text style={styles.subCardTitle}>
              TESDA Certificate Requirement
            </Text>
            {selectedServices.length > 0 ? (
              <>
                <Text style={styles.subCardText}>
                  Based on your selected service type(s):
                </Text>
                <View style={styles.servicePillWrap}>
                  {selectedServices.map((s) => (
                    <View key={s} style={styles.servicePill}>
                      <BadgeCheck size={16} color={BLUE} />
                      <Text style={styles.servicePillText}>{s}</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <Text style={styles.subCardText}>
                TESDA requirement depends on your selected service type.
              </Text>
            )}
          </View>

          {/* One TESDA upload section per selected service */}
          {selectedServices.map((service) => (
            <UploadSection
              key={service}
              label={getTesdaCertificateLabel(service)}
              required
              icon={<FileUp size={20} color={BLUE} />}
              hint="Upload your TESDA certificate (PDF, JPG, or PNG)."
              onPress={() => mockUpload(`TESDA Certificate – ${service}`)}
            />
          ))}

          {/* If no service selected, show a generic TESDA upload (optional) */}
          {selectedServices.length === 0 && (
            <UploadSection
              label="TESDA Certificate (if applicable)"
              icon={<FileUp size={20} color={BLUE} />}
              hint="Upload your TESDA certificate (PDF, JPG, or PNG)."
              onPress={() => mockUpload("TESDA Certificate")}
            />
          )}
        </View>

        {/* Bottom buttons */}
        <View style={styles.bottomRow}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.backBtn}
            onPress={handleBack}
          >
            <Text style={styles.backBtnText}>Back: Work Information</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.nextBtn}
            onPress={handleNext}
          >
            <Text style={styles.nextBtnText}>Next: Review & Submit</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 18 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Small reusable upload section card, consistent with the rest of the UI.
 */
type UploadSectionProps = {
  label: string;
  required?: boolean;
  icon: React.ReactNode;
  hint?: string;
  onPress: () => void;
};

function UploadSection({
  label,
  required,
  icon,
  hint,
  onPress,
}: UploadSectionProps) {
  return (
    <View style={styles.docBlock}>
      <View style={styles.docHeader}>
        <Text style={styles.docLabel}>{label}</Text>
        {required && (
          <View style={styles.tagRequired}>
            <Text style={styles.tagDot}>●</Text>
            <Text style={styles.tagText}>Required</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.uploadBox}
        onPress={onPress}
      >
        <View style={styles.uploadIconWrap}>{icon}</View>
        <Text style={styles.uploadText}>Tap to upload or add photo</Text>
        <Text style={styles.uploadSub}>PDF, JPG, or PNG • Max 5MB</Text>
      </TouchableOpacity>

      <View style={styles.docFooter}>
        <Text style={styles.docFooterLeft}>No file selected</Text>
        {hint ? <Text style={styles.docFooterRight}>{hint}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 6,
    alignItems: "center",
    backgroundColor: "#f5f6fa",
  },
  logo: {
    width: 190,
    height: 42,
    resizeMode: "contain",
  },
  root: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 22,
  },

  progressText: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 6,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0f172a",
  },
  stepSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
  },

  card: {
    marginTop: 14,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0f172a",
  },
  cardHint: {
    marginTop: 6,
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 10,
  },

  docBlock: {
    marginTop: 14,
  },
  docHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  docLabel: {
    fontSize: 13.5,
    fontWeight: "900",
    color: "#0f172a",
  },
  tagRequired: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#eef2ff",
  },
  tagDot: {
    fontSize: 12,
    color: BLUE,
    marginRight: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "800",
    color: BLUE,
  },

  uploadBox: {
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#93c5fd",
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  uploadIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1e293b",
  },
  uploadSub: {
    marginTop: 4,
    fontSize: 11.5,
    color: "#6b7280",
  },

  docFooter: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  docFooterLeft: {
    fontSize: 11,
    color: "#9ca3af",
  },
  docFooterRight: {
    fontSize: 11,
    color: "#9ca3af",
    textAlign: "right",
    flex: 1,
    marginLeft: 8,
  },

  subCard: {
    marginTop: 18,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  subCardTitle: {
    fontSize: 13.5,
    fontWeight: "900",
    color: "#0f172a",
  },
  subCardText: {
    marginTop: 4,
    fontSize: 12,
    color: "#6b7280",
  },
  servicePillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  servicePill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#e0f2fe",
  },
  servicePillText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "800",
    color: BLUE,
  },

  bottomRow: {
    marginTop: 20,
    flexDirection: "row",
    gap: 12,
  },
  backBtn: {
    flex: 1,
    height: 52,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#374151",
  },
  nextBtn: {
    flex: 1,
    height: 52,
    borderRadius: 999,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  nextBtnText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#ffffff",
  },
});
