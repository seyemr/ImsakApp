import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F8F8',
  },

  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 15,
    color: '#111',
  },

  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
  },

  surahItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
  },

  surahNumber: {
    fontSize: 20,
    width: 35,
    fontWeight: '600',
    color: '#444',
  },

  surahName: {
    fontSize: 18,
    fontWeight: '600',
  },

  surahSub: {
    color: '#666',
    fontSize: 14,
  },

  surahCount: {
    marginLeft: 'auto',
    color: '#555',
  },

  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
  },

  ayahNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#777',
    marginBottom: 4,
  },

  arabic: {
    fontSize: 22,
    textAlign: 'right',
    marginBottom: 10,
    fontWeight: '600',
  },

  translation: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
});
