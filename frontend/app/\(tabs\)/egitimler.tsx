import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { BookOpen } from 'lucide-react-native';

export default function Egitimler() {
  const egitimListesi = [
    { title: 'Multiple Myeloma Nedir?', category: 'Temel Bilgiler' },
    { title: 'Tedavi Süreçleri', category: 'Tedavi' },
    { title: 'Beslenme Önerileri', category: 'Yaşam Tarzı' },
    { title: 'Egzersiz ve Hareketlilik', category: 'Fiziksel Sağlık' },
  ];

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4 bg-[#D35400]/10 rounded-b-3xl mb-4 items-center">
        <Text className="text-xl font-bold text-[#D35400]">Eğitim Merkezi</Text>
        <Text className="text-gray-600 text-center mt-1">Hastalık ve tedavi hakkında güvenilir bilgiler edinin</Text>
      </View>
      
      <View className="px-4">
        {egitimListesi.map((item, index) => (
          <TouchableOpacity key={index} className="flex-row items-center p-4 bg-gray-50 border border-gray-100 rounded-xl mb-3 shadow-sm">
            <View className="w-12 h-12 bg-[#D35400] rounded-full items-center justify-center mr-4">
              <BookOpen color="white" size={24} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-400 uppercase tracking-wider">{item.category}</Text>
              <Text className="text-lg font-bold text-gray-800 leading-tight">{item.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
