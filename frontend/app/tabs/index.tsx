import React, { useState, useLayoutEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, ScrollView, Alert, SafeAreaView } from 'react-native';
import { Bell, Trash2, Plus, Home, Pill, Calendar, Activity, Info, X, Clock } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import { useSettings } from '@/context/SettingsContext';
import Animated, { FadeInUp, FadeInRight, ScaleInCenter, Layout } from 'react-native-reanimated';

const INITIAL_NOTIFICATIONS = [
  { id: '1', title: 'Yeni Bilgi Paylaşıldı', timestamp: '04.03.2026 17:34', type: 'info' },
  { id: '2', title: 'İlaç Hatırlatıcısı', timestamp: '05.03.2026 09:00', type: 'medication' },
  { id: '3', title: 'Randevu Bildirimi', timestamp: '05.03.2026 14:15', type: 'appointment' },
];

const NOTIFICATION_TYPES = [
  { label: 'İlaç', value: 'medication', icon: Pill, color: '#3B82F6' },
  { label: 'Randevu', value: 'appointment', icon: Calendar, color: '#F59E0B' },
  { label: 'Aktivite', value: 'activity', icon: Activity, color: '#10B981' },
  { label: 'Bilgi', value: 'info', icon: Info, color: '#6366F1' },
];

export default function HomeTab() {
  const { fontSize, isDarkMode } = useSettings();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('04.03.2026');
  const [newTime, setNewTime] = useState('09:00');
  const [selectedType, setSelectedType] = useState('medication');
  const navigation = useNavigation();

  const [activePicker, setActivePicker] = useState<'date' | 'time' | null>(null);

  const addNotification = () => {
    if (!newTitle.trim()) {
      Alert.alert('Hata', 'Lütfen bir başlık giriniz.');
      return;
    }

    const newId = (notifications.length > 0 ? Math.max(...notifications.map(n => parseInt(n.id))) + 1 : 1).toString();
    const timestamp = `${newDate} ${newTime}`;
    
    const newItem = {
      id: newId,
      title: newTitle,
      timestamp: timestamp,
      type: selectedType,
    };
    
    setNotifications([newItem, ...notifications]);
    setNewTitle('');
    setIsModalVisible(false);
    setActivePicker(null);
  };

  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push({
        full: d.toLocaleDateString('tr-TR'),
        day: d.getDate(),
        month: d.toLocaleString('tr-TR', { month: 'short' }),
        weekday: d.toLocaleString('tr-TR', { weekday: 'short' })
      });
    }
    return dates;
  };

  const generateTimes = () => {
    const times = [];
    for (let i = 8; i < 22; i++) {
      times.push(`${i.toString().padStart(2, '0')}:00`);
      times.push(`${i.toString().padStart(2, '0')}:30`);
    }
    return times;
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="flex-row items-center pr-2">
          <TouchableOpacity onPress={() => setIsModalVisible(true)} className="p-2">
            <Plus color="#FFFFFF" size={24} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, notifications]);

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getTypeIcon = (type: string) => {
    const found = NOTIFICATION_TYPES.find(t => t.value === type);
    if (found) {
      const IconComp = found.icon;
      return <IconComp color={found.color} size={22} />;
    }
    return <Bell color="#EF4444" size={22} />;
  };

  const getTypeColor = (type: string) => {
    const found = NOTIFICATION_TYPES.find(t => t.value === type);
    return found ? found.color : '#EF4444';
  };

  const renderItem = ({ item, index }: { item: any, index: number }) => (
    <Animated.View 
      entering={FadeInUp.delay(index * 100)}
      layout={Layout.springify()}
      className="flex-row items-center justify-between p-5 mb-4 mx-4 bg-white dark:bg-zinc-900 rounded-[28px] shadow-sm border border-gray-100 dark:border-zinc-800"
    >
      <View className="flex-row items-center flex-1">
        <View 
          className="p-3 mr-4 rounded-2xl"
          style={{ backgroundColor: `${getTypeColor(item.type)}15` }}
        >
          {getTypeIcon(item.type)}
        </View>
        <View className="flex-1">
          <Text style={{ fontSize }} className="font-black text-gray-800 dark:text-gray-100">{item.title}</Text>
          <View className="flex-row items-center mt-1">
            <Clock size={12} color="#9CA3AF" />
            <Text className="text-[11px] text-gray-400 ml-1 font-bold">{item.timestamp}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity 
        onPress={() => deleteNotification(item.id)}
        className="p-2 ml-2 bg-gray-50 dark:bg-zinc-800 rounded-full"
      >
        <Trash2 color="#EF4444" size={16} />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-zinc-950">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Summary */}
        <View className="px-6 py-10 bg-[#D35400] rounded-b-[50px] shadow-2xl mb-6">
          <View className="mb-8">
            <Text style={{ fontSize: fontSize - 2 }} className="text-orange-100 font-bold tracking-widest uppercase">Sağlık Durumu</Text>
            <Text style={{ fontSize: fontSize + 10 }} className="text-white font-black leading-tight mt-1">İyileşme Yolculuğun{"\n"}Hızla Devam Ediyor!</Text>
          </View>
          <View className="flex-row gap-x-4">
            <TouchableOpacity 
              onPress={() => Alert.alert("Planlı Görevler", `${notifications.length} adet bekleyen göreviniz bulunmaktadır.`)}
              className="flex-1 bg-white/20 p-5 rounded-[30px] border border-white/30"
            >
              <Text className="text-white font-black text-2xl">{notifications.length}</Text>
              <Text className="text-orange-50 text-[10px] font-black uppercase tracking-wider">Planlı</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => Alert.alert("Sağlık Analizleri", "Son 7 güne ait 4 adet sağlık analiz raporunuz hazır.")}
              className="flex-1 bg-white/20 p-5 rounded-[30px] border border-white/30"
            >
              <Text className="text-white font-black text-2xl">4</Text>
              <Text className="text-orange-50 text-[10px] font-black uppercase tracking-wider">Analiz</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section Title */}
        <View className="bg-gray-50 dark:bg-zinc-950 py-4 px-6">
          <View className="flex-row items-center justify-between">
            <Text style={{ fontSize: fontSize + 4 }} className="font-black text-gray-800 dark:text-white">Gelecek Görevler</Text>
            <View className="bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
              <Text className="text-[#D35400] text-[10px] font-black uppercase">Bugün</Text>
            </View>
          </View>
        </View>

        <View className="pb-32">
          {notifications.length > 0 ? (
            notifications.map((item, index) => (
              <React.Fragment key={item.id}>
                {renderItem({ item, index })}
              </React.Fragment>
            ))
          ) : (
            <View className="items-center justify-center mt-20 px-12">
              <View className="w-32 h-32 bg-gray-100 dark:bg-zinc-900 rounded-full items-center justify-center mb-6">
                <Bell size={48} color="#D1D5DB" />
              </View>
              <Text className="text-gray-400 text-center font-bold" style={{ fontSize }}>
                Her şey kontrol altında! Yeni bir hatırlatıcı eklemek için yukarıdaki + ikonuna dokunun.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modern Add Notification Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-white dark:bg-zinc-900 rounded-t-[50px] p-10 min-h-[650px] shadow-2xl">
            <View className="w-16 h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-full self-center mb-8" />
            
            <View className="flex-row justify-between items-center mb-10">
              <View>
                <Text style={{ fontSize: fontSize + 8 }} className="font-black text-gray-800 dark:text-white">Görev Planla</Text>
                <Text className="text-gray-400 font-bold mt-1">Sürecini yönetmek için detayları gir</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setIsModalVisible(false)}
                className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-2xl items-center justify-center"
              >
                <X size={24} color="#D35400" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              <Text className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-4 ml-1">Kategori</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-10">
                {NOTIFICATION_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    onPress={() => setSelectedType(type.value)}
                    className={`flex-row items-center px-6 py-5 rounded-[24px] mr-3 border-2 ${
                      selectedType === type.value 
                        ? 'bg-orange-50 dark:bg-orange-900/20 border-[#D35400]' 
                        : 'bg-gray-50 dark:bg-zinc-800 border-transparent'
                    }`}
                  >
                    <type.icon 
                      size={24} 
                      color={selectedType === type.value ? '#D35400' : '#9CA3AF'} 
                      className="mr-3"
                    />
                    <Text style={{ fontSize: fontSize - 1 }} className={`font-black ${
                      selectedType === type.value ? 'text-[#D35400]' : 'text-gray-400'
                    }`}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-4 ml-1">Hatırlatıcı İsmi</Text>
              <TextInput
                className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-[24px] text-gray-800 dark:text-gray-100 mb-10 font-bold"
                placeholder="Örn: Akşam İlacı"
                placeholderTextColor="#9CA3AF"
                value={newTitle}
                onChangeText={setNewTitle}
                style={{ fontSize: fontSize + 2 }}
              />

              <Text className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-4 ml-1">Zaman Ayarı</Text>
              <View className="flex-row gap-x-4 mb-8">
                <TouchableOpacity 
                  onPress={() => setActivePicker(activePicker === 'date' ? null : 'date')}
                  className={`flex-1 p-6 rounded-[24px] border-2 ${activePicker === 'date' ? 'border-[#D35400] bg-orange-50' : 'border-transparent bg-gray-50 dark:bg-zinc-800'}`}
                >
                  <Text className="text-[9px] text-gray-400 font-black uppercase mb-1">Tarih</Text>
                  <Text style={{ fontSize }} className={`font-black ${activePicker === 'date' ? 'text-[#D35400]' : 'text-gray-800 dark:text-gray-200'}`}>{newDate}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setActivePicker(activePicker === 'time' ? null : 'time')}
                  className={`flex-1 p-6 rounded-[24px] border-2 ${activePicker === 'time' ? 'border-[#D35400] bg-orange-50' : 'border-transparent bg-gray-50 dark:bg-zinc-800'}`}
                >
                  <Text className="text-[9px] text-gray-400 font-black uppercase mb-1">Saat</Text>
                  <Text style={{ fontSize }} className={`font-black ${activePicker === 'time' ? 'text-[#D35400]' : 'text-gray-800 dark:text-gray-200'}`}>{newTime}</Text>
                </TouchableOpacity>
              </View>

              {activePicker === 'date' && (
                <Animated.View entering={FadeInRight} className="mb-10">
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    {generateDates().map((d, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => { setNewDate(d.full); setActivePicker('time'); }}
                        className={`mr-4 items-center p-6 rounded-[28px] border-2 ${newDate === d.full ? 'bg-[#D35400] border-[#D35400]' : 'bg-white dark:bg-zinc-800 border-gray-100 dark:border-zinc-700 shadow-sm'}`}
                      >
                        <Text className={`text-[9px] font-black uppercase ${newDate === d.full ? 'text-orange-100' : 'text-gray-400'}`}>{d.weekday}</Text>
                        <Text className={`text-2xl font-black mt-1 ${newDate === d.full ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>{d.day}</Text>
                        <Text className={`text-[9px] font-bold ${newDate === d.full ? 'text-orange-100' : 'text-gray-400'}`}>{d.month}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </Animated.View>
              )}

              {activePicker === 'time' && (
                <Animated.View entering={FadeInRight} className="mb-10">
                  <View className="flex-row flex-wrap gap-3">
                    {generateTimes().slice(0, 8).map((t, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => { setNewTime(t); setActivePicker(null); }}
                        className={`px-6 py-4 rounded-2xl border-2 ${newTime === t ? 'bg-[#D35400] border-[#D35400]' : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 shadow-sm'}`}
                      >
                        <Text className={`font-black ${newTime === t ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>{t}</Text>
                      </TouchableOpacity>
                    ))}
                    <Text className="w-full text-center text-gray-300 text-[10px] font-bold mt-2">Daha fazla saat için kaydırın...</Text>
                  </View>
                </Animated.View>
              )}

              <TouchableOpacity
                onPress={addNotification}
                activeOpacity={0.8}
                className="bg-[#D35400] p-7 rounded-[30px] items-center shadow-xl shadow-orange-300 mt-4 mb-10"
              >
                <Text className="text-white font-black text-xl tracking-widest uppercase">Görevi Kaydet</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
