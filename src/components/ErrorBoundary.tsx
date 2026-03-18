import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Typography } from '../theme';

interface State { hasError: boolean }

/**
 * Catches render errors in child prayer screens.
 * On error, clears the shorterForm setting so a broken toggle can't
 * permanently lock the app, then shows a tap-to-reset prompt.
 */
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch() {
    // Reset shorterForm to false so the next launch doesn't re-trigger the same crash
    AsyncStorage.setItem('@s/shorterForm', 'false').catch(() => {});
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <View style={{ flex: 1, backgroundColor: Colors.parchment, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={{ fontFamily: Typography.serifBold, fontSize: 20, color: Colors.ink, textAlign: 'center', marginBottom: 16 }}>
          Something went wrong.
        </Text>
        <Text style={{ fontFamily: Typography.serifItalic, fontSize: 16, color: Colors.inkLight, textAlign: 'center', marginBottom: 32, lineHeight: 24 }}>
          A setting may have caused an error. It has been reset automatically.
        </Text>
        <TouchableOpacity
          onPress={() => this.setState({ hasError: false })}
          style={{ paddingVertical: 12, paddingHorizontal: 28, borderWidth: 1, borderColor: Colors.ink, borderRadius: 4 }}
        >
          <Text style={{ fontFamily: Typography.serifBold, fontSize: 16, color: Colors.ink }}>
            Tap to Continue
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
