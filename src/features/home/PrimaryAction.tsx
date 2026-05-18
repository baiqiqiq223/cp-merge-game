import { Button, Text, View } from '@tarojs/components'
import './PrimaryAction.scss'

type PrimaryActionProps = {
  label: string
  subLabel: string
  onClick: () => void
}

export function PrimaryAction({ label, subLabel, onClick }: PrimaryActionProps) {
  return (
    <Button className='primary-action' onClick={onClick}>
      <View className='primary-icon'>▶</View>
      <View className='primary-copy'>
        <Text className='primary-label'>{label}</Text>
        <Text className='primary-sub'>{subLabel}</Text>
      </View>
    </Button>
  )
}
