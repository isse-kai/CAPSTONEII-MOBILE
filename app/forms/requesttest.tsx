import AsyncStorage from '@react-native-async-storage/async-storage'
import { Pressable, Text, TextInput, View } from 'dripsy'
import * as ImagePicker from 'expo-image-picker'
import { useRouter, type Href } from 'expo-router'
import {
    ArrowLeft,
    Facebook,
    Instagram,
    Linkedin,
    Plus,
    Search,
} from 'lucide-react-native'
import React, { useEffect, useMemo, useState } from 'react'
import {
    ActivityIndicator,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
} from 'react-native'

const { width } = Dimensions.get('window')
const LOGO = require('../../assets/jdklogo.png')

const STORAGE_KEY = 'request_step1'
const NEXT_ROUTE = '/home/home' as Href

const ALL_BARANGAYS = [
  'Alijis', 'Banago', 'Bata', 'Cabug', 'Estefania', 'Felisa', 'Granada',
  'Handumanan', 'Mandalagan', 'Mansilingan', 'Montevista', 'Pahanocoy',
  'Singcang-Airport', 'Sum-ag', 'Taculing',
]

const isEmail = (s: string) => /\S+@\S+\.\S+/.test(s)
const isPhonePH = (s: string) => /^\d{10,11}$/.test(s.replace(/\D/g, ''))

export default function RequestClientInfo() {
  const router = useRouter()

  const [first, setFirst] = useState<string>('')
  const [last, setLast] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [brgy, setBrgy] = useState<string | null>(null)
  const [street, setStreet] = useState<string>('')
  const [addr, setAddr] = useState<string>('')
  const [fb, setFb] = useState<string>('')
  const [ig, setIg] = useState<string>('')
  const [li, setLi] = useState<string>('')
  const [photo, setPhoto] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY)
        if (raw) {
          const v = JSON.parse(raw)
          setFirst(v.first ?? '')
          setLast(v.last ?? '')
          setPhone(v.phone ?? '')
          setEmail(v.email ?? '')
          setBrgy(v.brgy ?? null)
          setStreet(v.street ?? '')
          setAddr(v.addr ?? '')
          setFb(v.fb ?? '')
          setIg(v.ig ?? '')
          setLi(v.li ?? '')
          setPhoto(v.photo ?? null)
        }
      } catch {}
    })()
  }, [])

  const [showBrgy, setShowBrgy] = useState(false)
  const [brgyQuery, setBrgyQuery] = useState('')
  const filteredBarangays = useMemo(
    () =>
      brgyQuery
        ? ALL_BARANGAYS.filter((b) =>
            b.toLowerCase().includes(brgyQuery.toLowerCase())
          )
        : ALL_BARANGAYS,
    [brgyQuery]
  )

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') return
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      aspect: [1, 1],
      allowsEditing: true,
    })
    if (!res.canceled && res.assets?.[0]?.uri) setPhoto(res.assets[0].uri)
  }

  const isComplete = useMemo(
    () =>
      first.trim().length > 1 &&
      last.trim().length > 1 &&
      isPhonePH(phone) &&
      isEmail(email) &&
      !!brgy &&
      street.trim().length > 2 &&
      addr.trim().length > 2,
    [first, last, phone, email, brgy, street, addr]
  )

  const [saving, setSaving] = useState(false)
  const onNext = async () => {
    if (!isComplete) return
    try {
      setSaving(true)
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          first,
          last,
          phone,
          email,
          brgy,
          street,
          addr,
          fb,
          ig,
          li,
          photo,
        })
      )
      router.push(NEXT_ROUTE)
    } finally {
      setSaving(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        {/* Header */}
        <View
          sx={{
            px: 3,
            pt: 2,
            pb: 2,
            borderBottomWidth: 1,
            borderBottomColor: '#eef2f7',
            position: 'relative',
          }}
        >
          <View
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 4,
              alignItems: 'center',
            }}
            pointerEvents="none"
          >
            <Image
              source={LOGO}
              style={{
                width: Math.min(width * 0.78, 340),
                height: 66,
                resizeMode: 'contain',
              }}
            />
          </View>

          <Pressable
            onPress={() => router.back()}
            sx={{
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowLeft color="#0f172a" size={26} strokeWidth={2.4} />
          </Pressable>
        </View>

        {/* Content */}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 12, paddingTop: 12 }}
        >
          <Text sx={{ color: 'sub', fontSize: 12, mb: 2 }}>
            1 of 4 | Post a Service Request
          </Text>
          <Text sx={{ color: 'text', fontSize: 24, fontWeight: 'bold', mb: 3 }}>
            Step 1: Client Information
          </Text>

          {/* Personal Info */}
          <Text sx={{ color: 'text', fontSize: 18, fontWeight: 'bold' }}>
            Personal Information
          </Text>
          <Text sx={{ color: 'sub', mt: 1, mb: 3 }}>
            Please fill in your personal details to proceed.
          </Text>

          <View sx={{ flexDirection: 'row', gap: 2 }}>
            <View sx={{ flex: 1 }}>
              <Text sx={{ color: 'text', fontWeight: 'bold', mb: 2 }}>
                First Name
              </Text>
              <TextInput
                value={first}
                onChangeText={setFirst}
                placeholder="First Name"
                placeholderTextColor="placeholder"
                sx={{
                  bg: 'fieldBg',
                  borderWidth: 1,
                  borderColor: 'border',
                  borderRadius: 10,
                  px: 3,
                  py: 3,
                  color: 'text',
                }}
              />
            </View>
            <View sx={{ flex: 1 }}>
              <Text sx={{ color: 'text', fontWeight: 'bold', mb: 2 }}>
                Last Name
              </Text>
              <TextInput
                value={last}
                onChangeText={setLast}
                placeholder="Last Name"
                placeholderTextColor="placeholder"
                sx={{
                  bg: 'fieldBg',
                  borderWidth: 1,
                  borderColor: 'border',
                  borderRadius: 10,
                  px: 3,
                  py: 3,
                  color: 'text',
                }}
              />
            </View>
          </View>

          {/* Contact / Email */}
          <View sx={{ flexDirection: 'row', gap: 2, mt: 3 }}>
            <View sx={{ flex: 1 }}>
              <Text sx={{ color: 'text', fontWeight: 'bold', mb: 2 }}>
                Contact Number
              </Text>
              <View
                sx={{
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderColor: 'border',
                  borderRadius: 10,
                  bg: 'fieldBg',
                  alignItems: 'center',
                }}
              >
                <View
                  sx={{
                    px: 2,
                    py: 3,
                    borderRightWidth: 1,
                    borderRightColor: 'border',
                    bg: 'white',
                  }}
                >
                  <Text sx={{ color: 'text' }}>🇵🇭 +63</Text>
                </View>
                <TextInput
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Mobile Number"
                  placeholderTextColor="placeholder"
                  sx={{
                    flex: 1,
                    px: 3,
                    py: 3,
                    color: 'text',
                  }}
                />
              </View>
            </View>

            <View sx={{ flex: 1 }}>
              <Text sx={{ color: 'text', fontWeight: 'bold', mb: 2 }}>
                Email Address
              </Text>
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                placeholder="Email Address"
                placeholderTextColor="placeholder"
                sx={{
                  bg: 'fieldBg',
                  borderWidth: 1,
                  borderColor: 'border',
                  borderRadius: 10,
                  px: 3,
                  py: 3,
                  color: 'text',
                }}
              />
            </View>
          </View>

          {/* Barangay / Street */}
          <View sx={{ flexDirection: 'row', gap: 2, mt: 3 }}>
            <View sx={{ flex: 1 }}>
              <Text sx={{ color: 'text', fontWeight: 'bold', mb: 2 }}>
                Barangay
              </Text>
              <Pressable onPress={() => setShowBrgy(true)}>
                <View
                  sx={{
                    bg: 'fieldBg',
                    borderWidth: 1,
                    borderColor: 'border',
                    borderRadius: 10,
                    px: 3,
                    py: 3,
                  }}
                >
                  <Text sx={{ color: brgy ? 'text' : 'placeholder' }}>
                    {brgy || 'Select Barangay'}
                  </Text>
                </View>
              </Pressable>
            </View>

            <View sx={{ flex: 1 }}>
              <Text sx={{ color: 'text', fontWeight: 'bold', mb: 2 }}>
                Street
              </Text>
              <TextInput
                value={street}
                onChangeText={setStreet}
                placeholder="House No. and Street"
                placeholderTextColor="placeholder"
                sx={{
                  bg: 'fieldBg',
                  borderWidth: 1,
                  borderColor: 'border',
                  borderRadius: 10,
                  px: 3,
                  py: 3,
                  color: 'text',
                }}
              />
            </View>
          </View>

          {/* Additional Address */}
          <View sx={{ mt: 3 }}>
            <Text sx={{ color: 'text', fontWeight: 'bold', mb: 2 }}>
              Additional Address (Landmark etc.)
            </Text>
            <TextInput
              value={addr}
              onChangeText={setAddr}
              placeholder="Additional Address (Required)"
              placeholderTextColor="placeholder"
              multiline
              sx={{
                bg: 'fieldBg',
                borderWidth: 1,
                borderColor: 'border',
                borderRadius: 10,
                px: 3,
                py: 3,
                minHeight: 84,
                color: 'text',
                textAlignVertical: 'top',
              }}
            />
          </View>

          {/* Profile Picture */}
          <View sx={{ mt: 4 }}>
            <Text sx={{ color: 'text', fontSize: 18, fontWeight: 'bold', mb: 2 }}>
              Profile Picture
            </Text>
            <Text sx={{ color: 'sub', mb: 3 }}>
              Upload your profile picture.
            </Text>

            <View sx={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Pressable onPress={pickImage}>
                <View
                  sx={{
                    width: 110,
                    height: 110,
                    borderRadius: 55,
                    borderWidth: 1,
                    borderColor: 'border',
                    bg: '#f1f5f9',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {photo ? (
                    <Image
                      source={{ uri: photo }}
                      style={{ width: '100%', height: '100%' }}
                    />
                  ) : (
                    <Plus color="#94a3b8" size={28} strokeWidth={2.6} />
                  )}
                </View>
              </Pressable>

              <Pressable
                onPress={pickImage}
                sx={{
                  px: 3,
                  py: 2,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: 'border',
                  bg: '#fff',
                }}
              >
                <Text sx={{ color: 'text', fontWeight: 'bold' }}>Choose Photo</Text>
              </Pressable>
            </View>
          </View>

          {/* Social Media */}
          <View sx={{ mt: 4 }}>
            <Text sx={{ color: 'text', fontSize: 18, fontWeight: 'bold', mb: 2 }}>
              Social Media
            </Text>
            <Text sx={{ color: 'sub', mb: 3 }}>
              Please provide your social media links (For reference).
            </Text>

            {/* Facebook */}
            <View sx={{ flexDirection: 'row', alignItems: 'center', gap: 2, mb: 3 }}>
              <Facebook color="#1877F2" size={18} strokeWidth={2.2} />
              <TextInput
                value={fb}
                onChangeText={setFb}
                placeholder="Facebook Link"
                placeholderTextColor="placeholder"
                autoCapitalize="none"
                sx={{
                  flex: 1,
                  bg: 'fieldBg',
                  borderWidth: 1,
                  borderColor: 'border',
                  borderRadius: 10,
                  px: 3,
                  py: 2,
                  color: 'text',
                }}
              />
            </View>

            {/* Instagram */}
            <View sx={{ flexDirection: 'row', alignItems: 'center', gap: 2, mb: 3 }}>
              <Instagram color="#E1306C" size={18} strokeWidth={2.2} />
              <TextInput
                value={ig}
                onChangeText={setIg}
                placeholder="Instagram Link"
                placeholderTextColor="placeholder"
                autoCapitalize="none"
                sx={{
                  flex: 1,
                  bg: 'fieldBg',
                  borderWidth: 1,
                  borderColor: 'border',
                  borderRadius: 10,
                  px: 3,
                  py: 2,
                  color: 'text',
                }}
              />
            </View>

            {/* LinkedIn */}
            <View sx={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <Linkedin color="#0A66C2" size={18} strokeWidth={2.2} />
              <TextInput
                value={li}
                onChangeText={setLi}
                placeholder="LinkedIn Link"
                placeholderTextColor="placeholder"
                autoCapitalize="none"
                sx={{
                  flex: 1,
                  bg: 'fieldBg',
                  borderWidth: 1,
                  borderColor: 'border',
                  borderRadius: 10,
                  px: 3,
                  py: 2,
                  color: 'text',
                }}
              />
            </View>
          </View>
        </ScrollView>

        {/* Sticky Next Button */}
        <View
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            px: 3,
            py: 3,
            bg: 'white',
            borderTopWidth: 1,
            borderTopColor: '#eef2f7',
          }}
        >
          <Pressable
            disabled={!isComplete || saving}
            onPress={onNext}
            sx={{
              py: 3,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              bg: !isComplete || saving ? '#a7c8ff' : 'blue',
            }}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text sx={{ color: 'white', fontWeight: 'bold' }}>Next</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {/* Barangay Modal */}
      <Modal
        visible={showBrgy}
        animationType="slide"
        transparent
        onRequestClose={() => setShowBrgy(false)}
      >
        <Pressable
          onPress={() => setShowBrgy(false)}
          sx={{ flex: 1, bg: 'rgba(0,0,0,0.25)' }}
        >
          <View
            sx={{
              mt: 'auto',
              bg: 'white',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: '70%',
              p: 3,
            }}
            pointerEvents="box-none"
          >
            <Text sx={{ color: 'text', fontWeight: 'bold', fontSize: 16, mb: 2 }}>
              Select Barangay
            </Text>

            <View
              sx={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'border',
                borderRadius: 999,
                px: 2,
                height: 36,
                mb: 2,
              }}
            >
              <Search color="#7b8aa0" size={18} strokeWidth={2.2} />
              <TextInput
                value={brgyQuery}
                onChangeText={setBrgyQuery}
                placeholder="Search barangay"
                placeholderTextColor="placeholder"
                sx={{
                  flex: 1,
                  px: 2,
                  py: 0,
                  color: 'text',
                }}
              />
            </View>

            <ScrollView>
              {filteredBarangays.map((b) => (
                <Pressable
                  key={b}
                  onPress={() => {
                    setBrgy(b)
                    setShowBrgy(false)
                  }}
                  sx={{
                    py: 3,
                    borderBottomWidth: 1,
                    borderBottomColor: '#eef2f7',
                  }}
                >
                  <Text sx={{ color: 'text' }}>{b}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  )
}