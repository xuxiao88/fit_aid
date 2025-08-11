#!/bin/bash
set -e  # 遇错退出

# 🔍 如果 main 分支有未提交的修改，自动提交
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "💾 检测到 main 分支有未提交的更改，正在提交..."
  git add .
  git commit -m "chore: auto commit before deploy"
fi

echo "📦 构建项目..."
npm run build

# ✅ 检查 dist 是否存在且非空
if [ ! -d "dist" ] || [ -z "$(ls -A dist)" ]; then
  echo "❌ 错误：dist 目录不存在或为空！请检查构建是否成功。"
  exit 1
fi

# 🌟 切换到 gh-pages 分支
echo "🚀 切换到 gh-pages 分支..."
if git rev-parse --verify gh-pages > /dev/null 2>&1; then
  git checkout gh-pages
else
  git checkout --orphan gh-pages
fi

# 🧹 清理 gh-pages 分支上的旧文件（保留 .git）
echo "🧹 清理旧文件..."
git rm -rf . 2>/dev/null || true

# ✅ 复制 dist 内容到 gh-pages 分支根目录
echo "📂 复制 dist 文件..."
shopt -s dotglob
cp -r dist/* ./
shopt -u dotglob

# ✅ 提交更改
git add .
git commit -m "Deploy to GitHub Pages"

# ✅ 推送到远程 gh-pages 分支
echo "📤 推送到远程 gh-pages 分支..."
git push origin gh-pages --force

# ✅ 切回 main 分支
git checkout main

echo "✅ 部署完成！"
