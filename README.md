# python-backend

## GROUPE 1

- LIGHTSAIL
- S3

## members

- Jiad ABDUL
- Paul Charbel
- Faithgot Glin-Dayi
- Ahmat Rouchad
- Hugo Cieplucha

## Requirements

- docker
- or python and nodejs

## How to run

### Docker

```sh
touch .env
cp .env.example .env
docker compose up
```

### Python and NODE

```sh
cd backend
touch .env
cp ../.env.example .env
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
flask run 
```

```sh
cd frontend
npm install
npm run dev
```