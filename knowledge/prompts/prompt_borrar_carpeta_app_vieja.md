NOTA PARA ANA — no pegar esto en Claude Code, es solo para recordar contexto:

Este prompt es para Claude Code (el que corre en tu compu), no para el agente de Figma. Borra la carpeta vieja `theaveling\app`, que quedó duplicada después de que reorganizamos el proyecto para que el código viva directo en `theaveling\` (igual que `orbit-app`). Antes de pegarlo, asegurate de estar parada en `theaveling` (no adentro de `theaveling\app`) — si tenés Claude Code abierto ahí, salí con `/exit`, hacé `cd ..` si hace falta, y volvé a abrirlo con `cd theaveling` + `claude`.

--- PROMPT (pegar desde acá) ---

Estoy reorganizando este proyecto: el código ya vive directo en la raíz de esta carpeta (`theaveling\`, donde ya están `src\`, `package.json`, etc.), y quedó una carpeta vieja duplicada en `theaveling\app\` de antes de la reorganización, que ya no se usa.

Por favor:
1. Confirmá primero que existe una carpeta `app` dentro del directorio actual y mostrame qué contiene (para verificar que es la carpeta vieja del proyecto duplicado, con su propio `src`, `package.json`, `node_modules`, etc.).
2. Confirmá que el directorio actual NO es esa carpeta `app` (que estamos parados en `theaveling`, no en `theaveling\app`).
3. Si ambas cosas se confirman, borrá la carpeta `app` completa (incluyendo `node_modules` adentro).
4. Confirmá al final que la carpeta `app` ya no existe, y que `src\`, `package.json`, `knowledge\` siguen intactos en la raíz.

No toques ningún otro archivo o carpeta.

## Verificación esperada al terminar

- `theaveling\app` ya no existe.
- `theaveling\src`, `theaveling\package.json`, `theaveling\knowledge` siguen ahí sin cambios.
