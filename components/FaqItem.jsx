import { View, Text } from "react-native";

const FaqItem = ({ question, answer }) => {
    return (
      <View className="mb-4 p-4 rounded-lg shadow-md border border-[#606060]">
        <Text className="text-lg font-semibold mb-2 text-white">{question}</Text>
        <Text className="text-white">{answer}</Text>
      </View>
    );
  };
  
  export default FaqItem;
  