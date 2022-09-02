FROM node:16.0
# 创建vue项目根路径
ADD . /web/
# 切换vue项目根路径为工作路径
WORKDIR /web/

COPY package*.json ./
# 安装项目依赖
RUN npm config set registry https://registry.npmmirror.com
RUN npm install -g pnpm
RUN pnpm install --registry=https://registry.npmmirror.com
COPY . .
RUN pnpm build:dev

FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 4000

CMD ["nginx", "-g", "daemon off;"]