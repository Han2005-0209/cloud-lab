# Cloud Computing Lab — Trần Gia Hân (236894)

Ứng dụng MERN quản lý sinh viên cho bài thực hành Buổi 2–6. React gọi API bằng đường dẫn tương đối `/api/students`; Express kết nối MongoDB Atlas. Frontend Nginx chuyển tiếp `/api/` tới backend, nên giao diện và API dùng cùng một tên miền khi triển khai.

## Các đường dẫn đã triển khai

| Nội dung | Đường dẫn |
| --- | --- |
| Repository | https://github.com/Han2005-0209/cloud-lab |
| Docker Hub backend | https://hub.docker.com/r/trangiahan2005/mern-backend |
| Docker Hub frontend | https://hub.docker.com/r/trangiahan2005/mern-frontend |
| Ứng dụng Render | https://mern-frontend-236894.onrender.com/ |
| API qua tên miền frontend | https://mern-frontend-236894.onrender.com/api/students |
| API backend trực tiếp | https://mern-backend-236894.onrender.com/api/students |
| Health check backend | https://mern-backend-236894.onrender.com/health |

Render dùng gói Free nên lần truy cập đầu tiên sau khi dịch vụ ngủ có thể cần chờ khởi động.

## Chạy local với Docker Compose

1. Tạo `.env` ở thư mục gốc từ `.env.example`. Thay `MONGODB_URI` bằng URI database thực. File `.env` đã được loại khỏi Git; không đưa mật khẩu lên repository.
2. Build từ mã nguồn: `docker compose up -d --build`. Hoặc dùng image Docker Hub: `docker compose -f docker-compose.hub.yml up -d`. Cấu hình production nằm ở `docker-compose.production.yml`.
3. Mở `http://localhost:5173`; backend chạy ở `http://localhost:5000`. Kiểm tra `http://localhost:5000/health` và `http://localhost:5173/api/students`.
4. Dừng bằng `docker compose down` hoặc thêm `-f` đúng với file Compose đã dùng.

Image cuối cùng: `trangiahan2005/mern-backend:2.0` và `trangiahan2005/mern-frontend:3.0`. Hai image này cũng được dùng trên Render. Các tag `1.0`, `2.0` cũ vẫn là dấu mốc thực hành Buổi 4 trên Docker Hub.

## Chạy trực tiếp từ mã nguồn

- Backend: vào `server`, chạy `npm ci`, đặt `MONGODB_URI` trong môi trường hoặc `server/.env`, rồi chạy `npm start`.
- Frontend: vào `client`, chạy `npm ci` rồi `npm run dev`. Vite chuyển `/api` tới `http://localhost:5000`.

API gồm `GET`, `POST /api/students`; `PUT`, `DELETE /api/students/:id`; `GET /api/hello`; `GET /health` và `/api/health`. Giao diện hỗ trợ thêm, xem, sửa và xóa sinh viên. Database hiện có một bản ghi của Trần Gia Hân và hai bản ghi mẫu để kiểm tra danh sách.
