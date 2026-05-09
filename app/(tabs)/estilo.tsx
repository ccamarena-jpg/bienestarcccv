import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { CText } from '../../components/clasica/CText';
import { CCard } from '../../components/clasica/CCard';
import { CHairline } from '../../components/clasica/CHairline';
import { Colors, Spacing } from '../../constants/tokens';
import { useAppStore } from '../../store/useAppStore';

const READINGS = [
  {
    title: 'Lectura de hoy',
    text: 'Capas que se leen como decisión. El lino sobre el algodón, el cuello abierto que no pide permiso. Este outfit dice que sabes adónde vas aunque no lo hayas planeado.',
    tags: ['neutros', 'capas', 'lino', 'silueta media'],
  },
];

export default function Estilo() {
  const { outfitImg, setOutfitImg } = useAppStore();
  const reading = READINGS[0];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [3, 4],
    });

    if (!result.canceled && result.assets[0]) {
      setOutfitImg(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <CText variant="mono" muted style={styles.eyebrow}>ESTILO · MOMENTO</CText>
        <CHairline style={styles.rule} />

        {/* Outfit photo */}
        <TouchableOpacity style={styles.photoContainer} onPress={pickImage} activeOpacity={0.85}>
          {outfitImg ? (
            <Image source={{ uri: outfitImg }} style={styles.photo} resizeMode="cover" />
          ) : (
            <View style={styles.photoPlaceholder}>
              <CText variant="displayM" serif italic muted style={{ opacity: 0.4 }}>
                outfit
              </CText>
              <CText variant="bodyS" muted style={{ marginTop: Spacing.sm }}>
                Toca para subir foto
              </CText>
            </View>
          )}
          <View style={styles.photoOverlay}>
            <CText variant="mono" style={{ color: Colors.white, fontSize: 9, letterSpacing: 1.5 }}>
              {outfitImg ? '↑ CAMBIAR' : '+ SUBIR FOTO'}
            </CText>
          </View>
        </TouchableOpacity>

        {/* Reading */}
        <CCard style={styles.readingCard}>
          <CText variant="mono" accent style={styles.readingEyebrow}>{reading.title.toUpperCase()}</CText>
          <CHairline style={{ marginVertical: Spacing.sm }} />
          <CText variant="bodyL" serif italic style={styles.readingText}>
            {reading.text}
          </CText>
          <View style={styles.tags}>
            {reading.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <CText variant="mono" muted style={styles.tagText}>{tag}</CText>
              </View>
            ))}
          </View>
        </CCard>

        {/* History placeholder */}
        <View style={styles.historyHeader}>
          <CText variant="mono" muted style={styles.historyTitle}>ESTA SEMANA</CText>
        </View>
        <View style={styles.historyGrid}>
          {[...Array(5)].map((_, i) => (
            <View key={i} style={[styles.historyCell, i === 0 && outfitImg ? {} : styles.historyCellEmpty]}>
              {i === 0 && outfitImg ? (
                <Image source={{ uri: outfitImg }} style={styles.historyImg} resizeMode="cover" />
              ) : (
                <CText variant="mono" muted style={{ fontSize: 9 }}>
                  {['L', 'M', 'X', 'J', 'V'][i]}
                </CText>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.paper },
  container: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: Spacing.xl, gap: Spacing.md },
  eyebrow: { letterSpacing: 1.5, textTransform: 'uppercase' },
  rule: {},
  photoContainer: {
    height: 320,
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.rule,
  },
  photo: { width: '100%', height: '100%' },
  photoPlaceholder: {
    flex: 1,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(43,42,38,0.6)',
    padding: Spacing.sm,
    alignItems: 'center',
  },
  readingCard: { gap: 0 },
  readingEyebrow: { fontSize: 9, letterSpacing: 1.5 },
  readingText: { lineHeight: 26, color: Colors.ink },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginTop: Spacing.md },
  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.rule,
    borderRadius: 2,
  },
  tagText: { fontSize: 10, letterSpacing: 1 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historyTitle: { letterSpacing: 1.5, textTransform: 'uppercase' },
  historyGrid: { flexDirection: 'row', gap: Spacing.xs },
  historyCell: {
    flex: 1,
    aspectRatio: 0.75,
    borderRadius: 2,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.rule,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyCellEmpty: { backgroundColor: Colors.surface },
  historyImg: { width: '100%', height: '100%' },
});
