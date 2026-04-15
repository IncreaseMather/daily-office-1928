import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, View, Text, Platform, AppState } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { NavigationContainer, DefaultTheme, DarkTheme, useNavigation, type Theme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  EBGaramond_400Regular,
  EBGaramond_400Regular_Italic,
  EBGaramond_700Bold,
} from '@expo-google-fonts/eb-garamond';

import { MorningPrayerScreen } from './src/screens/MorningPrayerScreen';
import { EveningPrayerScreen } from './src/screens/EveningPrayerScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { Colors, DarkColors, Typography } from './src/theme';
import { getInitialOffice } from './src/utils/dateHelpers';
import { SettingsProvider, useTheme } from './src/context/SettingsContext';
import { SelectedDateProvider } from './src/context/SelectedDateContext';
import { rescheduleActiveReminders } from './src/utils/notifications';

// ── Navigation themes ─────────────────────────────────────────────────────────
// Passing a `theme` to NavigationContainer propagates colors to all navigation
// chrome (tab bar background, header, borders) in a single synchronous update,
// eliminating the one-frame lag that occurs when relying on screenOptions props.

const lightNavTheme: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary:      Colors.tabActive,
    background:   Colors.parchment,
    card:         Colors.tabBar,      // tab bar + header background
    text:         Colors.ink,
    border:       Colors.rule,        // tab bar top border + header bottom border
    notification: Colors.rubric,
  },
};

const darkNavTheme: Theme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary:      DarkColors.tabActive,
    background:   DarkColors.parchment,
    card:         DarkColors.tabBar,
    text:         DarkColors.ink,
    border:       DarkColors.rule,
    notification: DarkColors.rubric,
  },
};

// ── Navigator ─────────────────────────────────────────────────────────────────

const Tab = createBottomTabNavigator();

/**
 * Watches AppState and navigates to the correct office tab whenever the app
 * returns to the foreground. Switches to Morning Prayer before noon and
 * Evening Prayer from noon onward. Also handles overnight date changes.
 */
function OfficeSwitcher() {
  const navigation = useNavigation<any>();
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    rescheduleActiveReminders();
    const sub = AppState.addEventListener('change', (nextState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextState === 'active'
      ) {
        const office = new Date().getHours() < 12 ? 'Morning Prayer' : 'Evening Prayer';
        navigation.navigate(office);
        rescheduleActiveReminders();
      }
      appStateRef.current = nextState;
    });
    return () => sub.remove();
  }, [navigation]);

  return null;
}

function TabNavigator() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const extraBottom = Platform.OS === 'android' ? 16 : 0;
  const tabBarHeight = 56 + insets.bottom + extraBottom;

  return (
    <>
    <OfficeSwitcher />
    <Tab.Navigator
      id={undefined}
      initialRouteName={getInitialOffice()}
      screenOptions={{
        // backgroundColor and borderColor intentionally omitted here —
        // they come from the NavigationContainer theme (card / border) above
        // and are applied synchronously to all chrome in one pass.
        headerTitleStyle: {
          fontFamily: Typography.serifBold,
          fontSize: Typography.sizes.subheading,
          color: colors.ink,
        },
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarStyle: {
          borderTopWidth: 1.5,
          height: tabBarHeight,
          paddingBottom: insets.bottom + extraBottom,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
        },
        tabBarItemStyle: { justifyContent: 'center', alignItems: 'center' },
        tabBarLabelStyle: {
          fontFamily: Typography.serifBold,
          fontSize: Typography.sizes.label,
          textAlign: 'center',
        },
        tabBarActiveTintColor:   colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarIcon: () => null,
      }}
    >
      <Tab.Screen
        name="Morning Prayer"
        children={() => <ErrorBoundary><MorningPrayerScreen /></ErrorBoundary>}
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Svg width={20} height={20} viewBox="0 0 20 20">
                <Circle cx="10" cy="10" r="5" stroke={colors.ink} strokeWidth="1.5" fill="none" />
                <Path d="M17 10 L19 10" stroke={colors.ink} strokeWidth="1.5" strokeLinecap="round" />
                <Path d="M14.95 14.95 L16.36 16.36" stroke={colors.ink} strokeWidth="1.5" strokeLinecap="round" />
                <Path d="M10 17 L10 19" stroke={colors.ink} strokeWidth="1.5" strokeLinecap="round" />
                <Path d="M5.05 14.95 L3.64 16.36" stroke={colors.ink} strokeWidth="1.5" strokeLinecap="round" />
                <Path d="M3 10 L1 10" stroke={colors.ink} strokeWidth="1.5" strokeLinecap="round" />
                <Path d="M5.05 5.05 L3.64 3.64" stroke={colors.ink} strokeWidth="1.5" strokeLinecap="round" />
                <Path d="M10 3 L10 1" stroke={colors.ink} strokeWidth="1.5" strokeLinecap="round" />
                <Path d="M14.95 5.05 L16.36 3.64" stroke={colors.ink} strokeWidth="1.5" strokeLinecap="round" />
              </Svg>
              <Text style={{ fontFamily: Typography.serifBold, fontSize: Typography.sizes.subheading, color: colors.ink }}>
                Morning Prayer
              </Text>
            </View>
          ),
          headerTitleAlign: 'left',
        }}
      />
      <Tab.Screen
        name="Evening Prayer"
        children={() => <ErrorBoundary><EveningPrayerScreen /></ErrorBoundary>}
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Svg width={20} height={20} viewBox="0 0 20 20">
                <Path
                  d="M16.04 3.1 A 8 8 0 1 0 16.04 16.9 A 7.2 7.2 0 0 1 16.04 3.1 Z"
                  fill={colors.ink}
                />
              </Svg>
              <Text style={{ fontFamily: Typography.serifBold, fontSize: Typography.sizes.subheading, color: colors.ink }}>
                Evening Prayer
              </Text>
            </View>
          ),
          headerTitleAlign: 'left',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 16, color: focused ? colors.tabActive : colors.tabInactive, marginBottom: -2 }}>
              {'⚙'}
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
    </>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [fontsLoaded] = useFonts({
    EBGaramond_400Regular,
    EBGaramond_400Regular_Italic,
    EBGaramond_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: Colors.parchment, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={Colors.inkLight} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <SelectedDateProvider>
          <AppInner />
        </SelectedDateProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

/** Separated so TabNavigator and NavigationContainer can both call useTheme()
 *  (requires SettingsProvider to be mounted above in the tree). */
function AppInner() {
  const { isDark, colors } = useTheme();
  return (
    <NavigationContainer theme={isDark ? darkNavTheme : lightNavTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.parchment} />
      <TabNavigator />
    </NavigationContainer>
  );
}
