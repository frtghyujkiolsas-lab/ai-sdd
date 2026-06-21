# 04 接口契约

## 核心接口

### POST `/api/generate`

用于上传员工照片和基础信息，返回标准证件照与最终工牌 PNG。

## 请求字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `photo` | file | 是 | 员工照片 |
| `name` | string | 是 | 员工姓名 |
| `department` | string | 是 | 部门 |
| `position` | string | 是 | 岗位 |
| `employeeId` | string | 是 | 工号 |

## 响应字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `task_id` | string | 生成任务 ID |
| `id_photo` | string | 标准证件照 base64 |
| `badge_png` | string | 最终工牌 PNG base64 |

## 示例

```bash
curl -X POST http://localhost:8888/api/generate \
  -F 'name=Demo User' \
  -F 'department=Product' \
  -F 'position=AI Product Manager' \
  -F 'employeeId=XM-2026-001' \
  -F 'photo=@/path/to/demo-photo.png'
```

## 契约原则

- 前端只能依赖接口契约，不依赖后端内部实现。
- 后端返回最终工牌 PNG，避免前端和后端各自渲染导致结果不一致。
- 错误信息需要可读，方便 HR 判断是照片问题、服务问题还是字段问题。
