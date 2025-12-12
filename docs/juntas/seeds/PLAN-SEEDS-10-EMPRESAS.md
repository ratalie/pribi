# 📋 Plan: Seeds de 10 Empresas con Sistemas de Acciones Alternados

## 🎯 Objetivo

Crear 10 empresas de prueba con:
- **Sistema Clásico** (5 empresas): Comunes (con voto) + Preferentes (sin voto)
- **Sistema de Clases** (5 empresas): Clase A, B, D, etc. (cada una con/sin derecho a voto)

## 📊 Distribución

### Empresas con Sistema Clásico (0, 2, 4, 6, 8)
- **Acción Común**: Con derecho a voto
- **Acción Preferente**: Sin derecho a voto

### Empresas con Sistema de Clases (1, 3, 5, 7, 9)
- **Clase A**: Con derecho a voto
- **Clase B**: Con derecho a voto
- **Clase D**: Sin derecho a voto
- (Variar según empresa)

## 👥 Accionistas

- **Todas las personas**: Naturales y solteras
- **2 accionistas por empresa** (Juan y María)
- **Distribución de acciones variada** para probar diferentes escenarios

## 🔧 Configuración por Empresa

### Empresa 0: Sistema Clásico
- Común: 300 acciones (con voto)
- Preferente: 200 acciones (sin voto)
- Total: 500 acciones
- Juan: 300 comunes (60% con voto)
- María: 200 preferentes (40% sin voto)

### Empresa 1: Sistema de Clases
- Clase A: 200 acciones (con voto)
- Clase B: 150 acciones (con voto)
- Clase D: 150 acciones (sin voto)
- Total: 500 acciones
- Juan: 200 Clase A + 100 Clase D (40% con voto, 20% sin voto)
- María: 150 Clase B + 50 Clase D (30% con voto, 10% sin voto)

### Empresa 2: Sistema Clásico
- Común: 400 acciones (con voto)
- Preferente: 100 acciones (sin voto)
- Total: 500 acciones
- Juan: 250 comunes (50% con voto)
- María: 150 comunes + 100 preferentes (30% con voto, 20% sin voto)

### Empresa 3: Sistema de Clases
- Clase A: 250 acciones (con voto)
- Clase B: 100 acciones (con voto)
- Clase C: 100 acciones (con voto)
- Clase D: 50 acciones (sin voto)
- Total: 500 acciones
- Juan: 250 Clase A (50% con voto)
- María: 100 Clase B + 100 Clase C + 50 Clase D (20% con voto, 20% con voto, 10% sin voto)

### Empresa 4: Sistema Clásico
- Común: 350 acciones (con voto)
- Preferente: 150 acciones (sin voto)
- Total: 500 acciones
- Juan: 200 comunes + 50 preferentes (40% con voto, 10% sin voto)
- María: 150 comunes + 100 preferentes (30% con voto, 20% sin voto)

### Empresa 5: Sistema de Clases
- Clase A: 300 acciones (con voto)
- Clase B: 100 acciones (con voto)
- Clase D: 100 acciones (sin voto)
- Total: 500 acciones
- Juan: 200 Clase A + 50 Clase D (40% con voto, 10% sin voto)
- María: 100 Clase A + 100 Clase B + 50 Clase D (20% con voto, 20% con voto, 10% sin voto)

### Empresa 6: Sistema Clásico
- Común: 450 acciones (con voto)
- Preferente: 50 acciones (sin voto)
- Total: 500 acciones
- Juan: 300 comunes (60% con voto)
- María: 150 comunes + 50 preferentes (30% con voto, 10% sin voto)

### Empresa 7: Sistema de Clases
- Clase A: 200 acciones (con voto)
- Clase B: 200 acciones (con voto)
- Clase C: 50 acciones (con voto)
- Clase D: 50 acciones (sin voto)
- Total: 500 acciones
- Juan: 200 Clase A (40% con voto)
- María: 200 Clase B + 50 Clase C + 50 Clase D (40% con voto, 10% con voto, 10% sin voto)

### Empresa 8: Sistema Clásico
- Común: 250 acciones (con voto)
- Preferente: 250 acciones (sin voto)
- Total: 500 acciones
- Juan: 150 comunes + 100 preferentes (30% con voto, 20% sin voto)
- María: 100 comunes + 150 preferentes (20% con voto, 30% sin voto)

### Empresa 9: Sistema de Clases
- Clase A: 150 acciones (con voto)
- Clase B: 150 acciones (con voto)
- Clase C: 100 acciones (con voto)
- Clase D: 100 acciones (sin voto)
- Total: 500 acciones
- Juan: 100 Clase A + 100 Clase B + 50 Clase D (20% con voto, 20% con voto, 10% sin voto)
- María: 50 Clase A + 50 Clase B + 100 Clase C + 50 Clase D (10% con voto, 10% con voto, 20% con voto, 10% sin voto)

## ✅ Checklist de Implementación

- [ ] Crear función helper para generar datos de empresa según índice
- [ ] Implementar lógica para alternar entre sistema clásico y de clases
- [ ] Crear acciones según el sistema (clásico o clases)
- [ ] Asignar acciones a accionistas según el plan
- [ ] Mantener personas naturales y solteras
- [ ] Mantener poderes/facultades como están
- [ ] Probar creación de las 10 empresas

