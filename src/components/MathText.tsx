import React, { memo } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import WebView from 'react-native-webview';

interface Props {
    content: string;
    style?: object;
}

const katexHtml = (content: string) => `
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
      font-size: 16px;
      line-height: 1.5;
      color: #0F172A;
      background: transparent;
      padding: 4px 0;
    }
    .katex { font-size: 1.1em; }
    .katex-display { margin: 0.5em 0; }
  </style>
</head>
<body>
  <div id="math">${escapeHtml(content)}</div>
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

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function MathText({ content, style }: Props) {
    // Check if content has any LaTeX
    const hasLatex = /[\$\\]/.test(content);

    if (!hasLatex) {
        // For plain text, just return null and let parent handle it
        return null;
    }

    return (
        <View style={[styles.container, style]}>
            <WebView
                source={{ html: katexHtml(content) }}
                style={styles.webview}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                originWhitelist={['*']}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                scalesPageToFit={Platform.OS === 'android'}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: 40,
        backgroundColor: 'transparent',
    },
    webview: {
        flex: 1,
        backgroundColor: 'transparent',
    },
});

export default memo(MathText);
