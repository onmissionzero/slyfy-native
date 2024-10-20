import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const Button = ({ text, onPress }) => {
    return (
        <TouchableOpacity
            className="bg-[#1db954] rounded-full w-60 h-20 px-2 py-1 justify-center items-center"
            onPress={onPress}
        >
            <Text className="text-black text-2xl font-bold">
                {text}
            </Text>
        </TouchableOpacity>
    );
}

export default Button;
