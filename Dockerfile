# 1. Билдер
FROM node:18-alpine AS builder

# 2. Рабочая директория
WORKDIR /app

# 3. Копируем зависимости
COPY package.json yarn.lock ./

# 4. Устанавливаем зависимости
RUN yarn install --frozen-lockfile

# 5. Копируем весь проект и собираем
COPY . .
RUN yarn build

# 6. Production-образ
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Копируем только нужные файлы
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
RUN yarn install --production --frozen-lockfile

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

# Next.js слушает 3000 порт
EXPOSE 3000

# Запуск
CMD ["yarn", "start"]
