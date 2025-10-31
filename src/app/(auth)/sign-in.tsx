import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import GoogleSignIn from '../components/GoogleSignIn'
import Ionicons from '@react-native-vector-icons/ionicons'

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <SafeAreaView className='flex-1 justify-center items-center w-full'>
        <View className='flex flex-col gap-4 border border-gray-200 p-6 rounded-xl  w-[350px] h-[400px] justify-center items-center shadow-sm bg-white'>
          <View>
            <Text className='text-2xl font-bold'>Inner Strength Unbound</Text>
          </View>
         <View className='w-full space-y-2'>
             <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          className='border border-gray-200 rounded-md placeholder:text-gray-400 p-2 w-full'/>
         </View>
          <View className='w-full space-y-2 mb-4'>
            <TextInput
            value={password}
            placeholder="Enter password"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          className='border border-gray-200 rounded-md placeholder:text-gray-400 p-2 w-full'/>
          </View>
         <View className='w-full mb-2'>
             <TouchableOpacity className='flex flex-row gap-2 border border-red-950 rounded-md h-12 bg-red-900 justify-center items-center w-full' onPress={onSignInPress}>
              <Ionicons name="enter-outline" size={24} color="white" />
            <Text className='text-white '>Sign In</Text>
          </TouchableOpacity>
         </View>
          <View>
            <Text>Or sign in with</Text>
          </View>
          <View className='w-full'>
            <GoogleSignIn />
          </View>
          <View className='flex-row gap-2 mt-4'>
            <Text>Don't have an account?</Text>
            <Link href="/sign-up">
              <Text className='text-blue-400'>Sign up</Text>
            </Link>
          </View>
        </View>
    </SafeAreaView>
  )
}

export default SignIn