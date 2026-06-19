# AI Badge Studio｜AI 智能工牌生成系统

> 上传员工生活照，自动生成统一风格证件照，并合成企业工牌 PNG 的 AI 工作流 Demo。
>
> Upload a casual employee photo, standardize it into an ID portrait, compose it into a branded employee badge, and export a ready-to-use PNG.

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

---

## Why This Project

This is a small AI product demo for an internal HR / admin workflow:

- Turn casual employee photos into standardized ID photos.
- Keep employee fields editable and reviewable.
- Compose the portrait into a unified company badge template.
- Export a final PNG that can be used for onboarding, HR records, or internal display.

The goal is not just "generate an image", but to show a controllable product workflow:

```text
Photo Upload
→ ID Photo Standardization
→ Badge Template Composition
→ Quality Check
→ PNG Export
```

## Core Features

- **Photo upload**: Upload a casual portrait from the browser.
- **ID photo generation**: Integrates with HivisionIDPhotos for face detection, cropping, background replacement, and ID-photo standardization.
- **Badge composition**: Uses an HTML/CSS badge template and injects employee fields dynamically.
- **PNG export**: Renders the final badge image through a local backend workflow.
- **HR-style dashboard**: Includes a basic management view for reviewing generated badge tasks.

## Tech Stack

- **Frontend**: React, Vite, TypeScript-style component structure, Tailwind-style utility classes.
- **Backend**: Python standard-library HTTP service.
- **Image processing**: HivisionIDPhotos API / Docker service.
- **Rendering**: HTML/CSS badge template + headless browser screenshot export.

## Project Structure

```text
xianma-badge/
├── figma-make-export/        # React frontend prototype
├── server.py                 # Local API service
├── templates/                # Badge HTML/CSS templates
├── assets/                   # Public-safe visual assets
├── docs/                     # GitHub showcase assets
└── README.md
```

## Run Locally

### 1. Start HivisionIDPhotos

Run HivisionIDPhotos locally and make sure its API is available:

```bash
curl http://localhost:8080/docs
```

### 2. Start Backend

```bash
cd xianma-badge
python3 server.py
```

Default backend address:

```text
http://localhost:8888
```

### 3. Start Frontend

```bash
cd xianma-badge/figma-make-export
npm install
npm run dev
```

Then open the local Vite address shown in the terminal.

## API Example

```bash
curl -X POST http://localhost:8888/api/generate \
  -F 'name=Demo User' \
  -F 'department=Product' \
  -F 'position=AI Product Manager' \
  -F 'employeeId=XM-2026-001' \
  -F 'photo=@/path/to/demo-photo.png'
```

Response:

```text
id_photo   Standardized ID photo in base64
badge_png  Final badge PNG in base64
task_id    Generated task ID
```

## Product Thinking

This project focuses on three product design principles:

- **Controllability**: AI handles repetitive image standardization, while employee information remains editable.
- **Consistency**: Badge output follows one unified visual template.
- **Workflow fit**: The product is designed for an internal admin / HR scenario, not as a generic image toy.

## Privacy Note

This repository should only include demo images and anonymized sample data. Avoid committing real employee photos, generated badges with real personal information, logs, or local uploads.
