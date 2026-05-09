import { Tabs } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Colors, Radius } from '../../constants/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NAV_ITEMS = [
  { name: 'hoy',    icon: '⌂', label: 'Hoy' },
  { name: 'cocina', icon: '◍', label: 'Cocina' },
  { name: 'gastos', icon: 'S/', label: 'Gastos' },
  { name: 'estilo', icon: '◑', label: 'Estilo' },
  { name: 'agenda', icon: '◒', label: 'Agenda' },
];

function CNav({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.nav, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.pill}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const item = NAV_ITEMS.find((n) => n.name === route.name) || NAV_ITEMS[0];
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={[styles.navItem, isFocused && styles.navItemActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.navIcon, isFocused && styles.navIconActive]}>
                {item.icon}
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
    backgroundColor: Colors.bg,
    alignItems: 'center',
    paddingTop: 10,
  },
  pill: {
    flexDirection: 'row',
    backgroundColor: Colors.ink,
    borderRadius: Radius.pill,
    padding: 5,
    gap: 4,
  },
  navItem: {
    width: 48,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemActive: {
    backgroundColor: Colors.white,
  },
  navIcon: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
  },
  navIconActive: {
    color: Colors.ink,
  },
});
