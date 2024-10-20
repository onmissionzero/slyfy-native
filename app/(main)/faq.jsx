import React from 'react';
import { View, Text, Linking, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FaqItem from '../../components/FaqItem';

function Faq() {
  const faqs = [
    {
      question: "Why does this not work for me?",
      answer: (
        <Text style={styles.text}>
          If the app isn't working for you, it's likely because you're not on the whitelist. 
          Contact the developer on{' '}
          <Text 
            style={styles.link} 
            onPress={() => Linking.openURL('https://discord.com/invite/6YyMRZSq')}
          >
            Discord
          </Text>.
        </Text>
      )
    },
    {
      question: "What is the whitelist?",
      answer: (
        <Text style={styles.text}>
          Due to how Spotify works (compliance with developer policy), the app is in <Text 
            style={styles.link} 
            onPress={() => Linking.openURL('https://developer.spotify.com/documentation/web-api/concepts/quota-modes')}
          >
            development mode
          </Text>.
          There can only be so many people accessing the app (testers) that the developer has to approve.
        </Text>
      )
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Frequently Asked Questions</Text>
      <View style={styles.content}>
        {faqs.map((faq, index) => (
          <FaqItem
            key={index}
            question={`${index + 1}. ${faq.question}`}
            answer={faq.answer}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  header: {
    fontFamily: 'Palanquin', // Apply the custom font here
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  content: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
  },
  text: {
    fontFamily: 'Palanquin', // Apply the custom font here
    color: 'white',
  },
  link: {
    fontFamily: 'Palanquin', // Apply the custom font here
    color: '#3b82f6',
    textDecorationLine: 'underline',
  },
});

export default Faq;
