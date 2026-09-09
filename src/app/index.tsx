import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

export default function App() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [screen, setScreen] = useState('home');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starter');
  const [price, setPrice] = useState('');

  const [message, setMessage] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filterCourse, setFilterCourse] = useState('All');

  const courses = ['Starter', 'Main Course', 'Dessert'];

  // ADD OR UPDATE MENU ITEM
  const saveItem = () => {
    if (!dishName.trim() || !description.trim() || !price.trim()) {
      setMessage('Please fill in all fields.');
      return;
    }

    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      setMessage('Please enter a valid price.');
      return;
    }

    if (editingIndex !== null) {
      const updatedItems = [...menuItems];

      updatedItems[editingIndex] = {
        ...updatedItems[editingIndex],
        dishName: dishName.trim(),
        description: description.trim(),
        course: course,
        price: parseFloat(price).toFixed(2),
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
        price: parseFloat(price).toFixed(2),
      };

      setMenuItems([...menuItems, newItem]);
      setMessage('Item added successfully!');
    }

    setTimeout(() => {
      clearForm();
      setScreen('home');
    }, 1200);
  };

  // CLEAR FORM
  const clearForm = () => {
    setDishName('');
    setDescription('');
    setCourse('Starter');
    setPrice('');
    setMessage('');
    setEditingIndex(null);
  };

  // GO TO ADD SCREEN
  const goToAdd = () => {
    clearForm();
    setScreen('add');
  };

  // GO TO EDIT SCREEN
  const goToEdit = (item: any, index: number) => {
    setDishName(item.dishName);
    setDescription(item.description);
    setCourse(item.course);
    setPrice(item.price.toString());
    setEditingIndex(index);
    setMessage('');
    setScreen('add');
  };

  const deleteItem = (index: number) => {
    Alert.alert(
      'Delete Menu Item',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedItems = menuItems.filter(
              (_, itemIndex) => itemIndex !== index
            );

            setMenuItems(updatedItems);
            setMessage('Item deleted successfully!');

            setTimeout(() => {
              setMessage('');
            }, 1500);
          },
        },
      ]
    );
  };

  // GO HOME
  const goHome = () => {
    clearForm();
    setScreen('home');
  };

  // FILTER MENU ITEMS
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.dishName
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesCourse =
      filterCourse === 'All' || item.course === filterCourse;

    return matchesSearch && matchesCourse;
  });

  // HOME SCREEN
  const renderHome = () => (
    <View style={styles.screen}>
      <Text style={styles.logo}></Text>

      <Text style={styles.title}>CHEF'S MENU MANAGER</Text>

      <Text style={styles.welcome}>
        MANAGE YOUR MENU ITEMS EASILY
      </Text>

      <View style={styles.homeButtons}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={goToAdd}
        >
          <Text style={styles.primaryButtonText}>
           ADD MENU ITEM
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setScreen('menu')}
        >
          <Text style={styles.secondaryButtonText}>
           VIEW MENU ITEMS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.goldButton}
          onPress={() => setScreen('statistics')}
        >
          <Text style={styles.goldButtonText}>
          VIEW STATISTICS
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.totalBox}>
        <Text style={styles.totalNumber}>{menuItems.length}</Text>
        <Text style={styles.totalText}>MENU ITEMS</Text>
      </View>
    </View>
  );

  // ADD / EDIT SCREEN
  const renderAdd = () => (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.title}>
        {editingIndex !== null
          ? 'EDIT MENU ITEM'
          : 'ADD MENU ITEM'}
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
                course === c && styles.courseButtonActive,
              ]}
              onPress={() => setCourse(c)}
            >
              <Text
                style={[
                  styles.courseButtonText,
                  course === c && styles.courseButtonTextActive,
                ]}
              >
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

        {message ? (
          <Text style={styles.errorText}>{message}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveItem}
        >
          <Text style={styles.saveButtonText}>
            {editingIndex !== null ? 'UPDATE ITEM' : 'SAVE ITEM'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={goHome}
        >
          <Text style={styles.cancelButtonText}>CANCEL</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // MENU SCREEN
  const renderMenu = () => (
    <View style={styles.screen}>
      <Text style={styles.title}>📋 MENU ITEMS</Text>


      <Text style={styles.filterTitle}>Filter by Course</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterCourse === 'All' && styles.filterActive,
          ]}
          onPress={() => setFilterCourse('All')}
        >
          <Text
            style={[
              styles.filterText,
              filterCourse === 'All' && styles.filterTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {courses.map((c) => (
          <TouchableOpacity
            key={c}
            style={[
              styles.filterButton,
              filterCourse === c && styles.filterActive,
            ]}
            onPress={() => setFilterCourse(c)}
          >
            <Text
              style={[
                styles.filterText,
                filterCourse === c && styles.filterTextActive,
              ]}
            >
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => {
          setSearchText('');
          setFilterCourse('All');
        }}
      >
        <Text style={styles.clearButtonText}>
          CLEAR SEARCH & FILTER
        </Text>
      </TouchableOpacity>

      {filteredItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No menu items found
          </Text>
          <Text style={styles.emptySubText}>
            Add a new menu item to get started.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => {
            const originalIndex = menuItems.findIndex(
              (menuItem) => menuItem.id === item.id
            );

            return (
              <View style={styles.menuItem}>
                <View style={styles.itemRow}>
                  <View style={styles.itemLeft}>
                    <Text style={styles.itemName}>
                      {item.dishName}
                    </Text>

                    <Text style={styles.itemDesc}>
                      {item.description}
                    </Text>

                    <Text style={styles.itemCourse}>
                     {item.course}
                    </Text>
                  </View>

                  <Text style={styles.itemPrice}>
                    R{item.price}
                  </Text>
                </View>

                <View style={styles.itemButtons}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() =>
                      goToEdit(item, originalIndex)
                    }
                  >
                    <Text style={styles.editButtonText}>
                     EDIT
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() =>
                      deleteItem(originalIndex)
                    }
                  >
                    <Text style={styles.deleteButtonText}>
                      DELETE
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={goHome}
      >
        <Text style={styles.backButtonText}>
          ← BACK TO HOME
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderStatistics = () => {
    const totalItems = menuItems.length;

    const totalPrice = menuItems.reduce(
      (sum, item) => sum + parseFloat(item.price),
      0
    );

    const averagePrice =
      totalItems > 0 ? totalPrice / totalItems : 0;

    const starterCount = menuItems.filter(
      (item) => item.course === 'Starter'
    ).length;

    const mainCourseCount = menuItems.filter(
      (item) => item.course === 'Main Course'
    ).length;

    const dessertCount = menuItems.filter(
      (item) => item.course === 'Dessert'
    ).length;

    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}> STATISTICS</Text>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {totalItems}
          </Text>
          <Text style={styles.statLabel}>
            TOTAL MENU ITEMS
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            R{averagePrice.toFixed(2)}
          </Text>
          <Text style={styles.statLabel}>
            AVERAGE PRICE
          </Text>
        </View>

        <Text style={styles.courseStatsTitle}>
          ITEMS BY COURSE
        </Text>

        <View style={styles.courseStatRow}>
          <Text style={styles.courseStatName}>
            Starter
          </Text>
          <Text style={styles.courseStatNumber}>
            {starterCount}
          </Text>
        </View>

        <View style={styles.courseStatRow}>
          <Text style={styles.courseStatName}>
           Main Course
          </Text>
          <Text style={styles.courseStatNumber}>
            {mainCourseCount}
          </Text>
        </View>

        <View style={styles.courseStatRow}>
          <Text style={styles.courseStatName}>
           Dessert
          </Text>
          <Text style={styles.courseStatNumber}>
            {dessertCount}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={goHome}
        >
          <Text style={styles.backButtonText}>
            ← BACK TO HOME
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {screen === 'home' && renderHome()}
      {screen === 'add' && renderAdd()}
      {screen === 'menu' && renderMenu()}
      {screen === 'statistics' && renderStatistics()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF5',
    paddingTop: 40,
  },

  screen: {
    flex: 1,
    paddingHorizontal: 20,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  logo: {
    fontSize: 55,
    textAlign: 'center',
    marginTop: 25,
  },

  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 10,
    textAlign: 'center',
  },

  welcome: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginBottom: 30,
  },

  homeButtons: {
    marginTop: 10,
  },

  primaryButton: {
    backgroundColor: '#1B5E20',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  secondaryButton: {
    backgroundColor: '#E8F5E9',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2E7D32',
  },

  secondaryButtonText: {
    color: '#1B5E20',
    fontSize: 17,
    fontWeight: 'bold',
  },

  goldButton: {
    backgroundColor: '#D4A017',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },

  goldButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  totalBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },

  totalNumber: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#1B5E20',
  },

  totalText: {
    color: '#2E7D32',
    fontWeight: 'bold',
    marginTop: 3,
  },

  form: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderTopWidth: 5,
    borderTopColor: '#D4A017',
    elevation: 3,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: 9,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F8FFF8',
  },

  textArea: {
    height: 85,
    textAlignVertical: 'top',
  },

  courseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },

  courseButton: {
    flex: 1,
    padding: 11,
    marginHorizontal: 3,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#A5D6A7',
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
  },

  courseButtonActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },

  courseButtonText: {
    color: '#1B5E20',
    fontSize: 13,
    textAlign: 'center',
  },

  courseButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  saveButton: {
    backgroundColor: '#2E7D32',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  cancelButton: {
    backgroundColor: '#D4A017',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  errorText: {
    color: '#C62828',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 15,
    fontWeight: 'bold',
  },

  searchInput: {
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: 10,
    padding: 13,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    marginBottom: 12,
  },

  filterTitle: {
    color: '#1B5E20',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },

  filterScroll: {
    marginBottom: 10,
  },

  filterButton: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#A5D6A7',
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 8,
  },

  filterActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },

  filterText: {
    color: '#1B5E20',
    fontWeight: '600',
  },

  filterTextActive: {
    color: '#FFFFFF',
  },

  clearButton: {
    backgroundColor: '#D4A017',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },

  clearButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  menuItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#D4A017',
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
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1B5E20',
  },

  itemDesc: {
    fontSize: 14,
    color: '#555',
    marginTop: 3,
  },

  itemCourse: {
    fontSize: 13,
    color: '#2E7D32',
    marginTop: 5,
  },

  itemPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4A017',
    marginLeft: 10,
  },

  itemButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },

  editButton: {
    flex: 1,
    backgroundColor: '#2E7D32',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  editButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  deleteButton: {
    flex: 1,
    backgroundColor: '#FFF0E6',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4A017',
  },

  deleteButtonText: {
    color: '#9A6500',
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
    color: '#1B5E20',
    fontWeight: 'bold',
  },

  emptySubText: {
    fontSize: 15,
    color: '#777',
    marginTop: 7,
    textAlign: 'center',
  },

  backButton: {
    backgroundColor: '#1B5E20',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },

  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    marginBottom: 15,
    borderTopWidth: 5,
    borderTopColor: '#D4A017',
    elevation: 3,
  },

  statNumber: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#1B5E20',
  },

  statLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
    marginTop: 5,
  },

  courseStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },

  courseStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
  },

  courseStatName: {
    color: '#1B5E20',
    fontSize: 16,
    fontWeight: '600',
  },

  courseStatNumber: {
    color: '#D4A017',
    fontSize: 18,
    fontWeight: 'bold',
  },
});