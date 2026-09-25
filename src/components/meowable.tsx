import React from 'react';
import {
  Pressable as RNPressable,
  Switch as RNSwitch,
  TouchableOpacity as RNTouchableOpacity,
} from 'react-native';
import { playKitten } from '../audio/kittenMeow';

type PressableProps = React.ComponentProps<typeof RNPressable> & { meow?: boolean };

/** Touchables and switches that meow while the hidden setting is on. */
export function TouchableOpacity(props: React.ComponentProps<typeof RNTouchableOpacity>) {
  const { onPress, ...rest } = props;
  return (
    <RNTouchableOpacity
      {...rest}
      onPress={(event) => {
        playKitten();
        onPress?.(event);
      }}
    />
  );
}

export function Pressable({ meow = true, onPress, ...rest }: PressableProps) {
  return (
    <RNPressable
      {...rest}
      onPress={(event) => {
        if (meow) playKitten();
        onPress?.(event);
      }}
    />
  );
}

export function Switch(props: React.ComponentProps<typeof RNSwitch>) {
  const { onValueChange, ...rest } = props;
  return (
    <RNSwitch
      {...rest}
      onValueChange={(value) => {
        playKitten();
        onValueChange?.(value);
      }}
    />
  );
}
