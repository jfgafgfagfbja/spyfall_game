import {Location, LocationList} from '../types';

export class LocationManager {
  createDefaultLocationList(): LocationList {
    const defaultLocations: string[] = [
      'Sân bay',
      'Bệnh viện',
      'Trường học',
      'Ngân hàng',
      'Rạp chiếu phim',
      'Nhà hàng',
      'Khách sạn',
      'Bãi biển',
      'Siêu thị',
      'Công viên',
      'Bảo tàng',
      'Thư viện',
      'Sở thú',
      'Ga tàu',
      'Cảng biển',
      'Căn cứ quân sự',
      'Đại sứ quán',
      'Casino',
      'Spa',
      'Phòng gym',
      'Công ty',
      'Nhà máy',
      'Tàu ngầm',
      'Trạm vũ trụ',
      'Rạp xiếc',
      'Đám cưới',
      'Chuyến bay',
      'Tàu cướp biển',
      'Phim trường',
      'Siêu thị điện tử',
    ];

    return {
      id: 'default',
      name: 'Danh sách mặc định',
      locations: defaultLocations.map((name, index) => ({
        id: `default-${index}`,
        name,
      })),
      isDefault: true,
    };
  }

  validateLocationName(name: string): boolean {
    return name.trim().length > 0;
  }

  isDuplicateLocation(name: string, locationList: LocationList): boolean {
    return locationList.locations.some(
      loc => loc.name.toLowerCase() === name.toLowerCase(),
    );
  }

  addLocation(name: string, locationList: LocationList): LocationList {
    if (!this.validateLocationName(name)) {
      throw new Error('Tên địa điểm không được để trống');
    }

    if (this.isDuplicateLocation(name, locationList)) {
      throw new Error('Địa điểm này đã tồn tại trong danh sách');
    }

    const newLocation: Location = {
      id: this.generateId(),
      name: name.trim(),
    };

    return {
      ...locationList,
      locations: [...locationList.locations, newLocation],
    };
  }

  updateLocation(
    locationId: string,
    newName: string,
    locationList: LocationList,
  ): LocationList {
    if (!this.validateLocationName(newName)) {
      throw new Error('Tên địa điểm không được để trống');
    }

    // Check duplicate excluding current location
    const isDuplicate = locationList.locations.some(
      loc =>
        loc.id !== locationId &&
        loc.name.toLowerCase() === newName.toLowerCase(),
    );

    if (isDuplicate) {
      throw new Error('Địa điểm này đã tồn tại trong danh sách');
    }

    return {
      ...locationList,
      locations: locationList.locations.map(loc =>
        loc.id === locationId ? {...loc, name: newName.trim()} : loc,
      ),
    };
  }

  removeLocation(locationId: string, locationList: LocationList): LocationList {
    return {
      ...locationList,
      locations: locationList.locations.filter(loc => loc.id !== locationId),
    };
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const locationManager = new LocationManager();
