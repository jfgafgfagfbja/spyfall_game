import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {useLocation} from '../context/LocationContext';

interface LocationListSelectionProps {
  navigation: any;
}

const LocationListSelection: React.FC<LocationListSelectionProps> = ({navigation}) => {
  const {locationLists, selectedList, setSelectedList} = useLocation();

  const handleSelect = (list: any) => {
    setSelectedList(list);
    navigation.goBack();
  };

  const handleManage = () => {
    navigation.navigate('LocationManagement');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={locationLists}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.listItem,
              selectedList?.id === item.id && styles.selectedItem,
            ]}
            onPress={() => handleSelect(item)}>
            <View>
              <Text style={styles.listName}>
                {item.name}
                {item.isDefault && ' (Mặc định)'}
              </Text>
              <Text style={styles.listCount}>
                {item.locations.length} địa điểm
              </Text>
            </View>
            {selectedList?.id === item.id && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.manageButton} onPress={handleManage}>
            <Text style={styles.manageButtonText}>⚙️ Quản lý danh sách</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listItem: {
    backgroundColor: '#FFF',
    padding: 20,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedItem: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  listName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  listCount: {
    fontSize: 14,
    color: '#666',
  },
  checkmark: {
    fontSize: 24,
    color: '#007AFF',
  },
  manageButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    margin: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  manageButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LocationListSelection;
