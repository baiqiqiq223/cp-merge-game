import { Canvas } from '@tarojs/components'
import Taro, { useDidHide, useReady } from '@tarojs/taro'
import { useEffect, useRef } from 'react'
import './GameCanvas.scss'

type GameCanvasProps = {
  level: number
  energy: number
}

type PixiModule = typeof import('pixi.js')

export function GameCanvas({ level, energy }: GameCanvasProps) {
  const appRef = useRef<import('pixi.js').Application | null>(null)

  useReady(() => {
    void initPixi()
  })

  useEffect(() => {
    return () => {
      appRef.current?.destroy(true)
      appRef.current = null
    }
  }, [])

  useDidHide(() => {
    appRef.current?.stop()
  })

  const initPixi = async () => {
    if (appRef.current) {
      return
    }

    try {
      const pixi = (await import('pixi.js')) as PixiModule
      const query = Taro.createSelectorQuery()
      query
        .select('#home-pixi-canvas')
        .fields({ node: true, size: true })
        .exec(async (res) => {
          const canvas = res?.[0]?.node
          const width = res?.[0]?.width || 320
          const height = res?.[0]?.height || 280

          if (!canvas) {
            return
          }

          const app = new pixi.Application()
          await app.init({
            canvas,
            width,
            height,
            backgroundAlpha: 0,
            antialias: true,
            resolution: Taro.getSystemInfoSync().pixelRatio || 1
          })

          appRef.current = app
          renderScene(pixi, app, width, height, level, energy)
        })
    } catch {
      appRef.current = null
    }
  }

  return <Canvas id='home-pixi-canvas' canvasId='home-pixi-canvas' type='2d' className='game-canvas' />
}

function renderScene(
  pixi: PixiModule,
  app: import('pixi.js').Application,
  width: number,
  height: number,
  level: number,
  energy: number
) {
  const stage = app.stage
  stage.removeChildren()

  const stars = new pixi.Container()
  stage.addChild(stars)

  for (let i = 0; i < 42; i += 1) {
    const star = new pixi.Graphics()
    const radius = 1 + (i % 3)
    star.circle(0, 0, radius).fill({ color: i % 2 ? 0xffffff : 0xffd166, alpha: 0.82 })
    star.x = (i * 47) % width
    star.y = (i * 83) % height
    stars.addChild(star)
  }

  const planet = new pixi.Graphics()
  planet.circle(0, 0, 82).fill({ color: 0xff6b57 })
  planet.circle(-24, -24, 34).fill({ color: 0xff9b72, alpha: 0.56 })
  planet.x = width * 0.78
  planet.y = height * 0.28
  stage.addChild(planet)

  const ship = new pixi.Graphics()
  ship
    .poly([0, -64, 48, 58, 0, 38, -48, 58])
    .fill({ color: 0xffffff })
    .stroke({ color: 0x1e2230, width: 4 })
  ship.rect(-16, 12, 32, 52).fill({ color: 0x48d6b5 })
  ship.x = width * 0.38
  ship.y = height * 0.56
  stage.addChild(ship)

  const flame = new pixi.Graphics()
  flame.poly([-16, 60, 0, 108, 16, 60]).fill({ color: energy > 30 ? 0xffd166 : 0xff6b57 })
  flame.x = ship.x
  flame.y = ship.y
  stage.addChild(flame)

  const levelText = new pixi.Text({
    text: `LV ${level}`,
    style: {
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontSize: 28,
      fontWeight: '900'
    }
  })
  levelText.x = 28
  levelText.y = 28
  stage.addChild(levelText)

  app.ticker.add(() => {
    stars.x = (stars.x - 0.25) % width
    ship.y += Math.sin(app.ticker.lastTime / 240) * 0.5
    flame.scale.y = 0.88 + Math.sin(app.ticker.lastTime / 120) * 0.12
    planet.rotation += 0.0018
  })
}
