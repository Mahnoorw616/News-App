import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';

const NewsScreen = () => {
  const [category, setCategory] = useState('Technology'); // Default category
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = ['Technology', 'Business', 'Sports', 'Entertainment'];

  // Fetch news articles based on selected category
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?category=${category}&apiKey=YOUR_API_KEY`);
        const data = await response.json();
        setArticles(data.articles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [category]); // Re-fetch articles whenever the category changes

  // Handle article selection and show a confirmation dialog
  const handleArticleSelect = (article) => {
    Alert.alert(
      'Continue Reading?',
      `Do you want to continue reading "${article.title}"?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => openArticle(article.url) },
      ]
    );
  };

  // Open the article in the browser
  const openArticle = (url) => {
    Linking.openURL(url).catch(err => console.error("Error opening URL", err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Category</Text>
      <View style={styles.radioButtonsContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.radioButton, category === cat && styles.selectedRadioButton]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.radioButtonText, category === cat && styles.selectedRadioButtonText]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <Text>Loading articles...</Text>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleArticleSelect(item)}>
              <View style={styles.articleCard}>
                <Text style={styles.articleTitle}>{item.title}</Text>
                <Text>{item.description}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  radioButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  radioButton: {
    padding: 10,
    marginRight: 20,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioButton: {
    backgroundColor: '#007bff',
  },
  radioButtonText: {
    fontSize: 16,
    color: '#007bff',
  },
  selectedRadioButtonText: {
    color: '#fff',
  },
  articleCard: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default NewsScreen;
