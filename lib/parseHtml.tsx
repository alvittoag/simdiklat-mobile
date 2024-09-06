import { Linking, Text } from "react-native";

export const parseHtml = (htmlString: any) => {
  const parts = htmlString?.split(/(<a href=".*?">.*?<\/a>|<p>.*?<\/p>)/g);

  return parts?.map((part: any, index: any) => {
    if (part.startsWith("<a")) {
      const href = part.match(/href="(.*?)"/)[1];
      const linkText = part.match(/>(.*?)<\/a>/)[1];
      return (
        <Text
          key={index}
          style={{ color: "blue" }}
          onPress={() => Linking.openURL(href)}
        >
          {linkText}
        </Text>
      );
    }

    // Handle <p> tags
    if (part.startsWith("<p")) {
      const text = part.match(/<p>(.*?)<\/p>/)[1];
      return (
        <Text key={index} style={{ marginBottom: 10 }}>
          {text}
        </Text>
      );
    }

    // Just return plain text
    return <Text key={index}>{part}</Text>;
  });
};
