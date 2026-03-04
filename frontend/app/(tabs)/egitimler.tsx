import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Modal, Image } from 'react-native';
import { Book, CheckCircle2, Search, Clock, PlayCircle, BookOpen, X, ChevronRight } from 'lucide-react-native';
import { useSettings } from '@/context/SettingsContext';

const CATEGORIES = [
  { id: 'all', label: 'Tümü' },
  { id: 'disease', label: 'Hastalık' },
  { id: 'nutrition', label: 'Beslenme' },
  { id: 'exercise', label: 'Egzersiz' },
  { id: 'support', label: 'Destek' },
];

const INITIAL_ARTICLES = [
  { 
    id: '1', 
    title: 'Miyelom Nedir?', 
    category: 'disease', 
    duration: '5 dk', 
    type: 'reading', 
    completed: true,
    content: 'Multipl miyelom, kemik iliğindeki plazma hücrelerinin kontrolsüz çoğalmasıyla karakterize bir kanser türüdür. Plazma hücreleri normalde vücudun bağışıklık sisteminin bir parçasıdır ve antikor üretirler. Ancak miyelomda bu hücreler anormalleşir ve kemik iliğinde yer kaplayarak sağlıklı kan hücrelerinin üretimini engeller.\n\nBelirtiler arasında kemik ağrısı, böbrek sorunları, yorgunluk ve sık enfeksiyon geçirme yer alabilir. Erken teşhis ve modern tedavilerle yaşam kalitesi önemli ölçüde artırılabilmektedir.'
  },
  { 
    id: '2', 
    title: 'Beslenme Önerileri', 
    category: 'nutrition', 
    duration: '8 dk', 
    type: 'reading', 
    completed: false,
    content: 'Miyelom hastaları için beslenme, tedavi sürecinin ayrılmaz bir parçasıdır. Yeterli protein alımı kas kütlesini korumak için kritiktir. Ayrıca antioksidan bakımından zengin meyve ve sebzeler bağışıklık sistemini destekler.\n\nBol su tüketimi böbrek sağlığı için hayati önem taşır. Tuz tüketimini sınırlamak ve işlenmiş gıdalardan kaçınmak genel sağlığınızı olumlu etkileyecektir. Doktorunuzun önerdiği özel bir diyet varsa ona sadık kalmanız en doğrusudur.'
  },
  { 
    id: '3', 
    title: 'Günlük Egzersizler', 
    category: 'exercise', 
    duration: '12 dk', 
    type: 'video', 
    completed: false,
    content: 'Egzersiz, yorgunlukla başa çıkmanıza ve kemik sağlığınızı korumanıza yardımcı olur. Ancak miyelomda kemikler hassas olabileceği için düşük etkili egzersizler tercih edilmelidir.\n\nYürüyüş, yoga ve hafif esneme hareketleri idealdir. Egzersize başlamadan önce mutlaka doktorunuza danışmalı ve kendinizi aşırı zorlamamalısınız. Video içeriklerimizde güvenli hareket serilerini izleyebilirsiniz.'
  },
  { 
    id: '6', 
    title: 'Enfeksiyon Riskinden Korunma', 
    category: 'disease', 
    duration: '6 dk', 
    type: 'reading', 
    completed: false,
    content: 'Bağışıklık sisteminiz tedavi sürecinde baskılanabilir. Kalabalık ortamlardan kaçınmak, el hijyenine dikkat etmek ve iyi pişmiş gıdalar tüketmek enfeksiyon riskini azaltır.\n\nAteşiniz çıktığında veya kendinizi aniden halsiz hissettiğinizde vakit kaybetmeden sağlık ekibinize haber vermelisiniz. Koruyucu önlemler, tedavi sürecinizin kesintisiz devam etmesini sağlar.'
  },
  { 
    id: '7', 
    title: 'Laboratuvar Sonuçlarını Anlamak', 
    category: 'disease', 
    duration: '15 dk', 
    type: 'reading', 
    completed: false,
    content: 'Kan tahlillerinizdeki değerler (Hemoglobin, Kreatinin, M-proteini vb.) hastalığın seyrini takip etmemizi sağlar. Değerlerdeki küçük dalgalanmalar her zaman kötüye gidiş anlamına gelmez.\n\nBu değerleri doktorunuzla birlikte değerlendirmek en sağlıklısıdır. Kendi başınıza internetten araştırma yaparak endişelenmek yerine, uzman görüşüne güvenmelisiniz.'
  },
  { 
    id: '4', 
    title: 'İlaç Kullanımı', 
    category: 'disease', 
    duration: '4 dk', 
    type: 'reading', 
    completed: true,
    content: 'İlaçlarınızı her gün aynı saatte ve düzenli kullanmanız tedavinin başarısı için çok önemlidir. Bazı ilaçlar aç karna, bazıları tok karna alınmalıdır. İlaçlarınızı almayı unuttuğunuzda ne yapmanız gerektiğini doktorunuza sormalısınız.\n\nYan etkiler hissettiğinizde bunları not alıp doktorunuzla paylaşın. Kendi başınıza ilaç dozunu değiştirmeyin veya ilacı bırakmayın.'
  },
  { 
    id: '5', 
    title: 'Psikolojik Destek', 
    category: 'support', 
    duration: '10 dk', 
    type: 'reading', 
    completed: false,
    content: 'Kanserle mücadele sadece fiziksel değil, aynı zamanda duygusal bir süreçtir. Kaygı, korku veya üzüntü hissetmeniz çok normaldir. Bu duyguları ailenizle, arkadaşlarınızla veya bir uzmanla paylaşmak yükünüzü hafifletir.\n\nDestek gruplarına katılmak, benzer süreçlerden geçen kişilerle deneyim paylaşmak size yalnız olmadığınızı hissettirecektir. Psikolojik iyi oluş, fiziksel iyileşmeyi de olumlu yönde etkiler.'
  },
];

export default function EducationScreen() {
  const { fontSize, isDarkMode } = useSettings();
  const [articles, setArticles] = useState(INITIAL_ARTICLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleComplete = (id: string) => {
    setArticles(current => 
      current.map(article => 
        article.id === id ? { ...article, completed: !article.completed } : article
      )
    );
  };

  const openArticle = (article: any) => {
    setSelectedArticle(article);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      onPress={() => openArticle(item)}
      className="flex-row items-center p-4 mx-4 my-2 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800"
    >
      <View className={`w-14 h-14 rounded-2xl items-center justify-center mr-4 ${
        item.type === 'video' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-orange-50 dark:bg-orange-900/20'
      }`}>
        {item.type === 'video' ? (
          <PlayCircle color="#3B82F6" size={24} />
        ) : (
          <BookOpen color="#D35400" size={24} />
        )}
      </View>
      
      <View className="flex-1">
        <Text style={{ fontSize }} className="text-gray-800 dark:text-gray-100 font-bold">{item.title}</Text>
        <View className="flex-row items-center mt-1">
          <Clock size={12} color="#9CA3AF" className="mr-1" />
          <Text className="text-gray-400 text-xs mr-3">{item.duration}</Text>
          <View className="bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
            <Text className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase">{item.category}</Text>
          </View>
        </View>
      </View>

      {item.completed ? (
        <View className="bg-green-100 dark:bg-green-900/20 p-1.5 rounded-full">
          <CheckCircle2 color="#22C55E" size={20} />
        </View>
      ) : (
        <ChevronRight color="#D1D5DB" size={20} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-zinc-950">
      {/* Search Bar */}
      <View className="px-4 py-4 bg-white dark:bg-zinc-900 border-b border-gray-50 dark:border-zinc-800">
        <View className="flex-row items-center bg-gray-50 dark:bg-zinc-800 px-4 py-3 rounded-2xl border border-gray-100 dark:border-zinc-700">
          <Search size={20} color="#9CA3AF" className="mr-2" />
          <TextInput
            placeholder="Eğitim içeriklerinde ara..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-gray-700 dark:text-gray-200 font-medium"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ fontSize }}
          />
        </View>
      </View>

      {/* Categories */}
      <View className="bg-white dark:bg-zinc-900 py-4 border-b border-gray-50 dark:border-zinc-800">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2.5 rounded-full mr-2 border ${
                selectedCategory === cat.id 
                  ? 'bg-[#D35400] border-[#D35400]' 
                  : 'bg-white dark:bg-zinc-800 border-gray-100 dark:border-zinc-700'
              }`}
            >
              <Text style={{ fontSize: fontSize - 2 }} className={`font-bold ${
                selectedCategory === cat.id ? 'text-white' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredArticles}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingVertical: 12, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center mt-20 px-8">
            <Book size={64} color="#E5E7EB" />
            <Text className="text-gray-400 text-center mt-4" style={{ fontSize }}>Aradığınız kriterlere uygun içerik bulunamadı.</Text>
          </View>
        }
      />

      {/* Article Detail Modal */}
      <Modal
        animationType="slide"
        visible={!!selectedArticle}
        onRequestClose={() => setSelectedArticle(null)}
      >
        <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-50 dark:border-zinc-900">
            <Text style={{ fontSize: fontSize + 2 }} className="font-black text-gray-800 dark:text-white flex-1 mr-4" numberOfLines={1}>
              {selectedArticle?.title}
            </Text>
            <TouchableOpacity 
              onPress={() => setSelectedArticle(null)}
              className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-full items-center justify-center"
            >
              <X size={20} color="#D35400" />
            </TouchableOpacity>
          </View>
          
          <ScrollView className="flex-1 px-6 pt-6">
            <View className={`w-full h-48 rounded-[32px] items-center justify-center mb-8 ${
              selectedArticle?.type === 'video' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-orange-50 dark:bg-orange-900/20'
            }`}>
              {selectedArticle?.type === 'video' ? (
                <PlayCircle color="#3B82F6" size={80} />
              ) : (
                <BookOpen color="#D35400" size={80} />
              )}
            </View>

            <View className="flex-row items-center mb-6">
              <View className="bg-orange-100 dark:bg-orange-900/30 px-4 py-2 rounded-full mr-4">
                <Text className="text-[#D35400] font-black uppercase text-xs">{selectedArticle?.category}</Text>
              </View>
              <Clock size={16} color="#9CA3AF" className="mr-2" />
              <Text className="text-gray-400 font-bold">{selectedArticle?.duration} okuma süresi</Text>
            </View>

            <Text style={{ fontSize: fontSize + 2 }} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-10">
              {selectedArticle?.content}
            </Text>

            <TouchableOpacity 
              onPress={() => {
                toggleComplete(selectedArticle.id);
                setSelectedArticle(null);
              }}
              className={`py-5 rounded-2xl items-center mb-10 shadow-lg ${
                selectedArticle?.completed ? 'bg-gray-100 dark:bg-zinc-800' : 'bg-[#D35400]'
              }`}
            >
              <Text className={`font-black text-lg ${
                selectedArticle?.completed ? 'text-gray-400' : 'text-white'
              }`}>
                {selectedArticle?.completed ? 'TAMAMLANDI OLARAK İŞARETLE' : 'OKUDUM, TAMAMLA'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
