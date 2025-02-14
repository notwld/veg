import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

const VegetableScreen = () => {
  const [vegetables, setVegetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVegetables();
  }, []);

  const fetchVegetables = async () => {
    try {
      const response = await fetch('http://192.168.0.186:1337/api/vegetables?populate=*');
      const json = await response.json();
      setVegetables(json.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      // setError('Failed to fetch vegetables');
      setLoading(false);
    }
  };

  const renderVegetableItem = ({ item }) => {
    const discountedPrice = item.discount_price > 0 ? item.discount_price : item.price;
    const hasDiscount = item.discount_price > 0;

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => {/* Navigate to detail screen */}}
      >
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>{item.name.charAt(0).toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          {item.feature && (
            <View style={styles.featureBadge}>
              <Text style={styles.featureText}>Featured</Text>
            </View>
          )}
          
          <Text style={styles.name}>{item.name}</Text>
          
          <View style={styles.priceContainer}>
            {hasDiscount && (
              <Text style={styles.originalPrice}>
                ${item.price.toFixed(2)}
              </Text>
            )}
            <Text style={styles.price}>
              ${discountedPrice.toFixed(2)}
            </Text>
          </View>
          
          <Text style={styles.unit}>per {item.unit}</Text>

          <View style={styles.stockContainer}>
            <View style={[
              styles.stockIndicator,
              { backgroundColor: item.stock_quantity > 10 ? '#4CAF50' : '#FFA000' }
            ]} />
            <Text style={styles.stock}>
              {item.stock_quantity} {item.unit} left
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={() => {/* Add to cart logic */}}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fresh Vegetables</Text>
        <Text style={styles.headerSubtitle}>Hand-picked for you</Text>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={vegetables}
        renderItem={renderVegetableItem}
        keyExtractor={item => item.documentId}
        contentContainerStyle={styles.list}
        snapToInterval={CARD_WIDTH + 20}
        decelerationRate="fast"
        snapToAlignment="center"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1b1b1b',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 10,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    height: CARD_WIDTH * 0.8,
    backgroundColor: '#f1f3f4',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
  },
  imagePlaceholderText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  cardContent: {
    padding: 16,
  },
  featureBadge: {
    position: 'absolute',
    top: -30,
    right: 16,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginBottom: 8,
    color: '#1b1b1b',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2E7D32',
  },
  originalPrice: {
    fontSize: 18,
    textDecorationLine: 'line-through',
    color: '#999',
    marginRight: 8,
  },
  unit: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stockIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  stock: {
    fontSize: 14,
    color: '#666',
  },
  addToCartButton: {
    backgroundColor: '#2E7D32',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});

export default VegetableScreen;