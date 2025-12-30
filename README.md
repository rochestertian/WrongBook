
# 错题本 (Wrong Notebook)

## 🚀 技术栈更新说明
为了解决 `bubblewrap` 路径检测不稳定的问题，本项目已切换至 **原生 WebView 封装 (Native WebView Wrapper)**。

### 优点：
- **稳定性**：直接使用 Android Gradle 工具链构建。
- **功能性**：原生处理 `onShowFileChooser`，拍照上传更流畅。
- **纯净**：不需要在仓库中维护复杂的 Android 工程目录，通过 GitHub Actions 动态生成。

### 📦 如何获取 APK
1. 提交代码。
2. 在 **Actions** 页面找到 `Build Android APK (Native WebView)`。
3. 下载生成好的 `app-debug.apk` 即可安装。

Build By Rochester Tian | rochester.tian@gmail.com
