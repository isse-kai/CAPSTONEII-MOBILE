import { Text, View } from 'dripsy'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../header'
import ClientNavbar from '../navbar'


const CurrentRequests = () => {
  return (
    <SafeAreaView>
      <Header />
      <ScrollView>
        <View sx={{ p: 16 }}>
          <Text sx={{ fontSize: 20, fontFamily: 'Poppins-Bold', mb: 12 }}>
            Current Service Requests
          </Text>

          {/* Example request card */}
          <View sx={{ bg: '#fff', p: 16, borderRadius: 12, mb: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }}>
            <Text sx={{ fontSize: 16, fontFamily: 'Poppins-Bold', mb: 4 }}>Plumbing Repair</Text>
            <Text sx={{ fontSize: 14, color: '#4b5563' }}>Scheduled: Oct 6, 10:00 AM</Text>
            <Text sx={{ fontSize: 14, color: '#4b5563' }}>Status: In Progress</Text>
          </View>
        </View>
      </ScrollView>
      <ClientNavbar />
    </SafeAreaView>
  )
}

export default CurrentRequests
