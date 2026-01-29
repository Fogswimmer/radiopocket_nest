-include .env

PACKAGE_MANAGER = ${PACKAGE_MANAGER := npm}

COMPOSE_FILE := docker-compose.yml

ifeq (${NODE_ENV},prod)
  COMPOSE_FILE := docker-compose.yml
else
  COMPOSE_FILE := docker-compose.dev.yml
endif

COMPOSE := docker compose -f $(COMPOSE_FILE)

up:
  $(COMPOSE) up -d

down:
  $(COMPOSE) down --remove-orphans

restart: down up

build:
  $(COMPOSE) up --build -d

install:
  npm install

start:
  $(PACKAGE_MANAGER) start:dev

