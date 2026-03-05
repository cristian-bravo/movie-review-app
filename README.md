<div align="center">

# 🎬 Movie Review App

### Aplicación web moderna para buscar, explorar y reseñar películas

![NextJS](https://img.shields.io/badge/Next.js-Framework-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Lenguaje-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/TailwindCSS-Estilos-38BDF8?style=for-the-badge&logo=tailwindcss)
![React](https://img.shields.io/badge/React-Library-61DAFB?style=for-the-badge&logo=react)
![Status](https://img.shields.io/badge/Estado-En%20desarrollo-orange?style=for-the-badge)

---

Aplicación web que permite a los usuarios **buscar películas, explorar información detallada y escribir reseñas**.  
El proyecto utiliza tecnologías modernas enfocadas en **rendimiento, escalabilidad y una interfaz limpia**.

</div>

---

# 📌 Descripción del Proyecto

Esta aplicación fue desarrollada como una **plataforma web de búsqueda y reseñas de películas**.

Los usuarios pueden:

- Buscar películas por título
- Ver información detallada de cada película
- Publicar reseñas y calificaciones
- Leer opiniones de otros usuarios

El sistema está construido con **Next.js, TypeScript y TailwindCSS**, aplicando buenas prácticas de desarrollo frontend y diseño responsivo.

---

# ✨ Funcionalidades

## 🔎 Búsqueda de Películas
- Campo de búsqueda para encontrar películas por título
- Visualización de resultados con:
  - Imagen de la película
  - Título
  - Breve descripción

## 🎥 Detalles de la Película
- Página individual por película
- Información detallada como:
  - Sinopsis
  - Reparto
  - Calificaciones
  - Datos adicionales

## ✍️ Sistema de Reseñas
- Los usuarios registrados pueden escribir reseñas
- Sistema de calificación de películas
- Visualización de reseñas de otros usuarios

## 👤 Autenticación de Usuarios
- Registro de nuevos usuarios
- Inicio de sesión
- Perfil de usuario con historial de reseñas

## 📱 Diseño Responsivo
La interfaz se adapta completamente a:

- Computadoras de escritorio
- Tablets
- Dispositivos móviles

---

# 🛠 Tecnologías Utilizadas

| Tecnología | Descripción |
|-----------|-------------|
| **Next.js** | Framework para aplicaciones React |
| **React** | Construcción de la interfaz de usuario |
| **TypeScript** | Tipado estático y mayor mantenibilidad |
| **TailwindCSS** | Estilizado moderno y responsivo |
| **IMDb API** | Obtención de información de películas |
| **Firebase / MongoDB (opcional)** | Almacenamiento de usuarios y reseñas |
| **Sistema de Autenticación** | Gestión de usuarios |

---

## 🧱 Estructura del Proyecto

```text
src/
├── app/
│   ├── movies/
│   ├── search/
│   └── profile/
│
├── components/
│   ├── MovieCard.tsx
│   ├── SearchBar.tsx
│   ├── ReviewForm.tsx
│   └── Navbar.tsx
│
├── services/
│   └── movieApi.ts
│
├── hooks/
│
├── types/
│
└── utils/
```

---

# ⚙️ Instalación del Proyecto

Clonar el repositorio:

```bash
git clone https://github.com/tuusuario/movie-review-app.git

Entrar al proyecto:

cd movie-review-app

Instalar dependencias:

npm install

Ejecutar el servidor de desarrollo:

npm run dev

Abrir en el navegador:

http://localhost:3000
📡 Integración con API

El proyecto utiliza la API oficial de IMDb para obtener información de películas.

https://developer.imdb.com/

📦 Posibles Mejoras Futuras

Recomendaciones de películas

Sistema de likes en reseñas

Filtros avanzados de búsqueda

Listas personalizadas de películas

Integración con más APIs de cine

👨‍💻 Autor

Cristian Bravo

Proyecto desarrollado como parte de una práctica académica orientada al desarrollo de aplicaciones web modernas.

📜 Licencia

Licencia de uso personal.

Este proyecto fue desarrollado con fines personales y de aprendizaje.
No se permite su redistribución o uso comercial sin autorización del autor.
