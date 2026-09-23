# TODO

 - включать/выключать озвучивание хода пользователя
 - включать/выключать озвучивание хода компьютера
 - выбор сложности компьютера (рандом - easy - normal - hard - stockfish MAX)

# chess-canvas-app

В данном репозитории находятся два приложения:

- приложение React, реализующее интерфейс для игры в шахматы с компьютером с помощью голоса и использующее `assistan-client` для взаимодействия с бэкендом распознавания;
- архив `scenario-example-old.zip` - приложение Смарт-кода, выполняющееся на бэкенде распознавания речи и определяющее логику распознавания речи и голосового/текстового взаимодействия. (АРХИВ УСТАРЕЛ И ОСТАЁТСЯ ЗДЕСЬ ДО ЗАМЕНЫ НА АКТУАЛЬНЫЙ)

Обычного бэкенда, реализующего серверную логику и хранение данных, в этом приложении нет.

Для тестирования приложения на локальном хосте ниже приведена инструкция.

## Генерация token:

1. Идём на страницу ([SmartApp Studio](https://developers.sber.ru/studio/));
2. В меню профиля (правый верхний угол) выбираем "Настройки профиля";
3. В меню слева - "Настройки сервисов"
4. На открывшейся странице - "SmartApp - Информация для каталога, эмулятор, мои устройства"
5. Вкладка "Эмулятор";
6. Нажимаем "Обновить ключ";
7. Нажимаем "Скопировать ключ" (Появляется надпись "Выполнено. Ключ скопирован");
8. Указываем токен в файле `.env`, в строке `VITE_APP_TOKEN`.

## Запуск проекта:

Протестировано под Nodejs `v20.20.2`.

1. Установить нужную версию Nodejs можно либо непосредственно с сайта, либо (рекомендуется) с помощью утилиты `nvm`, позволяющей быстро переключаться между версиями Node из командной строки (`nvm install 20.20.2`, `nvm use 20.20.2`).
2. Установить менеджер пакетов `yarn`, установить зависимости и запустить:

```bash
npm install -g yarn
yarn
yarn dev
```

Если после установки `yarn` при попытке его запустить вы получаете сообщение `The term 'yarn' is not recognized`, см. раздел "Устранение проблем" ниже.

Эти же команды в менеджере пакетов `npm` (уже установлен по умолчанию вместе с Nodejs):

```bash
npm install
npm run dev
```

Если при запске `npm install` выводится ошибка "Conflicting peer dependency: typescript", см. раздел "Устранение проблем" ниже.



3. Должен открыться веб-браузер со страницей приложения, в котором (кроме обычного визуального интерфейса) в нижней части появится панель Ассистента с шариком слева. Кликом на шарике можно включать/отключать распознавание речи. При отключенном распознавании текст можно вводить с клавиатуры в строке справа от шарика.
   ![doc/screen.png](doc/screen.png)
4. При вращающемся шарике в этом приложении доступны следующие голосовые команды:

- "Добавь задачу <название задачи>",
- "Выполнил <название задачи>",
- "Удали задачу <название задачи>".

Не забудьте разрешить доступ страницы к микрофону.

Если вам не нужно, чтобы новая вкладка браузера открывалась каждый раз при старте приложения, в файле `.env` добавьте строку

```dotenv
BROWSER=none
```

Внимание! При внесении изменений в файл `.env` приложение необходимо перезапустить.

# Документация

## Официальная документация

### Описание Assistant Client

Описание Assistant Client приведено в репозитории https://github.com/salute-developers/salutejs-client

*Обратите внимание: старая страница проекта https://github.com/sberdevices/assistant-client не обновляется.*

*То же с именем модуля NPM: @sberdevices/assistant-client -> '@salutejs/client.*

## Документация developers.sber.ru

- Разработка графического интерфейса: Canvas App -- Создание приложений на JavaScript -- https://developers.sber.ru/docs/ru/va/canvas/title-page
- Разработка голосовой части: Code --  среда разработки на языках JavaScript и SmartApp DSL -- https://developers.sber.ru/docs/ru/va/code/overview

## Поддержка

Чат в телеграмме: https://t.me/smartmarket_community

Заявку можно оставить в чате на сайте developers.sber.ru

# Устранение проблем

### Не работает озвучка и/или микрофон в браузере

Нужно перейти в [настройки сайта](https://support.google.com/chrome/answer/114662) и разрешить доступ к звуку и микрофону.

Значение параметра Sound по умолчанию; "Automatic (default)", не позволяет браузеру проигрывать звуки до того, как пользователь совершит какое-то действие. Если вам нужно услышать начальное приветствие сразу после загрузки страницы, это значение неужно изменить на "Allow".

### Проблема

Большое количество сообщений `Failed to parse source map`:

```log
Module Warning (from ./node_modules/source-map-loader/dist/cjs.js):
Failed to parse source map from '(...)\salut-app\node_modules\@salutejs\plasma-typo\src\tokens.ts' file:
Error: ENOENT: no such file or directory, open '(...)\salut-app\node_modules\@salutejs\plasma-typo\src\tokens.ts'
```

### Решение

Это - предупреждающие сообщения и не являются признаком ошибки.
При необходимости их отключить (не рекомендуется), можно добавить в файл `.env` следующую строку:

```dotenv
GENERATE_SOURCEMAP=false
```

Внимание! При внесении изменений в файл `.env` приложение необходимо перезапустить.

## The term 'yarn' is not recognized

### Проблема

Если вы работаете в Windows, и после установки `yarn`, при попытке его запустить, вы получаете сообщение `The term 'yarn' is not recognized`:

```log
yarn : The term 'yarn' is not recognized as the name of a cmdlet, function, script file, or operable program. Check the spelling of the name, or if a path was included, verify that the path is correct and try again.
```

### Решение

В Windows настоящее время по умолчанию используется командная строка PowerShell. В некоторых случаях PowerShell не может найти команду `yarn` после установки. Наиболее простой способ решить эту проблему - запустить более старый командный процессор Cmd. В нём, как правило, всё работает.
В случае, если это не решает проблему, можно использовать оригинальный менеджер пакетов `npm`.

## "Conflicting peer dependency: typescript" при выполнении команды `npm install`

### Проблема

При выполнении команды для установки пакетов

```
npm install
```

Выводится следующая ошибка:
```
npm error code ERESOLVE
npm error ERESOLVE could not resolve
npm error
npm error While resolving: react-scripts@5.0.1
npm error Found: typescript@5.4.5
npm error node_modules/typescript
npm error   typescript@"=5.4.5" from the root project
npm error
npm error peerOptional typescript@"^3.2.1 || ^4" from react-scripts@5.0.1
npm error node_modules/react-scripts
npm error   react-scripts@"5.0.1" from the root project
npm error
npm error Conflicting peer dependency: typescript@4.9.5
npm error node_modules/typescript
npm error   peerOptional typescript@"^3.2.1 || ^4" from react-scripts@5.0.1
npm error   node_modules/react-scripts
npm error     react-scripts@"5.0.1" from the root project
npm error
npm error Fix the upstream dependency conflict, or retry
npm error this command with --force or --legacy-peer-deps
npm error to accept an incorrect (and potentially broken) dependency resolution.
npm error
npm error
npm error For a full report see:
npm error C:\Users\alykoshin\AppData\Local\npm-cache\_logs\2025-03-29T19_07_40_891Z-eresolve-report.txt
npm error A complete log of this run can be found in: C:\Users\alykoshin\AppData\Local\npm-cache\_logs\2025-03-29T19_07_40_891Z-debug-0.log
PS D:\teach\11. webdev - все материалы\05. МИСиС. 1.02. Разр.кл.-серв.прил. - 2025\Проекты для консультаций\todo-canvas-app> npm i --force
```
### Решение

Запустить `npm i` с ключом `--force`
```
npm i --force
```

Или использовать команду `yarn`, если она была установлена.

```
yarn
```

### Проблема

Сайт открылся, но ничего не работает, начального приветствия не слышно.

При открытии консоли через F12 или ПКМ -> Inspect видны ошибки вебсокетов:
![/doc/certificate_error3.png](/doc/certificate_error3.png)

### Решение

Откройте в новом окне указанный url (в данном случае `wss://nlp2.devices.sberbank.ru/vps/`), но замените `wss://` на `https://` (в данном случае получится `https://nlp2.devices.sberbank.ru/vps/`). На открывшемся сайте примите недействительные сертификаты.
![/doc/certificate_error1.png](/doc/certificate_error.png) ![/doc/certificate_error2.png](/doc/certificate_error2.png)

Перезагрузите страницу приложения.

## Управление пультом ДУ (Canvas App)

Приложение использует DOM `keydown` (`key`, затем `code`, затем стандартный
браузерный `keyCode`). Android KeyEvent из документации Native App здесь не
используется. Spatial Navigation реализована локально: геометрический переход
между кнопками внутри активного окна, координатная навигация внутри доски.
Headless UI удерживает фокус в диалогах и восстанавливает его после закрытия.

- Стрелки: перемещение по доске; начальная клетка — e2. Бело-синяя рамка показывает
  курсор, жёлтая клетка — выбранную фигуру, зелёные метки — допустимые назначения.
- OK / Enter: выбрать белую фигуру, затем выполнить ход на допустимую клетку.
  Повторный OK на выбранной фигуре отменяет выбор. Удержание OK не повторяет действие.
- Назад / Escape / Backspace: отменить выбор или закрыть окно превращения/результата.
  Нативный Back обрабатывается через временную запись History API и `popstate`.
  На основной доске без выбора Back сохраняет системное поведение выхода.
- Вниз с первой горизонтали: кнопки «Вернуть ход» и «Сбросить игру».
  Влево/вправо: переключение кнопок; вверх: возврат к сохранённой клетке доски.
- В окнах сложности, превращения и результата: стрелки по расположению кнопок,
  OK для действия; Tab / Shift+Tab также работают. Превращение: ферзь, ладья,
  слон или конь; есть кнопка отмены.
- Перетаскивание мышью/касанием сохранено; добавлен выбор двумя кликами/касаниями.
  Все ходы идут через `App.make_move` и проверяются `chess.js`.
- Home, питание, громкость, вызов ассистента не перехватываются.

### Проверка

`npm test` — проверки обработчиков компонентов с настоящим chess.js и имитацией
React hooks/фокуса: ход с пульта, отмена, недопустимый ход, все превращения,
рокировка, взятие на проходе, шах, конец игры, пространственный переход кнопок,
задержанный ответ движка, возврат хода и сброс. Это не браузерные E2E-тесты.
`npm run build` — производственная сборка.

Ручной сценарий: `npm run dev`, открыть адрес Vite (обычно
http://localhost:3000/chess-canvas-app/). Без мыши выбрать сложность стрелками и
Enter. На e2: Enter, ↑, ↑, Enter — e2–e4. Дождаться ответа Салюта. Выбрать другую
фигуру и отменить Escape. Спуститься вниз за край доски, вернуть ход, переключиться
на сброс и начать новую партию. Проверить ограничения на краях доски, Tab,
недопустимый ход, смену управления мышь/пульт, все варианты превращения и оба
действия окна результата. На реальном Салют ТВ/SberBox дополнительно проверить
физический Back (отмена выбора, затем выход), удержание OK, системные кнопки,
видимость фокуса с расстояния и полную партию до результата. Проверять также
производственную сборку через `npm run preview`.

При проверке реализации браузерный доступ был запрещён системой разрешений;
ручная проверка в браузере и на физическом ТВ не выполнена.

Документация, использованная при реализации:
- [Проектирование для больших экранов](https://developers.sber.ru/docs/ru/va/about/app-design/big-screen).
- [Assistant Client: пульт и History API для Canvas App](https://github.com/salute-developers/salutejs-client#пульт).
- [Spatial Navigation Lite](https://github.com/salute-developers/spatial).
- [Поддержка пульта в Native App](https://developers.sber.ru/docs/ru/va/native/step-by-step/apk/remote).
- [Поддержка геймпада в Native App](https://developers.sber.ru/docs/ru/va/native/step-by-step/apk/gamepad):
  Android KeyEvent/MotionEvent не являются DOM-событиями; отдельный Gamepad API
  в рамках поддержки пульта не добавлялся.

## Инструкция с учётом устройства

Текст `HelpSidebar` выбирается в `src/controlInstructions.js`. Приоритет имеет
`device.surface`, если он пришёл в стартовых данных или событиях Assistant Client:

| Поверхность | Инструкция |
| --- | --- |
| SBERBOX, TV, TV_HUAWEI, TIME, SATELLITE | Стрелки пульта, OK, Назад |
| SBOL, COMPANION | Касания и перетаскивание |
| STARGATE (SberPortal) | Касания; устройство не называется смартфоном |
| SBERBOOM, SBERBOOM_MINI, неизвестное значение | Универсальная инструкция без названий устройств ввода |

В `@salutejs/client` 1.37.1 нет публичного метода получения устройства.
`payload.device.surface` из [SmartApp API](https://developers.sber.ru/docs/ru/va/api/smartapp-api-requests)
приходит в бэкенд в том числе в RUN_APP; SDK не гарантирует его автоматическую
передачу во фронтенд. Если сценарий передаёт метаданные, поддерживается команда
`{"type":"smart_app_data","smart_app_data":{"device":{"surface":"TV"}}}`
и её развёрнутый SDK-вариант `{"device":{"surface":"TV"}}`. Также читается
`payload.device.surface`. События без метаданных не сбрасывают уже выбранный режим.
Для гарантированного определения поверхности сценарий должен передавать поле из
входящего запроса, а не фиксированное значение из примера.

Если поверхности нет, используются признаки ТВ/мобильной платформы в userAgent,
`userAgentData.mobile` и media queries `pointer`/`hover`. Сенсорность и размер окна
сами по себе не определяют смартфон. Сенсорный Windows-ноутбук с точным указателем
и hover получает инструкцию для компьютера; неопределённый сенсорный экран —
универсальную. Браузерное определение является эвристикой.

`npm test` проверяет отрисованный HTML инструкции для всех поверхностей таблицы,
резервное определение устройства, приоритет SDK и обновление по стартовым/поздним
событиям. Это программная проверка текста, а не визуальная проверка на физических
устройствах. Правила ходов и обработчики управления в этой адаптации не изменялись.
