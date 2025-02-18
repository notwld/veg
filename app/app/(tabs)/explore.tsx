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
  Image,
  TextInput
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.6;

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
      setLoading(false);
    }
  };

  const renderVegetableItem = ({ item }) => {
    const discountedPrice = item.discount_price > 0 ? item.discount_price : item.price;
    const hasDiscount = item.discount_price > 0;

    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>{item.name.charAt(0).toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.priceRow}>
            {hasDiscount && (
              <Text style={styles.originalPrice}>${item.price.toFixed(2)}</Text>
            )}
            <Text style={styles.price}>${discountedPrice.toFixed(2)}</Text>
            <Text style={styles.unit}>/{item.unit}</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <Text style={styles.categoryText}>Category {item}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>John Wick</Text>
        </View>
        <Image 
          source={{uri: "https://placehold.co/600x400/png"}}
          style={styles.avatar}
        />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search fresh vegetables..."
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
      </View>

      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[1,2,3,4,5]}
        renderItem={renderCategoryItem}
        contentContainerStyle={styles.categoryList}
        keyExtractor={item => item.toString()}
      />

      <Text style={styles.sectionTitle}>Fresh Picks</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={vegetables}
        renderItem={renderVegetableItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.vegetableList}
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
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    marginTop: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginTop: 25,
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  categoryList: {
    paddingHorizontal: 10,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  vegetableList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    height: CARD_WIDTH,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFE8E8',
  },
  imagePlaceholderText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  cardContent: {
    padding: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: '#999',
    marginRight: 8,
  },
  unit: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  addButton: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    backgroundColor: '#FF6B6B',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VegetableScreen;