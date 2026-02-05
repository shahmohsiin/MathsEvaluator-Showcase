import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, StatusBar, ActivityIndicator, RefreshControl } from 'react-native';
import { Colors } from '../theme/colors';
import { ChevronRight, Clock, Trash2, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiService } from '../services/api';
import { HistoryItem, EvaluateResponse } from '../types/evaluation';

export default function HistoryScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadHistory = useCallback(async () => {
        try {
            setError(null);
            const data = await apiService.getHistory(50);
            setHistory(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load history');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadHistory();
    }, [loadHistory]);

    const handleViewEvaluation = async (evaluationId: string) => {
        try {
            const result = await apiService.getEvaluation(evaluationId);
            navigation.navigate('Evaluation', { evaluation: result });
        } catch (err: any) {
            console.error('Failed to load evaluation:', err);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderItem = ({ item }: { item: HistoryItem }) => {
        const isAllCorrect = item.incorrect_count === 0;

        return (
            <Pressable
                style={styles.card}
                onPress={() => handleViewEvaluation(item.evaluation_id)}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.dateContainer}>
                        <Calendar size={14} color={Colors.textSecondary} style={{ marginRight: 6 }} />
                        <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
                    </View>
                    <ChevronRight size={18} color={Colors.textMuted} />
                </View>

                <View style={styles.cardContent}>
                    <Text style={styles.questionCount}>{item.total_questions} Questions</Text>

                    <View style={[
                        styles.statusBadge,
                        { backgroundColor: isAllCorrect ? '#ECFDF5' : '#FEF2F2' }
                    ]}>
                        {isAllCorrect ? (
                            <CheckCircle2 size={14} color={Colors.success} />
                        ) : (
                            <AlertCircle size={14} color={Colors.error} />
                        )}
                        <Text style={[
                            styles.statusText,
                            { color: isAllCorrect ? Colors.success : Colors.error }
                        ]}>
                            {isAllCorrect ? 'All Correct' : `${item.incorrect_count} Error${item.incorrect_count > 1 ? 's' : ''}`}
                        </Text>
                    </View>
                </View>
            </Pressable>
        );
    };

    // Loading State
    if (loading) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
                <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                    <Text style={styles.headerTitle}>History</Text>
                    <Text style={styles.headerSubtitle}>Your past evaluations</Text>
                </View>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            </View>
        );
    }

    // Error State
    if (error) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
                <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                    <Text style={styles.headerTitle}>History</Text>
                    <Text style={styles.headerSubtitle}>Your past evaluations</Text>
                </View>
                <View style={styles.centerContainer}>
                    <AlertCircle size={48} color={Colors.error} />
                    <Text style={styles.errorText}>{error}</Text>
                    <Pressable style={styles.retryBtn} onPress={loadHistory}>
                        <Text style={styles.retryBtnText}>Retry</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                <View>
                    <Text style={styles.headerTitle}>History</Text>
                    <Text style={styles.headerSubtitle}>Your past evaluations</Text>
                </View>
            </View>

            <FlatList
                data={history}
                keyExtractor={(item) => item.evaluation_id}
                renderItem={renderItem}
                contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[Colors.primary]}
                        tintColor={Colors.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Clock size={48} color={Colors.border} />
                        <Text style={styles.emptyTitle}>No History Yet</Text>
                        <Text style={styles.emptyText}>Your evaluation history will appear here</Text>
                    </View>
                }
            />
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
        paddingBottom: 24,
        backgroundColor: Colors.background,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.textPrimary,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '500',
        marginTop: 4,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    listContent: {
        padding: 24,
    },
    card: {
        backgroundColor: Colors.surface,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    dateText: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    questionCount: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
    },
    emptyTitle: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    emptyText: {
        marginTop: 4,
        fontSize: 14,
        color: Colors.textMuted,
    },
    errorText: {
        marginTop: 16,
        fontSize: 15,
        color: Colors.error,
        textAlign: 'center',
    },
    retryBtn: {
        marginTop: 16,
        backgroundColor: Colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 10,
    },
    retryBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
});
