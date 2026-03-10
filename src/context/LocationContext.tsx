import React, {createContext, useContext, useState, useEffect, useCallback} from 'react';
import {LocationList, Location} from '../types';
import {locationManager} from '../engine/LocationManager';
import {locationRepository} from '../data/LocationRepository';

interface LocationContextType {
  locationLists: LocationList[];
  selectedList: LocationList | null;
  loading: boolean;
  loadLocationLists: () => Promise<void>;
  createLocationList: (name: string) => Promise<LocationList>;
  addLocation: (listId: string, name: string) => Promise<void>;
  updateLocation: (listId: string, locationId: string, newName: string) => Promise<void>;
  deleteLocation: (listId: string, locationId: string) => Promise<void>;
  deleteLocationList: (listId: string) => Promise<void>;
  getDefaultLocationList: () => LocationList;
  setSelectedList: (list: LocationList | null) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [locationLists, setLocationLists] = useState<LocationList[]>([]);
  const [selectedList, setSelectedList] = useState<LocationList | null>(null);
  const [loading, setLoading] = useState(true);

  const loadLocationLists = useCallback(async () => {
    try {
      setLoading(true);
      const lists = await locationRepository.fetchAll();
      
      // If no lists exist, create default list
      if (lists.length === 0) {
        const defaultList = locationManager.createDefaultLocationList();
        await locationRepository.save(defaultList);
        setLocationLists([defaultList]);
        setSelectedList(defaultList);
      } else {
        setLocationLists(lists);
        // Set default list as selected if none selected
        if (!selectedList) {
          const defaultList = lists.find(l => l.isDefault) || lists[0];
          setSelectedList(defaultList);
        }
      }
    } catch (error) {
      console.error('Error loading location lists:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedList]);

  useEffect(() => {
    loadLocationLists();
  }, []);

  const createLocationList = useCallback(async (name: string): Promise<LocationList> => {
    const newList: LocationList = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      locations: [],
      isDefault: false,
    };

    await locationRepository.save(newList);
    setLocationLists(prev => [...prev, newList]);
    return newList;
  }, []);

  const addLocation = useCallback(async (listId: string, name: string) => {
    const list = locationLists.find(l => l.id === listId);
    if (!list) {
      throw new Error('Location list not found');
    }

    const updatedList = locationManager.addLocation(name, list);
    await locationRepository.update(updatedList);
    
    setLocationLists(prev =>
      prev.map(l => (l.id === listId ? updatedList : l)),
    );

    if (selectedList?.id === listId) {
      setSelectedList(updatedList);
    }
  }, [locationLists, selectedList]);

  const updateLocation = useCallback(async (
    listId: string,
    locationId: string,
    newName: string,
  ) => {
    const list = locationLists.find(l => l.id === listId);
    if (!list) {
      throw new Error('Location list not found');
    }

    const updatedList = locationManager.updateLocation(locationId, newName, list);
    await locationRepository.update(updatedList);
    
    setLocationLists(prev =>
      prev.map(l => (l.id === listId ? updatedList : l)),
    );

    if (selectedList?.id === listId) {
      setSelectedList(updatedList);
    }
  }, [locationLists, selectedList]);

  const deleteLocation = useCallback(async (listId: string, locationId: string) => {
    const list = locationLists.find(l => l.id === listId);
    if (!list) {
      throw new Error('Location list not found');
    }

    const updatedList = locationManager.removeLocation(locationId, list);
    await locationRepository.update(updatedList);
    
    setLocationLists(prev =>
      prev.map(l => (l.id === listId ? updatedList : l)),
    );

    if (selectedList?.id === listId) {
      setSelectedList(updatedList);
    }
  }, [locationLists, selectedList]);

  const deleteLocationList = useCallback(async (listId: string) => {
    const list = locationLists.find(l => l.id === listId);
    if (list?.isDefault) {
      throw new Error('Không thể xóa danh sách mặc định');
    }

    await locationRepository.delete(listId);
    setLocationLists(prev => prev.filter(l => l.id !== listId));

    if (selectedList?.id === listId) {
      const defaultList = locationLists.find(l => l.isDefault) || locationLists[0];
      setSelectedList(defaultList);
    }
  }, [locationLists, selectedList]);

  const getDefaultLocationList = useCallback((): LocationList => {
    return locationManager.createDefaultLocationList();
  }, []);

  const value: LocationContextType = {
    locationLists,
    selectedList,
    loading,
    loadLocationLists,
    createLocationList,
    addLocation,
    updateLocation,
    deleteLocation,
    deleteLocationList,
    getDefaultLocationList,
    setSelectedList,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
};
