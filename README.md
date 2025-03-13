
# How it works

Первое тестовое задание 
Второе представлено в sql_task_2_test_query.txt

# Getting started



## Installation
### 1. Frontend: Выберите 1 из 2 способов ниже:
- Установите зависимости фронта и запустите фронт на локальном уровне:
```shell
cd frontend
npm install 
cd ..
npm --prefix=frontend start
```
Эта команда установит и запустит сервер угловой разработки. Вы можете получить доступ к угловому приложению через свой веб -браузер в `http://localhost:4200`.

- Установите и строите фронта в виде статических файлов (выберите это, если вы не хотите вносить какие -либо изменения в проект Frontend):
```shell
npm --prefix=frontend install
npm --prefix=frontend run build
```

### 2. Backend:
- Set up a virtual environment
```shell
# Install environment and dependencies
python -m venv .venv
source .venv/bin/activate

# or use this command on Windows
python -m venv .venv
.venv/Scripts/activate
```

- Install backend dependencies:
```shell
pip install -r backend/requirements.txt
```

- Apply database migrations:
```shell
# Apply migrations
python backend/manage.py migrate
```

- Run the Django development server:
```shell
# Run server
python backend/manage.py runserver
```

Теперь ваш локальный сервер должен работать, и вы можете получить доступ к этому приложению Django/Angular через свой веб -браузер в http://localhost:8000.
### Useful information
- node module в архиве, бибилиотеки для python представлены requirements и архивом в venv
