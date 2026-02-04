up:
	docker compose up -d

down:
	docker compose down

restart: down up

build:
	docker compose up --build -d
