import React, { useMemo, useState } from 'react';

import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

/*
=========================================================
CHEF'S MENU MANAGER
Final PoE - React Native Mobile Application
=========================================================
Features:
1. Add menu items
2. View menu items
3. Edit menu items
4. Delete menu items
5. Search menu items
6. Filter by course
7. Clear search/filter
8. Display menu statistics
9. Validation
10. Success and error messages
=========================================================
*/

// -------------------------------------------------------
// COURSE OPTIONS
// -------------------------------------------------------

const COURSES = ['Starter', 'Main Course', 'Dessert'];

type MenuItem = {
  id: string;
  name: string;
  description: string;
  course: string;
  price: number;
};

type AppButtonProps = {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  danger?: boolean;
};

type InputFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
};

type CoursePickerProps = {
  value: string;
  onChange: (value: string) => void;
};

type MenuItemCardProps = {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
};

// -------------------------------------------------------
// REUSABLE BUTTON COMPONENT
// -------------------------------------------------------

function AppButton({
  title,
  onPress,
  secondary = false,
  danger = false,
}: AppButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondaryButton,
        danger && styles.dangerButton,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          secondary && styles.secondaryButtonText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

// -------------------------------------------------------
// REUSABLE INPUT COMPONENT
// -------------------------------------------------------

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType = 'default',
}: InputFieldProps) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        multiline={multiline}
        keyboardType={keyboardType}
        style={[
          styles.input,
          multiline && styles.descriptionInput,
        ]}
      />
    </View>
  );
}

// -------------------------------------------------------
// COURSE PICKER COMPONENT
// -------------------------------------------------------

function CoursePicker({ value, onChange }: CoursePickerProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>Course</Text>

      <Pressable
        style={styles.picker}
        onPress={() => setVisible(true)}
      >
        <Text style={value ? styles.pickerText : styles.placeholderText}>
          {value || 'Select course'}
        </Text>

        <Text style={styles.arrow}>▼</Text>
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.courseModal}>
            <Text style={styles.modalTitle}>
              Select Course
            </Text>

            {COURSES.map((course) => (
              <Pressable
                key={course}
                style={styles.courseOption}
                onPress={() => {
                  onChange(course);
                  setVisible(false);
                }}
              >
                <Text style={styles.courseOptionText}>
                  {course}
                </Text>
              </Pressable>
            ))}

            <AppButton
              title="Cancel"
              secondary
              onPress={() => setVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

// -------------------------------------------------------
// MENU ITEM CARD
// -------------------------------------------------------

function MenuItemCard({
  item,
  onEdit,
  onDelete,
}: MenuItemCardProps) {
  return (
    <View style={styles.menuCard}>

      <View style={styles.menuCardTop}>
        <Text style={styles.dishName}>
          {item.name}
        </Text>

        <Text style={styles.price}>
          R{Number(item.price).toFixed(2)}
        </Text>
      </View>

      <Text style={styles.description}>
        {item.description}
      </Text>

      <View style={styles.courseBadge}>
        <Text style={styles.courseBadgeText}>
          {item.course}
        </Text>
      </View>

      <View style={styles.cardButtons}>
        <Pressable
          style={styles.editButton}
          onPress={() => onEdit(item)}
        >
          <Text style={styles.editButtonText}>
            Edit
          </Text>
        </Pressable>

        <Pressable
          style={styles.deleteButton}
          onPress={() => onDelete(item.id)}
        >
          <Text style={styles.deleteButtonText}>
            Delete
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// -------------------------------------------------------
// MAIN APPLICATION
// -------------------------------------------------------

export default function App() {

  // -----------------------------------------------------
  // APPLICATION STATE
  // -----------------------------------------------------

  const [screen, setScreen] = useState('home');

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);

  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  // -----------------------------------------------------
  // RESET FORM
  // -----------------------------------------------------

  const resetForm = () => {
    setDishName('');
    setDescription('');
    setCourse('');
    setPrice('');
    setEditingId(null);
  };

  // -----------------------------------------------------
  // VALIDATE MENU ITEM
  // -----------------------------------------------------

  const validateForm = () => {

    if (!dishName.trim()) {
      Alert.alert(
        'Missing Information',
        'Please enter the dish name.'
      );
      return false;
    }

    if (!description.trim()) {
      Alert.alert(
        'Missing Information',
        'Please enter the dish description.'
      );
      return false;
    }

    if (!course) {
      Alert.alert(
        'Missing Information',
        'Please select a course.'
      );
      return false;
    }

    if (!price.trim()) {
      Alert.alert(
        'Missing Information',
        'Please enter the price.'
      );
      return false;
    }

    const numericPrice = Number(price);

    if (isNaN(numericPrice) || numericPrice <= 0) {
      Alert.alert(
        'Invalid Price',
        'Please enter a valid price greater than R0.'
      );
      return false;
    }

    return true;
  };

  // -----------------------------------------------------
  // ADD MENU ITEM
  // -----------------------------------------------------

  const addMenuItem = () => {

    if (!validateForm()) {
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: dishName.trim(),
      description: description.trim(),
      course: course,
      price: Number(price),
    };

    setMenuItems((currentItems) => [
      ...currentItems,
      newItem,
    ]);

    Alert.alert(
      'Success',
      `${dishName} has been added to the menu.`
    );

    resetForm();
    setScreen('menu');
  };

  // -----------------------------------------------------
  // EDIT MENU ITEM
  // -----------------------------------------------------

  const editMenuItem = (item: MenuItem) => {

    setEditingId(item.id);
    setDishName(item.name);
    setDescription(item.description);
    setCourse(item.course);
    setPrice(String(item.price));

    setScreen('edit');
  };

  // -----------------------------------------------------
  // UPDATE MENU ITEM
  // -----------------------------------------------------

  const updateMenuItem = () => {

    if (!validateForm()) {
      return;
    }

    setMenuItems((currentItems) =>
      currentItems.map((item) => {

        if (item.id === editingId) {
          return {
            ...item,
            name: dishName.trim(),
            description: description.trim(),
            course: course,
            price: Number(price),
          };
        }

        return item;
      })
    );

    Alert.alert(
      'Success',
      'The menu item has been updated successfully.'
    );

    resetForm();
    setScreen('menu');
  };

  // -----------------------------------------------------
  // DELETE MENU ITEM
  // -----------------------------------------------------

  const deleteMenuItem = (id) => {

    const item = menuItems.find(
      (menuItem) => menuItem.id === id
    );

    if (!item) {
      return;
    }

    Alert.alert(
      'Delete Menu Item',
      `Are you sure you want to delete "${item.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {

            setMenuItems((currentItems) =>
              currentItems.filter(
                (menuItem) => menuItem.id !== id
              )
            );

            Alert.alert(
              'Deleted',
              `${item.name} has been removed from the menu.`
            );
          },
        },
      ]
    );
  };

  // -----------------------------------------------------
  // FILTER AND SEARCH MENU ITEMS
  // -----------------------------------------------------

  const filteredMenuItems = useMemo(() => {

    return menuItems.filter((item) => {

      const matchesSearch =
        item.name
          .toLowerCase()
          .includes(searchText.toLowerCase());

      const matchesCourse =
        selectedFilter === 'All' ||
        item.course === selectedFilter;

      return matchesSearch && matchesCourse;
    });

  }, [menuItems, searchText, selectedFilter]);

  // -----------------------------------------------------
  // CLEAR SEARCH AND FILTER
  // -----------------------------------------------------

  const clearSearchAndFilter = () => {
    setSearchText('');
    setSelectedFilter('All');
  };

  // -----------------------------------------------------
  // STATISTICS
  // -----------------------------------------------------

  const totalItems = menuItems.length;

  const averagePrice =
    totalItems === 0
      ? 0
      : menuItems.reduce(
          (total, item) => total + Number(item.price),
          0
        ) / totalItems;

  const starterCount = menuItems.filter(
    (item) => item.course === 'Starter'
  ).length;

  const mainCourseCount = menuItems.filter(
    (item) => item.course === 'Main Course'
  ).length;

  const dessertCount = menuItems.filter(
    (item) => item.course === 'Dessert'
  ).length;

  // -----------------------------------------------------
  // HOME SCREEN
  // -----------------------------------------------------

  const HomeScreen = () => {

    return (
      <ScrollView
        contentContainerStyle={styles.homeContainer}
      >

        <Text style={styles.logoIcon}>
          👨‍🍳
        </Text>

        <Text style={styles.appTitle}>
          CHEF'S
        </Text>

        <Text style={styles.appTitle}>
          MENU MANAGER
        </Text>

        <Text style={styles.welcomeText}>
          Welcome, Chef!
        </Text>

        <Text style={styles.subtitle}>
          Manage your restaurant menu easily
          from your mobile device.
        </Text>

        <AppButton
          title="＋ ADD MENU ITEM"
          onPress={() => {
            resetForm();
            setScreen('add');
          }}
        />

        <AppButton
          title="☰ VIEW MENU"
          onPress={() => setScreen('menu')}
        />

        <AppButton
          title="📊 MENU STATISTICS"
          onPress={() => setScreen('statistics')}
        />

      </ScrollView>
    );
  };

  // -----------------------------------------------------
  // ADD SCREEN
  // -----------------------------------------------------

  const AddScreen = () => {

    return (
      <ScrollView
        contentContainerStyle={styles.formContainer}
      >

        <Text style={styles.screenTitle}>
          Add Menu Item
        </Text>

        <InputField
          label="Dish Name"
          value={dishName}
          onChangeText={setDishName}
          placeholder="Enter dish name"
        />

        <InputField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          multiline
        />

        <CoursePicker
          value={course}
          onChange={setCourse}
        />

        <InputField
          label="Price (R)"
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price"
          keyboardType="decimal-pad"
        />

        <AppButton
          title="SAVE MENU ITEM"
          onPress={addMenuItem}
        />

        <AppButton
          title="CANCEL"
          secondary
          onPress={() => {
            resetForm();
            setScreen('home');
          }}
        />

      </ScrollView>
    );
  };

  // -----------------------------------------------------
  // EDIT SCREEN
  // -----------------------------------------------------

  const EditScreen = () => {

    return (
      <ScrollView
        contentContainerStyle={styles.formContainer}
      >

        <Text style={styles.screenTitle}>
          Update Menu Item
        </Text>

        <InputField
          label="Dish Name"
          value={dishName}
          onChangeText={setDishName}
          placeholder="Enter dish name"
        />

        <InputField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          multiline
        />

        <CoursePicker
          value={course}
          onChange={setCourse}
        />

        <InputField
          label="Price (R)"
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price"
          keyboardType="decimal-pad"
        />

        <AppButton
          title="UPDATE / SAVE CHANGES"
          onPress={updateMenuItem}
        />

        <AppButton
          title="CANCEL"
          secondary
          onPress={() => {
            resetForm();
            setScreen('menu');
          }}
        />

      </ScrollView>
    );
  };

  // -----------------------------------------------------
  // MENU SCREEN
  // -----------------------------------------------------

  const MenuScreen = () => {

    return (
      <View style={styles.menuContainer}>

        <Text style={styles.screenTitle}>
          Menu Items
        </Text>

        {/* SEARCH */}

        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search by dish name..."
          placeholderTextColor="#999"
          style={styles.searchInput}
        />

        {/* FILTER */}

        <Text style={styles.filterTitle}>
          Filter by Course
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >

          {['All', ...COURSES].map((filter) => (

            <Pressable
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              style={[
                styles.filterButton,
                selectedFilter === filter &&
                  styles.activeFilterButton,
              ]}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === filter &&
                    styles.activeFilterText,
                ]}
              >
                {filter}
              </Text>
            </Pressable>

          ))}

        </ScrollView>

        {/* CLEAR */}

        {(searchText || selectedFilter !== 'All') && (
          <Pressable
            onPress={clearSearchAndFilter}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>
              Clear Search & Filter
            </Text>
          </Pressable>
        )}

        {/* MENU LIST */}

        {menuItems.length === 0 ? (

          <View style={styles.emptyContainer}>

            <Text style={styles.emptyIcon}>
              🍽️
            </Text>

            <Text style={styles.emptyTitle}>
              No Menu Items
            </Text>

            <Text style={styles.emptyText}>
              No menu items have been added yet.
            </Text>

            <AppButton
              title="ADD FIRST MENU ITEM"
              onPress={() => {
                resetForm();
                setScreen('add');
              }}
            />

          </View>

        ) : filteredMenuItems.length === 0 ? (

          <View style={styles.emptyContainer}>

            <Text style={styles.emptyIcon}>
              🔍
            </Text>

            <Text style={styles.emptyTitle}>
              No Results
            </Text>

            <Text style={styles.emptyText}>
              No menu items match your search or filter.
            </Text>

            <AppButton
              title="CLEAR SEARCH & FILTER"
              secondary
              onPress={clearSearchAndFilter}
            />

          </View>

        ) : (

          <FlatList
            data={filteredMenuItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MenuItemCard
                item={item}
                onEdit={editMenuItem}
                onDelete={deleteMenuItem}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

        )}

        <AppButton
          title="＋ ADD NEW ITEM"
          onPress={() => {
            resetForm();
            setScreen('add');
          }}
        />

      </View>
    );
  };

  // -----------------------------------------------------
  // STATISTICS SCREEN
  // -----------------------------------------------------

  const StatisticsScreen = () => {

    return (
      <ScrollView
        contentContainerStyle={styles.statisticsContainer}
      >

        <Text style={styles.screenTitle}>
          Menu Statistics
        </Text>

        <Text style={styles.statisticsSubtitle}>
          Overview of your restaurant menu
        </Text>

        {/* TOTAL */}

        <View style={styles.statCard}>

          <Text style={styles.statIcon}>
            🍽️
          </Text>

          <Text style={styles.statNumber}>
            {totalItems}
          </Text>

          <Text style={styles.statLabel}>
            Total Menu Items
          </Text>

        </View>

        {/* AVERAGE PRICE */}

        <View style={styles.statCard}>

          <Text style={styles.statIcon}>
            💰
          </Text>

          <Text style={styles.statNumber}>
            R{averagePrice.toFixed(2)}
          </Text>

          <Text style={styles.statLabel}>
            Average Price
          </Text>

        </View>

        <Text style={styles.courseStatisticsTitle}>
          Items by Course
        </Text>

        {/* STARTER */}

        <View style={styles.courseStatRow}>

          <Text style={styles.courseStatName}>
            Starter
          </Text>

          <Text style={styles.courseStatNumber}>
            {starterCount}
          </Text>

        </View>

        {/* MAIN COURSE */}

        <View style={styles.courseStatRow}>

          <Text style={styles.courseStatName}>
            Main Course
          </Text>

          <Text style={styles.courseStatNumber}>
            {mainCourseCount}
          </Text>

        </View>

        {/* DESSERT */}

        <View style={styles.courseStatRow}>

          <Text style={styles.courseStatName}>
            Dessert
          </Text>

          <Text style={styles.courseStatNumber}>
            {dessertCount}
          </Text>

        </View>

        <AppButton
          title="BACK TO HOME"
          onPress={() => setScreen('home')}
        />

      </ScrollView>
    );
  };

  // -----------------------------------------------------
  // SCREEN NAVIGATION
  // -----------------------------------------------------

  const renderScreen = () => {

    switch (screen) {

      case 'add':
        return <AddScreen />;

      case 'edit':
        return <EditScreen />;

      case 'menu':
        return <MenuScreen />;

      case 'statistics':
        return <StatisticsScreen />;

      default:
        return <HomeScreen />;
    }
  };

  // -----------------------------------------------------
  // MAIN RETURN
  // -----------------------------------------------------

  return (
    <SafeAreaView style={styles.appContainer}>

      <StatusBar
        barStyle="light-content"
        backgroundColor="#5B2CB6"
      />

      {/* TOP BAR */}

      {screen !== 'home' && (
        <View style={styles.header}>

          <Pressable
            onPress={() => {
              resetForm();
              setScreen('home');
            }}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>
              ‹
            </Text>
          </Pressable>

          <Text style={styles.headerTitle}>
            CHEF'S MENU MANAGER
          </Text>

        </View>
      )}

      {renderScreen()}

    </SafeAreaView>
  );
}

// =======================================================
// STYLES
// =======================================================

const styles = StyleSheet.create({

  // -----------------------------------------------------
  // GENERAL
  // -----------------------------------------------------

  appContainer: {
    flex: 1,
    backgroundColor: '#F7F5FC',
  },

  // -----------------------------------------------------
  // HEADER
  // -----------------------------------------------------

  header: {
    height: 60,
    backgroundColor: '#5B2CB6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButtonText: {
    color: '#FFFFFF',
    fontSize: 38,
    lineHeight: 40,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 5,
  },

  // -----------------------------------------------------
  // HOME
  // -----------------------------------------------------

  homeContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },

  logoIcon: {
    fontSize: 65,
    marginBottom: 10,
  },

  appTitle: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#222222',
    textAlign: 'center',
  },

  welcomeText: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 25,
  },

  subtitle: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 15,
    marginTop: 10,
    marginBottom: 30,
    lineHeight: 22,
  },

  // -----------------------------------------------------
  // BUTTONS
  // -----------------------------------------------------

  button: {
    width: '100%',
    backgroundColor: '#5B2CB6',
    minHeight: 52,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 7,
    paddingHorizontal: 15,
  },

  buttonPressed: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },

  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#5B2CB6',
  },

  secondaryButtonText: {
    color: '#5B2CB6',
  },

  dangerButton: {
    backgroundColor: '#D32F2F',
  },

  // -----------------------------------------------------
  // FORMS
  // -----------------------------------------------------

  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  screenTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 20,
  },

  inputContainer: {
    marginBottom: 17,
  },

  inputLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 7,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    minHeight: 50,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#222222',
  },

  descriptionInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 13,
  },

  // -----------------------------------------------------
  // PICKER
  // -----------------------------------------------------

  picker: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  pickerText: {
    color: '#222222',
    fontSize: 16,
  },

  placeholderText: {
    color: '#999999',
    fontSize: 16,
  },

  arrow: {
    color: '#5B2CB6',
    fontSize: 15,
  },

  // -----------------------------------------------------
  // MODAL
  // -----------------------------------------------------

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 25,
  },

  courseModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },

  modalTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#222222',
  },

  courseOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  courseOptionText: {
    fontSize: 17,
    color: '#5B2CB6',
    fontWeight: '600',
  },

  // -----------------------------------------------------
  // MENU
  // -----------------------------------------------------

  menuContainer: {
    flex: 1,
    padding: 18,
  },

  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 14,
  },

  filterTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333333',
    marginBottom: 8,
  },

  filterScroll: {
    maxHeight: 45,
    marginBottom: 5,
  },

  filterButton: {
    borderWidth: 1,
    borderColor: '#5B2CB6',
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: 'center',
    marginRight: 8,
    height: 38,
    backgroundColor: '#FFFFFF',
  },

  activeFilterButton: {
    backgroundColor: '#5B2CB6',
  },

  filterButtonText: {
    color: '#5B2CB6',
    fontWeight: '600',
  },

  activeFilterText: {
    color: '#FFFFFF',
  },

  clearButton: {
    alignSelf: 'flex-end',
    marginVertical: 8,
  },

  clearButtonText: {
    color: '#5B2CB6',
    fontWeight: 'bold',
  },

  listContent: {
    paddingBottom: 10,
  },

  // -----------------------------------------------------
  // MENU CARD
  // -----------------------------------------------------

  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginVertical: 7,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    elevation: 2,
  },

  menuCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  dishName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#5B2CB6',
    flex: 1,
    paddingRight: 10,
  },

  price: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222222',
  },

  description: {
    fontSize: 14,
    color: '#555555',
    marginTop: 8,
    lineHeight: 20,
  },

  courseBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEE7FF',
    borderRadius: 15,
    paddingHorizontal: 11,
    paddingVertical: 5,
    marginTop: 10,
  },

  courseBadgeText: {
    color: '#5B2CB6',
    fontWeight: 'bold',
    fontSize: 12,
  },

  cardButtons: {
    flexDirection: 'row',
    marginTop: 15,
  },

  editButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#5B2CB6',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },

  editButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  deleteButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#D32F2F',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },

  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // -----------------------------------------------------
  // EMPTY STATE
  // -----------------------------------------------------

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  emptyIcon: {
    fontSize: 50,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#333333',
  },

  emptyText: {
    color: '#666666',
    textAlign: 'center',
    marginVertical: 10,
  },

  // -----------------------------------------------------
  // STATISTICS
  // -----------------------------------------------------

  statisticsContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  statisticsSubtitle: {
    color: '#666666',
    marginTop: -12,
    marginBottom: 20,
  },

  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 22,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    elevation: 2,
  },

  statIcon: {
    fontSize: 35,
    marginBottom: 5,
  },

  statNumber: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#5B2CB6',
  },

  statLabel: {
    color: '#555555',
    fontSize: 15,
    marginTop: 5,
  },

  courseStatisticsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222222',
    marginTop: 10,
    marginBottom: 12,
  },

  courseStatRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 17,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },

  courseStatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },

  courseStatNumber: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#5B2CB6',
  },

})