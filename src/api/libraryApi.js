import axios from 'axios';

const turkishKeywords = ['din', 'islam', 'dua', 'tasavvuf', 'mevlana', 'namaz', 'hadis', 'tefsir', 'iman', 'ahlak', 'ibadet', 'kuran', 'sufi', 'peygamber', 'ramazan', 'ezan'];

// Din kategorisinden kitapları getirir
export async function getBooks() {
  let allBooks = [];
  for (const kw of turkishKeywords) {
    try {
      const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(kw)}&langRestrict=tr&maxResults=8`);
      if (res.data.items) {
        allBooks = allBooks.concat(res.data.items);
      }
    } catch (e) {}
  }
  // Benzersiz kitaplar
  const uniqueBooks = [];
  const seen = new Set();
  for (const book of allBooks) {
    if (!seen.has(book.id)) {
      uniqueBooks.push(book);
      seen.add(book.id);
    }
  }
  return uniqueBooks;
}

// Kitap arama
export async function searchBooks(query) {
  const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&langRestrict=tr&maxResults=20`);
  return res.data.items || [];
}

// Kitap detayı getir
export async function getBookDetail(bookId) {
  const res = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
  return res.data;
}
