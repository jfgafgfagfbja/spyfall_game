import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import {useLocation} from '../context/LocationContext';
import {LocationList} from '../types';

interface LocationManagementProps {
  navigation: any;
}

const LocationManagement: React.FC<LocationManagementProps> = ({navigation}) => {
  const {locationLists, createLocationList, deleteLocationList} = useLocation();
  const [modalVisible, setModalVisible] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [nameError, setNameError] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreateList = async () => {
    const trimmed = newListName.trim();
    if (!trimmed) {
      setNameError('Tên danh sách không được để trống');
      return;
    }
    const duplicate = locationLists.some(
      l => l.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (duplicate) {
      setNameError('Tên danh sách đã tồn tại');
      return;
    }
    try {
      setCreating(true);
      const newList = await createLocationList(trimmed);
      setModalVisible(false);
      setNewListName('');
      setNameError('');
      navigation.navigate('LocationListDetail', {listId: newList.id, listName: newList.name});
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể tạo danh sách mới');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = (list: LocationList) => {
    if (list.isDefault) {
      Alert.alert('Không thể xóa', 'Danh sách mặc định không thể bị xóa');
      return;
    }
    Alert.alert(
      'Xóa danh sách',
      `Bạn có chắc muốn xóa "${list.name}" và tất cả địa điểm trong đó?`,
      [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteLocationList(list.id);
            } catch (e) {
              Alert.alert('Lỗi', 'Không thể xóa danh sách');
            }
          },
        },
      ],
    );
  };

  const handleOpenDetail = (list: LocationList) => {
    navigation.navigate('LocationListDetail', {listId: list.id, listName: list.name});
  };

  const renderItem = ({item}: {item: LocationList}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => handleOpenDetail(item)}
      activeOpacity={0.8}>
      <View style={styles.listItemContent}>
        <Text style={styles.listName}>
          {item.name}
          {item.isDefault && (
            <Text style={styles.defaultBadge}> (Mặc định)</Text>
          )}
        </Text>
        <Text style={styles.locationCount}>
          {item.locations.length} địa điểm
        </Text>
      </View>
      <View style={styles.listItemActions}>
        <Text style={styles.chevron}>›</Text>
        {!item.isDefault && (
          <TouchableOpacity
            onPress={() => handleDelete(item)}
            style={styles.deleteButton}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Text style={styles.deleteButtonText}>🗑</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={locationLists}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Chưa có danh sách nào</Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setNewListName('');
          setNameError('');
          setModalVisible(true);
        }}>
        <Text style={styles.addButtonText}>+ Tạo danh sách mới</Text>
      </TouchableOpacity>

      {/* Create new list modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Danh Sách Mới</Text>
            <TextInput
              style={[styles.textInput, nameError ? styles.inputError : null]}
              placeholder="Tên danh sách..."
              value={newListName}
              onChangeText={text => {
                setNewListName(text);
                if (nameError) setNameError('');
              }}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleCreateList}
            />
            {nameError ? (
              <Text style={styles.errorText}>{nameError}</Text>
            ) : null}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.confirmButton,
                  creating && styles.disabledButton,
                ]}
                onPress={handleCreateList}
                disabled={creating}>
                <Text style={styles.confirmButtonText}>
                  {creating ? 'Đang tạo...' : 'Tạo'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    paddingVertical: 10,
  },
  listItem: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  listItemContent: {
    flex: 1,
  },
  listName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  defaultBadge: {
    fontSize: 13,
    fontWeight: '400',
    color: '#007AFF',
  },
  locationCount: {
    fontSize: 14,
    color: '#8E8E93',
  },
  listItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chevron: {
    fontSize: 22,
    color: '#C7C7CC',
    fontWeight: '300',
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 60,
    color: '#8E8E93',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    margin: 15,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: '#D1D1D6',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 6,
    color: '#1C1C1E',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 2,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  modalButton: {
    flex: 1,
    borderRadius: 10,
    padding: 13,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
  },
  cancelButtonText: {
    color: '#1C1C1E',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default LocationManagement;
