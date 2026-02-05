import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, StatusBar, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../theme/colors';
import { Calculator, History, Info, ChevronRight, Zap } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={styles.title}>Math Evaluator</Text>
        </View>
        <View style={styles.avatarPlaceholder}>
          <Zap size={24} color={Colors.primary} fill={Colors.surface} />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Action Card */}
        <Pressable
          style={styles.heroCardPressable}
          onPress={() => navigation.navigate('Evaluation')}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroIconContainer}>
                <Calculator color="#FFF" size={32} />
              </View>
              <View style={styles.heroTextContainer}>
                <Text style={styles.heroTitle}>Evaluate Solution</Text>
                <Text style={styles.heroSubtitle}>Snap a photo or upload to solve instantly</Text>
              </View>
              <ChevronRight color="rgba(255,255,255,0.8)" size={24} />
            </View>
          </LinearGradient>
        </Pressable>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.grid}>
          {/* History Card */}
          <Pressable
            style={styles.gridCard}
            onPress={() => navigation.navigate('History')}
          >
            <View style={[styles.iconBadge, { backgroundColor: '#EEF2FF' }]}>
              <History color={Colors.primary} size={24} />
            </View>
            <Text style={styles.cardTitle}>History</Text>
            <Text style={styles.cardSubtitle}>View past solutions</Text>
          </Pressable>

          {/* About Card */}
          <Pressable
            style={styles.gridCard}
            onPress={() => navigation.navigate('About')}
          >
            <View style={[styles.iconBadge, { backgroundColor: '#ECFEFF' }]}>
              <Info color={Colors.accent} size={24} />
            </View>
            <Text style={styles.cardTitle}>About Us</Text>
            <Text style={styles.cardSubtitle}>Learn more</Text>
          </Pressable>
        </View>

        {/* Decorative Modern Element or Tip */}
        <LinearGradient
          colors={['#1E293B', '#0F172A']}
          style={styles.proTipCard}
        >
          <View style={styles.proTipHeader}>
            <Zap color="#FBBF24" size={20} fill="#FBBF24" />
            <Text style={styles.proTipLabel}>Pro Tip</Text>
          </View>
          <Text style={styles.proTipText}>
            Ensure good lighting when capturing math problems for the best accuracy.
          </Text>
        </LinearGradient>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20, // Adjust based on SafeArea if needed
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30
  },
  greeting: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    color: Colors.textPrimary,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  heroCardPressable: {
    marginBottom: 32,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  heroCard: {
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  heroIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  heroTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  gridCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    width: (width - 48 - 16) / 2, // (Screen width - padding - gap) / 2
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  proTipCard: {
    borderRadius: 20,
    padding: 24,
  },
  proTipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  proTipLabel: {
    color: '#FBBF24',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  proTipText: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 22,
  },
});
