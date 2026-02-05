import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import { IncorrectQuestion } from '../types/evaluation';
import { Colors } from '../theme/colors';
import { XCircle, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, BookOpen } from 'lucide-react-native';
import WebView from 'react-native-webview';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

interface Props {
    data: IncorrectQuestion;
    defaultExpanded?: boolean;
}

const katexHtml = (content: string, fontSize: number = 16) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: ${fontSize}px;
      line-height: 1.8;
      color: #0F172A;
      background: transparent;
      padding: 8px 0;
    }
    .katex { font-size: 1.15em; }
    .katex-display { margin: 0.85em 0; }
  </style>
</head>
<body>
  <div id="math">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
  <script>
    document.addEventListener("DOMContentLoaded", function() {
      renderMathInElement(document.getElementById("math"), {
        delimiters: [
          {left: "$$", right: "$$", display: true},
          {left: "$", right: "$", display: false},
          {left: "\\\\(", right: "\\\\)", display: false},
          {left: "\\\\[", right: "\\\\]", display: true}
        ],
        throwOnError: false
      });
    });
  </script>
</body>
</html>
`;

function MathContent({ content, minHeight = 40 }: { content: string; minHeight?: number }) {
    const [webViewHeight, setWebViewHeight] = useState(minHeight);
    const hasLatex = /[\$\\]/.test(content);

    if (!hasLatex) {
        return <Text style={styles.plainText}>{content}</Text>;
    }

    const injectedJavaScript = `
        window.ReactNativeWebView.postMessage(document.body.scrollHeight);
        true;
    `;

    const handleMessage = (event: any) => {
        const height = parseInt(event.nativeEvent.data, 10);
        if (height && height > minHeight) {
            setWebViewHeight(Math.min(height + 20, 300)); // Cap at 300px
        }
    };

    return (
        <WebView
            source={{ html: katexHtml(content) }}
            style={{ height: webViewHeight, backgroundColor: 'transparent' }}
            scrollEnabled={webViewHeight >= 300}
            showsVerticalScrollIndicator={webViewHeight >= 300}
            nestedScrollEnabled={true}
            originWhitelist={['*']}
            javaScriptEnabled={true}
            injectedJavaScript={injectedJavaScript}
            onMessage={handleMessage}
        />
    );
}

export default function QuestionResultTab({ data, defaultExpanded = false }: Props) {
    const [expanded, setExpanded] = useState(defaultExpanded);

    const toggle = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    const questionNumber = data.question_number || data.question_id.replace(/[^0-9]/g, '') || '?';

    return (
        <View style={[styles.card, expanded && styles.cardExpanded]}>
            {/* Header - Pressable only on header to prevent scroll interference */}
            <Pressable
                onPress={toggle}
                style={styles.headerPressable}
                android_ripple={{ color: 'rgba(99, 102, 241, 0.1)' }}
            >
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.errorIconContainer}>
                            <XCircle color={Colors.error} size={20} strokeWidth={2.5} />
                        </View>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.title}>{data.question_number || `Question ${questionNumber}`}</Text>
                            {!expanded && (
                                <Text style={styles.errorPreviewInline} numberOfLines={1}>
                                    {data.error_summary}
                                </Text>
                            )}
                        </View>
                    </View>
                    <View style={[styles.chevronContainer, expanded && styles.chevronContainerExpanded]}>
                        {expanded ? (
                            <ChevronUp color={Colors.primary} size={18} strokeWidth={2.5} />
                        ) : (
                            <ChevronDown color={Colors.textSecondary} size={18} strokeWidth={2.5} />
                        )}
                    </View>
                </View>
            </Pressable>

            {/* Expanded Content - Not wrapped in Pressable to allow scrolling */}
            {expanded && (
                <View style={styles.content}>
                    <View style={styles.divider} />

                    {/* Question */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <BookOpen size={16} color={Colors.primary} strokeWidth={2} />
                            <Text style={styles.sectionLabel}>QUESTION</Text>
                        </View>
                        <View style={styles.questionBox}>
                            <MathContent content={data.question} minHeight={50} />
                        </View>
                    </View>

                    {/* Error Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <AlertCircle size={16} color={Colors.error} strokeWidth={2} />
                            <Text style={styles.errorLabelHeader}>WHAT WENT WRONG</Text>
                        </View>
                        <View style={styles.errorBox}>
                            <Text style={styles.errorSummary}>{data.error_summary}</Text>
                            <View style={styles.explanationDivider} />
                            <MathContent content={data.error_explanation} minHeight={50} />
                        </View>
                    </View>

                    {/* Correct Solution */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <CheckCircle2 size={16} color={Colors.success} strokeWidth={2} />
                            <Text style={styles.solutionLabelHeader}>CORRECT SOLUTION</Text>
                        </View>
                        <View style={styles.solutionBox}>
                            <MathContent content={data.correct_solution} minHeight={60} />
                        </View>
                    </View>

                    {/* Final Answer */}
                    <View style={styles.finalAnswerSection}>
                        <View style={styles.finalAnswerHeader}>
                            <Text style={styles.finalAnswerLabel}>Final Answer</Text>
                        </View>
                        <View style={styles.finalAnswerContent}>
                            <MathContent content={data.final_answer} minHeight={40} />
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        marginBottom: 14,
        borderWidth: 1.5,
        borderColor: 'rgba(239, 68, 68, 0.15)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
        overflow: 'hidden',
    },
    cardExpanded: {
        borderColor: Colors.primary,
        borderWidth: 1.5,
        shadowOpacity: 0.12,
        elevation: 5,
    },
    headerPressable: {
        padding: 18,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    headerTextContainer: {
        flex: 1,
    },
    errorIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#FEF2F2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
        letterSpacing: -0.3,
        marginBottom: 2,
    },
    errorPreviewInline: {
        fontSize: 14,
        color: Colors.error,
        marginTop: 2,
        opacity: 0.85,
        lineHeight: 20,
    },
    chevronContainer: {
        padding: 8,
        backgroundColor: Colors.background,
        borderRadius: 10,
    },
    chevronContainerExpanded: {
        backgroundColor: '#EEF2FF',
    },
    content: {
        paddingHorizontal: 18,
        paddingBottom: 18,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginBottom: 24,
        opacity: 0.5,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    sectionLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.primary,
        letterSpacing: 0.8,
    },
    questionBox: {
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    plainText: {
        fontSize: 16,
        color: Colors.textPrimary,
        lineHeight: 28,
    },
    errorLabelHeader: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.error,
        letterSpacing: 0.8,
    },
    errorBox: {
        backgroundColor: '#FEF2F2',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: Colors.error,
    },
    errorSummary: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.error,
        lineHeight: 24,
    },
    explanationDivider: {
        height: 1,
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        marginVertical: 14,
    },
    solutionLabelHeader: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.success,
        letterSpacing: 0.8,
    },
    solutionBox: {
        backgroundColor: '#F0FDF4',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: Colors.success,
    },
    finalAnswerSection: {
        marginTop: 4,
    },
    finalAnswerHeader: {
        marginBottom: 12,
    },
    finalAnswerLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    finalAnswerContent: {
        backgroundColor: '#EEF2FF',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#C7D2FE',
    },
});
