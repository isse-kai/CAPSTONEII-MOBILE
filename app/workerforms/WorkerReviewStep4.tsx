import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle2, FileText, Hammer, MapPin } from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const BLUE = '#1E88E5';

type PersonalInfo = {
  firstName: string;
  lastName: string;
  birthdate: string;
  age: string;
  phone: string;
  email: string;
  barangay: string;
  street: string;
};

type WorkInfo = {
  description: string;
  yearsExperience: string;
  hasTools: 'yes' | 'no' | '';
  selectedServices: string[];
  selectedTasks: Record<string, string[]>;
};

function parsePersonalInfo(raw?: string): PersonalInfo {
  const fallback: PersonalInfo = {
    firstName: '',
    lastName: '',
    birthdate: '',
    age: '',
    phone: '',
    email: '',
    barangay: '',
    street: '',
  };

  if (!raw) return fallback;
  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return fallback;
  }
}

function parseWorkInfo(raw?: string): WorkInfo {
  const fallback: WorkInfo = {
    description: '',
    yearsExperience: '',
    hasTools: '',
    selectedServices: [],
    selectedTasks: {},
  };

  if (!raw) return fallback;
  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return fallback;
  }
}

export default function WorkerReviewStep4() {
  const router = useRouter();
  const { personal, work, services } = useLocalSearchParams<{
    personal?: string;
    work?: string;
    services?: string;
  }>();

  const personalInfo = useMemo(() => parsePersonalInfo(personal), [personal]);
  const workInfo = useMemo(() => parseWorkInfo(work), [work]);

  const selectedServices = useMemo(() => {
    if (workInfo.selectedServices && workInfo.selectedServices.length > 0) {
      return workInfo.selectedServices;
    }
    if (!services) return [];
    try {
      return decodeURIComponent(services)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    } catch {
      return [];
    }
  }, [workInfo.selectedServices, services]);

  const hasToolsLabel =
    workInfo.hasTools === 'yes'
      ? 'Yes, I have my own tools or equipment'
      : workInfo.hasTools === 'no'
      ? 'No, I don’t have my own tools'
      : 'Not specified';

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = () => {
    console.log('Submit worker application', {
      personalInfo,
      selectedServices,
      workInfo,
    });

    // ✅ Go to success screen instead of going back to WorkerPage
    router.replace('/workerpage/workerpage');
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Logo header */}
      <View style={styles.header}>
        <Image
          source={require('../../image/jdklogo.png')}
          style={styles.logo}
        />
      </View>

      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress text */}
        <Text style={styles.progressText}>4 of 4 • Post a Worker Application</Text>

        {/* Titles */}
        <Text style={styles.stepTitle}>Step 4: Review & Submit</Text>
        <Text style={styles.stepSubtitle}>
          Please review your information before submitting.
        </Text>

        {/* PERSONAL INFO CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Personal Information</Text>
            <View style={styles.statusPill}>
              <CheckCircle2 size={16} color={BLUE} />
              <Text style={styles.statusPillText}>From your account details</Text>
            </View>
          </View>

          {/* Name */}
          <View style={styles.row}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>First Name</Text>
              <Text style={styles.value}>{personalInfo.firstName || '—'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Last Name</Text>
              <Text style={styles.value}>{personalInfo.lastName || '—'}</Text>
            </View>
          </View>

          {/* Birthdate / Age */}
          <View style={styles.row}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Birthdate</Text>
              <Text style={styles.value}>{personalInfo.birthdate || '—'}</Text>
            </View>
            <View style={styles.infoItemSmall}>
              <Text style={styles.label}>Age</Text>
              <Text style={styles.value}>{personalInfo.age || '—'}</Text>
            </View>
          </View>

          {/* Contact / Email */}
          <View style={styles.row}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Contact Number</Text>
              <Text style={styles.value}>{personalInfo.phone || '—'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Email Address</Text>
              <Text style={styles.value}>{personalInfo.email || '—'}</Text>
            </View>
          </View>
        </View>

        {/* ADDRESS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Address</Text>
            <MapPin size={18} color={BLUE} />
          </View>

          <View style={styles.row}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Barangay</Text>
              <Text style={styles.value}>{personalInfo.barangay || '—'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Street</Text>
              <Text style={styles.value}>{personalInfo.street || '—'}</Text>
            </View>
          </View>
        </View>

        {/* WORK INFO CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Work Information</Text>
            <Hammer size={18} color={BLUE} />
          </View>

          {/* Services */}
          <Text style={styles.sectionLabel}>Service Type</Text>
          {selectedServices.length > 0 ? (
            <View style={styles.serviceChipWrap}>
              {selectedServices.map((service) => (
                <View key={service} style={styles.serviceChip}>
                  <Text style={styles.serviceChipText}>{service}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.valueMuted}>No service type selected</Text>
          )}

          {/* Tasks */}
          {selectedServices.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, { marginTop: 12 }]}>
                Service Tasks
              </Text>
              {selectedServices.map((service) => {
                const tasks = workInfo.selectedTasks[service] || [];
                if (!tasks.length) return null;

                return (
                  <View key={service} style={styles.tasksGroup}>
                    <Text style={styles.tasksGroupTitle}>{service}</Text>
                    <View style={styles.tasksPillWrap}>
                      {tasks.map((task) => (
                        <View key={task} style={styles.taskPill}>
                          <Text style={styles.taskPillText}>{task}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                );
              })}
            </>
          )}

          {/* Description */}
          <Text style={[styles.sectionLabel, { marginTop: 12 }]}>
            Service Description
          </Text>
          <View style={styles.readonlyBox}>
            <Text style={workInfo.description ? styles.value : styles.valueMuted}>
              {workInfo.description || 'No description provided.'}
            </Text>
          </View>

          {/* Experience */}
          <Text style={[styles.sectionLabel, { marginTop: 12 }]}>
            Years of Experience
          </Text>
          <Text style={styles.value}>
            {workInfo.yearsExperience
              ? `${workInfo.yearsExperience} year(s)`
              : 'Not specified'}
          </Text>

          {/* Tools */}
          <Text style={[styles.sectionLabel, { marginTop: 12 }]}>
            Tools / Equipment
          </Text>
          <Text style={styles.value}>{hasToolsLabel}</Text>
        </View>

        {/* DOCUMENTS SUMMARY CARD (no actual files shown) */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Documents</Text>
            <FileText size={18} color={BLUE} />
          </View>

          <Text style={styles.documentsText}>
            Your uploaded documents from <Text style={styles.bold}>Step 3</Text>{' '}
            (IDs, clearances, proof of address, TESDA certificates) are attached
            to this application. For security and privacy, file previews are not
            shown here.
          </Text>
        </View>

        {/* BOTTOM BUTTONS */}
        <View style={styles.bottomRow}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.backBtn}
            onPress={handleBack}
          >
            <Text style={styles.backBtnText}>Back: Required Documents</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.submitBtn}
            onPress={handleSubmit}
          >
            <Text style={styles.submitBtnText}>Submit Application</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 18 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 6,
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
  },
  logo: {
    width: 190,
    height: 42,
    resizeMode: 'contain',
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
    color: '#6b7280',
    marginBottom: 6,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
  },
  stepSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },

  card: {
    marginTop: 14,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    padding: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0f172a',
  },

  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#e0f2fe',
  },
  statusPillText: {
    marginLeft: 6,
    fontSize: 11,
    fontWeight: '800',
    color: BLUE,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  infoItem: {
    flex: 1,
  },
  infoItemSmall: {
    width: 90,
  },

  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6b7280',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  valueMuted: {
    fontSize: 13,
    color: '#9ca3af',
  },

  sectionLabel: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '900',
    color: '#0f172a',
  },

  serviceChipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  serviceChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#e0f2fe',
  },
  serviceChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: BLUE,
  },

  tasksGroup: {
    marginTop: 8,
  },
  tasksGroupTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1f2933',
    marginBottom: 4,
  },
  tasksPillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  taskPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#e5f0ff',
  },
  taskPillText: {
    fontSize: 11.5,
    color: '#1e293b',
    fontWeight: '600',
  },

  readonlyBox: {
    marginTop: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  documentsText: {
    marginTop: 4,
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 19,
  },
  bold: {
    fontWeight: '800',
    color: '#374151',
  },

  bottomRow: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 12,
  },
  backBtn: {
    flex: 1,
    height: 52,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#374151',
  },
  submitBtn: {
    flex: 1,
    height: 52,
    borderRadius: 999,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#ffffff',
  },
});
