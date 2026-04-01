import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  View,
  PanResponder,
  Animated,
  StyleProp,
  ViewStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useTheme } from '../context/SettingsContext';

// ── Constants ─────────────────────────────────────────────────────────────────

const BAR_WIDTH_IDLE   = 3;
const BAR_WIDTH_ACTIVE = 9;
const INDICATOR_MIN_H  = 44;
const FADE_DELAY_MS    = 2000;
const HIT_SLOP         = 20; // extra tap width beyond bar so it's easy to grab

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const ScrollableScreen = React.forwardRef<ScrollView, Props>(
  function ScrollableScreen({ children, style, contentContainerStyle }, forwardedRef) {
    const { colors } = useTheme();

    // ── Refs ─────────────────────────────────────────────────────────────────

    const internalScrollRef = useRef<ScrollView>(null);

    // Merge forwarded ref with internal ref so callers can programmatically scroll
    const mergeRef = useCallback(
      (node: ScrollView | null) => {
        (internalScrollRef as React.MutableRefObject<ScrollView | null>).current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<ScrollView | null>).current = node;
        }
      },
      [forwardedRef],
    );

    const scrollYRef         = useRef(0);
    const contentHeightRef   = useRef(0);
    const containerHeightRef = useRef(0);
    const draggingRef        = useRef(false);
    const dragStartScrollY   = useRef(0);
    const fadeTimerRef       = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Animated values ───────────────────────────────────────────────────────
    //   barState: 0 = hidden · 1 = idle (40% opacity) · 2 = active (100% opacity)

    const barState     = useRef(new Animated.Value(0)).current;
    const indicatorTop = useRef(new Animated.Value(0)).current;

    const barOpacity = barState.interpolate({
      inputRange:  [0, 1, 2],
      outputRange: [0, 0.4, 1],
      extrapolate: 'clamp',
    });
    const barWidth = barState.interpolate({
      inputRange:  [0, 1, 2],
      outputRange: [BAR_WIDTH_IDLE, BAR_WIDTH_IDLE, BAR_WIDTH_ACTIVE],
      extrapolate: 'clamp',
    });

    // ── Indicator height in state (needs re-render on layout change) ──────────

    const [indicatorH, setIndicatorH] = useState(0);

    // ── Helpers ───────────────────────────────────────────────────────────────

    const computeIndicatorH = (): number => {
      const ch    = containerHeightRef.current;
      const total = contentHeightRef.current;
      if (!ch || !total || total <= ch) return 0;
      return Math.max((ch / total) * ch, INDICATOR_MIN_H);
    };

    const updateIndicatorPos = (scrollY: number) => {
      const ch    = containerHeightRef.current;
      const total = contentHeightRef.current;
      if (!ch || !total || total <= ch) return;
      const h         = computeIndicatorH();
      const maxScroll = total - ch;
      const maxTravel = ch - h;
      if (maxScroll <= 0 || maxTravel <= 0) return;
      const pos = Math.max(0, Math.min(maxTravel, (scrollY / maxScroll) * maxTravel));
      indicatorTop.setValue(pos);
    };

    // PanResponder is created once so these live in refs to avoid stale closures
    const showIdleRef   = useRef<() => void>(() => {});
    const showActiveRef = useRef<() => void>(() => {});

    showIdleRef.current = () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      Animated.timing(barState, {
        toValue: 1, duration: 120, useNativeDriver: false,
      }).start();
      fadeTimerRef.current = setTimeout(() => {
        if (!draggingRef.current) {
          Animated.timing(barState, {
            toValue: 0, duration: 400, useNativeDriver: false,
          }).start();
        }
      }, FADE_DELAY_MS);
    };

    showActiveRef.current = () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      Animated.timing(barState, {
        toValue: 2, duration: 100, useNativeDriver: false,
      }).start();
    };

    // ── Mount flash ───────────────────────────────────────────────────────────

    useEffect(() => {
      // Brief appearance so users discover the scrollbar exists
      Animated.sequence([
        Animated.timing(barState, { toValue: 1, duration: 200, useNativeDriver: false }),
        Animated.delay(1200),
        Animated.timing(barState, { toValue: 0, duration: 500, useNativeDriver: false }),
      ]).start();

      return () => {
        if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Scroll / layout callbacks ─────────────────────────────────────────────

    const handleScroll = useCallback(
      (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollYRef.current = e.nativeEvent.contentOffset.y;
        updateIndicatorPos(scrollYRef.current);
        if (!draggingRef.current) showIdleRef.current();
      },
      [], // eslint-disable-line react-hooks/exhaustive-deps
    );

    const handleLayout = useCallback(
      (e: { nativeEvent: { layout: { height: number } } }) => {
        containerHeightRef.current = e.nativeEvent.layout.height;
        setIndicatorH(computeIndicatorH());
        updateIndicatorPos(scrollYRef.current);
      },
      [], // eslint-disable-line react-hooks/exhaustive-deps
    );

    const handleContentSizeChange = useCallback((_w: number, h: number) => {
      contentHeightRef.current = h;
      setIndicatorH(computeIndicatorH());
      updateIndicatorPos(scrollYRef.current);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── PanResponder (drag-to-scroll) ─────────────────────────────────────────

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder:  () => true,
        onPanResponderTerminationRequest: () => false,

        onPanResponderGrant: () => {
          draggingRef.current = true;
          dragStartScrollY.current = scrollYRef.current;
          showActiveRef.current();
        },

        onPanResponderMove: (_, gesture) => {
          const ch    = containerHeightRef.current;
          const total = contentHeightRef.current;
          if (!ch || !total || total <= ch) return;

          const h         = Math.max((ch / total) * ch, INDICATOR_MIN_H);
          const maxTravel = ch - h;
          const maxScroll = total - ch;
          if (maxTravel <= 0) return;

          const newY    = dragStartScrollY.current + (gesture.dy / maxTravel) * maxScroll;
          const clamped = Math.max(0, Math.min(maxScroll, newY));

          internalScrollRef.current?.scrollTo({ y: clamped, animated: false });
          scrollYRef.current = clamped;
          updateIndicatorPos(clamped);
        },

        onPanResponderRelease: () => {
          draggingRef.current = false;
          showIdleRef.current();
        },

        onPanResponderTerminate: () => {
          draggingRef.current = false;
          showIdleRef.current();
        },
      }),
    ).current;

    // ── Render ────────────────────────────────────────────────────────────────

    return (
      <View style={[{ flex: 1 }, style]}>
        <ScrollView
          ref={mergeRef}
          style={{ flex: 1 }}
          contentContainerStyle={contentContainerStyle}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          onLayout={handleLayout}
          onContentSizeChange={handleContentSizeChange}
        >
          {children}
        </ScrollView>

        {indicatorH > 0 && (
          // Hit area is wider than the visible bar so it's easy to grab
          <View
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: BAR_WIDTH_ACTIVE + HIT_SLOP,
            }}
            {...panResponder.panHandlers}
          >
            <Animated.View
              style={{
                position: 'absolute',
                right: 2,
                top: indicatorTop,
                width: barWidth,
                height: indicatorH,
                backgroundColor: colors.rubric,
                borderRadius: 2,
                opacity: barOpacity,
              }}
            />
          </View>
        )}
      </View>
    );
  },
);
