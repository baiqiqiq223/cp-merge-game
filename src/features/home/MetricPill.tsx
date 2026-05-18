import { View, Text } from '@tarojs/components'
import './MetricPill.scss'

type MetricPillProps = {
  label: string
  value: number
  suffix?: string
  tone: 'mint' | 'gold' | 'coral'
}

export function MetricPill({ label, value, suffix = '', tone }: MetricPillProps) {
  return (
    <View className={`metric-pill metric-pill-${tone}`}>
      <Text className='metric-label'>{label}</Text>
      <Text className='metric-value'>
        {value}
        <Text className='metric-suffix'>{suffix}</Text>
      </Text>
    </View>
  )
}
