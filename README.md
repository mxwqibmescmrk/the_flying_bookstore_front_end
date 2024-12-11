This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Data Test
```
Ngân hàng	NCB
Số thẻ	9704198526191432198
Tên chủ thẻ	NGUYEN VAN A
Ngày phát hành	07/15
Mật khẩu OTP	123456
```
xem thêm thông tin thẻ test tại
[vnpay](https://sandbox.vnpayment.vn/apis/vnpay-demo/#th%C3%B4ng-tin-th%E1%BA%BB-test)

## Getting Started

First, run the development server:

```bash
pnpm dev
```

## Chạy trên máy mới
cài docker và java jdk 21 và git

cài git và clone backend về

Xong chạy local yaml trước để tạo image và volumn và container trên docker

Xong chạy build gradle bằng lệnh

```
./gradlew build
```
vào thư mục build/libs chạy lệnh 
```
java -jar base-api-0.0.1-SNAPSHOT.jar
```
cài ngrok vào máy

