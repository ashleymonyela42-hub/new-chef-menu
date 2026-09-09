(No subject)
Ashley<ashleymonyela42@gmail.com>

Ashley Mohlatlego Monyela
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
                  <Text style={styles.itemCourse}>{item.course}</Text>
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
        {editingIndex !== null ? 'EDIT MENU ITEM' : 'ADD MENU ITEM'}
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>Dish Name *</Text>
        <TextInput
          style={styles.input}
          value={dishName}
          onChangeText={setDishName}
          placeholder="e.g. Beef Burger"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="e.g. With cheddar cheese and chips"
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Course *</Text>
        <View style={styles.courseContainer}>
          {courses.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.courseButton,
                course === c && styles.courseButtonActive
              ]}
              onPress={() => setCourse(c)}
            >
              <Text style={[
                styles.courseButtonText,
                course === c && styles.courseButtonTextActive
              ]}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Price *</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="e.g. 95.00"
          placeholderTextColor="#999"
          keyboardType="decimal-pad"
        />

        {message ? <Text style={styles.errorText}>{message}</Text> : null}

        <View style={styles.buttonRow}>
          <View style={styles.buttonWrapper}>
            <Button title="SAVE" onPress={saveItem} color="#28a745" />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="CANCEL" onPress={goHome} color="#dc3545" />
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {screen === 'home' ? renderHome() : renderAdd()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  menuItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  itemCourse: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    fontStyle: 'italic',
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
  },
  emptySubText: {
    fontSize: 16,
    color: '#999',
    marginTop: 5,
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  courseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  courseButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
    alignItems: 'center',
  },
  courseButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  courseButtonText: {
    color: '#333',
    fontSize: 14,
  },
  courseButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  buttonWrapper: {
    flex: 1,
  },
  errorText: {
    color: '#dc3545',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusMessage: {
    color: '#28a745',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});