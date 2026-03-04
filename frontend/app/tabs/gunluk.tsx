import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Dimensions, ActivityIndicator } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft, FadeIn, ScaleInCenter } from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import { CheckSquare, Square, ChevronLeft, ChevronRight, Moon, Smile, Meh, Frown, Thermometer, Battery, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { useSettings } from '@/context/SettingsContext';

const symptomOptions = [
  "Egzersiz yapmadım",
  "Yüzme",
  "Yoga",
  "Sırt Ağrısı",
  "Bacak Ağrısı",
  "İştahsızlık",
  "Mide Bulantısı",
  "Baş Dönmesi"
];

const moodOptions = [
  { label: 'Harika', icon: Smile, color: '#10B981', value: 3 },
  { label: 'Normal', icon: Meh, color: '#F59E0B', value: 2 },
  { label: 'Düşük', icon: Frown, color: '#EF4444', value: 1 },
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
  const [analysisReport, setAnalysisReport] = useState<string[]>([]);
  
  const totalSteps = 5;

    const generateAnalysis = () => {
      let reports = [];
      
      // Ağrı Analizi
      if (pain > 7) {
        reports.push("⚠️ Şiddetli ağrı bildirimi (" + pain + "/10). Lütfen doktorunuzun reçete ettiği hızlı etkili ilaçları kullanın ve fiziksel aktiviteyi durdurun.");
        reports.push("🚨 Ağrınız 2 saat içinde azalmazsa sağlık ekibinize haber vermeniz önerilir.");
      } else if (pain > 3) {
        reports.push("ℹ️ Orta düzey ağrı (" + pain + "/10). Ilık bir duş veya hafif nefes egzersizleri rahatlamanıza yardımcı olabilir.");
      } else {
        reports.push("✅ Ağrı kontrolünüz harika! Vücudunuz tedaviye iyi yanıt veriyor.");
      }

      // Yorgunluk ve Uyku
      if (fatigue > 6) {
        if (sleep < 6) {
          reports.push("💤 Yüksek yorgunluk ve yetersiz uyku tespit edildi. Vücudunuzun onarımı için bugün mutlaka 2 saatlik bir gündüz uykusu planlayın.");
        } else {
          reports.push("⚡ Yorgunluk seviyeniz yüksek. Enerjinizi korumak için bugün sadece temel ihtiyaçlarınıza odaklanın ve ağır işlerden kaçının.");
        }
      } else if (fatigue > 0 && sleep >= 8) {
        reports.push("🌙 Uyku süreniz ideal (" + sleep + " saat), ancak yorgunluk hissiniz devam ediyor. Bunu bir sonraki randevunuzda doktorunuzla paylaşabilirsiniz.");
      }
      
      // Ruh Hali
      if (mood === 1) {
        reports.push("🧡 Bugün moraliniz biraz düşük. Unutmayın, bu iniş çıkışlar sürecin bir parçası. Destek gruplarıyla iletişime geçmek veya bir arkadaşınızla konuşmak iyi gelebilir.");
      } else if (mood === 3) {
        reports.push("✨ Harika bir ruh hali! Pozitif enerjiniz iyileşme sürecinizi destekliyor.");
      }
      
      // Semptomlar
      if (selectedSymptoms.length > 0) {
        if (selectedSymptoms.includes("İştahsızlık")) reports.push("🍎 İştahsızlık için az ama sık yemek yeme kuralını uygulayın. Sıvı protein takviyeleri veya soğuk gıdalar daha kolay tüketilebilir.");
        if (selectedSymptoms.includes("Mide Bulantısı")) reports.push("🤢 Bulantı için zencefilli çay, nane-limon veya doktorunuzun önerdiği anti-emetik ilaçları kullanabilirsiniz.");
        if (selectedSymptoms.includes("Baş Dönmesi")) reports.push("🌀 Baş dönmesi hissettiğinizde ani hareketlerden kaçının ve yeterli sıvı tükettiğinizden emin olun.");
        if (selectedSymptoms.includes("Sırt Ağrısı")) reports.push("🦴 Sırt ağrısı için uygun yatak pozisyonunu seçtiğinizden emin olun ve doktorunuza danışarak hafif esneme hareketleri yapın.");
      }

      if (reports.length === 0) reports.push("🌟 Tüm verileriniz ideal seviyelerde. Harika bir gün geçiriyorsunuz, böyle devam edin!");

      setAnalysisReport(reports);
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
    
    // Simulate real analysis and saving
    setTimeout(() => {
      setIsProcessing(false);
      setIsSaved(true);
    }, 2500);
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
        <Animated.View entering={ScaleInCenter} className="items-center">
          <View className="mb-8">
            <ActivityIndicator size="large" color="#D35400" />
          </View>
          <Text style={{ fontSize: fontSize + 6 }} className="font-black text-gray-800 dark:text-white text-center mb-3">Analiz Hazırlanıyor</Text>
          <Text style={{ fontSize: fontSize - 1 }} className="text-gray-500 dark:text-gray-400 text-center leading-relaxed">
            Yapay zeka asistanımız girdiğiniz verileri sağlık protokollerine göre inceliyor. Lütfen bekleyin...
          </Text>
        </Animated.View>
      </View>
    );
  }

  if (isSaved) {
    return (
      <ScrollView className="flex-1 bg-gray-50 dark:bg-zinc-950" showsVerticalScrollIndicator={false}>
        <View className="px-8 pt-16 pb-20">
          <Animated.View entering={FadeIn} className="items-center">
            <View className="w-24 h-24 bg-green-500 rounded-full items-center justify-center mb-6 shadow-xl shadow-green-200">
              <CheckCircle2 color="white" size={60} />
            </View>
            <Text style={{ fontSize: fontSize + 10 }} className="font-black text-gray-800 dark:text-white text-center mb-2">Başarıyla Kaydedildi</Text>
            <Text style={{ fontSize: fontSize - 2 }} className="text-gray-400 font-bold mb-10">04 Mart 2026 • Günlük Kaydı</Text>
            
            <View className="w-full bg-white dark:bg-zinc-900 p-8 rounded-[40px] border border-gray-100 dark:border-zinc-800 shadow-sm mb-10">
              <View className="flex-row items-center mb-6">
                <View className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl items-center justify-center mr-3">
                  <AlertCircle color="#D35400" size={20} />
                </View>
                <Text className="text-xs font-black text-gray-400 uppercase tracking-widest">Sağlık Analiz Raporu</Text>
              </View>
              
              {analysisReport.map((report, idx) => (
                <View key={idx} className="mb-4 flex-row">
                  <Text style={{ fontSize }} className="text-gray-700 dark:text-gray-200 leading-relaxed font-bold">
                    {report}
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity 
              onPress={resetDiary}
              activeOpacity={0.8}
              className="bg-[#D35400] w-full py-6 rounded-3xl items-center shadow-2xl shadow-orange-300"
            >
              <Text className="text-white font-black text-xl tracking-widest">ANA SAYFAYA DÖN</Text>
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
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} key="step1" className="items-center">
            <View className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-3xl items-center justify-center mb-6">
              <Thermometer color="#D35400" size={40} />
            </View>
            <Text style={{ fontSize: fontSize + 10 }} className="font-black text-gray-800 dark:text-white text-center mb-2">Ağrı Durumu</Text>
            <Text style={{ fontSize }} className="text-gray-500 dark:text-gray-400 text-center mb-10 px-6">Bugün fiziksel olarak ne kadar ağrı hissediyorsun?</Text>
            
            <View className="w-full bg-white dark:bg-zinc-900 p-10 rounded-[40px] shadow-sm border border-gray-100 dark:border-zinc-800 items-center">
              <Text className="text-8xl font-black text-[#D35400] mb-6">{Math.round(pain)}</Text>
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
              <View className="flex-row justify-between w-full mt-4 px-2">
                <Text className="text-gray-400 font-black text-[10px] uppercase tracking-wider">Çok İyi</Text>
                <Text className="text-gray-400 font-black text-[10px] uppercase tracking-wider">Şiddetli</Text>
              </View>
            </View>
          </Animated.View>
        );
      case 2:
        return (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} key="step2" className="items-center">
            <View className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-3xl items-center justify-center mb-6">
              <Battery color="#3B82F6" size={40} />
            </View>
            <Text style={{ fontSize: fontSize + 10 }} className="font-black text-gray-800 dark:text-white text-center mb-2">Enerji Seviyesi</Text>
            <Text style={{ fontSize }} className="text-gray-500 dark:text-gray-400 text-center mb-10 px-6">Bugün kendini ne kadar yorgun hissediyorsun?</Text>
            
            <View className="w-full bg-white dark:bg-zinc-900 p-10 rounded-[40px] shadow-sm border border-gray-100 dark:border-zinc-800 items-center">
              <Text className="text-8xl font-black text-[#3B82F6] mb-6">{Math.round(fatigue)}</Text>
              <Slider
                style={{ width: '100%', height: 60 }}
                minimumValue={0}
                maximumValue={10}
                step={1}
                value={fatigue}
                onValueChange={setFatigue}
                minimumTrackTintColor="#3B82F6"
                maximumTrackTintColor="#F3F4F6"
                thumbTintColor="#3B82F6"
              />
              <View className="flex-row justify-between w-full mt-4 px-2">
                <Text className="text-gray-400 font-black text-[10px] uppercase tracking-wider">Enerjik</Text>
                <Text className="text-gray-400 font-black text-[10px] uppercase tracking-wider">Bitkin</Text>
              </View>
            </View>
          </Animated.View>
        );
      case 3:
        return (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} key="step3" className="items-center">
            <View className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-3xl items-center justify-center mb-6">
              <Moon color="#A855F7" size={40} />
            </View>
            <Text style={{ fontSize: fontSize + 10 }} className="font-black text-gray-800 dark:text-white text-center mb-2">Uyku Düzeni</Text>
            <Text style={{ fontSize }} className="text-gray-500 dark:text-gray-400 text-center mb-10 px-6">Dün gece toplamda kaç saat uyudun?</Text>
            
            <View className="w-full bg-white dark:bg-zinc-900 p-10 rounded-[40px] shadow-sm border border-gray-100 dark:border-zinc-800 items-center">
              <Text className="text-8xl font-black text-[#A855F7] mb-6">{Math.round(sleep)}<Text className="text-4xl text-gray-300">s</Text></Text>
              <Slider
                style={{ width: '100%', height: 60 }}
                minimumValue={0}
                maximumValue={12}
                step={0.5}
                value={sleep}
                onValueChange={setSleep}
                minimumTrackTintColor="#A855F7"
                maximumTrackTintColor="#F3F4F6"
                thumbTintColor="#A855F7"
              />
              <View className="flex-row justify-between w-full mt-4 px-2">
                <Text className="text-gray-400 font-black text-[10px] uppercase tracking-wider">Yetersiz</Text>
                <Text className="text-gray-400 font-black text-[10px] uppercase tracking-wider">İdeal (8+)</Text>
              </View>
            </View>
          </Animated.View>
        );
      case 4:
        return (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} key="step4">
            <Text style={{ fontSize: fontSize + 10 }} className="font-black text-gray-800 dark:text-white text-center mb-2">Duygusal Durum</Text>
            <Text style={{ fontSize }} className="text-gray-500 dark:text-gray-400 text-center mb-10">Zihinsel olarak nasıl hissediyorsun?</Text>
            
            <View className="flex-row justify-between">
              {moodOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setMood(option.value)}
                  activeOpacity={0.8}
                  className={`flex-1 mx-2 p-8 rounded-[36px] items-center border-4 ${
                    mood === option.value 
                      ? 'bg-white dark:bg-zinc-800 border-[#D35400] shadow-xl' 
                      : 'bg-white dark:bg-zinc-900 border-transparent shadow-sm'
                  }`}
                >
                  <option.icon 
                    size={48} 
                    color={mood === option.value ? '#D35400' : '#E5E7EB'} 
                  />
                  <Text style={{ fontSize: fontSize - 2 }} className={`mt-4 font-black tracking-widest uppercase ${
                    mood === option.value ? 'text-[#D35400]' : 'text-gray-300'
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
            <Text style={{ fontSize: fontSize + 10 }} className="font-black text-gray-800 dark:text-white text-center mb-2">Ek Semptomlar</Text>
            <Text style={{ fontSize }} className="text-gray-500 dark:text-gray-400 text-center mb-10">Bugün yaşadığın belirgin bir şikayetin var mı?</Text>
            
            <View className="flex-row flex-wrap gap-4 justify-center">
              {symptomOptions.map((option) => (
                <TouchableOpacity 
                  key={option}
                  activeOpacity={0.7}
                  onPress={() => toggleSymptom(option)}
                  className={`flex-row items-center px-6 py-5 rounded-[24px] border-2 ${
                    selectedSymptoms.includes(option) 
                      ? 'bg-orange-500 border-orange-500 shadow-lg shadow-orange-200' 
                      : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 shadow-sm'
                  }`}
                >
                  <Text style={{ fontSize: fontSize - 1 }} className={`font-black ${
                    selectedSymptoms.includes(option) ? 'text-white' : 'text-gray-500 dark:text-gray-300'
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
      <View className="flex-1 px-6 pt-10">
        {/* Modern Progress Steps */}
        <View className="flex-row justify-center mb-16 gap-x-3">
          {Array.from({ length: totalSteps }).map((_, idx) => {
            const step = idx + 1;
            const isActive = currentStep === step;
            const isCompleted = currentStep > step;
            return (
              <View 
                key={step} 
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  isActive ? 'bg-[#D35400] w-16' : isCompleted ? 'bg-orange-300 w-4' : 'bg-gray-200 dark:bg-zinc-800 w-4'
                }`}
              />
            );
          })}
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 200 }}
        >
          {renderStep()}
        </ScrollView>
      </View>

      {/* Modern Floating Navigation */}
      <View className="absolute bottom-10 left-6 right-6 flex-row items-center gap-x-4">
        {currentStep > 1 && (
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={prevStep}
            className="w-20 h-20 rounded-[28px] bg-white dark:bg-zinc-900 items-center justify-center shadow-xl shadow-gray-200 dark:shadow-none border border-gray-100 dark:border-zinc-800"
          >
            <ChevronLeft color="#D35400" size={32} />
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={nextStep}
          className="flex-1 bg-[#D35400] h-20 rounded-[28px] flex-row items-center justify-center shadow-2xl shadow-orange-400"
        >
          <Text style={{ fontSize: fontSize + 2 }} className="text-white font-black uppercase tracking-[3px] mr-2">
            {currentStep === totalSteps ? 'Analiz Et' : 'Devam Et'}
          </Text>
          {currentStep < totalSteps && <ChevronRight color="white" size={24} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}
