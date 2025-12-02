import { Text, View } from 'dripsy'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import WorkerHeader from '../header'
import WorkerNavbar from '../navbar'

const CompletedWorks = () => {
  return (
    <SafeAreaView>
      <WorkerHeader />
      <ScrollView>
        <View sx={{ p: 16 }}>
          <Text sx={{ fontSize: 20, fontFamily: 'Poppins-Bold', mb: 12 }}>
            Completed Jobs
          </Text>

          {/* Example completed job card */}
          <View
            sx={{
              bg: '#fff',
              p: 16,
              borderRadius: 12,
              mb: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Text sx={{ fontSize: 16, fontFamily: 'Poppins-Bold', mb: 4 }}>
              Cleaning Service
            </Text>
            <Text sx={{ fontSize: 14, color: '#4b5563' }}>
              Completed: Sep 28, 3:00 PM
            </Text>
            <Text sx={{ fontSize: 14, color: '#4b5563' }}>
              Feedback: ★★★★☆
            </Text>
          </View>
        </View>
      </ScrollView>
      <WorkerNavbar />
    </SafeAreaView>
  )
}

export default CompletedWorks
