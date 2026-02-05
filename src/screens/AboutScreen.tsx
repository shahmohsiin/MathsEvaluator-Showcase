import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Linking, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import LinearGradient from 'react-native-linear-gradient';
import { Zap, Github, Mail, Globe, Heart } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutScreen() {
    const insets = useSafeAreaInsets();

    const openLink = (url: string) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1E1B4B" />

            {/* Header / Hero Section */}
            <LinearGradient
                colors={['#312E81', Colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.hero, { paddingTop: insets.top + 20 }]}
            >
                <View style={styles.logoContainer}>
                    <Zap size={40} color="#FFF" fill="#FFF" />
                </View>
                <Text style={styles.heroTitle}>Maths Evaluator</Text>
                <Text style={styles.heroVersion}>Version 1.0.0</Text>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About the App</Text>
                    <Text style={styles.sectionText}>
                        Maths Evaluator is your smart companion for solving complex mathematical problems.
                        Whether you're a student checking your homework or a teacher validating solutions,
                        our step-by-step analysis helps you learn and understand the process.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Connect with Us</Text>

                    <TouchableOpacity style={styles.linkRow} onPress={() => openLink('https://github.com')}>
                        <View style={[styles.iconBox, { backgroundColor: '#F0F9FF' }]}>
                            <Github size={20} color="#0EA5E9" />
                        </View>
                        <View style={styles.linkContent}>
                            <Text style={styles.linkTitle}>GitHub</Text>
                            <Text style={styles.linkSub}>View source code</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkRow} onPress={() => openLink('https://example.com')}>
                        <View style={[styles.iconBox, { backgroundColor: '#FDF2F8' }]}>
                            <Globe size={20} color="#EC4899" />
                        </View>
                        <View style={styles.linkContent}>
                            <Text style={styles.linkTitle}>Website</Text>
                            <Text style={styles.linkSub}>Visit our landing page</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkRow} onPress={() => openLink('mailto:contact@mathseval.com')}>
                        <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
                            <Mail size={20} color="#22C55E" />
                        </View>
                        <View style={styles.linkContent}>
                            <Text style={styles.linkTitle}>Contact Support</Text>
                            <Text style={styles.linkSub}>We're here to help</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Heart size={16} color={Colors.error} fill={Colors.error} style={{ marginRight: 6 }} />
                    <Text style={styles.footerText}>Made with love by Mohsin</Text>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    hero: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        alignItems: 'center',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    logoContainer: {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 4,
    },
    heroVersion: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '500',
    },
    content: {
        flex: 1,
        marginTop: 24,
        paddingHorizontal: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 16,
    },
    sectionText: {
        fontSize: 15,
        lineHeight: 24,
        color: Colors.textSecondary,
    },
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    linkContent: {
        flex: 1,
    },
    linkTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    linkSub: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        opacity: 0.8,
    },
    footerText: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
});
