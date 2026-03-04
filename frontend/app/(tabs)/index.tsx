import React, { useState, useLayoutEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, ScrollView, Alert, SafeAreaView } from 'react-native';
import { Bell, Trash2, Plus, Home, Pill, Calendar, Activity, Info, X } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import { useSettings } from '@/context/SettingsContext';

const INITIAL_NOTIFICATIONS = [
  { id: '1', title: 'Yeni Bilgi Paylaşıldı', timestamp: '22.08.25 17:34', type: 'info' },
  { id: '2', title: 'İlaç Hatırlatıcısı', timestamp: '23.08.25 09:00', type: 'medication' },
  { id: '3', title: 'Randevu Bildirimi', timestamp: '23.08.25 14:15', type: 'appointment' },
  { id: '4', title: 'Tahlil Sonuçları Hazır', timestamp: '24.08.25 10:30', type: 'activity' },
  { id: '5', title: 'Yeni Eğitim İçeriği', timestamp: '25.08.25 16:20', type: 'info' },
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

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

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
            <TouchableOpacity className="p-2">
              <Home color="#FFFFFF" size={24} />
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

  const renderItem = ({ item }: { item: any }) => (
    <View className="flex-row items-center justify-between p-4 mb-3 mx-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
      <View className="flex-row items-center flex-1">
        <View 
          className="p-2.5 mr-3 rounded-xl"
          style={{ backgroundColor: `${getTypeColor(item.type)}15` }}
        >
          {getTypeIcon(item.type)}
        </View>
        <View className="flex-1">
          <Text style={{ fontSize }} className="font-bold text-gray-800 dark:text-gray-100">{item.title}</Text>
          <Text className="text-xs text-gray-400 mt-1 font-medium">{item.timestamp}</Text>
        </View>
      </View>
      <TouchableOpacity 
        onPress={() => deleteNotification(item.id)}
        className="p-2 ml-2"
      >
        <Trash2 color="#D1D5DB" size={18} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-zinc-950">
      {/* Summary Section */}
      <View className="px-4 py-8 bg-[#D35400] rounded-b-[40px] shadow-lg mb-4">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text style={{ fontSize: fontSize - 2 }} className="text-orange-100 font-medium">Hoşgeldiniz,</Text>
            <Text style={{ fontSize: fontSize + 6 }} className="text-white font-black leading-tight">Bugün Nasıl{"\n"}Hissediyorsunuz?</Text>
          </View>
        </View>
        <View className="flex-row gap-x-3">
          <View className="flex-1 bg-white/20 p-4 rounded-2xl border border-white/30 backdrop-blur-md">
            <Text className="text-white font-black text-xl">{notifications.length}</Text>
            <Text className="text-orange-50 text-[10px] font-bold uppercase tracking-wider">Hatırlatıcı</Text>
          </View>
          <View className="flex-1 bg-white/20 p-4 rounded-2xl border border-white/30 backdrop-blur-md">
            <Text className="text-white font-black text-xl">3</Text>
            <Text className="text-orange-50 text-[10px] font-bold uppercase tracking-wider">Makale</Text>
          </View>
          <View className="flex-1 bg-white/20 p-4 rounded-2xl border border-white/30 backdrop-blur-md">
            <Text className="text-white font-black text-xl">85%</Text>
            <Text className="text-orange-50 text-[10px] font-bold uppercase tracking-wider">Uyum</Text>
          </View>
        </View>
      </View>

      <View className="flex-row px-6 mb-4 mt-2 items-center justify-between">
        <Text style={{ fontSize: fontSize + 2 }} className="font-black text-gray-800 dark:text-white">Bildirimler</Text>
        <TouchableOpacity>
          <Text className="text-xs text-[#D35400] font-black uppercase tracking-tighter">Tümünü Gör</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center mt-20 px-8">
            <Bell size={64} color="#E5E7EB" />
            <Text className="text-gray-400 text-center mt-4" style={{ fontSize }}>Henüz bildiriminiz bulunmamaktadır. Sağ üstteki + butonu ile yeni bir hatırlatıcı ekleyebilirsiniz.</Text>
          </View>
        }
      />

      {/* Add Notification Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-zinc-900 rounded-t-[40px] p-8 min-h-[550px]">
            <View className="flex-row justify-between items-center mb-8">
              <Text style={{ fontSize: fontSize + 6 }} className="font-black text-gray-800 dark:text-white">Yeni Hatırlatıcı</Text>
              <TouchableOpacity 
                onPress={() => setIsModalVisible(false)}
                className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-full items-center justify-center"
              >
                <X size={20} color="#D35400" />
              </TouchableOpacity>
            </View>

            <Text className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Hatırlatıcı Türü</Text>
            <View className="flex-row flex-wrap gap-3 mb-8">
              {NOTIFICATION_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  onPress={() => setSelectedType(type.value)}
                  className={`flex-row items-center px-5 py-4 rounded-2xl border ${
                    selectedType === type.value 
                      ? 'bg-orange-50 dark:bg-orange-900/20 border-[#D35400]' 
                      : 'bg-gray-50 dark:bg-zinc-800 border-gray-100 dark:border-zinc-700'
                  }`}
                >
                  <type.icon 
                    size={20} 
                    color={selectedType === type.value ? '#D35400' : '#9CA3AF'} 
                    className="mr-3"
                  />
                  <Text style={{ fontSize: fontSize - 2 }} className={`font-bold ${
                    selectedType === type.value ? 'text-[#D35400]' : 'text-gray-500'
                  }`}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Hatırlatıcı Başlığı</Text>
            <TextInput
              className="bg-gray-50 dark:bg-zinc-800 p-5 rounded-2xl border border-gray-100 dark:border-zinc-700 text-gray-800 dark:text-gray-100 mb-6"
              placeholder="Örn: İlaç vaktin geldi"
              placeholderTextColor="#9CA3AF"
              value={newTitle}
              onChangeText={setNewTitle}
              style={{ fontSize }}
            />

            <Text className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Hatırlatıcı Zamanı</Text>
            <View className="flex-row gap-x-4 mb-6">
              <TouchableOpacity 
                onPress={() => { setShowDatePicker(true); setShowTimePicker(false); }}
                className={`flex-1 p-5 rounded-2xl border ${showDatePicker ? 'border-[#D35400] bg-orange-50 dark:bg-orange-900/20' : 'border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800'}`}
              >
                <Text className="text-[10px] text-gray-400 font-bold uppercase mb-1">Tarih</Text>
                <Text style={{ fontSize }} className={`font-black ${showDatePicker ? 'text-[#D35400]' : 'text-gray-700 dark:text-gray-200'}`}>{newDate}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => { setShowTimePicker(true); setShowDatePicker(false); }}
                className={`flex-1 p-5 rounded-2xl border ${showTimePicker ? 'border-[#D35400] bg-orange-50 dark:bg-orange-900/20' : 'border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800'}`}
              >
                <Text className="text-[10px] text-gray-400 font-bold uppercase mb-1">Saat</Text>
                <Text style={{ fontSize }} className={`font-black ${showTimePicker ? 'text-[#D35400]' : 'text-gray-700 dark:text-gray-200'}`}>{newTime}</Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <View className="mb-6">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                  {generateDates().map((d, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => { setNewDate(d.full); setShowDatePicker(false); }}
                      className={`mr-3 items-center p-4 rounded-2xl border ${newDate === d.full ? 'bg-[#D35400] border-[#D35400]' : 'bg-gray-50 dark:bg-zinc-800 border-gray-100 dark:border-zinc-700'}`}
                    >
                      <Text className={`text-[10px] font-bold uppercase ${newDate === d.full ? 'text-orange-100' : 'text-gray-400'}`}>{d.weekday}</Text>
                      <Text className={`text-xl font-black ${newDate === d.full ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>{d.day}</Text>
                      <Text className={`text-[10px] font-bold ${newDate === d.full ? 'text-orange-100' : 'text-gray-400'}`}>{d.month}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {showTimePicker && (
              <View className="mb-6 h-40">
                <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                  <View className="flex-row flex-wrap gap-2">
                    {generateTimes().map((t, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => { setNewTime(t); setShowTimePicker(false); }}
                        className={`px-5 py-3 rounded-xl border ${newTime === t ? 'bg-[#D35400] border-[#D35400]' : 'bg-gray-50 dark:bg-zinc-800 border-gray-100 dark:border-zinc-700'}`}
                      >
                        <Text className={`font-black ${newTime === t ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>{t}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            <TouchableOpacity
              onPress={addNotification}
              className="bg-[#D35400] p-5 rounded-2xl items-center shadow-lg shadow-orange-300 mt-4"
            >
              <Text className="text-white font-black text-lg">HATIRLATICI OLUŞTUR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
