# 微信小游戏项目

基于 Taro + React + TypeScript 的首页项目骨架，包含 Zustand 状态管理、Taro Storage 本地缓存、Tailwind 样式入口、PixiJS 首页画布和 Framer Motion 交互动画。

## 运行

```bash
corepack enable
corepack prepare pnpm@9.15.9 --activate
pnpm install
pnpm dev:weapp
```

使用微信开发者工具打开当前目录，导入后预览 `dist`。

## 环境限制

- Node.js：`>=20.11.0 <23`
- pnpm：`>=9.15.0 <10`

建议使用 `.nvmrc` 中声明的 Node 版本：

```bash
nvm use
corepack enable
corepack prepare pnpm@9.15.9 --activate
pnpm install
```

如果执行 `pnpm dev:weapp` 出现 `'taro' 不是内部或外部命令`，说明当前依赖还没有安装成功，或终端没有使用项目声明的 pnpm。按下面顺序重新执行：

```bash
corepack enable
corepack prepare pnpm@9.15.9 --activate
pnpm install
pnpm exec taro --version
pnpm dev:weapp
```

如果构建卡在 `babel-preset-taro` 或 Taro CLI 的依赖解析错误，先清理后重装：

```bash
Remove-Item -Recurse -Force node_modules, pnpm-lock.yaml
nvm use
corepack enable
corepack prepare pnpm@9.15.9 --activate
pnpm install
pnpm dev:weapp
```

## 远程仓库

绑定远程仓库后执行：

```bash
git remote add origin <你的仓库地址>
git branch -M main
git push -u origin main
```

## 结构

- `src/pages/index`：首页页面与页面样式
- `src/features/home`：首页业务组件与 PixiJS 画布
- `src/store`：Zustand 游戏状态
- `src/services`：本地缓存等平台服务封装
- `config`：Taro 构建配置

## 扩展建议

新增玩法、任务、背包、关卡等模块时，优先在 `src/features/<domain>` 下建立独立组件与模型，再由页面组合调用。平台 API 统一放入 `src/services`，避免业务组件直接散落调用。
