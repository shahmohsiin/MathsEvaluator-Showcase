import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, Pressable, ActivityIndicator, Image, Modal, TouchableOpacity, TouchableWithoutFeedback, BackHandler } from 'react-native';
import { launchImageLibrary, launchCamera, Asset } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import QuestionResultTab from '../components/QuestionResultTab';
import { EvaluateResponse, IncorrectQuestion, HistoryItem } from '../types/evaluation';
import { Colors } from '../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Upload, CheckCircle2, RotateCcw, Sparkles, AlertCircle, AlertTriangle, Camera, Image as ImageIcon, Clock, ChevronRight, X } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { apiService } from '../services/api';

type UIState = 'idle' | 'ready' | 'loading' | 'success' | 'hasErrors' | 'error';

export default function EvaluationScreen() {
    const navigation = useNavigation();
    const [questionImage, setQuestionImage] = useState<Asset | null>(null);
    const [answerImage, setAnswerImage] = useState<Asset | null>(null);
    const [currentEvaluation, setCurrentEvaluation] = useState<EvaluateResponse | null>(null);
    const [uiState, setUIState] = useState<UIState>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [pickerModalVisible, setPickerModalVisible] = useState(false);
    const [currentPickerType, setCurrentPickerType] = useState<'question' | 'answer'>('question');
    const insets = useSafeAreaInsets();

    // Load recent history
    const loadHistory = useCallback(async () => {
        try {
            setLoadingHistory(true);
            const history = await apiService.getHistory(5);
            setRecentHistory(history);
        } catch (error) {
            console.log('Failed to load history:', error);
        } finally {
            setLoadingHistory(false);
        }
    }, []);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    // Prevent back navigation (gesture or button) when showing results
    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            // Only prevent if showing results
            if (uiState !== 'success' && uiState !== 'hasErrors') {
                return; // Allow normal back
            }

            // Prevent navigation
            e.preventDefault();

            // Reset instead
            handleReset();
        });

        return unsubscribe;
    }, [navigation, uiState]);

    // Also handle Android back button
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (uiState === 'success' || uiState === 'hasErrors') {
                handleReset();
                return true; // Prevent default
            }
            return false; // Allow default
        });

        return () => backHandler.remove();
    }, [uiState]);

    const openPickerModal = (type: 'question' | 'answer') => {
        setCurrentPickerType(type);
        setPickerModalVisible(true);
    };

    const closePickerModal = () => {
        setPickerModalVisible(false);
    };

    const handlePickFromCamera = async () => {
        closePickerModal();
        const options = {
            mediaType: 'photo' as const,
            quality: 0.8 as const,
            includeBase64: true,
            maxWidth: 2048,
            maxHeight: 2048,
        };

        const result = await launchCamera(options);
        if (result.assets && result.assets[0]) {
            if (currentPickerType === 'question') {
                setQuestionImage(result.assets[0]);
            } else {
                setAnswerImage(result.assets[0]);
            }
        }
    };

    const handlePickFromGallery = async () => {
        closePickerModal();
        const options = {
            mediaType: 'photo' as const,
            quality: 0.8 as const,
            includeBase64: true,
            maxWidth: 2048,
            maxHeight: 2048,
        };

        const result = await launchImageLibrary(options);
        if (result.assets && result.assets[0]) {
            if (currentPickerType === 'question') {
                setQuestionImage(result.assets[0]);
            } else {
                setAnswerImage(result.assets[0]);
            }
        }
    };

    const handleSubmit = async () => {
        if (!questionImage?.base64 || !answerImage?.base64) {
            setErrorMessage('Please select both images');
            return;
        }

        setUIState('loading');
        setErrorMessage('');

        try {
            const result = await apiService.evaluate(questionImage.base64, answerImage.base64);
            setCurrentEvaluation(result);
            setUIState(result.incorrect_questions.length === 0 ? 'success' : 'hasErrors');
            // Refresh history after new evaluation
            loadHistory();
        } catch (error: any) {
            console.error('Evaluation error:', error);
            setErrorMessage(error.message || 'Evaluation failed');
            setUIState('error');
        }
    };

    const handleReset = () => {
        setQuestionImage(null);
        setAnswerImage(null);
        setCurrentEvaluation(null);
        setUIState('idle');
        setErrorMessage('');
    };

    const handleViewHistory = async (evaluationId: string) => {
        setUIState('loading');
        try {
            const result = await apiService.getEvaluation(evaluationId);
            setCurrentEvaluation(result);
            setUIState(result.incorrect_questions.length === 0 ? 'success' : 'hasErrors');
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to load evaluation');
            setUIState('error');
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
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHrs < 24) return `${diffHrs}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    // Results View
    if (currentEvaluation && (uiState === 'success' || uiState === 'hasErrors')) {
        const { summary, incorrect_questions } = currentEvaluation;

        return (
            <View style={styles.mainContainer}>
                <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

                <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                    <View style={styles.headerRow}>
                        <View style={styles.headerLeft}>
                            <Text style={styles.headerTitle}>Evaluation Result</Text>
                            <Text style={styles.headerSubtitle}>Analysis of your answers</Text>
                        </View>
                        <Pressable style={styles.newAnalysisBtn} onPress={handleReset}>
                            <RotateCcw size={16} color="#FFF" />
                            <Text style={styles.newAnalysisBtnText}>New</Text>
                        </Pressable>
                    </View>
                </View>

                <ScrollView
                    style={styles.container}
                    contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 40 }]}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Summary Card */}
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryRow}>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryValue}>{summary.total_questions}</Text>
                                <Text style={styles.summaryLabel}>Total Questions</Text>
                            </View>
                            <View style={styles.summaryDivider} />
                            <View style={styles.summaryItem}>
                                <Text style={[
                                    styles.summaryValue,
                                    { color: summary.incorrect_questions > 0 ? Colors.error : Colors.success }
                                ]}>
                                    {summary.incorrect_questions}
                                </Text>
                                <Text style={styles.summaryLabel}>Incorrect</Text>
                            </View>
                        </View>
                    </View>

                    {/* Success State */}
                    {uiState === 'success' && (
                        <View style={styles.successCard}>
                            <CheckCircle2 size={64} color={Colors.success} fill="#ECFDF5" />
                            <Text style={styles.successTitle}>Perfect Solution!</Text>
                            <Text style={styles.successText}>
                                All {summary.total_questions} questions answered correctly
                            </Text>
                        </View>
                    )}

                    {/* Error Tabs */}
                    {uiState === 'hasErrors' && (
                        <>
                            <View style={styles.errorsHeader}>
                                <AlertCircle size={22} color={Colors.error} />
                                <View style={styles.errorsHeaderText}>
                                    <Text style={styles.errorsTitle}>Questions to Review</Text>
                                    <Text style={styles.errorsSubtitle}>Tap to expand details</Text>
                                </View>
                            </View>

                            {incorrect_questions.map((q: IncorrectQuestion) => (
                                <QuestionResultTab
                                    key={q.question_id}
                                    data={q}
                                    defaultExpanded={incorrect_questions.length === 1}
                                />
                            ))}
                        </>
                    )}
                </ScrollView>
            </View>
        );
    }

    // Loading State
    if (uiState === 'loading') {
        return (
            <View style={styles.mainContainer}>
                <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Evaluating your solution...</Text>
                    <Text style={styles.loadingSubtext}>This may take a few seconds</Text>
                </View>
            </View>
        );
    }

    // Error State
    if (uiState === 'error') {
        return (
            <View style={styles.mainContainer}>
                <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
                <View style={styles.errorContainer}>
                    <AlertTriangle size={48} color={Colors.error} />
                    <Text style={styles.errorTitle}>Evaluation Failed</Text>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                    <Pressable style={styles.retryBtn} onPress={handleReset}>
                        <Text style={styles.retryBtnText}>Try Again</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    // Upload View
    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                <Text style={styles.headerTitle}>Evaluate Solution</Text>
                <Text style={styles.headerSubtitle}>Upload question paper and answer sheet</Text>
            </View>

            <ScrollView
                style={styles.container}
                contentContainerStyle={[styles.uploadContainer, { paddingBottom: insets.bottom + 20 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Upload Boxes */}
                <View style={styles.uploadRowHorizontal}>
                    {/* Question Image */}
                    <Pressable
                        style={[styles.uploadBox, questionImage && styles.uploadBoxFilled]}
                        onPress={() => openPickerModal('question')}
                    >
                        {questionImage ? (
                            <Image source={{ uri: questionImage.uri }} style={styles.uploadPreview} />
                        ) : (
                            <>
                                <ImageIcon size={28} color={Colors.textMuted} />
                                <Text style={styles.uploadText}>Question Paper</Text>
                                <Text style={styles.uploadHint}>Tap to select</Text>
                            </>
                        )}
                    </Pressable>

                    {/* Answer Image */}
                    <Pressable
                        style={[styles.uploadBox, answerImage && styles.uploadBoxFilled]}
                        onPress={() => openPickerModal('answer')}
                    >
                        {answerImage ? (
                            <Image source={{ uri: answerImage.uri }} style={styles.uploadPreview} />
                        ) : (
                            <>
                                <Camera size={28} color={Colors.textMuted} />
                                <Text style={styles.uploadText}>Answer Sheet</Text>
                                <Text style={styles.uploadHint}>Tap to select</Text>
                            </>
                        )}
                    </Pressable>
                </View>

                {/* Submit Button */}
                <Pressable
                    style={[styles.submitBtn, (!questionImage || !answerImage) && styles.submitBtnDisabled]}
                    onPress={handleSubmit}
                    disabled={!questionImage || !answerImage}
                >
                    <LinearGradient
                        colors={(!questionImage || !answerImage) ? ['#94A3B8', '#64748B'] : [Colors.primary, Colors.secondary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.submitGradient}
                    >
                        <Sparkles size={20} color="#FFF" />
                        <Text style={styles.submitText}>Evaluate Solution</Text>
                    </LinearGradient>
                </Pressable>

                {/* Recently Analysed */}
                <View style={styles.recentSection}>
                    <View style={styles.recentHeader}>
                        <Clock size={18} color={Colors.textSecondary} />
                        <Text style={styles.recentTitle}>Recently Analysed</Text>
                    </View>

                    {loadingHistory ? (
                        <ActivityIndicator size="small" color={Colors.primary} style={{ marginTop: 20 }} />
                    ) : recentHistory.length === 0 ? (
                        <View style={styles.emptyHistory}>
                            <Text style={styles.emptyHistoryText}>No evaluations yet</Text>
                            <Text style={styles.emptyHistorySubtext}>Your analysis history will appear here</Text>
                        </View>
                    ) : (
                        recentHistory.map((item) => (
                            <Pressable
                                key={item.evaluation_id}
                                style={styles.historyCard}
                                onPress={() => handleViewHistory(item.evaluation_id)}
                            >
                                <View style={styles.historyCardLeft}>
                                    <Text style={styles.historyTime}>{formatDate(item.created_at)}</Text>
                                    <Text style={styles.historyQuestions}>
                                        {item.total_questions} questions
                                    </Text>
                                </View>
                                <View style={styles.historyCardRight}>
                                    <View style={[
                                        styles.historyStatus,
                                        { backgroundColor: item.incorrect_count === 0 ? '#ECFDF5' : '#FEF2F2' }
                                    ]}>
                                        <Text style={[
                                            styles.historyStatusText,
                                            { color: item.incorrect_count === 0 ? Colors.success : Colors.error }
                                        ]}>
                                            {item.incorrect_count === 0 ? 'All Correct' : `${item.incorrect_count} Error${item.incorrect_count > 1 ? 's' : ''}`}
                                        </Text>
                                    </View>
                                    <ChevronRight size={18} color={Colors.textMuted} />
                                </View>
                            </Pressable>
                        ))
                    )}
                </View>
            </ScrollView>

            {/* Image Picker Modal */}
            <Modal
                visible={pickerModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closePickerModal}
            >
                <TouchableWithoutFeedback onPress={closePickerModal}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>
                                        Select {currentPickerType === 'question' ? 'Question Paper' : 'Answer Sheet'}
                                    </Text>
                                    <Pressable onPress={closePickerModal} style={styles.modalClose}>
                                        <X size={20} color={Colors.textSecondary} />
                                    </Pressable>
                                </View>

                                <TouchableOpacity style={styles.modalOption} onPress={handlePickFromCamera}>
                                    <View style={[styles.modalIconBox, { backgroundColor: '#EEF2FF' }]}>
                                        <Camera size={22} color={Colors.primary} />
                                    </View>
                                    <View style={styles.modalOptionText}>
                                        <Text style={styles.modalOptionTitle}>Camera</Text>
                                        <Text style={styles.modalOptionHint}>Take a photo</Text>
                                    </View>
                                    <ChevronRight size={18} color={Colors.textMuted} />
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.modalOption, { borderBottomWidth: 0 }]} onPress={handlePickFromGallery}>
                                    <View style={[styles.modalIconBox, { backgroundColor: '#ECFDF5' }]}>
                                        <ImageIcon size={22} color={Colors.success} />
                                    </View>
                                    <View style={styles.modalOptionText}>
                                        <Text style={styles.modalOptionTitle}>Gallery</Text>
                                        <Text style={styles.modalOptionHint}>Choose from photos</Text>
                                    </View>
                                    <ChevronRight size={18} color={Colors.textMuted} />
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: Colors.background,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.textPrimary,
    },
    headerSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '500',
        marginTop: 2,
    },
    newAnalysisBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        gap: 4,
    },
    newAnalysisBtnText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '700',
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
    },
    uploadContainer: {
        padding: 20,
    },
    // Summary
    summaryCard: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryValue: {
        fontSize: 32,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    summaryLabel: {
        fontSize: 13,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    summaryDivider: {
        width: 1,
        height: 40,
        backgroundColor: Colors.border,
    },
    // Success
    successCard: {
        backgroundColor: '#F0FDF4',
        borderRadius: 20,
        padding: 40,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.success,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.success,
        marginTop: 16,
        marginBottom: 8,
    },
    successText: {
        fontSize: 15,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    // Errors Section
    errorsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#FEF2F2',
        padding: 14,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: Colors.error,
    },
    errorsHeaderText: {
        marginLeft: 12,
        flex: 1,
    },
    errorsTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.error,
    },
    errorsSubtitle: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    // Loading
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: Colors.textPrimary,
        fontWeight: '600',
    },
    loadingSubtext: {
        marginTop: 4,
        fontSize: 14,
        color: Colors.textSecondary,
    },
    // Error
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.error,
        marginTop: 16,
    },
    errorText: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 8,
        textAlign: 'center',
    },
    retryBtn: {
        marginTop: 24,
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
    // Upload
    uploadRowHorizontal: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    uploadBox: {
        flex: 1,
        backgroundColor: Colors.surface,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: Colors.border,
        borderStyle: 'dashed',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 140,
    },
    uploadBoxFilled: {
        borderColor: Colors.success,
        borderStyle: 'solid',
        padding: 0,
        overflow: 'hidden',
    },
    uploadPreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    uploadText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginTop: 10,
    },
    uploadHint: {
        fontSize: 11,
        color: Colors.textSecondary,
        marginTop: 4,
    },
    submitBtn: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 32,
    },
    submitBtnDisabled: {
        opacity: 0.6,
    },
    submitGradient: {
        paddingVertical: 18,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    submitText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    // Recent Section
    recentSection: {
        marginTop: 8,
    },
    recentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    recentTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginLeft: 8,
    },
    emptyHistory: {
        backgroundColor: Colors.surface,
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    emptyHistoryText: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    emptyHistorySubtext: {
        fontSize: 13,
        color: Colors.textMuted,
        marginTop: 4,
    },
    historyCard: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    historyCardLeft: {
        flex: 1,
    },
    historyTime: {
        fontSize: 13,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    historyQuestions: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginTop: 2,
    },
    historyCardRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    historyStatus: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    historyStatusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    modalClose: {
        padding: 4,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    modalIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    modalOptionText: {
        flex: 1,
    },
    modalOptionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    modalOptionHint: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginTop: 2,
    },
});
