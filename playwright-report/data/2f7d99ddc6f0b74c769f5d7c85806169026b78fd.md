# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: geolocation-ip-fallback.spec.ts >> Geolocation IP Fallback >> should show approximate location via IP when GPS permission is denied
- Location: e2e\geolocation-ip-fallback.spec.ts:4:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('span').filter({ hasText: /aproximada/ })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('span').filter({ hasText: /aproximada/ })

```

```yaml
- banner:
  - text: Theaveling
  - button "Elegir ubicación":
    - img
  - button "Buscar":
    - img
- navigation:
  - button "Todo"
  - button "Escena"
  - button "Cultura"
- main:
  - heading "Curado por Theaveling" [level=2]
  - img
  - 'link "Agregar a favoritos Dramaturgias Nómadas: Muestra Estival Hibridación de las artes escénicas europeas en un entorno industrial recuperado de la periferia urbana."':
    - /url: /experiencia/dramaturgias-nomadas
    - button "Agregar a favoritos":
      - img
    - 'heading "Dramaturgias Nómadas: Muestra Estival" [level=2]'
    - paragraph: Hibridación de las artes escénicas europeas en un entorno industrial recuperado de la periferia urbana.
  - link "Agregar a favoritos La consagración del otoño Una reinterpretación visceral y minimalista de la consagración primaveral a través de técnicas de danza butoh y expresión contemporánea.":
    - /url: /experiencia/la-consagracion-del-otono
    - button "Agregar a favoritos":
      - img
    - heading "La consagración del otoño" [level=2]
    - paragraph: Una reinterpretación visceral y minimalista de la consagración primaveral a través de técnicas de danza butoh y expresión contemporánea.
  - 'link "Agregar a favoritos Comité del Fracaso: Ensayo Abierto Un ensayo escénico poco frecuente en el circuito local: cruza clown físico con dramaturgia de creación colectiva, sin texto previo — se construye enteramente en sala durante meses de work-in-progress. Theaveling la eligió por el riesgo formal, no por el nombre del elenco."':
    - /url: /experiencia/comite-del-fracaso
    - button "Agregar a favoritos":
      - img
    - 'heading "Comité del Fracaso: Ensayo Abierto" [level=2]'
    - paragraph: "Un ensayo escénico poco frecuente en el circuito local: cruza clown físico con dramaturgia de creación colectiva, sin texto previo — se construye enteramente en sala durante meses de work-in-progress. Theaveling la eligió por el riesgo formal, no por el nombre del elenco."
  - button "+10 Más Curados"
  - heading "Más reservados" [level=2]
  - img
  - 'link "Agregar a favoritos Teatro de máscaras Sesión Subterránea: Ritual de Máscaras Un ritual escénico sin palabras: actores con máscaras talladas a mano cuentan la historia solo con el cuerpo y el gesto, en un búnker reconvertido. Sólo 40 espectadores por función, sentados a centímetros del escenario, sin cuarta pared. Búnker 43, Bogotá ★ 8.8 $95.000 COP"':
    - /url: /experiencia/sesion-subterranea
    - button "Agregar a favoritos":
      - img
    - text: Teatro de máscaras
    - 'heading "Sesión Subterránea: Ritual de Máscaras" [level=3]'
    - paragraph: "Un ritual escénico sin palabras: actores con máscaras talladas a mano cuentan la historia solo con el cuerpo y el gesto, en un búnker reconvertido. Sólo 40 espectadores por función, sentados a centímetros del escenario, sin cuarta pared."
    - paragraph: Búnker 43, Bogotá
    - text: ★ 8.8 $95.000 COP
  - 'link "Agregar a favoritos Farsa surrealista Las Tetas de Tiresias: Lectura Feminista La obra que le dio nombre al surrealismo — Apollinaire, 1917 — sobre una mujer que cambia de sexo para escapar del mandato doméstico y termina gobernando entre hombres. Esta versión traslada el escándalo original a una lectura explícitamente feminista contemporánea, sin perder el tono de farsa absurda del texto. Teatro Mayor Julio Mario Santo Domingo, Bogotá ★ 9.2 Desde $55.000 COP"':
    - /url: /experiencia/las-tetas-de-tiresias
    - button "Agregar a favoritos":
      - img
    - text: Farsa surrealista
    - 'heading "Las Tetas de Tiresias: Lectura Feminista" [level=3]'
    - paragraph: La obra que le dio nombre al surrealismo — Apollinaire, 1917 — sobre una mujer que cambia de sexo para escapar del mandato doméstico y termina gobernando entre hombres. Esta versión traslada el escándalo original a una lectura explícitamente feminista contemporánea, sin perder el tono de farsa absurda del texto.
    - paragraph: Teatro Mayor Julio Mario Santo Domingo, Bogotá
    - text: ★ 9.2 Desde $55.000 COP
  - 'link "Agregar a favoritos Teatro inmersivo La casa de los silencios: Recorrido Inmersivo Un espacio escénico donde el silencio se convierte en protagonista. Teatro inmersivo que explora los límites de la percepción auditiva. Casa Cuarta Pared, Bogotá ★ 9.0 $38.000 COP"':
    - /url: /experiencia/la-casa-de-los-silencios
    - button "Agregar a favoritos":
      - img
    - text: Teatro inmersivo
    - 'heading "La casa de los silencios: Recorrido Inmersivo" [level=3]'
    - paragraph: Un espacio escénico donde el silencio se convierte en protagonista. Teatro inmersivo que explora los límites de la percepción auditiva.
    - paragraph: Casa Cuarta Pared, Bogotá
    - text: ★ 9.0 $38.000 COP
  - 'link "Agregar a favoritos Performance íntima Cuerpos en tránsito: Función Íntima Antes de ser sala de teatro, Espacio Callejón funcionó como una imprenta clandestina en los años 70 — algunas de las prensas originales siguen expuestas en el vestíbulo. «Cuerpos en tránsito» dialoga directamente con ese pasado: un montaje sobre cuerpos que atraviesan espacios de resistencia. Espacio Callejón, Bogotá ★ 9.4 $40.000 COP"':
    - /url: /experiencia/cuerpos-en-transito
    - button "Agregar a favoritos":
      - img
    - text: Performance íntima
    - 'heading "Cuerpos en tránsito: Función Íntima" [level=3]'
    - paragraph: "Antes de ser sala de teatro, Espacio Callejón funcionó como una imprenta clandestina en los años 70 — algunas de las prensas originales siguen expuestas en el vestíbulo. «Cuerpos en tránsito» dialoga directamente con ese pasado: un montaje sobre cuerpos que atraviesan espacios de resistencia."
    - paragraph: Espacio Callejón, Bogotá
    - text: ★ 9.4 $40.000 COP
  - 'link "Agregar a favoritos Cine documental Fronteras Difusas: Retrospectiva Analógica Ciclo de cine experimental en formato analógico que cuestiona los límites del relato de no-ficción y la materialidad del soporte fílmico. Cine Tonalá, Bogotá ★ 9.1 $25.000 COP"':
    - /url: /experiencia/fronteras-difusas
    - button "Agregar a favoritos":
      - img
    - text: Cine documental
    - 'heading "Fronteras Difusas: Retrospectiva Analógica" [level=3]'
    - paragraph: Ciclo de cine experimental en formato analógico que cuestiona los límites del relato de no-ficción y la materialidad del soporte fílmico.
    - paragraph: Cine Tonalá, Bogotá
    - text: ★ 9.1 $25.000 COP
  - 'link "Agregar a favoritos Música experimental Trance: Ritual Sonoro Colectivo Un set en vivo de música electroacústica pensado como ritual colectivo: capas de sintetizadores modulares y percusión ancestral que se construyen en tiempo real, sin repetir nunca el mismo set dos veces. Auditorio Fragua, Bogotá ★ 9.0 $38.000 COP"':
    - /url: /experiencia/trance-ritual-sonoro
    - button "Agregar a favoritos":
      - img
    - text: Música experimental
    - 'heading "Trance: Ritual Sonoro Colectivo" [level=3]'
    - paragraph: "Un set en vivo de música electroacústica pensado como ritual colectivo: capas de sintetizadores modulares y percusión ancestral que se construyen en tiempo real, sin repetir nunca el mismo set dos veces."
    - paragraph: Auditorio Fragua, Bogotá
    - text: ★ 9.0 $38.000 COP
  - 'link "Agregar a favoritos Tragedia contemporánea Antígona, Ahora: Tragedia Urbana Una relectura de Sófocles trasladada a un contexto urbano contemporáneo: la misma pregunta sobre la ley y la desobediencia, dicha con el lenguaje de hoy. Teatro Matacandelas, Bogotá ★ 9.2 $44.000 COP"':
    - /url: /experiencia/antigona-ahora
    - button "Agregar a favoritos":
      - img
    - text: Tragedia contemporánea
    - 'heading "Antígona, Ahora: Tragedia Urbana" [level=3]'
    - paragraph: "Una relectura de Sófocles trasladada a un contexto urbano contemporáneo: la misma pregunta sobre la ley y la desobediencia, dicha con el lenguaje de hoy."
    - paragraph: Teatro Matacandelas, Bogotá
    - text: ★ 9.2 $44.000 COP
  - text: +15 Ver más
  - heading "Descubrimientos" [level=2]
  - img
  - 'link "Agregar a favoritos Musical A Chorus Line: Historias Reales de Bogotá Sala Seki Sano, Bogotá"':
    - /url: /experiencia/a-chorus-line
    - button "Agregar a favoritos":
      - img
    - text: Musical
    - 'heading "A Chorus Line: Historias Reales de Bogotá" [level=3]'
    - paragraph: Sala Seki Sano, Bogotá
  - 'link "Agregar a favoritos Función unipersonal Uno a Uno: Función a Puerta Cerrada Cuarto 7, Bogotá"':
    - /url: /experiencia/uno-a-uno
    - button "Agregar a favoritos":
      - img
    - text: Función unipersonal
    - 'heading "Uno a Uno: Función a Puerta Cerrada" [level=3]'
    - paragraph: Cuarto 7, Bogotá
  - link "Agregar a favoritos Laboratorio teatral Clase de improvisación del ritmo escénico Centro Danza Canal, Bogotá":
    - /url: /experiencia/clase-improvisacion-ritmo
    - button "Agregar a favoritos":
      - img
    - text: Laboratorio teatral
    - heading "Clase de improvisación del ritmo escénico" [level=3]
    - paragraph: Centro Danza Canal, Bogotá
  - 'link "Agregar a favoritos Cineclub Película: Archivo 22, Función Nocturna Cine Club El Muro, Bogotá"':
    - /url: /experiencia/pelicula-archivo-22
    - button "Agregar a favoritos":
      - img
    - text: Cineclub
    - 'heading "Película: Archivo 22, Función Nocturna" [level=3]'
    - paragraph: Cine Club El Muro, Bogotá
  - 'link "Agregar a favoritos Lectura dramática Materia y memoria: Lectura Táctil del Tiempo La Casa Encendida, Bogotá"':
    - /url: /experiencia/materia-y-memoria
    - button "Agregar a favoritos":
      - img
    - text: Lectura dramática
    - 'heading "Materia y memoria: Lectura Táctil del Tiempo" [level=3]'
    - paragraph: La Casa Encendida, Bogotá
  - 'link "Agregar a favoritos Cine local Noche de Cortos: Ciudad Invisible a 5 Km Cinemateca del Parque, Bogotá"':
    - /url: /experiencia/noche-de-cortos-ciudad-invisible
    - button "Agregar a favoritos":
      - img
    - text: Cine local
    - 'heading "Noche de Cortos: Ciudad Invisible a 5 Km" [level=3]'
    - paragraph: Cinemateca del Parque, Bogotá
  - 'link "Agregar a favoritos Charla Charla: Cuando el Lenguaje No Alcanza Teatro Ditirambo, Bogotá"':
    - /url: /experiencia/charla-dramaturgias-del-cuerpo
    - button "Agregar a favoritos":
      - img
    - text: Charla
    - 'heading "Charla: Cuando el Lenguaje No Alcanza" [level=3]'
    - paragraph: Teatro Ditirambo, Bogotá
  - text: +40 Ver más
- navigation:
  - link "Descubrir":
    - /url: /
    - img
    - text: Descubrir
  - link "Reservas":
    - /url: /reservas
    - img
    - text: Reservas
  - link "Perfil":
    - /url: /perfil
    - img
    - text: Perfil
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Geolocation IP Fallback", () => {
  4  |   test("should show approximate location via IP when GPS permission is denied", async ({
  5  |     page,
  6  |     context,
  7  |   }) => {
  8  |     // Crea un contexto sin permisos de geolocalización
  9  |     await context.grantPermissions([]);
  10 | 
  11 |     // Inicia la app
  12 |     await page.goto("http://localhost:5173");
  13 | 
  14 |     // Abre el LocationSheet tocando el ícono de ubicación
  15 |     const locationButton = page.locator('button[aria-label="Elegir ubicación"]');
  16 |     await locationButton.click();
  17 | 
  18 |     // Intenta usar ubicación actual (GPS falla, intenta IP)
  19 |     const ciudadActualButton = page
  20 |       .locator("button")
  21 |       .filter({ hasText: "Ciudad actual" });
  22 |     await ciudadActualButton.click();
  23 | 
  24 |     // Espera a que termine el proceso
  25 |     await page.waitForTimeout(3000);
  26 | 
  27 |     // Verifica que se muestre "aproximada"
  28 |     const ubicacionTexto = page
  29 |       .locator("span")
  30 |       .filter({ hasText: /aproximada/ });
> 31 |     await expect(ubicacionTexto).toBeVisible({ timeout: 5000 });
     |                                  ^ Error: expect(locator).toBeVisible() failed
  32 |   });
  33 | 
  34 |   test("should still show error message when both GPS and IP fail", async ({
  35 |     page,
  36 |     context,
  37 |   }) => {
  38 |     // Intercepta la API de IP para simular un fallo
  39 |     await page.route("https://ipwho.is/**", (route) => {
  40 |       route.abort("failed");
  41 |     });
  42 | 
  43 |     // Sin permisos de GPS
  44 |     await context.grantPermissions([]);
  45 | 
  46 |     await page.goto("http://localhost:5173");
  47 | 
  48 |     // Abre el LocationSheet
  49 |     const locationButton = page.locator('button[aria-label="Elegir ubicación"]');
  50 |     await locationButton.click();
  51 | 
  52 |     // Intenta usar ubicación actual
  53 |     const ciudadActualButton = page
  54 |       .locator("button")
  55 |       .filter({ hasText: "Ciudad actual" });
  56 |     await ciudadActualButton.click();
  57 | 
  58 |     // Espera a que terminen ambos intentos
  59 |     await page.waitForTimeout(2000);
  60 | 
  61 |     // Verifica que se muestre el mensaje de error
  62 |     const errorTexto = page
  63 |       .locator("span")
  64 |       .filter({ hasText: "No se pudo confirmar" });
  65 |     await expect(errorTexto).toBeVisible({ timeout: 5000 });
  66 |   });
  67 | });
  68 | 
```