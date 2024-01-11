# Node.js 버전 18.x 이미지 사용
FROM node:18

# 작업 폴더 생성 및 설정
WORKDIR /app

# 앱 종속성 설치를 위한 package.json과 yarn.lock 파일 복사
COPY package.json yarn.lock ./

# yarn 패키지 설치
RUN yarn install

# 소스 코드를 컨테이너의 작업 폴더로 복사
COPY . .

# 앱 빌드
RUN yarn build

# EXPOSE 80
# Nginx를 사용하여 앱 제공
FROM nginx:latest
COPY --from=0 /app/public /usr/share/nginx/html