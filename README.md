# DATN
Tải docker về máy: 
    - https://www.docker.com/products/docker-desktop/
    - mở docker

Chạy docker file: 
    - docker compose up --build
    hệ thống chạy
    lần khác chạy sẽ: docker compose down => docker compose up --build 

Chạy tool Kong:
    - cd /kong/
    - docker compose up --build
    lần sau chạy: docker compose down => docker compose up -d

chạy frontend cửa hàng 1
    - cd /frontend/
    - npm start
    - nhấn đăng nhập => đăng kí để tạo tài khoàn và sử dụng 

Chạy frontend cửa hàng 2 
    - cd  /frontend_store/
    - npm start
    - nhấn đăng nhập => đăng kí để tạo tài khoàn và sử dụng 

Chạy trang quản trị viên:
    - cd /frontend_admin
    - npm start
    - đăng nhập tài khoản 
        email: ronaldo@gmail.com
        mật khẩu; 123456
    sau đó sử dụng quản lý đến các tài khoản, sản phẩm , danh mục , đơn hàng, cửa hàng, tồn kho, mã ưu đãi, thống kê