import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SignIn from "./(auth)/sign-in";
import GoogleSignIn from "./components/GoogleSignIn";

export default function Page() {
  return (
    <SafeAreaView className="flex-1 justify-center items-center w-full">
        <View className="flex-1 items-center justify-center bg-white w-full">
      <Text>Welcome to the Home Page!</Text>
      <View className="flex-1 justify-center items-center">
        <SignIn />
      </View>
      
    </View>  
    </SafeAreaView>
  );
}

