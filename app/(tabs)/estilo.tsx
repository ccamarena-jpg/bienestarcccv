import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { CText } from '../../components/clasica/CText';
import { Colors, Spacing, Radius, Shadow } from '../../constants/tokens';
import { useAppStore } from '../../store/useAppStore';

const READING = {
  text: 'Capas que se leen como decisión. El lino sobre el algodón, el cuello abierto que no pide permiso. Este outfit dice que sabes adónde vas aunque no lo hayas planeado.',
  tags: ['neutros', 'capas', 'lino', 'silueta media'],
};

const DIAS = ['L', 'M', 'X', 'J', 'V'];

export default function Estilo() {
  const { outfitImg, setOutfitImg } = useAppStore();

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

        {/* Header */}
        <View style={styles.header}>
          <CText variant="title" weight="bold" style={{ fontSize: 28, color: Colors.ink }}>Estilo</CText>
          <CText variant="body" muted>Tu momento de hoy</CText>
        </View>

        {/* Photo card */}
        <TouchableOpacity style={styles.photoCard} onPress={pickImage} activeOpacity={0.9}>
          {outfitImg ? (
            <Image source={{ uri: outfitImg }} style={styles.photo} resizeMode="cover" />
          ) : (
            <View style={styles.photoPlaceholder}>
              <CText style={{ fontSize: 48 }}>👗</CText>
              <CText variant="subtitle" weight="semi" style={{ color: Colors.pinkDk, marginTop: Spacing.sm }}>
                Sube tu outfit
              </CText>
              <CText variant="bodyS" muted style={{ marginTop: 4, textAlign: 'center' }}>
                Toca para añadir la foto del día
              </CText>
            </View>
          )}
          <View style={styles.photoOverlay}>
            <View style={styles.overlayPill}>
              <CText variant="label" style={{ color: Colors.white, letterSpacing: 1 }}>
                {outfitImg ? '↑ CAMBIAR FOTO' : '+ SUBIR FOTO'}
              </CText>
            </View>
          </View>
        </TouchableOpacity>

        {/* Lectura del estilo */}
        <View style={styles.readingCard}>
          <View style={styles.readingHeader}>
            <View style={styles.readingBadge}>
              <CText variant="label" style={{ color: Colors.pinkDk, letterSpacing: 1 }}>LECTURA DE HOY</CText>
            </View>
          </View>
          <CText variant="body" italic style={{ lineHeight: 24, color: Colors.ink }}>
            "{READING.text}"
          </CText>
          <View style={styles.tags}>
            {READING.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <CText variant="label" style={{ color: Colors.pinkDk }}>{tag}</CText>
              </View>
            ))}
          </View>
        </View>

        {/* Esta semana */}
        <View style={styles.semanaCard}>
          <CText variant="label" muted style={{ letterSpacing: 1, marginBottom: Spacing.sm }}>ESTA SEMANA</CText>
          <View style={styles.semanaGrid}>
            {DIAS.map((dia, i) => (
              <View key={dia} style={styles.semanahCell}>
                {i === 0 && outfitImg ? (
                  <Image source={{ uri: outfitImg }} style={styles.semanaImg} resizeMode="cover" />
                ) : (
                  <View style={styles.semanaEmpty}>
                    <CText variant="label" muted>{dia}</CText>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Tips anti-inflamatorio */}
        <View style={styles.tipCard}>
          <CText variant="label" style={{ color: Colors.limeDk, letterSpacing: 1, marginBottom: Spacing.xs }}>
            CUIDADO PERSONAL HOY
          </CText>
          {[
            { icon: '💧', tip: 'Hidratación: 2L de agua con limón' },
            { icon: '🌿', tip: 'Mascarilla de cúrcuma 15 min' },
            { icon: '😴', tip: 'Dormir 8h para reducir inflamación' },
          ].map(({ icon, tip }) => (
            <View key={tip} style={styles.tipRow}>
              <CText style={{ fontSize: 16 }}>{icon}</CText>
              <CText variant="bodyS" style={{ flex: 1, color: Colors.ink, lineHeight: 18 }}>{tip}</CText>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: 100, gap: Spacing.sm },
  header: { gap: 4, marginBottom: Spacing.xs },

  photoCard: {
    height: 300,
    borderRadius: Radius.card,
    overflow: 'hidden',
    backgroundColor: Colors.pink,
    ...Shadow.card,
  },
  photo: { width: '100%', height: '100%' },
  photoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.pink,
    gap: 4,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  overlayPill: {
    backgroundColor: 'rgba(26,26,46,0.65)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radius.pill,
  },

  readingCard: {
    backgroundColor: Colors.pink,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadow.card,
  },
  readingHeader: { flexDirection: 'row', alignItems: 'center' },
  readingBadge: {
    backgroundColor: Colors.pinkDk + '33',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    backgroundColor: Colors.white,
    borderRadius: Radius.pill,
  },

  semanaCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.card,
    padding: Spacing.md,
    ...Shadow.card,
  },
  semanaGrid: { flexDirection: 'row', gap: Spacing.xs },
  semanahCell: { flex: 1, aspectRatio: 0.75, borderRadius: 12, overflow: 'hidden' },
  semanaImg: { width: '100%', height: '100%' },
  semanaEmpty: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },

  tipCard: {
    backgroundColor: Colors.lime,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadow.card,
  },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
});
