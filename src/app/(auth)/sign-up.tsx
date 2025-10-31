import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    console.log(emailAddress, password)

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <>
        <Text>Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <TouchableOpacity onPress={onVerifyPress}>
          <Text>Verify</Text>
        </TouchableOpacity>
      </>
    )
  }

  return (
    <SafeAreaView className='flex-1 justify-center items-center w-full'>
        <View className='flex flex-col gap-4 border border-gray-200 p-6 rounded-xl  w-[350px] h-[400px] justify-center items-center shadow-sm bg-white'>
            <>
                <View>
                    <Text className='text-2xl font-bold'>Inner Strength Unbound</Text>
                </View>
                <View className='w-full space-y-2'>
                    <TextInput
                        autoCapitalize="none"
                        value={emailAddress}
                        placeholder="Enter email"
                        onChangeText={(email) => setEmailAddress(email)}
                        className='border border-gray-200 rounded-md placeholder:text-gray-400 p-2 w-full'
                    />
                </View>
                <View className='w-full space-y-2 mb-4'>
                    <TextInput
                        value={password}
                        placeholder="Enter password"
                        secureTextEntry={true}
                        onChangeText={(password) => setPassword(password)}
                        className='border border-gray-200 rounded-md placeholder:text-gray-400 p-2 w-full'
                    />
                </View>
                <View className='w-full mb-2 justify-center items-center'>
                    <TouchableOpacity className='flex flex-row gap-2 border border-red-950 rounded-md h-12 bg-red-900 justify-center items-center w-full' onPress={onSignUpPress}>
                        <Text className='text-white'>Sign Up</Text>
                    </TouchableOpacity>
                </View>
                <View className='flex-row gap-2 mt-4 justify-center items-center'>
                    <Text>Already have an account?</Text>
                <Link href="/sign-in">
                    <Text className='text-blue-600'>Sign in</Text>
                </Link>
                </View>
            </>
    </View>
    </SafeAreaView>
  )
}