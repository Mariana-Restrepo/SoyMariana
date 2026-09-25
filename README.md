# SoyMariana

Aplicación **web y móvil (Android / iOS)** con un único código base.

**Stack:** [Expo](https://expo.dev) · React Native · React Native Web · TypeScript · Expo Router

## Requisitos

- [Node.js](https://nodejs.org) 20 o superior
- [Visual Studio Code](https://code.visualstudio.com) (se recomiendan las extensiones de `.vscode/extensions.json`)
- Para probar en el celular: app **Expo Go** (Android / iOS) o un emulador

## Empezar

```bash
npm install
npm start          # menú de Expo: presiona w (web), a (Android), i (iOS)
```

| Comando               | Qué hace                                  |
| --------------------- | ----------------------------------------- |
| `npm start`           | Inicia el servidor de desarrollo          |
| `npm run web`         | Abre la versión web                       |
| `npm run android`     | Abre en Android                           |
| `npm run ios`         | Abre en iOS (requiere macOS o Expo Go)    |
| `npm run check`       | Verifica tipos (TypeScript) y lint        |
| `npm run lint:fix`    | Corrige problemas de lint automáticamente |
| `npm run format`      | Da formato al código con Prettier         |
| `npm run build:web`   | Genera el build de producción web (`dist/`) |

## Estructura

```
SoyMariana/
├── assets/            Imágenes, íconos y fuentes
├── docs/              Documentación del proyecto
├── src/
│   ├── app/           Rutas y pantallas (Expo Router: cada archivo = una pantalla)
│   ├── components/
│   │   ├── ui/          Componentes visuales reutilizables
│   │   └── navigation/  Barra de pestañas / navegación
│   ├── config/        Constantes y configuración de la app
│   ├── constants/     Tema: colores, espaciados, fuentes
│   ├── features/      Módulos por funcionalidad (pantallas, lógica y componentes propios)
│   ├── hooks/         Hooks reutilizables
│   ├── services/      Acceso a APIs, base de datos, autenticación
│   ├── types/         Tipos de TypeScript compartidos
│   └── utils/         Funciones auxiliares
├── app.json           Configuración de Expo (nombre, íconos, splash)
└── package.json
```

Más detalle en [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md).

## Convenciones

- Alias de importación: `@/` apunta a `src/` (ej. `import { Spacing } from '@/constants/theme'`).
- Archivos `*.web.tsx` se usan solo en web; `*.tsx` (sin sufijo) en móvil, o en ambos si no existe versión web.
- Instalar paquetes con `npx expo install <paquete>` para que la versión sea compatible con el SDK.
- Variables de entorno: copiar `.env.example` a `.env.local` (no se sube a git).
