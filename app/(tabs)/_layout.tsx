import { Tabs } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Colors, Spacing } from '../../constants/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NAV_ITEMS = [
  { name: 'hoy', label: 'Hoy', icon: '◐' },
  { name: 'cocina', label: 'Cocina', icon: '◍' },
  { name: 'gastos', label: 'S/', icon: '◎' },
  { name: 'estilo', label: 'Estilo', icon: '◑' },
  { name: 'agenda', label: 'Cuerpo', icon: '◒' },
];

function CNav({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.nav, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.navInner}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const item = NAV_ITEMS.find((n) => n.name === route.name) || NAV_ITEMS[0];
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={styles.navItem}
              activeOpacity={0.7}
            >
              <Text style={[styles.navIcon, isFocused && styles.navIconActive]}>
                {item.icon}
              </Text>
              <Text style={[styles.navLabel, isFocused && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <CNav {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="hoy" />
      <Tabs.Screen name="cocina" />
      <Tabs.Screen name="gastos" />
      <Tabs.Screen name="estilo" />
      <Tabs.Screen name="agenda" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  nav: {
    backgroundColor: Colors.paper,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.rule,
  },
  navInner: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingHorizontal: Spacing.sm,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    gap: 3,
  },
  navIcon: {
    fontSize: 16,
    color: Colors.muted,
  },
  navIconActive: {
    color: Colors.ink,
  },
  navLabel: {
    fontSize: 10,
    fontFamily: 'JetBrainsMono_400Regular',
    color: Colors.muted,
    letterSpacing: 0.5,
  },
  navLabelActive: {
    color: Colors.ink,
  },
});
