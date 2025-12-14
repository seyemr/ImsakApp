import { View, Text } from 'react-native';
import styles from '../styles/styles';

export default function AyahCard({ arabic, translation, number, showArabic, showTranslation, fontSize }) {
  return (
    <View style={styles.card}>
      <Text style={styles.ayahNumber}>{number}</Text>
      {showArabic && (
        <Text style={[styles.arabic, { fontSize }]}>{arabic}</Text>
      )}
      {showTranslation && (
        <Text style={[styles.translation, { fontSize }]}>{translation}</Text>
      )}
    </View>
  );
}
