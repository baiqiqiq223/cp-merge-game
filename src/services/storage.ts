import Taro from '@tarojs/taro'

export type StorageKey = 'game-state'

export const storage = {
  get<T>(key: StorageKey, fallback: T): T {
    try {
      const value = Taro.getStorageSync<string>(key)
      return value ? (JSON.parse(value) as T) : fallback
    } catch {
      return fallback
    }
  },

  set<T>(key: StorageKey, value: T): void {
    try {
      Taro.setStorageSync(key, JSON.stringify(value))
    } catch {
      Taro.showToast({ title: '缓存写入失败', icon: 'none' })
    }
  },

  remove(key: StorageKey): void {
    try {
      Taro.removeStorageSync(key)
    } catch {
      Taro.showToast({ title: '缓存清理失败', icon: 'none' })
    }
  }
}
