# ☕ RESTOCAFE

**RESTOCAFE** es una aplicación fullstack para la administración de productos, pedidos, reportes y usuarios en un entorno de cafetería o restaurante. Está dividida en un frontend Angular moderno y un backend Node.js con Express.

---

## 📦 Tecnologías y Paquetes Utilizados

### 🧠 Backend (Node.js + Express)

- `express` - Framework backend
- `jsonwebtoken` - Autenticación JWT
- `mysql` - Conector MySQL
- `dotenv` - Variables de entorno
- `cors` - Middleware para CORS
- `pug` - Motor de plantillas HTML
- `puppeteer` - Generación de PDF
- `nodemon` - Reinicio automático en desarrollo

### 💡 Frontend (Angular + Cypress)

- `@angular/core`, `@angular/router` - Framework SPA
- `@angular/material` - UI components
- `rxjs` - Programación reactiva
- `cypress` - Pruebas end-to-end
- `jest` - (opcional) Pruebas unitarias
- `sass` / `scss` - Estilos modulares

---

## 📁 Estructura del Proyecto

```bash
RESTOCAFE-main/
├── BACKEND/
│   ├── .env.example
│   ├── connection.js
│   ├── server.js
│   ├── index.js
│   ├── package.json
│   ├── table.sql
│   ├── routes/
│   │   ├── bill.js
│   │   ├── category.js
│   │   ├── dashboard.js
│   │   ├── product.js
│   │   ├── user.js
│   │   └── report.pug
│   └── services/
│       ├── authentication.js
│       └── checkRole.js
│
└── FRONTEND/
    ├── angular.json
    ├── package.json
    ├── tsconfig.json
    ├── cypress.config.ts
    ├── src/
    │   ├── app/
    │   │   ├── app.component.ts / .html / .scss / .spec.ts
    │   │   ├── app.routes.ts
    │   │
    │   │   ├── best-seller/
    │   │   │   └── best-seller.component.*
    │   │
    │   │   ├── dashboard/
    │   │   │   └── dashboard.component.*
    │   │
    │   │   ├── forgot-password/
    │   │   │   └── forgot-password.component.*
    │   │
    │   │   ├── home/
    │   │   │   └── home.component.*
    │   │
    │   │   ├── login/
    │   │   │   └── login.component.*
    │   │
    │   │   ├── signup/
    │   │   │   └── signup.component.*
    │   │
    │   │   ├── reset-password/
    │   │   │   └── reset-password.component.*
    │   │
    │   │   ├── material-component/
    │   │   │   └── material-component.component.*
    │   │
    │   │   ├── layouts/
    │   │   │   └── full/
    │   │   │       ├── full.component.*
    │   │   │       ├── header/
    │   │   │       │   └── header.component.*
    │   │   │       └── sidebar/
    │   │   │           └── sidebar.component.*
    │   │
    │   │   ├── shared/               # Componentes reutilizables
    │   │   └── services/             # Servicios Angular
    │   ├── environments/
    │   │   ├── environment.ts
    │   │   └── environment.prod.ts
    │   └── styles.scss
    └── cypress/
        ├── e2e/
        └── support/
```

---

## 🔧 Instalación

1. Clona el repositorio
```bash
git clone https://github.com/tu-usuario/RESTOCAFE.git
cd RESTOCAFE-main
```
2. Configura e inicia el backend
  ```bash
cd BACKEND
npm install
cp .env.example .env
# Edita .env con tus credenciales
npm run dev
```
3. Inicia el frontend
  ```bash
cd ../FRONTEND
npm install
ng serve

```
---
## 🌐 Variables de Entorno (.env)
  ```bash
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_clave
DB_NAME=restocafe
ACCESS_TOKEN_SECRET=una_clave_secreta

```
---
## 🧪 Pruebas
End-to-End con Cypress
  ```bash
cd FRONTEND
npx cypress open
```
Unitarias (si usas Jest)
  ```bash
npm run test
```
---
## 📄 Scripts Disponibles
Backend (BACKEND/package.json)
  ```bash
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```
Frontend (FRONTEND/package.json)
  ```bash
"scripts": {
  "start": "ng serve",
  "test": "jest",
  "e2e": "cypress run"
}
```
---
##  🧠 Base de Datos

Importa el archivo BACKEND/table.sql en tu servidor MySQL para crear la base de datos inicial.

Tablas principales:
  ```bash
user
product
category
bill
etc.
```
---
##  📬 Contribuciones
¡Tu ayuda es bienvenida!

Haz un fork del proyecto.

Crea una rama: git checkout -b feature/nueva-funcionalidad

Commitea tus cambios.

Abre un Pull Request.

## ✅ Estado

* Login, registro, cambio de contraseña
* Gestión de productos y categorías
* Reportes y generación de PDFs
* Dashboard administrativo
* Mejoras UI/UX
* Unit testing completo



