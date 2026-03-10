import React, {useState, useMemo} from 'react';
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
import {Location} from '../types';

interface LocationListDetailProps {
  navigation: any;
  route: any;
}

const LocationListDetail: React.FC<LocationListDetailProps> = ({
  navigation,
  route,
}) => {
  const {listId} = route.params as {listId: string};
  const {locationLists, addLocation, updateLocation, deleteLocation} =
    useLocation();

  const list = useMemo(
    () => locationLists.find(l => l.id === listId),
    [locationLists, listId],
  );

  // Add modal state
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');
  const [addError, setAddError] = useState('');
  const [adding, setAdding] = useState(false);

  // Edit inline state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editError, setEditError] = useState('');

  if (!list) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFoundText}>Không tìm thấy danh sách</Text>
      </View>
    );
  }

  const isDefault = list.isDefault;
  const tooFew = list.locations.length < 10;

  const handleAdd = async () => {
    const trimmed = newLocationName.trim();
    if (!trimmed) {
      setAddError('Tên địa điểm không được để trống');
      return;
    }
    const duplicate = list.locations.some(
      loc => loc.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (duplicate) {
      setAddError('Địa điểm này đã tồn tại trong danh sách');
      return;
    }
    try {
      setAdding(true);
      await addLocation(listId, trimmed);
      setAddModalVisible(false);
      setNewLocationName('');
      setAddError('');
    } catch (e: any) {
      setAddError(e?.message || 'Không thể thêm địa điểm');
    } finally {
      setAdding(false);
    }
  };

  const handleStartEdit = (loc: Location) => {
    setEditingId(loc.id);
    setEditingName(loc.name);
    setEditError('');
  };

  const handleSaveEdit = async (loc: Location) => {
    const trimmed = editingName.trim();
    if (!trimmed) {
      setEditError('Tên địa điểm không được để trống');
      return;
    }
    if (trimmed.toLowerCase() === loc.name.toLowerCase()) {
      setEditingId(null);
      return;
    }
    const duplicate = list.locations.some(
      l => l.id !== loc.id && l.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (duplicate) {
      setEditError('Địa điểm này đã tồn tại trong danh sách');
      return;
    }
    try {
      await updateLocation(listId, loc.id, trimmed);
      setEditingId(null);
      setEditError('');
    } catch (e: any) {
      setEditError(e?.message || 'Không thể cập nhật địa điểm');
    }
  };

  const handleDelete = (loc: Location) => {
    Alert.alert(
      'Xóa địa điểm',
      `Bạn có chắc muốn xóa "${loc.name}"?`,
      [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteLocation(listId, loc.id);
            } catch (e) {
              Alert.alert('Lỗi', 'Không thể xóa địa điểm');
            }
          },
        },
      ],
    );
  };

  const renderLocation = ({item}: {item: Location}) => {
    const isEditing = editingId === item.id;
    return (
      <View style={styles.locationItem}>
        {isEditing ? (
          <View style={styles.editRow}>
            <TextInput
              style={[styles.editInput, editError ? styles.inputError : null]}
              value={editingName}
              onChangeText={text => {
                setEditingName(text);
                if (editError) setEditError('');
              }}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={() => handleSaveEdit(item)}
            />
            <TouchableOpacity
              onPress={() => handleSaveEdit(item)}
              style={styles.saveButton}>
              <Text style={styles.saveButtonText}>✓</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setEditingId(null);
                setEditError('');
              }}
              style={styles.cancelEditButton}>
              <Text style={styles.cancelEditText}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.locationRow}
            onPress={() => !isDefault && handleStartEdit(item)}
            activeOpacity={isDefault ? 1 : 0.7}>
            <Text style={styles.locationName}>{item.name}</Text>
            {!isDefault && (
              <TouchableOpacity
                onPress={() => handleDelete(item)}
                style={styles.deleteButton}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Text style={styles.deleteButtonText}>🗑</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        )}
        {isEditing && editError ? (
          <Text style={styles.errorText}>{editError}</Text>
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header info */}
      <View style={styles.header}>
        <Text style={styles.listTitle}>{list.name}</Text>
        <Text style={styles.locationCountText}>
          {list.locations.length} địa điểm
        </Text>
        {tooFew && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ Danh sách có ít hơn 10 địa điểm. Nên thêm thêm để chơi tốt hơn.
            </Text>
          </View>
        )}
      </View>

      <FlatList
        data={list.locations}
        keyExtractor={item => item.id}
        renderItem={renderLocation}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Chưa có địa điểm nào</Text>
        }
      />

      {!isDefault && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setNewLocationName('');
            setAddError('');
            setAddModalVisible(true);
          }}>
          <Text style={styles.addButtonText}>+ Thêm địa điểm</Text>
        </TouchableOpacity>
      )}

      {/* Add location modal */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Thêm Địa Điểm</Text>
            <TextInput
              style={[styles.textInput, addError ? styles.inputError : null]}
              placeholder="Tên địa điểm..."
              value={newLocationName}
              onChangeText={text => {
                setNewLocationName(text);
                if (addError) setAddError('');
              }}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleAdd}
            />
            {addError ? (
              <Text style={styles.errorText}>{addError}</Text>
            ) : null}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setAddModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.confirmButton,
                  adding && styles.disabledButton,
                ]}
                onPress={handleAdd}
                disabled={adding}>
                <Text style={styles.confirmButtonText}>
                  {adding ? 'Đang thêm...' : 'Thêm'}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  header: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D1D1D6',
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  locationCountText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  warningBox: {
    marginTop: 10,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FFCC02',
  },
  warningText: {
    fontSize: 13,
    color: '#7D5A00',
    lineHeight: 18,
  },
  listContent: {
    paddingVertical: 8,
  },
  locationItem: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginVertical: 4,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  locationName: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 17,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  editInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    color: '#1C1C1E',
    backgroundColor: '#F2F8FF',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  saveButton: {
    backgroundColor: '#34C759',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelEditButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cancelEditText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 13,
    marginBottom: 6,
    marginLeft: 2,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
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
  // Modal styles
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

export default LocationListDetail;
