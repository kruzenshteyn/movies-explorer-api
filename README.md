# movies-explorer-api
Проект backend для диплома

Для обращения к ресурсу используется адрес https://api.alexbaev.nomoredomains.work

В API должно есть 5 роутов:
# возвращает информацию о пользователе (email и имя)
GET /users/me

# обновляет информацию о пользователе (email и имя)
PATCH /users/me

# возвращает все сохранённые текущим  пользователем фильмы
GET /movies

# создаёт фильм с переданными в теле
# country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId 
POST /movies

# удаляет сохранённый фильм по id
DELETE /movies/_id

Также в API есть ещё два роута: для регистрации и логина.
# создаёт пользователя с переданными в теле
# email, password и name
POST /signup

# проверяет переданные в теле почту и пароль
# и возвращает JWT
POST /signin

Для проверки есть роут
GET /secured
