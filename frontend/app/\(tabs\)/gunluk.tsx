import { View, Text } from 'react-native';

export default function Gunluk() {
  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-2xl font-bold text-[#D35400]">Günlük Takip</Text>
      <Text className="text-lg text-gray-600 mt-2">Bugünkü durumunuzu ve semptomlarınızı kaydedin</Text>
    </View>
  );
}
