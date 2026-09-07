# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: geolocation-ip-fallback.spec.ts >> Geolocation IP Fallback >> should still show error message when both GPS and IP fail
- Location: e2e\geolocation-ip-fallback.spec.ts:34:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('span').filter({ hasText: 'No se pudo confirmar' })
Expected: visible
Error: strict mode violation: locator('span').filter({ hasText: 'No se pudo confirmar' }) resolved to 2 elements:
    1) <span class="flex flex-col min-w-0">…</span> aka getByRole('button', { name: 'Ciudad actual No se pudo' })
    2) <span class="font-body text-[13px] text-white-60 truncate">No se pudo confirmar — Bogotá por defecto</span> aka getByRole('button', { name: 'Ciudad actual No se pudo' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('span').filter({ hasText: 'No se pudo confirmar' })

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e5]:
    - banner [ref=e6]:
      - generic [ref=e7]: Theaveling
      - generic [ref=e8]:
        - button "Elegir ubicación" [ref=e9]:
          - img [ref=e10]
        - button "Buscar" [ref=e12]:
          - img [ref=e13]
    - navigation [ref=e15]:
      - button "Todo" [ref=e16]:
        - generic [ref=e17]: Todo
      - button "Escena" [ref=e19]:
        - generic [ref=e20]: Escena
      - button "Cultura" [ref=e22]:
        - generic [ref=e23]: Cultura
  - generic [ref=e25]:
    - button "Cerrar" [ref=e26]
    - generic [ref=e27]:
      - generic [ref=e30]:
        - button "Cerrar" [ref=e31]:
          - img [ref=e32]
        - heading "Elegir ciudad" [level=2] [ref=e34]
      - generic [ref=e36]:
        - img [ref=e37]
        - textbox [ref=e39]:
          - /placeholder: Busca una ciudad
      - generic [ref=e40]:
        - button "Ciudad actual No se pudo confirmar — Bogotá por defecto" [ref=e42]:
          - img [ref=e44]
          - generic [ref=e46]:
            - generic [ref=e47]: Ciudad actual
            - generic [ref=e48]: No se pudo confirmar — Bogotá por defecto
        - paragraph [ref=e51]: Ciudades sugeridas
        - generic [ref=e52]:
          - img [ref=e54]
          - generic [ref=e56]: Buenos Aires, Argentina
          - generic [ref=e57]: Próximamente
        - generic [ref=e58]:
          - img [ref=e60]
          - generic [ref=e62]: Santiago, Chile
          - generic [ref=e63]: Próximamente
        - generic [ref=e64]:
          - img [ref=e66]
          - generic [ref=e68]: São Paulo, Brasil
          - generic [ref=e69]: Próximamente
        - generic [ref=e70]:
          - img [ref=e72]
          - generic [ref=e74]: Montevideo, Uruguay
          - generic [ref=e75]: Próximamente
  - main [ref=e77]:
    - generic [ref=e78]:
      - generic [ref=e79]:
        - heading "Curado por Theaveling" [level=2] [ref=e80]
        - img [ref=e81]
      - generic [ref=e83]:
        - 'link "Agregar a favoritos Dramaturgias Nómadas: Muestra Estival Hibridación de las artes escénicas europeas en un entorno industrial recuperado de la periferia urbana." [ref=e84] [cursor=pointer]':
          - /url: /experiencia/dramaturgias-nomadas
          - generic [ref=e85]:
            - button "Agregar a favoritos" [ref=e88]:
              - img [ref=e89]
            - generic [ref=e91]:
              - 'heading "Dramaturgias Nómadas: Muestra Estival" [level=2] [ref=e92]':
                - generic [ref=e93]:
                  - text: "Dramaturgias Nómadas:"
                  - text: Muestra Estival
              - paragraph [ref=e94]: Hibridación de las artes escénicas europeas en un entorno industrial recuperado de la periferia urbana.
        - link "Agregar a favoritos La consagración del otoño Una reinterpretación visceral y minimalista de la consagración primaveral a través de técnicas de danza butoh y expresión contemporánea." [ref=e95] [cursor=pointer]:
          - /url: /experiencia/la-consagracion-del-otono
          - generic [ref=e96]:
            - button "Agregar a favoritos" [ref=e99]:
              - img [ref=e100]
            - generic [ref=e102]:
              - heading "La consagración del otoño" [level=2] [ref=e103]
              - paragraph [ref=e104]: Una reinterpretación visceral y minimalista de la consagración primaveral a través de técnicas de danza butoh y expresión contemporánea.
        - 'link "Agregar a favoritos Comité del Fracaso: Ensayo Abierto Un ensayo escénico poco frecuente en el circuito local: cruza clown físico con dramaturgia de creación colectiva, sin texto previo — se construye enteramente en sala durante meses de work-in-progress. Theaveling la eligió por el riesgo formal, no por el nombre del elenco." [ref=e105] [cursor=pointer]':
          - /url: /experiencia/comite-del-fracaso
          - generic [ref=e106]:
            - button "Agregar a favoritos" [ref=e109]:
              - img [ref=e110]
            - generic [ref=e112]:
              - 'heading "Comité del Fracaso: Ensayo Abierto" [level=2] [ref=e113]':
                - generic [ref=e114]:
                  - text: "Comité del Fracaso:"
                  - text: Ensayo Abierto
              - paragraph [ref=e115]: "Un ensayo escénico poco frecuente en el circuito local: cruza clown físico con dramaturgia de creación colectiva, sin texto previo — se construye enteramente en sala durante meses de work-in-progress. Theaveling la eligió por el riesgo formal, no por el nombre del elenco."
      - button "+10 Más Curados" [ref=e116]:
        - generic [ref=e117]: "+10"
        - generic [ref=e118]: Más Curados
    - generic [ref=e119]:
      - generic [ref=e120]:
        - heading "Más reservados" [level=2] [ref=e121]
        - img [ref=e122]
      - generic [ref=e124]:
        - 'link "Agregar a favoritos Teatro de máscaras Sesión Subterránea: Ritual de Máscaras Un ritual escénico sin palabras: actores con máscaras talladas a mano cuentan la historia solo con el cuerpo y el gesto, en un búnker reconvertido. Sólo 40 espectadores por función, sentados a centímetros del escenario, sin cuarta pared. Búnker 43, Bogotá ★ 8.8 $95.000 COP" [ref=e125] [cursor=pointer]':
          - /url: /experiencia/sesion-subterranea
          - generic [ref=e126]:
            - button "Agregar a favoritos" [ref=e128]:
              - img [ref=e129]
            - generic [ref=e131]:
              - generic [ref=e132]: Teatro de máscaras
              - 'heading "Sesión Subterránea: Ritual de Máscaras" [level=3] [ref=e133]'
              - paragraph [ref=e134]: "Un ritual escénico sin palabras: actores con máscaras talladas a mano cuentan la historia solo con el cuerpo y el gesto, en un búnker reconvertido. Sólo 40 espectadores por función, sentados a centímetros del escenario, sin cuarta pared."
              - paragraph [ref=e135]: Búnker 43, Bogotá
            - generic [ref=e136]:
              - generic [ref=e137]: ★ 8.8
              - generic [ref=e138]: $95.000 COP
        - 'link "Agregar a favoritos Farsa surrealista Las Tetas de Tiresias: Lectura Feminista La obra que le dio nombre al surrealismo — Apollinaire, 1917 — sobre una mujer que cambia de sexo para escapar del mandato doméstico y termina gobernando entre hombres. Esta versión traslada el escándalo original a una lectura explícitamente feminista contemporánea, sin perder el tono de farsa absurda del texto. Teatro Mayor Julio Mario Santo Domingo, Bogotá ★ 9.2 Desde $55.000 COP" [ref=e139] [cursor=pointer]':
          - /url: /experiencia/las-tetas-de-tiresias
          - generic [ref=e140]:
            - button "Agregar a favoritos" [ref=e142]:
              - img [ref=e143]
            - generic [ref=e145]:
              - generic [ref=e146]: Farsa surrealista
              - 'heading "Las Tetas de Tiresias: Lectura Feminista" [level=3] [ref=e147]'
              - paragraph [ref=e148]: La obra que le dio nombre al surrealismo — Apollinaire, 1917 — sobre una mujer que cambia de sexo para escapar del mandato doméstico y termina gobernando entre hombres. Esta versión traslada el escándalo original a una lectura explícitamente feminista contemporánea, sin perder el tono de farsa absurda del texto.
              - paragraph [ref=e149]: Teatro Mayor Julio Mario Santo Domingo, Bogotá
            - generic [ref=e150]:
              - generic [ref=e151]: ★ 9.2
              - generic [ref=e152]: Desde $55.000 COP
        - 'link "Agregar a favoritos Teatro inmersivo La casa de los silencios: Recorrido Inmersivo Un espacio escénico donde el silencio se convierte en protagonista. Teatro inmersivo que explora los límites de la percepción auditiva. Casa Cuarta Pared, Bogotá ★ 9.0 $38.000 COP" [ref=e153] [cursor=pointer]':
          - /url: /experiencia/la-casa-de-los-silencios
          - generic [ref=e154]:
            - button "Agregar a favoritos" [ref=e156]:
              - img [ref=e157]
            - generic [ref=e159]:
              - generic [ref=e160]: Teatro inmersivo
              - 'heading "La casa de los silencios: Recorrido Inmersivo" [level=3] [ref=e161]'
              - paragraph [ref=e162]: Un espacio escénico donde el silencio se convierte en protagonista. Teatro inmersivo que explora los límites de la percepción auditiva.
              - paragraph [ref=e163]: Casa Cuarta Pared, Bogotá
            - generic [ref=e164]:
              - generic [ref=e165]: ★ 9.0
              - generic [ref=e166]: $38.000 COP
        - 'link "Agregar a favoritos Performance íntima Cuerpos en tránsito: Función Íntima Antes de ser sala de teatro, Espacio Callejón funcionó como una imprenta clandestina en los años 70 — algunas de las prensas originales siguen expuestas en el vestíbulo. «Cuerpos en tránsito» dialoga directamente con ese pasado: un montaje sobre cuerpos que atraviesan espacios de resistencia. Espacio Callejón, Bogotá ★ 9.4 $40.000 COP" [ref=e167] [cursor=pointer]':
          - /url: /experiencia/cuerpos-en-transito
          - generic [ref=e168]:
            - button "Agregar a favoritos" [ref=e170]:
              - img [ref=e171]
            - generic [ref=e173]:
              - generic [ref=e174]: Performance íntima
              - 'heading "Cuerpos en tránsito: Función Íntima" [level=3] [ref=e175]'
              - paragraph [ref=e176]: "Antes de ser sala de teatro, Espacio Callejón funcionó como una imprenta clandestina en los años 70 — algunas de las prensas originales siguen expuestas en el vestíbulo. «Cuerpos en tránsito» dialoga directamente con ese pasado: un montaje sobre cuerpos que atraviesan espacios de resistencia."
              - paragraph [ref=e177]: Espacio Callejón, Bogotá
            - generic [ref=e178]:
              - generic [ref=e179]: ★ 9.4
              - generic [ref=e180]: $40.000 COP
        - 'link "Agregar a favoritos Cine documental Fronteras Difusas: Retrospectiva Analógica Ciclo de cine experimental en formato analógico que cuestiona los límites del relato de no-ficción y la materialidad del soporte fílmico. Cine Tonalá, Bogotá ★ 9.1 $25.000 COP" [ref=e181] [cursor=pointer]':
          - /url: /experiencia/fronteras-difusas
          - generic [ref=e182]:
            - button "Agregar a favoritos" [ref=e184]:
              - img [ref=e185]
            - generic [ref=e187]:
              - generic [ref=e188]: Cine documental
              - 'heading "Fronteras Difusas: Retrospectiva Analógica" [level=3] [ref=e189]'
              - paragraph [ref=e190]: Ciclo de cine experimental en formato analógico que cuestiona los límites del relato de no-ficción y la materialidad del soporte fílmico.
              - paragraph [ref=e191]: Cine Tonalá, Bogotá
            - generic [ref=e192]:
              - generic [ref=e193]: ★ 9.1
              - generic [ref=e194]: $25.000 COP
        - 'link "Agregar a favoritos Música experimental Trance: Ritual Sonoro Colectivo Un set en vivo de música electroacústica pensado como ritual colectivo: capas de sintetizadores modulares y percusión ancestral que se construyen en tiempo real, sin repetir nunca el mismo set dos veces. Auditorio Fragua, Bogotá ★ 9.0 $38.000 COP" [ref=e195] [cursor=pointer]':
          - /url: /experiencia/trance-ritual-sonoro
          - generic [ref=e196]:
            - button "Agregar a favoritos" [ref=e198]:
              - img [ref=e199]
            - generic [ref=e201]:
              - generic [ref=e202]: Música experimental
              - 'heading "Trance: Ritual Sonoro Colectivo" [level=3] [ref=e203]'
              - paragraph [ref=e204]: "Un set en vivo de música electroacústica pensado como ritual colectivo: capas de sintetizadores modulares y percusión ancestral que se construyen en tiempo real, sin repetir nunca el mismo set dos veces."
              - paragraph [ref=e205]: Auditorio Fragua, Bogotá
            - generic [ref=e206]:
              - generic [ref=e207]: ★ 9.0
              - generic [ref=e208]: $38.000 COP
        - 'link "Agregar a favoritos Tragedia contemporánea Antígona, Ahora: Tragedia Urbana Una relectura de Sófocles trasladada a un contexto urbano contemporáneo: la misma pregunta sobre la ley y la desobediencia, dicha con el lenguaje de hoy. Teatro Matacandelas, Bogotá ★ 9.2 $44.000 COP" [ref=e209] [cursor=pointer]':
          - /url: /experiencia/antigona-ahora
          - generic [ref=e210]:
            - button "Agregar a favoritos" [ref=e212]:
              - img [ref=e213]
            - generic [ref=e215]:
              - generic [ref=e216]: Tragedia contemporánea
              - 'heading "Antígona, Ahora: Tragedia Urbana" [level=3] [ref=e217]'
              - paragraph [ref=e218]: "Una relectura de Sófocles trasladada a un contexto urbano contemporáneo: la misma pregunta sobre la ley y la desobediencia, dicha con el lenguaje de hoy."
              - paragraph [ref=e219]: Teatro Matacandelas, Bogotá
            - generic [ref=e220]:
              - generic [ref=e221]: ★ 9.2
              - generic [ref=e222]: $44.000 COP
        - generic [ref=e225]:
          - generic [ref=e226]: "+15"
          - generic [ref=e227]: Ver más
    - generic [ref=e228]:
      - generic [ref=e229]:
        - heading "Descubrimientos" [level=2] [ref=e230]
        - img [ref=e231]
      - generic [ref=e233]:
        - 'link "Agregar a favoritos Musical A Chorus Line: Historias Reales de Bogotá Sala Seki Sano, Bogotá" [ref=e234] [cursor=pointer]':
          - /url: /experiencia/a-chorus-line
          - generic [ref=e235]:
            - button "Agregar a favoritos" [ref=e237]:
              - img [ref=e238]
            - generic [ref=e240]:
              - generic [ref=e241]: Musical
              - 'heading "A Chorus Line: Historias Reales de Bogotá" [level=3] [ref=e242]'
              - paragraph [ref=e243]: Sala Seki Sano, Bogotá
        - 'link "Agregar a favoritos Función unipersonal Uno a Uno: Función a Puerta Cerrada Cuarto 7, Bogotá" [ref=e244] [cursor=pointer]':
          - /url: /experiencia/uno-a-uno
          - generic [ref=e245]:
            - button "Agregar a favoritos" [ref=e247]:
              - img [ref=e248]
            - generic [ref=e250]:
              - generic [ref=e251]: Función unipersonal
              - 'heading "Uno a Uno: Función a Puerta Cerrada" [level=3] [ref=e252]'
              - paragraph [ref=e253]: Cuarto 7, Bogotá
        - link "Agregar a favoritos Laboratorio teatral Clase de improvisación del ritmo escénico Centro Danza Canal, Bogotá" [ref=e254] [cursor=pointer]:
          - /url: /experiencia/clase-improvisacion-ritmo
          - generic [ref=e255]:
            - button "Agregar a favoritos" [ref=e257]:
              - img [ref=e258]
            - generic [ref=e260]:
              - generic [ref=e261]: Laboratorio teatral
              - heading "Clase de improvisación del ritmo escénico" [level=3] [ref=e262]
              - paragraph [ref=e263]: Centro Danza Canal, Bogotá
        - 'link "Agregar a favoritos Cineclub Película: Archivo 22, Función Nocturna Cine Club El Muro, Bogotá" [ref=e264] [cursor=pointer]':
          - /url: /experiencia/pelicula-archivo-22
          - generic [ref=e265]:
            - button "Agregar a favoritos" [ref=e267]:
              - img [ref=e268]
            - generic [ref=e270]:
              - generic [ref=e271]: Cineclub
              - 'heading "Película: Archivo 22, Función Nocturna" [level=3] [ref=e272]'
              - paragraph [ref=e273]: Cine Club El Muro, Bogotá
        - 'link "Agregar a favoritos Lectura dramática Materia y memoria: Lectura Táctil del Tiempo La Casa Encendida, Bogotá" [ref=e274] [cursor=pointer]':
          - /url: /experiencia/materia-y-memoria
          - generic [ref=e275]:
            - button "Agregar a favoritos" [ref=e277]:
              - img [ref=e278]
            - generic [ref=e280]:
              - generic [ref=e281]: Lectura dramática
              - 'heading "Materia y memoria: Lectura Táctil del Tiempo" [level=3] [ref=e282]'
              - paragraph [ref=e283]: La Casa Encendida, Bogotá
        - 'link "Agregar a favoritos Cine local Noche de Cortos: Ciudad Invisible a 5 Km Cinemateca del Parque, Bogotá" [ref=e284] [cursor=pointer]':
          - /url: /experiencia/noche-de-cortos-ciudad-invisible
          - generic [ref=e285]:
            - button "Agregar a favoritos" [ref=e287]:
              - img [ref=e288]
            - generic [ref=e290]:
              - generic [ref=e291]: Cine local
              - 'heading "Noche de Cortos: Ciudad Invisible a 5 Km" [level=3] [ref=e292]'
              - paragraph [ref=e293]: Cinemateca del Parque, Bogotá
        - 'link "Agregar a favoritos Charla Charla: Cuando el Lenguaje No Alcanza Teatro Ditirambo, Bogotá" [ref=e294] [cursor=pointer]':
          - /url: /experiencia/charla-dramaturgias-del-cuerpo
          - generic [ref=e295]:
            - button "Agregar a favoritos" [ref=e297]:
              - img [ref=e298]
            - generic [ref=e300]:
              - generic [ref=e301]: Charla
              - 'heading "Charla: Cuando el Lenguaje No Alcanza" [level=3] [ref=e302]'
              - paragraph [ref=e303]: Teatro Ditirambo, Bogotá
        - generic [ref=e306]:
          - generic [ref=e307]: "+40"
          - generic [ref=e308]: Ver más
  - navigation [ref=e310]:
    - link "Descubrir" [ref=e311] [cursor=pointer]:
      - /url: /
      - img [ref=e312]
      - generic [ref=e315]: Descubrir
    - link "Reservas" [ref=e317] [cursor=pointer]:
      - /url: /reservas
      - img [ref=e318]
      - generic [ref=e322]: Reservas
    - link "Perfil" [ref=e323] [cursor=pointer]:
      - /url: /perfil
      - img [ref=e324]
      - generic [ref=e327]: Perfil
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
  31 |     await expect(ubicacionTexto).toBeVisible({ timeout: 5000 });
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
> 65 |     await expect(errorTexto).toBeVisible({ timeout: 5000 });
     |                              ^ Error: expect(locator).toBeVisible() failed
  66 |   });
  67 | });
  68 | 
```