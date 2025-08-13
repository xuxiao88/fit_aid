#!/bin/bash
set -e  # 遇错退出

# ==================== 配置区 ====================
GH_PAGES_DIR="/Users/xuxiao/code/release/vue/fit_aid"
MAIN_DIR="/Users/xuxiao/code/local/vue/fit_aid"
# ==============================================

echo "🚀 开始部署到 GitHub Pages..."

# 确保在主项目目录
cd "${MAIN_DIR}"

# 🔍 如果 main 分支有未提交的修改，自动提交
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "💾 检测到 main 分支有未提交的更改，正在提交..."
  git add .
  git commit -m "chore: auto commit before deploy"
fi

# 📦 构建项目
echo "📦 正在构建项目..."
npm run build

# ✅ 检查 dist 是否存在且非空
if [ ! -d "dist" ] || [ -z "$(ls -A dist)" ]; then
  echo "❌ 错误：dist 目录不存在或为空！请检查构建是否成功。"
  exit 1
fi

# 🌟 进入 gh-pages 目录
echo "📁 进入 gh-pages 目录: ${GH_PAGES_DIR}"
cd "${GH_PAGES_DIR}"

# ✅ 确保在 gh-pages 分支
git checkout gh-pages

# ✅ 可选：拉取最新内容，避免冲突
git fetch origin
git reset --hard origin/gh-pages

# 🧹 清理旧文件（保留 .git）
echo "🧹 清理旧文件..."
git rm -rf . 2>/dev/null || true

# ✅ 复制 dist 内容到 gh-pages 根目录
echo "📂 复制 dist 文件..."
shopt -s dotglob nullglob  # 包含隐藏文件（如 .nojekyll），忽略空匹配
cp -r "${MAIN_DIR}/dist/"* ./
echo 'fitaid.fit' > ./CNAME
shopt -u dotglob nullglob

# ✅ 提交更改
echo "📝 提交更改..."
git add .
# 检查是否有变更
if git diff --cached --quiet; then
  echo "🟢 内容无变化，无需推送。"
  exit 0
fi

git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"

# ✅ 推送到远程 gh-pages 分支
echo "📤 推送到远程 gh-pages 分支..."
git push --force-with-lease origin gh-pages

echo "✅ 部署完成！"