// app/home/index.tsx
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'dripsy'
import { BlurView } from 'expo-blur'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Dimensions, Platform } from 'react-native'

const LOGO = require('../../assets/jdklogo.png')
const { height } = Dimensions.get('window')

const categories = [
  { id: '1', name: 'Plumbing', icon: '🚰' },
  { id: '2', name: 'Electrical', icon: '💡' },
  { id: '3', name: 'Cleaning', icon: '🧼' },
  { id: '4', name: 'Laundry', icon: '👕' },
  { id: '5', name: 'Mechanic', icon: '🛠️' },
  { id: '6', name: 'Carpentry', icon: '🪚' },
]

const pros = [
  { id: 'p1', name: 'Juan D.', role: 'Plumber', rating: 4.9, jobs: 120, price: '₱500/hr', time: '1h response' },
  { id: 'p2', name: 'Maria S.', role: 'Electrician', rating: 4.8, jobs: 98, price: '₱600/hr', time: '~2h response' },
  { id: 'p3', name: 'Carlo T.', role: 'Cleaner', rating: 4.7, jobs: 140, price: '₱350/hr', time: 'Fast response' },
]

export default function ClientHome() {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const anyOpen = showMenu || showProfile

  const closeAll = () => { setShowMenu(false); setShowProfile(false) }

  const Row = ({ children }: any) => (
    <View sx={{ paddingVertical: 10 }}>{children}</View>
  )
  const Divider = () => <View sx={{ height: 1, bg: 'rgba(255,255,255,0.08)', my: 6 }} />

  const MenuItem = ({ title, onPress, icon }: { title: string; onPress?: () => void; icon?: string }) => (
    <Pressable onPress={onPress ?? closeAll} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
      <Row>
        <View sx={{ flexDirection: 'row', alignItems: 'center' }}>
          {!!icon && <Text sx={{ color: '#cfe6ff', mr: 2 }}>{icon}</Text>}
          <Text sx={{ color: '#e7f1ff', fontWeight: '700' }}>{title}</Text>
        </View>
      </Row>
    </Pressable>
  )

  return (
    <View sx={{ flex: 1, bg: '#0b1220' }}>
      {/* TOP BAR */}
      <View sx={{ position: 'absolute', top: Platform.OS === 'ios' ? 10 : 0, left: 14, right: 14, zIndex: 50 }}>
        <BlurView intensity={50} tint="dark" style={{ borderRadius: 18, paddingVertical: 10, paddingHorizontal: 12 }}>
          <View sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Hamburger */}
            <Pressable onPress={() => { setShowMenu(v => !v); setShowProfile(false) }} hitSlop={10}>
              <View sx={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', bg: 'rgba(255,255,255,0.08)' }}>
                <Text sx={{ color: '#e7f1ff', fontSize: 16 }}>☰</Text>
              </View>
            </Pressable>

            {/* Center Logo */}
            <View sx={{ alignItems: 'center' }}>
              <Image source={LOGO} style={{ width: 32, height: 32 }} resizeMode="contain" />
              <Text sx={{ color: 'white', fontSize: 12, fontWeight: '700', mt: 4 }}>JDK Homecare</Text>
            </View>

            {/* Profile */}
            <Pressable onPress={() => { setShowProfile(v => !v); setShowMenu(false) }} hitSlop={10}>
              <View sx={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', bg: 'rgba(255,255,255,0.08)' }}>
                <Text sx={{ color: '#e7f1ff', fontSize: 16 }}>🙂</Text>
              </View>
            </Pressable>
          </View>
        </BlurView>
      </View>

      {/* BACKDROP BLUR when dropdowns are open */}
      {anyOpen && (
        <BlurView
          intensity={20}
          tint="dark"
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 40 }}
        >
          <Pressable onPress={closeAll} style={{ flex: 1 }} />
        </BlurView>
      )}

      {/* HAMBURGER DROPDOWN (glassy + caret) */}
      {showMenu && (
        <View sx={{ position: 'absolute', top: Platform.OS === 'ios' ? 62 : 52, left: 14, zIndex: 60 }}>
          <View sx={{ alignItems: 'flex-start', mb: 6, ml: 14 }}>
            <Text sx={{ color: 'rgba(255,255,255,0.4)' }}>▲</Text>
          </View>
          <BlurView intensity={55} tint="dark" style={{ borderRadius: 16, padding: 12, width: 230, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' }}>
            <Text sx={{ color: '#9fb4cc', fontSize: 12, fontWeight: '800', mb: 6 }}>MENU</Text>
            <Divider />
            <MenuItem title="Book" icon="📅" />
            <MenuItem title="Dashboard" icon="📊" />
            <MenuItem title="Browse Categories" icon="🗂️" />
            <MenuItem title="Report" icon="📝" />
            <MenuItem title="Help" icon="🆘" />
          </BlurView>
        </View>
      )}

      {/* PROFILE DROPDOWN (glassy + caret) */}
      {showProfile && (
        <View sx={{ position: 'absolute', top: Platform.OS === 'ios' ? 62 : 52, right: 14, zIndex: 60 }}>
          <View sx={{ alignItems: 'flex-end', mb: 6, mr: 14 }}>
            <Text sx={{ color: 'rgba(255,255,255,0.4)' }}>▲</Text>
          </View>
          <BlurView intensity={55} tint="dark" style={{ borderRadius: 16, padding: 12, width: 200, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' }}>
            <Text sx={{ color: '#9fb4cc', fontSize: 12, fontWeight: '800', mb: 6 }}>ACCOUNT</Text>
            <Divider />
            <MenuItem title="View Profile" icon="👤" />
            <MenuItem title="Log Out" icon="🚪" onPress={() => { closeAll(); /* TODO: hook logout */ }} />
          </BlurView>
        </View>
      )}

      <ScrollView contentContainerStyle={{ paddingTop: 110, paddingBottom: 120, minHeight: height * 1.05 }} showsVerticalScrollIndicator={false}>
        {/* Search / Hero */}
        <Pad>
          <Glass>
            <Text sx={{ color: 'white', fontSize: 22, fontWeight: '800', mb: 3 }}>Find Trusted Pros</Text>
            <View sx={{ flexDirection: 'row', alignItems: 'center', bg: 'rgba(255,255,255,0.08)', borderRadius: 12, px: 12, py: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
              <Text sx={{ color: '#9cc8ff', mr: 2 }}>🔎</Text>
              <TextInput placeholder="Search services (e.g., electrician)" placeholderTextColor="#9fb4cc" style={{ flex: 1, color: 'white', fontSize: 14 }} />
              <Pressable><Text sx={{ color: '#cfe6ff', fontWeight: '700' }}>Go</Text></Pressable>
            </View>
            <View sx={{ flexDirection: 'row', mt: 12, gap: 8 }}>
              {['Book Now', 'Schedule', 'Reorder'].map((a) => <Chip key={a} label={a} />)}
            </View>
          </Glass>
        </Pad>

        {/* Categories */}
        <Pad>
          <SectionTitle title="Browse Categories" />
          <View sx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {categories.map((c) => (
              <Pressable key={c.id}>
                <BlurView intensity={35} tint="dark" style={tile}>
                  <Text sx={{ fontSize: 22 }}>{c.icon}</Text>
                  <Text sx={{ color: 'white', fontWeight: '700', mt: 2 }}>{c.name}</Text>
                </BlurView>
              </Pressable>
            ))}
          </View>
        </Pad>

        {/* Featured Pros (carousel) */}
        <Pad>
          <SectionTitle title="Top Rated Nearby" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View sx={{ flexDirection: 'row', gap: 12, pr: 16 }}>
              {pros.map((p) => (
                <Pressable key={p.id}>
                  <BlurView intensity={35} tint="dark" style={proCard}>
                    <View sx={{ width: 48, height: 48, borderRadius: 24, bg: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                      <Text sx={{ color: 'white', fontSize: 16 }}>{p.name[0]}</Text>
                    </View>
                    <Text sx={{ color: 'white', fontWeight: '700', fontSize: 14 }}>{p.name}</Text>
                    <Text sx={{ color: '#b7c8db', fontSize: 12 }}>{p.role}</Text>
                    <View sx={{ flexDirection: 'row', alignItems: 'center', mt: 2 }}>
                      <Text sx={{ color: '#ffd166' }}>★</Text>
                      <Text sx={{ color: '#d9e6f2', ml: 2, fontSize: 12 }}>{p.rating} · {p.jobs} jobs</Text>
                    </View>
                    <View sx={{ flexDirection: 'row', mt: 6, gap: 6 }}>
                      <Pill>{p.price}</Pill><Pill>{p.time}</Pill>
                    </View>
                    <Pressable>
                      <View sx={{ mt: 10, bg: 'rgba(104,162,255,0.25)', borderRadius: 12, py: 8, px: 14, borderWidth: 1, borderColor: 'rgba(156,200,255,0.35)' }}>
                        <Text sx={{ color: '#d9ecff', fontWeight: '800', fontSize: 12 }}>View Profile</Text>
                      </View>
                    </Pressable>
                  </BlurView>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </Pad>

        {/* Workers list (placeholders) */}
        <Pad>
          <SectionTitle title="Available Now (Placeholders)" />
          <View sx={{ gap: 10 }}>
            {pros.concat(pros).map((p, i) => (
              <BlurView key={p.id + i} intensity={25} tint="dark" style={{ borderRadius: 16, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
                <View sx={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View sx={{ width: 40, height: 40, borderRadius: 20, bg: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', mr: 10 }}>
                    <Text sx={{ color: 'white' }}>{p.name[0]}</Text>
                  </View>
                  <View sx={{ flex: 1 }}>
                    <Text sx={{ color: 'white', fontWeight: '700' }}>{p.name} • <Text sx={{ color: '#b7c8db' }}>{p.role}</Text></Text>
                    <Text sx={{ color: '#9fb4cc', fontSize: 12 }}>★ {p.rating} · {p.jobs} jobs · {p.price}</Text>
                  </View>
                  <Pressable><Text sx={{ color: '#9cc8ff', fontWeight: '800' }}>Book</Text></Pressable>
                </View>
              </BlurView>
            ))}
          </View>
        </Pad>

        {/* Footer Info */}
        <Pad>
          <Glass>
            <Text sx={{ color: 'white', fontWeight: '800', mb: 8 }}>About JDK Homecare</Text>
            <Text sx={{ color: '#b7c8db', fontSize: 12, lineHeight: 18 }}>
              JDK connects clients with trusted local professionals for home services. Browse, compare, and book securely.
            </Text>
            <View sx={{ flexDirection: 'row', gap: 8, mt: 12, flexWrap: 'wrap' }}>
              <FooterBtn title="Safety Tips" />
              <FooterBtn title="Help & Support" />
              <FooterBtn title="Contact Us" />
            </View>
            <View sx={{ flexDirection: 'row', gap: 12, mt: 12 }}>
              <Text sx={{ color: '#9fb4cc', fontSize: 12 }}>Privacy</Text>
              <Text sx={{ color: '#9fb4cc', fontSize: 12 }}>Terms</Text>
              <Text sx={{ color: '#9fb4cc', fontSize: 12 }}>v0.1.0</Text>
            </View>
          </Glass>
        </Pad>
      </ScrollView>

      {/* Bottom nav */}
      <View sx={{ position: 'absolute', left: 14, right: 14, bottom: 14 }}>
        <BlurView intensity={45} tint="dark" style={{ borderRadius: 18, padding: 12 }}>
          <View sx={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <Text sx={{ color: '#e7f1ff', fontWeight: '800' }}>Client</Text>
            <Pressable onPress={() => router.push('/home/home')}>
              <Text sx={{ color: '#9cc8ff', fontWeight: '800' }}>Worker</Text>
            </Pressable>
          </View>
        </BlurView>
      </View>
    </View>
  )
}

/* Mini components */
const Pad = ({ children }: any) => <View sx={{ px: 16, mb: 16 }}>{children}</View>
const Glass = ({ children }: any) => (
  <BlurView intensity={40} tint="dark" style={{ padding: 16, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
    {children}
  </BlurView>
)
const SectionTitle = ({ title }: { title: string }) => (
  <Text sx={{ color: 'white', fontWeight: '800', mb: 10 }}>{title}</Text>
)
const Chip = ({ label }: { label: string }) => (
  <Pressable>
    <BlurView intensity={28} tint="dark" style={{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
      <Text sx={{ color: '#e7f1ff', fontSize: 13, fontWeight: '700' }}>{label}</Text>
    </BlurView>
  </Pressable>
)
const Pill = ({ children }: any) => (
  <BlurView intensity={22} tint="dark" style={{ paddingVertical: 4, paddingHorizontal: 8, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
    <Text sx={{ color: '#cfe6ff', fontSize: 11, fontWeight: '700' }}>{children}</Text>
  </BlurView>
)
const FooterBtn = ({ title }: { title: string }) => (
  <Pressable>
    <BlurView intensity={28} tint="dark" style={{ paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
      <Text sx={{ color: '#e7f1ff', fontWeight: '800', fontSize: 12 }}>{title}</Text>
    </BlurView>
  </Pressable>
)

/* Styles for tiles/cards */
const tile: any = { width: 110, height: 90, borderRadius: 16, padding: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }
const proCard: any = { width: 184, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }
