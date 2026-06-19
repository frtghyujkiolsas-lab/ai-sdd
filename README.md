<div align="center">

# AI Badge Studio

### AI 智能工牌生成系统

![status](https://img.shields.io/badge/status-portfolio_demo-2ea44f)
![frontend](https://img.shields.io/badge/frontend-React%20%7C%20Vite-61dafb)
![backend](https://img.shields.io/badge/backend-Python-3776ab)
![platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-6e7781)

**上传生活照 → 证件照标准化 → 工牌模板合成 → PNG 导出**

*一个面向 HR / 行政场景的可控 AI 图像工作流 Demo*

**简体中文** | [English](README.en.md)

</div>

![AI Badge Studio Showcase](docs/showcase-hero-v5.png)

## 项目简介

这是一个面向企业 HR / 行政场景的 AI 产品 Demo，用来解决员工工牌制作中“照片来源不统一、人工修图耗时、版式难以保持一致”的问题。

核心流程不是简单生成一张图片，而是把证件照处理、工牌模板合成、字段校验和 PNG 导出串成一个可控工作流：

```text
员工照片上传
→ AI 证件照标准化
→ 工牌模板合成
→ 信息确认 / 质量检查
→ PNG 导出
```

## 核心功能

- **照片上传**：支持上传员工生活照或头像照片。
- **证件照标准化**：对接 HivisionIDPhotos，完成头像检测、裁剪、背景替换和证件照规格化。
- **工牌模板合成**：使用 HTML/CSS 工牌模板，将头像、姓名、部门、岗位、工号等信息动态写入。
- **PNG 导出**：后端通过浏览器渲染模板并输出最终工牌图片。
- **管理端预览**：提供 HR 风格的任务查看页面，用于展示生成记录和处理状态。

## 产品设计思路

这个项目重点展示三个产品判断：

- **可控性**：AI 负责重复性的图像标准化，人事字段仍然保留人工确认和修改空间。
- **一致性**：所有工牌输出遵循统一模板，避免不同员工照片风格差异过大。
- **流程适配**：产品定位是企业内部 HR / 行政提效工具，不是泛用图片生成玩具。

## 技术栈

- **前端**：React + Vite
- **后端**：Python HTTP service
- **图像处理**：HivisionIDPhotos API / Docker service
- **模板渲染**：HTML/CSS badge template + headless browser screenshot export

## 本地运行

### 1. 启动 HivisionIDPhotos

先在本地运行 HivisionIDPhotos，并确认 API 可访问：

```bash
curl http://localhost:8080/docs
```

### 2. 启动后端

```bash
cd xianma-badge
python3 server.py
```

默认后端地址：

```text
http://localhost:8888
```

### 3. 启动前端

```bash
cd xianma-badge/figma-make-export
npm install
npm run dev
```

然后打开终端里显示的 Vite 本地地址。

## API 示例

```bash
curl -X POST http://localhost:8888/api/generate \
  -F 'name=Demo User' \
  -F 'department=Product' \
  -F 'position=AI Product Manager' \
  -F 'employeeId=XM-2026-001' \
  -F 'photo=@/path/to/demo-photo.png'
```

返回字段：

```text
id_photo   标准化证件照 base64
badge_png  最终工牌 PNG base64
task_id    生成任务 ID
```

## 项目结构

```text
xianma-badge/
├── figma-make-export/        # React 前端原型
├── server.py                 # 本地 API 服务
├── templates/                # 工牌 HTML/CSS 模板
├── assets/                   # 公开安全的视觉资源
├── docs/                     # GitHub 展示资源
└── README.md
```

## 隐私说明

仓库只保留 Demo 图片和匿名样例数据，不提交真实员工照片、真实工牌、日志、上传文件或本地生成结果。
