# OptimizeConstructorEdit Проект

Локальный сайт на Next.js для оптимизации работы конструкторского-бюро.

## 🔧 Установка/Настройка

1. Клонировать репозиторий:

   ```bash
   git clone https://github.com/EternalSyntaxErrorAllTime/optimize-constructor-edit
   cd optimize-constructor-edit
   ```

2. 🔐 Создание HTTPS-сертификата
   Для локальной сайта можно сгенерировать самоподписанный сертификат

3. 🗄🐘 Создайте базу данных на PostgreSQL.

   - Создайте базу данных с названием `optimizeConstructorEdit`
   - после используйте backup

4. 📝 Настройка окружения:
   Создайте файл .env в корне проекта и добавьте следующие переменные:

   ```env
   # Сайт
   URL_SITE="ссылка_на_сайт"
   CERT_DIR="путь_до_сертификата"

   # База данных
   DB_HOST=""
   DB_NAME="optimizeConstructorEdit"
   DB_USER=""
   DB_PASSWORD=""
   DB_PORT=5432
   DB_SSL=false

   # NextAuth
   NEXTAUTH_URL="ссылка_на_сайт"
   AUTH_SECRET="секретный_ключ"
   ```

5. ⤓ Установить зависимости и запуск проекта:
   ```bash
   npm install
   npm run build
   npm run start:ssl
   ```
