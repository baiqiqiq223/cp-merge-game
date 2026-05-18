import { create } from 'zustand'
import { storage } from '@/services/storage'

export type PlayerState = {
  name: string
  level: number
  exp: number
  nextLevelExp: number
  energy: number
  coins: number
  winStreak: number
}

type PersistedGameState = {
  player: PlayerState
  dailyRewardClaimed: boolean
  lastRewardDate: string
}

type GameStore = PersistedGameState & {
  startRun: () => void
  claimDailyReward: () => boolean
  resetProgress: () => void
}

const defaultState: PersistedGameState = {
  player: {
    name: 'Nova',
    level: 6,
    exp: 420,
    nextLevelExp: 800,
    energy: 88,
    coins: 1260,
    winStreak: 4
  },
  dailyRewardClaimed: false,
  lastRewardDate: ''
}

const today = () => new Date().toISOString().slice(0, 10)

const loadInitialState = (): PersistedGameState => {
  const cached = storage.get<PersistedGameState>('game-state', defaultState)
  const currentDate = today()

  if (cached.lastRewardDate !== currentDate) {
    return {
      ...cached,
      dailyRewardClaimed: false,
      lastRewardDate: currentDate
    }
  }

  return cached
}

const persist = (state: PersistedGameState) => storage.set('game-state', state)

export const useGameStore = create<GameStore>((set, get) => ({
  ...loadInitialState(),

  startRun: () => {
    set((state) => {
      const earnedExp = 45
      const earnedCoins = 32
      const nextExp = state.player.exp + earnedExp
      const leveledUp = nextExp >= state.player.nextLevelExp
      const player: PlayerState = {
        ...state.player,
        energy: Math.max(0, state.player.energy - 8),
        coins: state.player.coins + earnedCoins,
        winStreak: state.player.winStreak + 1,
        exp: leveledUp ? nextExp - state.player.nextLevelExp : nextExp,
        level: leveledUp ? state.player.level + 1 : state.player.level,
        nextLevelExp: leveledUp ? state.player.nextLevelExp + 220 : state.player.nextLevelExp
      }
      const nextState = { player, dailyRewardClaimed: state.dailyRewardClaimed, lastRewardDate: state.lastRewardDate }
      persist(nextState)
      return nextState
    })
  },

  claimDailyReward: () => {
    const state = get()
    if (state.dailyRewardClaimed) {
      return false
    }

    const nextState: PersistedGameState = {
      player: {
        ...state.player,
        energy: Math.min(100, state.player.energy + 18),
        coins: state.player.coins + 120
      },
      dailyRewardClaimed: true,
      lastRewardDate: today()
    }

    persist(nextState)
    set(nextState)
    return true
  },

  resetProgress: () => {
    storage.remove('game-state')
    set({
      ...defaultState,
      lastRewardDate: today()
    })
  }
}))
