import { View, Text, Button } from '@tarojs/components'
import Taro, { useReady } from '@tarojs/taro'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { GameCanvas } from '@/features/home/GameCanvas'
import { MetricPill } from '@/features/home/MetricPill'
import { PrimaryAction } from '@/features/home/PrimaryAction'
import { useGameStore } from '@/store/useGameStore'
import './index.scss'

const MotionView = motion(View)

export default function IndexPage() {
  const [ready, setReady] = useState(false)
  const { player, dailyRewardClaimed, claimDailyReward, startRun, resetProgress } = useGameStore()

  useReady(() => {
    setReady(true)
  })

  const progressText = useMemo(() => {
    const percent = Math.min(100, Math.round((player.exp / player.nextLevelExp) * 100))
    return `${percent}%`
  }, [player.exp, player.nextLevelExp])

  const handleStart = () => {
    startRun()
    Taro.showToast({ title: '任务已启动', icon: 'success' })
  }

  const handleReward = () => {
    const claimed = claimDailyReward()
    Taro.showToast({
      title: claimed ? '补给已领取' : '今日已领取',
      icon: claimed ? 'success' : 'none'
    })
  }

  return (
    <View className='home-page'>
      <View className='home-bg home-bg-a' />
      <View className='home-bg home-bg-b' />

      <View className='topbar'>
        <View>
          <Text className='eyebrow'>MISSION HUB</Text>
          <Text className='title'>星港行动</Text>
        </View>
        <Button className='icon-button' onClick={resetProgress} aria-label='重置进度'>
          ↻
        </Button>
      </View>

      <MotionView
        className='hero-panel'
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 24 }}
        transition={{ duration: 0.45 }}
      >
        <View className='canvas-shell'>
          <GameCanvas level={player.level} energy={player.energy} />
        </View>

        <View className='pilot-card'>
          <View>
            <Text className='card-label'>当前驾驶员</Text>
            <Text className='pilot-name'>{player.name}</Text>
          </View>
          <View className='level-badge'>Lv.{player.level}</View>
        </View>
      </MotionView>

      <View className='metrics-grid'>
        <MetricPill label='能量' value={player.energy} suffix='/100' tone='mint' />
        <MetricPill label='金币' value={player.coins} tone='gold' />
        <MetricPill label='连胜' value={player.winStreak} suffix='x' tone='coral' />
      </View>

      <View className='progress-card'>
        <View className='progress-head'>
          <Text>升级进度</Text>
          <Text>{progressText}</Text>
        </View>
        <View className='progress-track'>
          <View className='progress-fill' style={{ width: progressText }} />
        </View>
      </View>

      <View className='action-stack'>
        <PrimaryAction label='开始挑战' subLabel='消耗 8 点能量' onClick={handleStart} />
        <Button className='secondary-action' onClick={handleReward}>
          {dailyRewardClaimed ? '今日补给已领取' : '领取今日补给'}
        </Button>
      </View>
    </View>
  )
}
