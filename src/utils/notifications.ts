import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MP_ID_KEY = '@notif/mpId';
const EP_ID_KEY = '@notif/epId';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

async function cancelById(storageKey: string) {
  const id = await AsyncStorage.getItem(storageKey);
  if (id) {
    await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
    await AsyncStorage.removeItem(storageKey);
  }
}

export async function scheduleMpReminder(timeStr: string): Promise<void> {
  await cancelById(MP_ID_KEY);
  const [hour, minute] = timeStr.split(':').map(Number);
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time for Morning Prayer',
      body: 'The Daily Office awaits.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
  await AsyncStorage.setItem(MP_ID_KEY, id);
}

export async function cancelMpReminder(): Promise<void> {
  await cancelById(MP_ID_KEY);
}

export async function scheduleEpReminder(timeStr: string): Promise<void> {
  await cancelById(EP_ID_KEY);
  const [hour, minute] = timeStr.split(':').map(Number);
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time for Evening Prayer',
      body: 'The Daily Office awaits.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
  await AsyncStorage.setItem(EP_ID_KEY, id);
}

export async function cancelEpReminder(): Promise<void> {
  await cancelById(EP_ID_KEY);
}
