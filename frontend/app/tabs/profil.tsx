import React, { useState } from 'react';
import { View, Text, TextInput, Switch, ScrollView, SafeAreaView, TouchableOpacity, Alert, Modal } from 'react-native';
import Slider from '@react-native-community/slider';
import { User, Moon, Type, ChevronRight, LogOut, Camera, Bell, Shield, Languages, Share2, HelpCircle, X } from 'lucide-react-native';
import { useSettings } from '@/context/SettingsContext';

export default function ProfileScreen() {
  const { fontSize, setFontSize, isDarkMode, toggleDarkMode } = useSettings();
  const [bio, setBio] = useState('Multipl Miyelom ile mücadele ediyorum. Sağlıklı yaşam benim için önemli.');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Modals for info sections
  const [infoModal, setInfoModal] = useState<{ visible: boolean, title: string, content: string }>({
    visible: false,
    title: '',
    content: ''
  });

  const handleExport = () => {
    Alert.alert(
      "Verileri Dışa Aktar",
      "Son 30 günlük verileriniz PDF formatında hazırlanacaktır. Devam etmek istiyor musunuz?",
      [
        { text: "İptal", style: "cancel" },
        { text: "Dışa Aktar", onPress: () => Alert.alert("Başarılı", "Verileriniz e-posta adresinize gönderildi.") }
      ]
    );
  };

  const showInfo = (type: string) => {
    let title = '';
    let content = '';

    if (type === 'privacy') {
      title = 'Gizlilik ve Güvenlik';
      content = 'Verileriniz uçtan uca şifrelenmektedir. Sağlık verileriniz (ağrı seviyeleri, semptomlar, ruh hali) sadece sizin cihazınızda ve güvenli bulut yedeklemelerimizde saklanır. Üçüncü taraflarla, ilaç firmalarıyla veya reklam ağlarıyla asla paylaşılmaz.\n\nKVKK ve GDPR standartlarına tam uyumlu bir şekilde verileriniz korunur. İstediğiniz zaman "Hesabı Sil" seçeneği ile tüm verilerinizin kalıcı olarak kaldırılmasını talep edebilirsiniz.';
    } else if (type === 'help') {
      title = 'Yardım Merkezi';
      content = 'Uygulama kullanımı veya teknik sorunlar için 7/24 yanınızdayız.\n\n📧 E-posta: destek@miyelomtakip.com\n📞 Destek Hattı: 0850 123 45 67\n📍 Adres: Teknopark Ankara, No:12\n\nSıkça Sorulan Sorular (SSS) bölümüne web sitemiz üzerinden ulaşabilirsiniz. Geri bildirimleriniz uygulamamızı geliştirmemiz için çok değerlidir.';
    } else if (type === 'lang') {
      title = 'Dil Seçeneği';
      content = 'Multiple Myeloma Tracker şu an ana diliniz olan Türkçe ile tam uyumludur.\n\nYakında eklenecek diller:\n• İngilizce (English) - Nisan 2026\n• Almanca (Deutsch) - Haziran 2026\n• Arapça (العربية) - Ağustos 2026\n\nYeni bir dil desteği eklemek isterseniz lütfen destek ekibimize bildirin.';
    }

    setInfoModal({ visible: true, title, content });
  };

  const renderSettingItem = ({ icon: Icon, color, label, right: Right, onPress }: any) => (
    <TouchableOpacity 
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center justify-between py-4 border-b border-gray-50"
    >
      <View className="flex-row items-center">
        <View 
          className="w-10 h-10 rounded-xl items-center justify-center mr-3"
          style={{ backgroundColor: `${color}10` }}
        >
          <Icon size={20} color={color} />
        </View>
        <Text style={{ fontSize }} className="text-gray-700 font-bold dark:text-gray-200">{label}</Text>
      </View>
      {Right ? <Right /> : <ChevronRight size={20} color="#D1D5DB" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-zinc-950">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="items-center pt-10 pb-8 bg-white dark:bg-zinc-900 rounded-b-[40px] shadow-sm">
          <View className="relative">
            <View className="w-28 h-28 rounded-full bg-orange-50 dark:bg-orange-900/20 items-center justify-center overflow-hidden border-4 border-white dark:border-zinc-800 shadow-lg">
              <User size={64} color="#D35400" />
            </View>
            <TouchableOpacity className="absolute bottom-1 right-1 w-10 h-10 bg-[#D35400] rounded-full items-center justify-center border-4 border-white dark:border-zinc-800 shadow-md">
              <Camera size={18} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: fontSize + 4 }} className="mt-4 font-black text-gray-800 dark:text-white">Ahmet Yılmaz</Text>
          <Text className="text-gray-400 font-bold">Hasta No: #23841</Text>
          
          <View className="flex-row mt-6 gap-x-4">
            <TouchableOpacity className="bg-orange-50 dark:bg-orange-900/20 px-6 py-2.5 rounded-full border border-orange-100 dark:border-orange-900/30">
              <Text className="text-[#D35400] font-bold">Profili Düzenle</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleExport}
              className="bg-[#D35400] px-6 py-2.5 rounded-full shadow-md shadow-orange-200"
            >
              <Text className="text-white font-bold">Verileri Aktar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bio Section */}
        <View className="mx-4 mt-6 p-6 bg-white dark:bg-zinc-900 rounded-[32px] shadow-sm border border-gray-100 dark:border-zinc-800">
          <Text className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Kişisel Not</Text>
          <View className="bg-gray-50 dark:bg-zinc-800 rounded-2xl p-4 border border-gray-100 dark:border-zinc-700">
            <TextInput
              multiline
              numberOfLines={3}
              placeholder="Kendinle ilgili bir şeyler yaz..."
              value={bio}
              onChangeText={setBio}
              className="text-gray-700 dark:text-gray-200 font-medium min-h-[60px]"
              style={{ textAlignVertical: 'top', fontSize }}
            />
          </View>
        </View>

        {/* Settings Groups */}
        <View className="mx-4 mt-4 p-6 bg-white dark:bg-zinc-900 rounded-[32px] shadow-sm border border-gray-100 dark:border-zinc-800 mb-4">
          <Text className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Uygulama Ayarları</Text>
          
          {renderSettingItem({
            icon: Bell,
            color: '#F59E0B',
            label: 'Bildirimler',
            right: () => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#D1D5DB', true: '#D35400' }}
                thumbColor="#FFFFFF"
              />
            )
          })}

          {renderSettingItem({
            icon: Moon,
            color: '#A855F7',
            label: 'Gece Modu',
            right: () => (
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#D1D5DB', true: '#D35400' }}
                thumbColor="#FFFFFF"
              />
            )
          })}

          <View className="py-4">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl items-center justify-center mr-3">
                  <Type size={20} color="#3B82F6" />
                </View>
                <Text style={{ fontSize }} className="text-gray-700 dark:text-gray-200 font-bold">Yazı Boyutu</Text>
              </View>
              <Text className="text-[#D35400] font-black">{Math.round(fontSize)}px</Text>
            </View>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={12}
              maximumValue={24}
              step={1}
              value={fontSize}
              onValueChange={setFontSize}
              minimumTrackTintColor="#D35400"
              maximumTrackTintColor="#F3F4F6"
              thumbTintColor="#D35400"
            />
          </View>
        </View>

        <View className="mx-4 mt-2 p-6 bg-white dark:bg-zinc-900 rounded-[32px] shadow-sm border border-gray-100 dark:border-zinc-800 mb-10">
          <Text className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Destek ve Gizlilik</Text>
          
          {renderSettingItem({ icon: Languages, color: '#10B981', label: 'Dil Seçeneği', onPress: () => showInfo('lang') })}
          {renderSettingItem({ icon: Shield, color: '#6366F1', label: 'Gizlilik ve Güvenlik', onPress: () => showInfo('privacy') })}
          {renderSettingItem({ icon: HelpCircle, color: '#EC4899', label: 'Yardım Merkezi', onPress: () => showInfo('help') })}
          {renderSettingItem({ icon: Share2, color: '#6B7280', label: 'Uygulamayı Paylaş', onPress: () => Alert.alert("Paylaş", "Uygulama linki kopyalandı.") })}
          
          <TouchableOpacity 
            className="flex-row items-center py-5 mt-2"
            onPress={() => Alert.alert("Çıkış", "Oturumu kapatmak istediğinize emin misiniz?", [{ text: "Vazgeç" }, { text: "Çıkış Yap", style: "destructive" }])}
          >
            <View className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-xl items-center justify-center mr-3">
              <LogOut size={20} color="#EF4444" />
            </View>
            <Text style={{ fontSize: fontSize + 2 }} className="text-red-500 font-bold">Çıkış Yap</Text>
          </TouchableOpacity>
        </View>

        <View className="pb-20 items-center">
          <Text className="text-gray-300 dark:text-gray-600 font-bold tracking-widest text-[10px] uppercase">Multiple Myeloma Tracker • v1.2.4</Text>
        </View>
      </ScrollView>

      {/* Info Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={infoModal.visible}
        onRequestClose={() => setInfoModal({ ...infoModal, visible: false })}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-zinc-900 rounded-t-[40px] p-8 shadow-2xl">
            <View className="flex-row items-center justify-between mb-6">
              <Text style={{ fontSize: fontSize + 6 }} className="font-black text-gray-800 dark:text-white">{infoModal.title}</Text>
              <TouchableOpacity 
                onPress={() => setInfoModal({ ...infoModal, visible: false })}
                className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-full items-center justify-center"
              >
                <X size={20} color="#D35400" />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize }} className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              {infoModal.content}
            </Text>
            <TouchableOpacity 
              onPress={() => setInfoModal({ ...infoModal, visible: false })}
              className="bg-[#D35400] py-4 rounded-2xl items-center"
            >
              <Text className="text-white font-black text-lg">Anladım</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
