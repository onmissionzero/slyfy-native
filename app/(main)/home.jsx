import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import Player from "../../components/Player";

const Home = () => {
  return (
    <SafeAreaView className="bg-black w-full h-full">
      <Player />
    </SafeAreaView>
  )
}

export default Home