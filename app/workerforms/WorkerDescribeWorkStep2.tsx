import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Car,
  Droplets,
  Hammer,
  Info,
  MonitorCog,
  Wrench,
  Zap,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const BLUE = "#1E88E5";

const SERVICE_TYPES = [
  { id: "Carpenter", label: "Carpenter", icon: Hammer },
  { id: "Plumber", label: "Plumber", icon: Wrench },
  { id: "Laundry", label: "Laundry", icon: Droplets },
  { id: "Electrician", label: "Electrician", icon: Zap },
  { id: "Carwasher", label: "Carwasher", icon: Car },
  { id: "Appliances", label: "Appliance", icon: MonitorCog },
];

// Tasks per service type
const SERVICE_TASKS: Record<string, string[]> = {
  Carpenter: [
    "Furniture assembly & installation",
    "Door alignment & hardware fixing",
    "Basic lockset servicing",
    "Smart lock installation & troubleshooting",
    "Wall patching & surface repair",
    "Ceiling patching & minor restoration",
    "Leak source checking",
    "Waterproofing application",
    "Roof checking & minor roof repair work",
    "Area-based work measurement",
  ],
  Plumber: [
    "Plumbing checkup & leak assessment",
    "Faucet servicing & leak repair",
    "Grease trap maintenance & cleaning",
    "Sink blockage clearing",
    "Drain clearing",
    "Pipe servicing for exposed lines",
    "Toilet troubleshooting & servicing",
    "Heavy blockage clearing",
    "Deep line clearing",
    "Water heater installation",
    "Water heater troubleshooting",
    "Shower fixture installation",
  ],
  Laundry: [
    "Standard wash–dry–fold workflow",
    "Delicates / careful fabric handling",
    "Handwash processing",
    "Heavy fabric washing",
    "Bulky item washing",
    "Stain spotting & pre-treatment",
    "Garment finishing",
    "Per-piece garment handling",
    "Label-based sorting & item tracking",
  ],
  Electrician: [
    "Electrical safety check & diagnostics",
    "Lighting setup & replacement work",
    "Lighting fault troubleshooting",
    "Wiring routing & termination",
    "Wiring fault tracing & repair",
    "Outlet installation & testing",
    "Outlet troubleshooting & replacement",
    "Breaker panel handling",
    "Breaker issue troubleshooting",
    "Switch installation & replacement",
    "Switch troubleshooting",
    "Fan mounting & balancing",
    "Fan troubleshooting",
    "Outdoor lighting setup",
    "Outdoor lighting troubleshooting",
    "Doorbell wiring & setup",
    "Doorbell troubleshooting",
  ],
  Carwasher: [
    "Interior detailing & vacuuming",
    "Seat and fabric stain treatment",
    "Carpet shampoo / extraction cleaning",
    "Dashboard & panel deep cleaning",
    "Odor removal / deodorizing",
    "Exterior wash & rinse technique",
    "Wax / protectant application",
    "Tire & rim detailing",
    "Vehicle size handling (small car / sedan / MPV / SUV / pickup / van)",
  ],
  Appliances: [
    "Refrigerator troubleshooting",
    "Freezer troubleshooting",
    "TV mounting & setup",
    "TV diagnostics",
    "Washer installation & hook-up",
    "Washer troubleshooting",
    "Electric fan troubleshooting",
    "Dishwasher installation & hook-up",
    "Dishwasher troubleshooting",
    "Microwave troubleshooting",
    "Oven troubleshooting",
    "Rice cooker troubleshooting",
  ],
};

export default function WorkerDescribeWorkStep2() {
  const router = useRouter();
  const { personal } = useLocalSearchParams<{ personal?: string }>();

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<Record<string, string[]>>(
    {},
  );
  const [description, setDescription] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [hasTools, setHasTools] = useState<"yes" | "no" | "">("");
  const [toolsModalOpen, setToolsModalOpen] = useState(false);

  const toggleService = (id: string) => {
    setSelectedServices((prev) => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        // remove service + its tasks
        const next = prev.filter((s) => s !== id);
        setSelectedTasks((old) => {
          const clone = { ...old };
          delete clone[id];
          return clone;
        });
        return next;
      }
      return [...prev, id];
    });
  };

  const toggleTask = (serviceId: string, task: string) => {
    setSelectedTasks((prev) => {
      const current = prev[serviceId] || [];
      const exists = current.includes(task);
      const updated = exists
        ? current.filter((t) => t !== task)
        : [...current, task];
      return { ...prev, [serviceId]: updated };
    });
  };

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    const workPayload = {
      description,
      yearsExperience,
      hasTools,
      selectedServices,
      selectedTasks,
    };

    console.log("Step 2 submit", workPayload);

    router.push({
      pathname: "/workerforms/WorkerRequiredDocsStep3",
      params: {
        personal: personal ?? "",
        work: encodeURIComponent(JSON.stringify(workPayload)),
        services: encodeURIComponent(selectedServices.join(",")),
      },
    });
  };

  const canContinue =
    selectedServices.length > 0 &&
    description.trim().length > 0 &&
    yearsExperience.trim().length > 0 &&
    hasTools !== "";

  const toolsLabel = useMemo(() => {
    if (hasTools === "yes") return "Yes, I have my own tools or equipment";
    if (hasTools === "no") return "No, I don’t have my own tools";
    return "Select Yes or No";
  }, [hasTools]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Logo header (same as Step 1) */}
      <View style={styles.header}>
        <Image
          source={require("../../image/jdklogo.png")}
          style={styles.logo}
        />
      </View>

      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.scrollInner}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Progress text */}
        <Text style={styles.progressText}>
          2 of 4 • Post a Worker Application
        </Text>

        {/* Titles */}
        <Text style={styles.stepTitle}>Step 2: Describe Your Work</Text>
        <Text style={styles.stepSubtitle}>Tell us about your work</Text>

        {/* WORK INFORMATION CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Work Information</Text>
          <Text style={styles.cardHint}>
            Select the services you offer and tell clients more about your work.
          </Text>

          {/* SERVICE TYPE SECTION */}
          <Text style={styles.sectionLabel}>Service Type</Text>
          <View style={styles.serviceGrid}>
            {SERVICE_TYPES.map(({ id, label, icon: Icon }) => {
              const active = selectedServices.includes(id);
              return (
                <TouchableOpacity
                  key={id}
                  activeOpacity={0.9}
                  style={[
                    styles.serviceChip,
                    active && styles.serviceChipActive,
                  ]}
                  onPress={() => toggleService(id)}
                >
                  <View
                    style={[
                      styles.serviceIconCircle,
                      active && styles.serviceIconCircleActive,
                    ]}
                  >
                    <Icon size={18} color={active ? BLUE : "#64748b"} />
                  </View>
                  <Text
                    style={[
                      styles.serviceChipText,
                      active && styles.serviceChipTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* TASKS FOR SELECTED SERVICES */}
          {selectedServices.length > 0 && (
            <View style={styles.tasksBlock}>
              <View style={styles.tasksHeaderRow}>
                <Text style={styles.tasksTitle}>Service Tasks</Text>
                <View style={styles.tasksLegend}>
                  <Info size={14} color="#9ca3af" />
                  <Text style={styles.tasksLegendText}>
                    Tap to select the tasks you can perform for each service
                    type.
                  </Text>
                </View>
              </View>

              {selectedServices.map((service) => {
                const tasks = SERVICE_TASKS[service] || [];
                if (!tasks.length) return null;

                const selectedForService = selectedTasks[service] || [];

                return (
                  <View key={service} style={styles.tasksGroup}>
                    <Text style={styles.tasksGroupTitle}>{service}</Text>
                    <View style={styles.tasksPillWrap}>
                      {tasks.map((task) => {
                        const active = selectedForService.includes(task);
                        return (
                          <TouchableOpacity
                            key={task}
                            activeOpacity={0.85}
                            style={[
                              styles.taskPill,
                              active && styles.taskPillActive,
                            ]}
                            onPress={() => toggleTask(service, task)}
                          >
                            <Text
                              style={[
                                styles.taskPillText,
                                active && styles.taskPillTextActive,
                              ]}
                            >
                              {task}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* SERVICE DESCRIPTION */}
          <Text style={[styles.sectionLabel, { marginTop: 16 }]}>
            Service Description
          </Text>
          <View style={styles.textareaWrap}>
            <TextInput
              value={description}
              onChangeText={setDescription}
              style={styles.textarea}
              multiline
              placeholder="Describe the service you offer"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Years of Experience */}
          <Text style={styles.sectionLabel}>Years of Experience *</Text>
          <View style={styles.inputWrap}>
            <TextInput
              value={yearsExperience}
              onChangeText={setYearsExperience}
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter years of experience"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Tools / Equipment dropdown */}
          <Text style={styles.sectionLabel}>
            Do you have your own tools or equipment? *
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.inputWrap}
            onPress={() => setToolsModalOpen(true)}
          >
            <Text
              style={[
                styles.dropdownText,
                hasTools === "" && styles.dropdownPlaceholder,
              ]}
            >
              {toolsLabel}
            </Text>
            <Text style={styles.chevron}>▾</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom buttons */}
        <View style={styles.bottomRow}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.backBtn}
            onPress={handleBack}
          >
            <Text style={styles.backBtnText}>Back: Personal Information</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.nextBtn, !canContinue && { opacity: 0.6 }]}
            disabled={!canContinue}
            onPress={handleNext}
          >
            <Text style={styles.nextBtnText}>Next: Required Documents</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 18 }} />
      </ScrollView>

      {/* Tools Yes/No modal */}
      <Modal
        visible={toolsModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setToolsModalOpen(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalBackdrop}
          onPress={() => setToolsModalOpen(false)}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Do you have your own tools?</Text>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.modalItem}
              onPress={() => {
                setHasTools("yes");
                setToolsModalOpen(false);
              }}
            >
              <Text style={styles.modalItemText}>
                Yes, I have my own tools or equipment
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.modalItem}
              onPress={() => {
                setHasTools("no");
                setToolsModalOpen(false);
              }}
            >
              <Text style={styles.modalItemText}>
                No, I don’t have my own tools
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
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

  sectionLabel: {
    marginTop: 8,
    marginBottom: 6,
    fontSize: 13,
    fontWeight: "900",
    color: "#0f172a",
  },

  // Service type chips
  serviceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  serviceChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  serviceChipActive: {
    borderColor: BLUE,
    backgroundColor: "#e0f2fe",
  },
  serviceIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  serviceIconCircleActive: {
    borderColor: "#bfdbfe",
    backgroundColor: "#eff6ff",
  },
  serviceChipText: {
    fontSize: 12.5,
    fontWeight: "800",
    color: "#374151",
  },
  serviceChipTextActive: {
    color: BLUE,
  },

  tasksBlock: {
    marginTop: 16,
    borderRadius: 14,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
  },
  tasksHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 4,
  },
  tasksTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0f172a",
  },
  tasksLegend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  tasksLegendText: {
    fontSize: 11,
    color: "#9ca3af",
  },
  tasksGroup: {
    marginTop: 8,
  },
  tasksGroupTitle: {
    fontSize: 12.5,
    fontWeight: "800",
    color: "#1f2933",
    marginBottom: 6,
  },
  tasksPillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  taskPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#e5f0ff",
  },
  taskPillActive: {
    backgroundColor: BLUE,
  },
  taskPillText: {
    fontSize: 11.5,
    color: "#1e293b",
    fontWeight: "600",
  },
  taskPillTextActive: {
    color: "#ffffff",
  },

  // Text + inputs
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
    height: 54,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
  },

  textareaWrap: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 110,
  },
  textarea: {
    fontSize: 14,
    color: "#111827",
    textAlignVertical: "top",
  },

  dropdownText: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
  },
  dropdownPlaceholder: {
    color: "#9ca3af",
  },
  chevron: {
    fontSize: 16,
    fontWeight: "900",
    color: "#9ca3af",
    marginLeft: 6,
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

  // Tools modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.4)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 10,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  modalItemText: {
    fontSize: 14,
    color: "#111827",
  },
});
