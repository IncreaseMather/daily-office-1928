import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLiturgicalSeason, type LiturgicalSeason } from './liturgicalCalendar';

// ── AsyncStorage keys (exported so SettingsScreen can share them) ─────────────

export const ASYNC_KEY_MP_REMINDER = '@settings/mpReminder';
export const ASYNC_KEY_EP_REMINDER = '@settings/epReminder';
export const ASYNC_KEY_MP_HOUR     = '@settings/mpHour';
export const ASYNC_KEY_MP_MINUTES  = '@settings/mpMinutes';
export const ASYNC_KEY_EP_HOUR     = '@settings/epHour';
export const ASYNC_KEY_EP_MINUTES  = '@settings/epMinutes';

// Fixed identifiers so cancellation always targets the right notification,
// regardless of whether the stored ID ever gets out of sync.
const MP_NOTIF_ID = 'morning-prayer-reminder';
const EP_NOTIF_ID = 'evening-prayer-reminder';

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

// ── Schedule / cancel ─────────────────────────────────────────────────────────

/**
 * hour24  — 24-hour clock value (0–23)
 * minute  — minute value (0–59)
 */
export async function scheduleMpReminder(hour24: number, minute: number): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(MP_NOTIF_ID).catch(() => {});
  const season = getLiturgicalSeason(new Date());
  await Notifications.scheduleNotificationAsync({
    identifier: MP_NOTIF_ID,
    content: {
      title: 'Time for Morning Prayer',
      body: MORNING_SENTENCES[season],
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hour24,
      minute,
    },
  });
}

export async function cancelMpReminder(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(MP_NOTIF_ID).catch(() => {});
}

export async function scheduleEpReminder(hour24: number, minute: number): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(EP_NOTIF_ID).catch(() => {});
  const season = getLiturgicalSeason(new Date());
  await Notifications.scheduleNotificationAsync({
    identifier: EP_NOTIF_ID,
    content: {
      title: 'Time for Evening Prayer',
      body: EVENING_SENTENCES[season],
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hour24,
      minute,
    },
  });
}

export async function cancelEpReminder(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(EP_NOTIF_ID).catch(() => {});
}

/**
 * Called on app launch / foreground. Re-schedules active reminders so the
 * seasonal opening sentence stays current for that day's liturgical season.
 * Checks the user's saved preference (not a stored notification ID) so that
 * a cancelled reminder is never silently revived.
 */
export async function rescheduleActiveReminders(): Promise<void> {
  const [mpEnabled, epEnabled, mpH, mpM, epH, epM] = await Promise.all([
    AsyncStorage.getItem(ASYNC_KEY_MP_REMINDER),
    AsyncStorage.getItem(ASYNC_KEY_EP_REMINDER),
    AsyncStorage.getItem(ASYNC_KEY_MP_HOUR),
    AsyncStorage.getItem(ASYNC_KEY_MP_MINUTES),
    AsyncStorage.getItem(ASYNC_KEY_EP_HOUR),
    AsyncStorage.getItem(ASYNC_KEY_EP_MINUTES),
  ]);

  if (mpEnabled === 'true') {
    const h = parseInt(mpH ?? '7', 10);
    const m = parseInt(mpM ?? '0', 10);
    // Stored hour is 12-hour AM value; convert to 24-hour
    await scheduleMpReminder(h === 12 ? 0 : h, m);
  }
  if (epEnabled === 'true') {
    const h = parseInt(epH ?? '7', 10);
    const m = parseInt(epM ?? '0', 10);
    // Stored hour is 12-hour PM value; convert to 24-hour
    await scheduleEpReminder(h === 12 ? 12 : h + 12, m);
  }
}
