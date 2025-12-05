import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Category } from '@/database/CakeDatabase';

interface Props {
  categories: Category[];
  selectedId: number;
  onSelect: (id: number) => void;
}

const CategorySelector = ({ categories, selectedId, onSelect }: Props) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[styles.item, selectedId === cat.id && styles.active]}
          onPress={() => onSelect(cat.id)}
        >
          <Text style={[styles.text, selectedId === cat.id && styles.activeText]}>
            {cat.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default CategorySelector;

const styles = StyleSheet.create({
 item: {
  backgroundColor: '#eee',
  paddingVertical: 8,
  paddingHorizontal: 15,
  borderRadius: 20,
  marginRight: 10,
  minWidth: 80,
  maxWidth: 100,
  alignItems: 'center',
},
  active: {
    backgroundColor: '#8B4513'
  },
  text: {
    fontSize: 14,
    color: '#333'
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
