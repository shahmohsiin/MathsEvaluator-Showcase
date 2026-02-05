import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { EvalLanguage } from '../types/evaluation';
import { Colors } from '../theme/colors';

export default function EvalLanguageToggle({
  lang,
  setLang,
}: {
  lang: EvalLanguage;
  setLang: (l: EvalLanguage) => void;
}) {
  return (
    <View style={styles.wrap}>
      <Pressable onPress={() => setLang('en')}>
        <Text style={[styles.txt, lang === 'en' && styles.active]}>EN</Text>
      </Pressable>
      <Text style={styles.sep}>|</Text>
      <Pressable onPress={() => setLang('hi')}>
        <Text style={[styles.txt, lang === 'hi' && styles.active]}>HINGLISH</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center' },
  txt: { color: Colors.textMuted, fontWeight: '600' },
  active: { color: Colors.primary },
  sep: { marginHorizontal: 6, color: Colors.textMuted },
});
