import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface HTMLRendererProps {
  html: string;
  fontWeight?:
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900"
    | undefined;
}

const HTMLRenderer: React.FC<HTMLRendererProps> = ({
  html,
  fontWeight = "normal",
}) => {
  const parseHTML = (content: string) => {
    if (!content.trim()) {
      return <Text style={styles.baseText}>-</Text>;
    }

    const elements = content.split(/(<[^>]+>)/);
    let isStrong = false;
    let isItalic = false;
    let isUnderline = false;
    let isNewLine = false;

    const parsedElements = elements
      .map((element, index) => {
        if (element.startsWith("<")) {
          switch (element.toLowerCase()) {
            case "<b>":
            case "<strong>":
              isStrong = true;
              break;
            case "</b>":
            case "</strong>":
              isStrong = false;
              break;
            case "<i>":
            case "<em>":
              isItalic = true;
              break;
            case "</i>":
            case "</em>":
              isItalic = false;
              break;
            case "<u>":
              isUnderline = true;
              break;
            case "</u>":
              isUnderline = false;
              break;
            case "<br />":
            case "<br>":
              isNewLine = true;
              return <Text key={index}>{"\n"}</Text>;
            case "<p>":
              isNewLine = true;
              return null;
            case "</p>":
              isNewLine = true;
              return <Text key={index}>{"\n"}</Text>;
          }
          return null;
        } else {
          let style = {};
          if (isStrong) style = { ...style, ...styles.bold };
          if (isItalic) style = { ...style, ...styles.italic };
          if (isUnderline) style = { ...style, ...styles.underline };

          const trimmedElement = isNewLine ? element.trim() : element;
          isNewLine = false;

          return trimmedElement ? (
            <Text key={index} style={style}>
              {trimmedElement}
            </Text>
          ) : null;
        }
      })
      .filter(Boolean);

    return parsedElements.length > 0 ? (
      parsedElements
    ) : (
      <Text style={styles.baseText}>-</Text>
    );
  };

  return (
    <Text style={[styles.baseText, { fontWeight: fontWeight }]}>
      {parseHTML(html)}
    </Text>
  );
};

const styles = StyleSheet.create({
  baseText: {
    fontSize: 16,
    lineHeight: 24,
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
  underline: {
    textDecorationLine: "underline",
  },
});

export default HTMLRenderer;
