#!/bin/bash

# Illuminati 项目启动脚本

echo "🚀 Starting Illuminati..."

# 检查是否在项目根目录
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
  echo "❌ Please run this script from the project root directory"
  exit 1
fi

# 安装后端依赖
echo "📦 Installing backend dependencies..."
cd backend
if ! command -v pnpm &> /dev/null; then
  npm install
else
  pnpm install
fi

# 安装前端依赖
echo "📦 Installing frontend dependencies..."
cd ../frontend
if ! command -v pnpm &> /dev/null; then
  npm install
else
  pnpm install
fi

cd ..

# 启动后端
echo "🔧 Starting backend server..."
cd backend
if ! command -v pnpm &> /dev/null; then
  npm run dev &
else
  pnpm dev &
fi
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 2

# 启动前端
echo "🎨 Starting frontend server..."
cd frontend
if ! command -v pnpm &> /dev/null; then
  npm run dev
else
  pnpm dev
fi

# 清理
trap "kill $BACKEND_PID 2>/dev/null" EXIT
