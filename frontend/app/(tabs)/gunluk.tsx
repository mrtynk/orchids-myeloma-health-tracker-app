import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft, FadeIn } from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import { CheckSquare, Square, ChevronLeft, ChevronRight, Moon, Smile, Meh, Frown, Thermometer, Battery, CheckCircle2 } from 'lucide-react-native';
import { useSettings } from '@/context/SettingsContext';

const symptomOptions = [
  "Egzersiz yapmadım",
  "Yüzme",
  "Yoga",
  "Sırt Ağrısı",
  "Bacak Ağrısı",
  "İştahsızlık",
  "Diğer"
];

const moodOptions = [
  { label: 'Çok İyi', icon: Smile, color: '#10B981', value: 3 },
  { label: 'Normal', icon: Meh, color: '#F59E0B', value: 2 },
  { label: 'Kötü', icon: Frown, color: '#EF4444', value: 1 },
];

export default function DiaryTab() {
  const { fontSize, isDarkMode } = useSettings();
  const [currentStep, setCurrentStep] = useState(1);
  const [pain, setPain] = useState(0);
  const [fatigue, setFatigue] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState(2);
  const [sleep, setSleep] = useState(7);
  const [isSaved, setIsSaved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisReport, setAnalysisReport] = useState('');

  const totalSteps = 5;

  const generateAnalysis = () => {
    let report = "";
    
    // Ağrı Analizi
    if (pain > 7) report += "⚠️ Bugün bildirdiğiniz şiddetli ağrı seviyesi (" + pain + "/10) dikkat çekici. Mutlaka dinlenmeye özen gösterin ve doktorunuzun önerdiği ağrı yönetim planını uygulayın.\n\n";
    else if (pain > 3) report += "ℹ️ Hafif-orta düzeyde (" + pain + "/10) ağrı gözlemlendi. Hareketlerinizi kısıtlamadan hafif esneme egzersizleri ve nefes terapisi yapabilirsiniz.\n\n";
    else report += "✅ Ağrı seviyeniz oldukça düşük, vücudunuz bugün iyi bir direnç gösteriyor!\n\n";

    // Yorgunluk ve Uyku
    if (fatigue > 6 && sleep < 6) report += "💤 Yorgunluğunuzun (" + fatigue + "/10) temel sebebi yetersiz uyku (" + sleep + " saat) olabilir. Bugün vücudunuza toparlanma şansı tanımak için 8 saat uykuyu hedefleyin.\n\n";
    else if (fatigue > 6) report += "⚡ Yorgunluk seviyeniz yüksek. Gün içinde 'Power Nap' (20 dk kısa uyku) enerjinizi toplamanıza yardımcı olabilir.\n\n";
    
    // Ruh Hali
    if (mood === 1) report += "🧡 Duygusal olarak zorlandığınız bir gün. Unutmayın, bu süreçte moraliniz en büyük silahınız. Sevdiğiniz bir müziği dinlemek veya kısa bir yürüyüş ruhunuza iyi gelebilir.\n\n";
    else if (mood === 3) report += "✨ Harika bir ruh hali! Bu pozitif enerji iyileşme sürecinizi destekleyen en önemli faktörlerden biridir.\n\n";
    
    // Semptomlar
    if (selectedSymptoms.length > 0) {
      report += "🔍 Bildirdiğiniz semptomlar (" + selectedSymptoms.join(", ") + ") üzerine: ";
      if (selectedSymptoms.includes("İştahsızlık")) report += "Beslenmenizde protein ağırlıklı ve az ama sık öğünleri tercih edin. ";
      if (selectedSymptoms.includes("Sırt Ağrısı")) report += "Sırtınızı destekleyen yastıklar kullanın. ";
      report += "\n\n";
    }

    if (report === "") report += "🌟 Genel sağlık verileriniz stabil ve dengeli görünüyor. Mevcut rutininize ve doktor kontrollerinize sadık kalarak ilerlemeye devam edin.";

    setAnalysisReport(report);
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom) 
        : [...prev, symptom]
    );
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSave();
    }
  };

  const handleSave = () => {
    setIsProcessing(true);
    generateAnalysis();
    
    // Simulate processing/analysis
    setTimeout(() => {
      setIsProcessing(false);
      setIsSaved(true);
    }, 2000);
  };

  const resetDiary = () => {
    setCurrentStep(1);
    setPain(0);
    setFatigue(0);
    setSelectedSymptoms([]);
    setMood(2);
    setSleep(7);
    setIsSaved(false);
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isProcessing) {
    return (
      <View className="flex-1 bg-white dark:bg-zinc-950 items-center justify-center px-10">
        <Animated.View entering={FadeIn} className="items-center">
          <View className="w-20 h-20 border-4 border-[#D35400] border-t-transparent rounded-full animate-spin mb-8" />
          <Text style={{ fontSize: fontSize + 4 }} className="font-black text-gray-800 dark:text-white text-center mb-2">Analiz Ediliyor...</Text>
          <Text style={{ fontSize: fontSize - 2 }} className="text-gray-500 dark:text-gray-400 text-center">Verileriniz işleniyor ve size özel sağlık raporu hazırlanıyor.</Text>
        </Animated.View>
      </View>
    );
  }

  if (isSaved) {
    return (
      <ScrollView className="flex-1 bg-white dark:bg-zinc-950">
        <View className="items-center justify-center px-8 py-20">
          <Animated.View entering={FadeIn} className="items-center w-full">
            <View className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full items-center justify-center mb-6">
              <CheckCircle2 color="#22C55E" size={60} />
            </View>
            <Text style={{ fontSize: fontSize + 8 }} className="font-black text-gray-800 dark:text-white text-center mb-4">
              Kayıt Tamamlandı!
            </Text>
            
            <View className="w-full bg-orange-50 dark:bg-zinc-900 p-6 rounded-3xl border border-orange-100 dark:border-zinc-800 mb-8">
              <Text className="text-xs font-black text-[#D35400] uppercase tracking-widest mb-4">GÜNLÜK ANALİZ RAPORU</Text>
              <Text style={{ fontSize }} className="text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                {analysisReport}
              </Text>
            </View>

            <Text style={{ fontSize: fontSize - 2 }} className="text-gray-500 dark:text-gray-400 text-center mb-10 leading-relaxed italic">
              Bu analiz girdiğiniz verilere göre sistem tarafından otomatik oluşturulmuştur. Lütfen doktorunuzun tavsiyelerini önceliklendirin.
            </Text>

            <TouchableOpacity 
              onPress={resetDiary}
              className="bg-[#D35400] w-full py-5 rounded-2xl items-center shadow-lg shadow-orange-300"
            >
              <Text className="text-white font-black text-lg">ANA SAYFAYA DÖN</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} key="step1">
            <View className="flex-row items-center mb-2">
              <Thermometer color="#D35400" size={24} className="mr-2" />
              <Text style={{ fontSize: fontSize + 8 }} className="font-bold text-gray-800 dark:text-white">Ağrı Seviyeniz</Text>
            </View>
            <Text style={{ fontSize }} className="text-gray-500 dark:text-gray-400 mb-8">Şu anki ağrı seviyenizi 0 ile 10 arasında değerlendirin.</Text>
            
            <View className="items-center bg-white dark:bg-zinc-900 p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-zinc-800">
              <Text className="text-7xl font-black text-[#D35400] mb-8">{Math.round(pain)}</Text>
              <Slider
                style={{ width: '100%', height: 60 }}
                minimumValue={0}
                maximumValue={10}
                step={1}
                value={pain}
                onValueChange={setPain}
                minimumTrackTintColor="#D35400"
                maximumTrackTintColor="#F3F4F6"
                thumbTintColor="#D35400"
              />
              <View className="flex-row justify-between w-full mt-4">
                <Text className="text-gray-400 font-bold">Rahat</Text>
                <Text className="text-gray-400 font-bold">Şiddetli</Text>
              </View>
            </View>
          </Animated.View>
        );
      case 2:
        return (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} key="step2">
            <View className="flex-row items-center mb-2">
              <Battery color="#D35400" size={24} className="mr-2" />
              <Text style={{ fontSize: fontSize + 8 }} className="font-bold text-gray-800 dark:text-white">Yorgunluk Seviyeniz</Text>
            </View>
            <Text style={{ fontSize }} className="text-gray-500 dark:text-gray-400 mb-8">Şu anki yorgunluk seviyenizi 0 ile 10 arasında değerlendirin.</Text>
            
            <View className="items-center bg-white dark:bg-zinc-900 p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-zinc-800">
              <Text className="text-7xl font-black text-[#D35400] mb-8">{Math.round(fatigue)}</Text>
              <Slider
                style={{ width: '100%', height: 60 }}
                minimumValue={0}
                maximumValue={10}
                step={1}
                value={fatigue}
                onValueChange={setFatigue}
                minimumTrackTintColor="#D35400"
                maximumTrackTintColor="#F3F4F6"
                thumbTintColor="#D35400"
              />
              <View className="flex-row justify-between w-full mt-4">
                <Text className="text-gray-400 font-bold">Enerjik</Text>
                <Text className="text-gray-400 font-bold">Bitkin</Text>
              </View>
            </View>
          </Animated.View>
        );
      case 3:
        return (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} key="step3">
            <View className="flex-row items-center mb-2">
              <Moon color="#D35400" size={24} className="mr-2" />
              <Text style={{ fontSize: fontSize + 8 }} className="font-bold text-gray-800 dark:text-white">Uyku Süresi</Text>
            </View>
            <Text style={{ fontSize }} className="text-gray-500 dark:text-gray-400 mb-8">Dün gece kaç saat uyudunuz?</Text>
            
            <View className="items-center bg-white dark:bg-zinc-900 p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-zinc-800">
              <Text className="text-7xl font-black text-[#D35400] mb-8">{Math.round(sleep)}s</Text>
              <Slider
                style={{ width: '100%', height: 60 }}
                minimumValue={0}
                maximumValue={12}
                step={0.5}
                value={sleep}
                onValueChange={setSleep}
                minimumTrackTintColor="#D35400"
                maximumTrackTintColor="#F3F4F6"
                thumbTintColor="#D35400"
              />
              <View className="flex-row justify-between w-full mt-4">
                <Text className="text-gray-400 font-bold">0 saat</Text>
                <Text className="text-gray-400 font-bold">12+ saat</Text>
              </View>
            </View>
          </Animated.View>
        );
      case 4:
        return (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} key="step4">
            <View className="flex-row items-center mb-2">
              <Smile color="#D35400" size={24} className="mr-2" />
              <Text style={{ fontSize: fontSize + 8 }} className="font-bold text-gray-800 dark:text-white">Ruh Haliniz</Text>
            </View>
            <Text style={{ fontSize }} className="text-gray-500 dark:text-gray-400 mb-8">Bugün kendinizi nasıl hissediyorsunuz?</Text>
            
            <View className="flex-row justify-between">
              {moodOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setMood(option.value)}
                  className={`flex-1 mx-2 p-6 rounded-[32px] items-center border ${
                    mood === option.value 
                      ? 'bg-orange-50 dark:bg-orange-900/20 border-[#D35400]' 
                      : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 shadow-sm'
                  }`}
                >
                  <option.icon 
                    size={40} 
                    color={mood === option.value ? '#D35400' : '#9CA3AF'} 
                  />
                  <Text style={{ fontSize: fontSize - 2 }} className={`mt-3 font-bold ${
                    mood === option.value ? 'text-[#D35400]' : 'text-gray-500'
                  }`}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        );
      case 5:
        return (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} key="step5">
            <Text style={{ fontSize: fontSize + 8 }} className="font-bold mb-2 text-gray-800 dark:text-white">Semptomlar</Text>
            <Text style={{ fontSize }} className="text-gray-500 dark:text-gray-400 mb-6">Eklemek istediğiniz semptomlar var mı?</Text>
            
            <View className="flex-row flex-wrap gap-3">
              {symptomOptions.map((option) => (
                <TouchableOpacity 
                  key={option}
                  activeOpacity={0.7}
                  onPress={() => toggleSymptom(option)}
                  className={`flex-row items-center px-5 py-4 rounded-2xl border ${
                    selectedSymptoms.includes(option) 
                      ? 'bg-orange-50 dark:bg-orange-900/20 border-[#D35400]' 
                      : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 shadow-sm'
                  }`}
                >
                  {selectedSymptoms.includes(option) ? (
                    <CheckSquare color="#D35400" size={22} />
                  ) : (
                    <Square color="#9CA3AF" size={22} />
                  )}
                  <Text style={{ fontSize }} className={`ml-3 ${
                    selectedSymptoms.includes(option) 
                      ? 'text-[#D35400] font-bold' 
                      : 'text-gray-700 dark:text-gray-300 font-medium'
                  }`}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950">
      <View className="flex-1 px-6 pt-8">
        {/* Progress Bar */}
        <View className="flex-row justify-center mb-10 gap-x-2">
          {Array.from({ length: totalSteps }).map((_, idx) => {
            const step = idx + 1;
            return (
              <View 
                key={step} 
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentStep === step 
                    ? 'bg-[#D35400] w-14' 
                    : currentStep > step ? 'bg-orange-200 w-5' : 'bg-gray-200 w-5'
                }`}
              />
            );
          })}
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 150 }}
        >
          {renderStep()}
        </ScrollView>
      </View>

      {/* Footer Navigation */}
      <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 p-6 border-t border-gray-100 dark:border-zinc-800 shadow-2xl flex-row items-center gap-x-4">
        {currentStep > 1 && (
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={prevStep}
            className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-zinc-800 items-center justify-center"
          >
            <ChevronLeft color="#4B5563" size={32} />
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={nextStep}
          className="flex-1 bg-[#D35400] h-16 rounded-2xl flex-row items-center justify-center shadow-lg shadow-orange-300"
        >
          <Text style={{ fontSize }} className="text-white font-black uppercase tracking-widest mr-2">
            {currentStep === totalSteps ? 'Özet ve Kaydet' : 'Sonraki Adım'}
          </Text>
          {currentStep < totalSteps && <ChevronRight color="white" size={24} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}
