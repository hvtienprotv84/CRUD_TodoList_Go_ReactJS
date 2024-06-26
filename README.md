# CRUD - Go - ReactJS

- Go (Back-End)
- ReactJS (Front-End)
- MongoDB (Database)
- Vite.js

# Công nghệ đã dùng

- Fiber (giống ExpressJS nhưng cho Go)
- MongoDB Compass

### Requirements:
* Docker
* Docker Compose
* Golang

# Lưu Ý
- Mọi khi thay đổi bên client (Front-End) thì build lại với lệnh `npm run build`

# RUN
Download packages
```bash
go download
```
Đổi tên `.env.example` thành `.env`
<!--change CORS origin in `main.go` line `52` to localhost or your domain if you need -->

Build bin GO:
```bash
go build .
```
 hoàn thành chạy bin.

- `cd/client` để chuyển đến Folder của Client ( Front-End ) 

Chạy cả 2 phía `Client` và `GO`
```bash
go run main.go
```

# RUN Docker
bạn cũng cần định cấu hình tệp gốc CORS và tệp .env
```bash
docker-compose build
```

```bash
docker-compose up -d
```

nếu bạn muốn xem nhật ký, bạn có thể làm điều đó:
```bash
docker-compose logs -f
```
