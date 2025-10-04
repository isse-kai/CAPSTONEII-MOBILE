import { Text, View } from 'dripsy'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../header'
import ClientNavbar from '../navbar'

const CompletedRequests = () => {
  return (
    <SafeAreaView>
      <Header />
      <ScrollView>
        <View sx={{ p: 16 }}>
          <Text sx={{ fontSize: 20, fontFamily: 'Poppins-Bold', mb: 12 }}>
            Completed Requests
          </Text>

          {/* Example completed card */}
          <View sx={{ bg: '#fff', p: 16, borderRadius: 12, mb: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }}>
            <Text sx={{ fontSize: 16, fontFamily: 'Poppins-Bold', mb: 4 }}>Cleaning Service</Text>
            <Text sx={{ fontSize: 14, color: '#4b5563' }}>Completed: Sep 28, 3:00 PM</Text>
            <Text sx={{ fontSize: 14, color: '#4b5563' }}>Feedback: ★★★★☆</Text>
          </View>
        </View>
      </ScrollView>
      <ClientNavbar />
    </SafeAreaView>
  )
}

export default CompletedRequests
