# 📦 Scripts de Tests en package.json

## 🤔 ¿Qué son los Scripts de npm?

Los **scripts** en `package.json` son comandos que puedes ejecutar fácilmente con `npm run <nombre-script>`. 

### ¿Por qué usarlos?

✅ **Ventajas:**
- **Códigos más cortos**: En lugar de escribir `TEST_USE_MSW=false vitest run sociedad.repository.integration.test.ts`, escribes `npm run test:sociedades`
- **Consistencia**: Todos en el equipo usan los mismos comandos
- **Documentación**: Los scripts documentan qué comandos son importantes
- **Automatización**: Puedes encadenar scripts (ej: `npm run build && npm run test`)

### ¿Es correcto ejecutarlos desde package.json?

**¡SÍ!** Es la forma estándar y recomendada en Node.js/npm. Es como tener "atajos" para comandos largos.

---

## 📋 Scripts Disponibles

### Tests Generales

```bash
# Ejecutar todos los tests (con watch mode)
npm run test

# Ejecutar todos los tests una vez
npm run test:run

# Ejecutar tests en modo watch (se actualizan automáticamente)
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar tests de integración (backend real)
npm run test:integration

# Ejecutar tests con MSW (mocks)
npm run test:msw
```

### Tests Específicos de Registro de Sociedades

#### 1. `test:sociedades` - Solo el test principal de sociedades
```bash
npm run test:sociedades
```
**Qué hace:**
- Ejecuta solo `sociedad.repository.integration.test.ts`
- Prueba: crear, listar, eliminar sociedades
- **Tests:** ~3 tests

**Cuándo usarlo:**
- Cuando solo quieres probar la creación/gestión de sociedades
- Para verificar que el endpoint base funciona

---

#### 2. `test:registros` - Todos los pasos del registro (sin sociedad principal)
```bash
npm run test:registros
```
**Qué hace:**
- Ejecuta todos los tests de los **pasos** del registro:
  1. `datos-sociedad.repository.integration.test.ts` (Paso 1)
  2. `accionistas.repository.integration.test.ts` (Paso 2)
  3. `acciones.repository.integration.test.ts` (Paso 3)
  4. `asignacion-acciones.repository.integration.test.ts` (Paso 4)
  5. `quorum.repository.integration.test.ts` (Paso 5)
  6. `director.repository.integration.test.ts` (Paso 6)
  7. `apoderados.repository.integration.test.ts` (Paso 8)
- **Tests:** ~47 tests

**Cuándo usarlo:**
- Cuando quieres probar todos los pasos del flujo de registro
- Para verificar que todos los endpoints de los pasos funcionan
- **NO incluye** el test de crear/listar/eliminar sociedades

---

#### 3. `test:registros:all` - Todo (sociedades + pasos)
```bash
npm run test:registros:all
```
**Qué hace:**
- Ejecuta **TODO**: sociedad principal + todos los pasos
- **Tests:** ~50 tests

**Cuándo usarlo:**
- Cuando quieres probar **todo el flujo completo**
- Antes de hacer un commit importante
- Para verificar que todo el sistema funciona end-to-end

---

## 🎯 Resumen Visual

```
test:sociedades
└── sociedad.repository.integration.test.ts
    └── Crear, listar, eliminar sociedades

test:registros
├── datos-sociedad.repository.integration.test.ts (Paso 1)
├── accionistas.repository.integration.test.ts (Paso 2)
├── acciones.repository.integration.test.ts (Paso 3)
├── asignacion-acciones.repository.integration.test.ts (Paso 4)
├── quorum.repository.integration.test.ts (Paso 5)
├── director.repository.integration.test.ts (Paso 6)
└── apoderados.repository.integration.test.ts (Paso 8)

test:registros:all
├── sociedad.repository.integration.test.ts
└── [todos los pasos de arriba]
```

---

## 💡 Ejemplos de Uso

### Escenario 1: Solo quiero probar que puedo crear sociedades
```bash
npm run test:sociedades
```

### Escenario 2: Quiero probar todos los pasos del registro
```bash
npm run test:registros
```

### Escenario 3: Quiero probar TODO antes de hacer commit
```bash
npm run test:registros:all
```

### Escenario 4: Quiero probar un paso específico
```bash
# No hay script para esto, usa el comando directo:
TEST_USE_MSW=false npm run test -- --run acciones.repository.integration.test.ts
```

---

## 🔧 Cómo Funcionan los Scripts

Cuando escribes `npm run test:sociedades`, npm:

1. **Busca** en `package.json` el script `test:sociedades`
2. **Encuentra**: `"test:sociedades": "TEST_USE_MSW=false vitest run sociedad.repository.integration.test.ts"`
3. **Ejecuta** ese comando en la terminal
4. **Es equivalente a** escribir directamente:
   ```bash
   TEST_USE_MSW=false vitest run sociedad.repository.integration.test.ts
   ```

---

## 📝 Notas Importantes

### Variables de Entorno

Los scripts usan `TEST_USE_MSW=false` para indicar que queremos usar el **backend real**, no mocks.

### Orden de Ejecución

Los tests se ejecutan en el orden que los pones en el script. Si un test falla, los siguientes **siguen ejecutándose** (a menos que uses `--bail`).

### Tiempo de Ejecución

- `test:sociedades`: ~1-2 segundos
- `test:registros`: ~10-15 segundos
- `test:registros:all`: ~12-18 segundos

*(Depende de la velocidad del backend y la red)*

---

## 🚀 Próximos Pasos

Si quieres agregar más scripts, puedes:

1. Agregar scripts para pasos individuales:
   ```json
   "test:registros:datos-sociedad": "TEST_USE_MSW=false vitest run datos-sociedad.repository.integration.test.ts",
   "test:registros:accionistas": "TEST_USE_MSW=false vitest run accionistas.repository.integration.test.ts",
   ```

2. Agregar scripts con opciones:
   ```json
   "test:registros:verbose": "TEST_USE_MSW=false vitest run --reporter=verbose ..."
   ```

3. Agregar scripts para CI/CD:
   ```json
   "test:ci": "npm run test:registros:all -- --reporter=junit --outputFile=test-results.xml"
   ```

---

## 📚 Referencias

- [npm scripts documentation](https://docs.npmjs.com/cli/v9/using-npm/scripts)
- [Vitest CLI options](https://vitest.dev/guide/cli.html)
- Documentación de tests: `docs/testing/COMO-PROBAR-TESTS-INTEGRACION.md`

