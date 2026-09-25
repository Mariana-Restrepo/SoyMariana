# Arquitectura

## Decisión técnica

Un solo proyecto **Expo + React Native + TypeScript** que compila a:

- **Web** (React Native Web, salida estática con `expo export --platform web`)
- **Android** e **iOS** (apps nativas)

Un único código base evita duplicar lógica y pantallas entre plataformas.

## Capas

| Carpeta              | Responsabilidad                                                           |
| -------------------- | ------------------------------------------------------------------------- |
| `src/app`            | Solo rutas. Deben ser delgadas: importan y componen lo que viene de `features`. |
| `src/features/<x>`   | Todo lo de una funcionalidad: pantallas, componentes, hooks y tipos propios. |
| `src/components/ui`  | Componentes genéricos sin lógica de negocio (botones, tarjetas, inputs).  |
| `src/services`       | Comunicación externa (API, backend, almacenamiento). Sin UI.              |
| `src/hooks`          | Hooks transversales a toda la app.                                        |
| `src/utils`          | Funciones puras (formato de fechas, validaciones...).                     |
| `src/types`          | Tipos compartidos entre features.                                         |
| `src/config`         | Constantes de la app y lectura de variables de entorno.                   |
| `src/constants`      | Sistema de diseño: colores, espaciado, tipografías.                       |

## Código específico por plataforma

- `archivo.tsx` → móvil (y web si no hay `.web.tsx`)
- `archivo.web.tsx` → solo web
- `Platform.OS` para diferencias puntuales dentro de un mismo archivo

Ejemplo real: `components/navigation/app-tabs.tsx` (pestañas nativas) y `app-tabs.web.tsx` (barra superior web).

## Tema

Definido en `src/constants/theme.ts` (claro/oscuro automático). Usar `ThemedText` y `ThemedView` para respetar el tema.

## Pendiente de definir

- Backend / base de datos
- Autenticación
- Identidad visual (logo, paleta, tipografías) y reemplazo de íconos placeholder en `assets/images`
