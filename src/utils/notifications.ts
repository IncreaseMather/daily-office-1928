import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLiturgicalSeason, type LiturgicalSeason } from './liturgicalCalendar';

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

// ── Seasonal opening sentences ────────────────────────────────────────────────

const MORNING_SENTENCES: Record<LiturgicalSeason, string> = {
  Advent:    'In the wilderness prepare the way of the Lord; make straight in the desert a highway for our God.',
  Christmas: 'Behold, I bring you good news of a great joy which will come to all people; for to you is born this day a Savior, who is Christ the Lord.',
  Epiphany:  'Arise, shine; for your light has come, and the glory of the Lord has risen upon you.',
  'Pre-Lent':'If we say we have no sin, we deceive ourselves, but if we confess our sins, God is faithful and just to forgive us our sins.',
  Lent:      'If we say we have no sin, we deceive ourselves, but if we confess our sins, God is faithful and just to forgive us our sins.',
  Easter:    'Alleluia! Christ is risen! The Lord is risen indeed, Alleluia!',
  Trinity:   'O Lord, open thou our lips. And our mouth shall shew forth thy praise.',
};

const EVENING_SENTENCES: Record<LiturgicalSeason, string> = {
  Advent:    'The Lord will give you a sign; a young woman shall conceive and bear a son.',
  Christmas: 'The Word was made flesh and dwelt among us, and we beheld his glory.',
  Epiphany:  'Nations shall come to your light, and kings to the brightness of your rising.',
  'Pre-Lent':'Seek the Lord while he may be found, call upon him while he is near.',
  Lent:      'Seek the Lord while he may be found, call upon him while he is near.',
  Easter:    'Thanks be to God, who gives us the victory through our Lord Jesus Christ.',
  Trinity:   'O God, make speed to save us. O Lord, make haste to help us.',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── Schedule / cancel ─────────────────────────────────────────────────────────

export async function scheduleMpReminder(): Promise<void> {
  await cancelById(MP_ID_KEY);
  const season = getLiturgicalSeason(new Date());
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time for Morning Prayer',
      body: MORNING_SENTENCES[season],
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 7,
      minute: 0,
    },
  });
  await AsyncStorage.setItem(MP_ID_KEY, id);
}

export async function cancelMpReminder(): Promise<void> {
  await cancelById(MP_ID_KEY);
}

export async function scheduleEpReminder(): Promise<void> {
  await cancelById(EP_ID_KEY);
  const season = getLiturgicalSeason(new Date());
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time for Evening Prayer',
      body: EVENING_SENTENCES[season],
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 19,
      minute: 0,
    },
  });
  await AsyncStorage.setItem(EP_ID_KEY, id);
}

export async function cancelEpReminder(): Promise<void> {
  await cancelById(EP_ID_KEY);
}

/**
 * Called on app launch to keep notification bodies current with the liturgical
 * season. Re-schedules any active reminders so the season sentence updates.
 */
export async function rescheduleActiveReminders(): Promise<void> {
  const [mpId, epId] = await Promise.all([
    AsyncStorage.getItem(MP_ID_KEY),
    AsyncStorage.getItem(EP_ID_KEY),
  ]);
  if (mpId) await scheduleMpReminder();
  if (epId) await scheduleEpReminder();
}
