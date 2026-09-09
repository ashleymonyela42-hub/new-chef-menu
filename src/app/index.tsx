
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';

export default function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [screen, setScreen] = useState('home');
  const [editingIndex, setEditingIndex] = useState(null);
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starter');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');

  const courses = ['Starter', 'Main Course', 'Dessert'];

  const saveItem = () => {
    if (!dishName.trim() || !description.trim() || !price.trim()) {
      setMessage('Please fill in all fields');
      return;
    }

    if (isNaN(parseFloat(price))) {
      setMessage('Please enter a valid price');
      return;
    }

    if (editingIndex !== null) {
      const updatedItems = [...menuItems];
      updatedItems[editingIndex] = {
        id: Date.now().toString(),
        dishName: dishName.trim(),
        description: description.trim(),
        course: course,
        price: parseFloat(price).toFixed(2)
      };
      setMenuItems(updatedItems);
      setMessage('Item updated successfully!');
      setEditingIndex(null);
    } else {
      const newItem = {
        id: Date.now().toString(),
        dishName: dishName.trim(),
        description: description.trim(),
        course: course,
        price: parseFloat(price).toFixed(2)
      };
      setMenuItems([...menuItems, newItem]);
      setMessage('Item added successfully!');
    }

    setTimeout(() => {
      clearForm();
      setScreen('home');
    }, 1500);
  };

  const clearForm = () => {
    setDishName('');
    setDescription('');
    setCourse('Starter');
    setPrice('');
    setMessage('');
    setEditingIndex(null);
  };

  const goToAdd = () => {
    clearForm();
    setScreen('add');
  };

  const goToEdit = (item, index) => {
    setDishName(item.dishName);
    setDescription(item.description);
    setCourse(item.course);
    setPrice(item.price.toString());
    setEditingIndex(index);
    setScreen('add');
    setMessage('');
  };

  const goHome = () => {
    clearForm();
    setScreen('home');
  };

  const renderHome = () => (
    <View style={styles.screen}>
      <Text style={styles.title}>🍽️ MENU ITEMS</Text>
      
      {menuItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No menu items added yet</Text>
          <Text style={styles.emptySubText}>Tap "Add New Item" to get started</Text>
        </View>
      ) : (
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => goToEdit(item, index)}
            >
              <View style={styles.itemRow}>
                <View style={styles.itemLeft}>
                  <Text style={styles.itemName}>{item.dishName}</Text>
                  <Text style={styles.itemDesc}>{item.description}</Text>
                  <Text style={styles.itemCourse}>📌 {item.course}</Text>
                </View>
                <Text style={styles.itemPrice}>R{item.price}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={goToAdd}>
        <Text style={styles.addButtonText}>+ ADD NEW ITEM</Text>
      </TouchableOpacity>

      {message ? <Text style={styles.statusMessage}>{message}</Text> : null}
    </View>
  );

  const renderAdd = () => (
    <ScrollView style={styles.screen}>
      <Text style={styles.title}>
        {editingIndex !== null ? '✏️ EDIT MENU ITEM' : '➕ ADD MENU ITEM'}
      </Text>