#!/bin/bash

set -e  # 遇错退出

echo "📦 构建项目..."
npm run build

# ✅ 检查 dist 是否存在且非空
if [ ! -d "dist" ] || [ -z "$(ls -A dist)" ]; then
  echo "❌ 错误：dist 目录不存在或为空！请检查构建是否成功。"
  exit 1
fi

echo "🚀 创建 gh-pages 分支..."
git checkout -b gh-pages

# 清理所有文件（保留 .git）
echo "🧹 清理旧文件..."
git rm -rf . 2>/dev/null || true
find . -type f ! -name '.git' -delete 2>/dev/null || true
find . -type d ! -name '.git' -depth -delete 2>/dev/null || true

# ✅ 复制 dist 内容
echo "📂 复制 dist 文件..."
cp -r dist/* ./

# 提交并推送
git add .
git config user.name "Your Name"
git config user.email "your-email@example.com"
git commit -m "Deploy to GitHub Pages"

echo "📤 推送到远程 gh-pages 分支..."
git push origin gh-pages --force

# 切回 main
git checkout main

echo "✅ 部署完成！"