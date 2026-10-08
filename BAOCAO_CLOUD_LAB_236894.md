# Báo cáo Cloud Lab 01–06 — Trần Gia Hân (236894)

## Liên kết sản phẩm

| Mục nộp | Liên kết |
| --- | --- |
| GitHub Repository | https://github.com/Han2005-0209/cloud-lab |
| Docker Hub Backend | https://hub.docker.com/r/trangiahan2005/mern-backend |
| Docker Hub Frontend | https://hub.docker.com/r/trangiahan2005/mern-frontend |
| Render App | https://mern-frontend-236894.onrender.com/ |
| Render API qua domain Frontend | https://mern-frontend-236894.onrender.com/api/students |
| Render Backend API trực tiếp | https://mern-backend-236894.onrender.com/api/students |
| MongoDB Atlas Project | https://cloud.mongodb.com/v2/6a86c6218cc761f9af578489#/overview |

Atlas Project chỉ xem được khi người chấm có quyền đăng nhập. Chuỗi kết nối `MONGODB_URI` có mật khẩu database và được lưu trong Render Environment Group `MERN-Production-Secrets`, không đăng công khai trong repository hoặc báo cáo.

## Kết quả đã kiểm tra

- Repository `main` chứa mã React, Express, Dockerfile, các file Docker Compose và hướng dẫn chạy.
- Docker Hub chứa image backend `2.0`, frontend `3.0`; Render triển khai hai image trên gói Free ở Singapore.
- `GET /health` trên backend trả `UP`; `GET /api/students` qua domain frontend trả danh sách JSON từ MongoDB Atlas.
- Đã thử `POST`, `PUT`, `DELETE` qua URL công khai và xác nhận bản ghi thử được xóa sau khi kiểm tra. Collection `students` còn 3 bản ghi: Hân và hai sinh viên mẫu.
- Frontend gọi API qua `/api/students`; Nginx reverse proxy tới backend. HTTPS hoạt động trên các URL Render.
- Render Free có thể ngủ khi không có truy cập; frontend tự thử tải lại danh sách trong lúc backend khởi động.

## Lệnh kiểm tra nhanh

```bash
curl https://mern-backend-236894.onrender.com/health
curl https://mern-frontend-236894.onrender.com/api/students
```
