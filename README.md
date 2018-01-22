# Приложение для создания и редактирования информации о встречах сотрудников

## Задание 2
Нужно сверстать страницу списка переговрок и форму редактирования встречи.

## Запуск
```
npm i
```
Для работы приложения необходимо создать дополнительные представления в базе данных:
```
CREATE VIEW RoomsEvents AS
SELECT * FROM (
SELECT r.id, r.title, r.floor, r.capacity, NULL as dateStart, NULL as dateEnd
FROM Rooms r
WHERE r.id NOT IN (
	SELECT r.id
	FROM Rooms r, Events e
	WHERE r.id == e.RoomId
)
UNION
SELECT r.id, r.title, r.floor, r.capacity, e.dateStart as dateStart, e.dateEnd as dateEnd
FROM Rooms r, Events e
WHERE r.id == e.RoomId
)
```
```
CREATE VIEW ScheduleEvents AS
SELECT 
	r.id as "room_id", 
	r.capacity, 
	r.floor,
	e.id as "event_id", 
	time(e.dateStart) as "start", 
	time(e.dateEnd) as "end",
	date(e.dateStart) as "date",
	e.dateEnd, 
    e.dateStart
FROM Events e, Rooms r
WHERE e.RoomId = r.id
ORDER BY r.id, r.capacity
```

```
CREATE VIEW InfoEvents AS
SELECT e.id, e.title, e.dateStart, e.dateEnd, r.title as "room"
FROM Events e, Rooms r
WHERE r.id = e.RoomId
```

```
CREATE VIEW UserEvents AS
SELECT u.id as "user_id", eu.EventId as "event_id", u.login, u.avatarUrl FROM Users u, Events_Users eu
WHERE u.id = eu.UserId
```
Для разраотки, задание доступно по адресу http://localhost:3000/
```
npm run build-dev
```
Для продакшен сборки с модификацией и оптимизацией (все файлы будут помещены в папку public), , задание доступно по адресу http://localhost:3000/
```
npm run build-prod
```  

Для сброса данных в базе:
```
npm run reset-db
```
## Перечень используемых мной инструментов
Для разработки и сборки проекта использовал webpack.

Все инструменты выбирал исходя из следующих критериев количество скачак на github, дата последнего коммита и доступность документации:

- autoprefixer -  использовал для установки вендорных префиксов, для поддержки css свойств имеющих частичную поддержку
- babel-core - использовал для компиляции ES6
- babel-loader - использовал для компиляции ES6
- babel-preset-env - использовал для компиляции ES6
- babel-preset-es2015 - использовал для компиляции ES6
- clean-webpack-plugin - использовал для удаления директории сборки проекта
- css-loader - для работы webpack с css
- extract-text-webpack-plugin - для обработки не js файлов
- file-loader - для загрузки файлов
- html-webpack-plugin - для работы с html
- node-sass - для компиляции sass
- optimize-css-assets-webpack-plugin - для оптимизации css
- postcss-loader - для выполнения инструментов постобработки css
- postcss-units - хотел использовать для компиляции в rem
- sass-loader - для работы с sass
- style-loader - для работы с css
- uglifyjs-webpack-plugin - для минификации js
- webpack - для сборки проекта
- webpack-dev-server - веб-сервер с поддержкой hot reload
- webpack-merge - для сборки webpack конфига из разных файлов
- apollo-cache-inmemory - реализация кеша для apollo.js 
- apollo-client - apollo клиент для подключения к graphql серверу
- apollo-link-http - для подключения к graphql серверу
- graphql-tag - для построения graphql запросов для apollo
- moment - для раоты с датой и временем
- prop-types - проверка типов prop
- react - для реализации SPA
- react-apollo - поддержка apollo в react
- react-dom - для построения react dom
- react-router-dom - для клиентской маршрутизации
- react-swipeable - для реализации свайпа
- babel-preset-react - для компиляции jsx
- postcss-flexbugs-fixes - фикс для flexbox

Для реализации SPA выбирал между Vue.js и React.js, выбрал React.js т.к. комьюнити React.js намного больше комньюнити Vue.js, по React.js больше информации и примеров реализации.

## Описание сборки

/webpack.config.js - файл конфигурации webpack

/webpack - каталог с файлами конфигурации webpack

/resources - каталог с исходными файлами задания

/resources/components - компоненты react

/resources/fonts - каталог с шрифтами для задания

/resources/images - каталог с картинками для задания

/resources/pages - точка входа в SPA

/public - каталог с оптимизированными фалами SPA

/public/assets - шрифты, картинки и оптимизированный js и css

## Комментарии к реализации Функции getRecommendation 
   
Функция getRecommendation находится в файле /graphql/resolvers/query.js

Для ее реализации были использованны дополнительные предсталвения в базе данных, promises и рекурсия

## Комментарии к SPA

Обновление списка встреч происходит каждые 5 секунд
