import AsyncStorage from '@react-native-async-storage/async-storage';
import {LocationList} from '../types';

const LOCATION_LISTS_KEY = '@spyfall_location_lists';

export class LocationRepository {
  async save(locationList: LocationList): Promise<void> {
    try {
      const lists = await this.fetchAll();
      const existingIndex = lists.findIndex(l => l.id === locationList.id);
      
      if (existingIndex >= 0) {
        lists[existingIndex] = locationList;
      } else {
        lists.push(locationList);
      }
      
      await AsyncStorage.setItem(LOCATION_LISTS_KEY, JSON.stringify(lists));
    } catch (error) {
      console.error('Error saving location list:', error);
      throw new Error('Không thể lưu danh sách địa điểm. Vui lòng thử lại.');
    }
  }

  async fetchAll(): Promise<LocationList[]> {
    try {
      const data = await AsyncStorage.getItem(LOCATION_LISTS_KEY);
      if (!data) {
        return [];
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Error fetching location lists:', error);
      return [];
    }
  }

  async update(locationList: LocationList): Promise<void> {
    await this.save(locationList);
  }

  async delete(listId: string): Promise<void> {
    try {
      const lists = await this.fetchAll();
      const filtered = lists.filter(l => l.id !== listId);
      await AsyncStorage.setItem(LOCATION_LISTS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting location list:', error);
      throw new Error('Không thể xóa danh sách địa điểm. Vui lòng thử lại.');
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(LOCATION_LISTS_KEY);
    } catch (error) {
      console.error('Error clearing location lists:', error);
      throw new Error('Không thể xóa dữ liệu.');
    }
  }
}

export const locationRepository = new LocationRepository();
