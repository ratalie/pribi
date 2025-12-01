# 📦 DOCUMENTACIÓN COMPONENTES - REPOSITORIO PROBO
## Guía Detallada de Todos los Componentes

---

## 📋 ÍNDICE

1. [RepositoryLayout](#repositorylayout)
2. [RepositoryDashboard](#repositorydashboard)
3. [DocumentosSocietarios](#documentossocietarios)
4. [DocumentosGenerados](#documentosgenerados)
5. [CarpetasPersonalizadas](#carpetaspersonalizadas)
6. [CarpetaDetailView](#carpetadetailview)
7. [GlobalSearchBar](#globalsearchbar)
8. [PreviewModal](#previewmodal)

---

## 1. RepositoryLayout

### 📄 Archivo
`/components/repository/RepositoryLayout.tsx`

### 🎯 Propósito
Layout maestro del módulo Repositorio. Contiene el sidebar de navegación y el área de contenido principal.

### 📐 Estructura HTML
```tsx
<div className="flex h-screen" style={{ backgroundColor: '#F9FAFB' }}>
  {/* Sidebar */}
  <aside className="w-[280px] bg-white border-r flex flex-col">
    {/* Header con logo */}
    {/* Navegación */}
    {/* Footer con usuario */}
  </aside>

  {/* Main Content */}
  <main className="flex-1 overflow-hidden">
    {/* Vista actual */}
  </main>
</div>
```

### 🎨 Estilos del Sidebar

#### Contenedor Aside
```css
width: 280px;              /* Ancho fijo */
background-color: white;
border-right: 1px solid var(--border-light);
display: flex;
flex-direction: column;
```

#### Header (Logo)
```tsx
<div className="p-6 border-b" style={{ borderColor: 'var(--border-light)' }}>
  <div className="flex items-center gap-3">
    <div 
      className="p-2 rounded-lg"
      style={{ backgroundColor: '#EEF2FF' }}
    >
      <Database className="w-8 h-8" style={{ color: '#3C28A4' }} />
    </div>
    <div>
      <h1 
        className="text-xl"
        style={{ 
          fontFamily: 'var(--font-primary)',
          fontWeight: 600,
          color: 'var(--text-primary)'
        }}
      >
        Repositorio
      </h1>
      <p 
        className="text-sm"
        style={{ 
          fontFamily: 'var(--font-secondary)',
          color: 'var(--text-muted)'
        }}
      >
        Gestión documental
      </p>
    </div>
  </div>
</div>
```

#### Navegación (Tabs)
```tsx
<nav className="flex-1 p-4">
  {tabs.map(tab => (
    <button
      key={tab.id}
      onClick={() => handleNavigate(tab.id)}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl
        transition-all mb-2
        ${currentView === tab.id 
          ? 'bg-[#EEF2FF] shadow-sm' 
          : 'hover:bg-gray-50'
        }
      `}
    >
      <Icon 
        className="w-5 h-5" 
        style={{ 
          color: currentView === tab.id 
            ? '#3C28A4' 
            : '#6B7280'
        }} 
      />
      <span
        className="text-sm"
        style={{
          fontFamily: 'var(--font-secondary)',
          fontWeight: currentView === tab.id ? 600 : 400,
          color: currentView === tab.id 
            ? '#3C28A4' 
            : 'var(--text-primary)'
        }}
      >
        {tab.label}
      </span>
    </button>
  ))}
</nav>
```

**Estilos de Tab Activo:**
- Background: `#EEF2FF` (morado claro)
- Shadow: `shadow-sm`
- Icono color: `#3C28A4` (morado PROBO)
- Text color: `#3C28A4`
- Font weight: `600`

**Estilos de Tab Inactivo:**
- Background: `transparent`
- Hover: `bg-gray-50`
- Icono color: `#6B7280` (gris)
- Text color: `var(--text-primary)`
- Font weight: `400`

#### Footer (Usuario)
```tsx
<div 
  className="p-4 border-t"
  style={{ borderColor: 'var(--border-light)' }}
>
  <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
    <div 
      className="w-10 h-10 rounded-full flex items-center justify-center"
      style={{ backgroundColor: '#3C28A4' }}
    >
      <span 
        className="text-sm"
        style={{ 
          color: 'white',
          fontFamily: 'var(--font-primary)',
          fontWeight: 600
        }}
      >
        TA
      </span>
    </div>
    <div className="flex-1 min-w-0">
      <p 
        className="text-sm truncate"
        style={{ 
          fontFamily: 'var(--font-secondary)',
          fontWeight: 500,
          color: 'var(--text-primary)'
        }}
      >
        Thomas Anree
      </p>
      <p 
        className="text-xs truncate"
        style={{ 
          fontFamily: 'var(--font-secondary)',
          color: 'var(--text-muted)'
        }}
      >
        Admin
      </p>
    </div>
  </div>
</div>
```

### 🔧 Props y Estado

#### Estado Interno
```typescript
const [currentView, setCurrentView] = useState<RepositoryView>('dashboard');
const [selectedCarpetaId, setSelectedCarpetaId] = useState<string | null>(null);
const [searchQuery, setSearchQuery] = useState('');
```

#### Funciones
```typescript
function handleNavigate(view: RepositoryView, carpetaId?: string) {
  setCurrentView(view);
  if (carpetaId) {
    setSelectedCarpetaId(carpetaId);
  } else {
    setSelectedCarpetaId(null);
  }
}

function handleSearchChange(query: string) {
  setSearchQuery(query);
}
```

### 📦 Renderizado Condicional
```typescript
{currentView === 'dashboard' && (
  <RepositoryDashboard 
    onNavigate={handleNavigate}
    searchQuery={searchQuery}
    onSearchChange={handleSearchChange}
  />
)}

{currentView === 'societarios' && (
  <DocumentosSocietarios 
    searchQuery={searchQuery}
    onSearchChange={handleSearchChange}
  />
)}

{currentView === 'generados' && (
  <DocumentosGenerados 
    searchQuery={searchQuery}
    onSearchChange={handleSearchChange}
  />
)}

{currentView === 'personalizadas' && (
  <CarpetasPersonalizadas 
    onNavigate={handleNavigate}
    searchQuery={searchQuery}
    onSearchChange={handleSearchChange}
  />
)}

{currentView === 'carpeta-detail' && selectedCarpetaId && (
  <CarpetaDetailView 
    carpetaId={selectedCarpetaId}
    onBack={() => handleNavigate('personalizadas')}
  />
)}
```

---

## 2. RepositoryDashboard

### 📄 Archivo
`/components/repository/RepositoryDashboard.tsx`

### 🎯 Propósito
Vista principal del Dashboard con resumen, métricas y gráficos.

### 🔧 Props
```typescript
interface RepositoryDashboardProps {
  onNavigate: (view: RepositoryView) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}
```

### 📐 Estructura Completa

#### Contenedor Principal
```tsx
<div className="h-full overflow-y-auto" style={{ backgroundColor: 'var(--bg-muted)' }}>
  <div className="max-w-[1600px] mx-auto px-8 py-6">
    {/* Contenido */}
  </div>
</div>
```

#### SECCIÓN 1: Selector de Sociedad
```tsx
<div className="mb-6">
  <div className="flex items-center justify-between">
    <div>
      <p 
        className="text-sm mb-2"
        style={{ 
          color: 'var(--text-muted)', 
          fontFamily: 'var(--font-secondary)'
        }}
      >
        Gestionando repositorio de
      </p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border hover:shadow-md transition-all group"
            style={{ borderColor: 'var(--border-light)' }}
          >
            {/* Icono Building2 con fondo morado */}
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: '#EEF2FF' }}
            >
              <Building2 
                className="w-6 h-6" 
                style={{ color: 'var(--primary-700)' }} 
              />
            </div>
            
            {/* Info de sociedad */}
            <div className="text-left">
              <p 
                className="text-lg"
                style={{ 
                  color: 'var(--text-primary)', 
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 600
                }}
              >
                {selectedSociedad.nombre}
              </p>
              <p 
                className="text-sm"
                style={{ 
                  color: 'var(--text-muted)', 
                  fontFamily: 'var(--font-secondary)'
                }}
              >
                RUT: {selectedSociedad.rut} • {selectedSociedad.tipo}
              </p>
            </div>
            
            {/* Chevron */}
            <ChevronDown 
              className="w-5 h-5 ml-2 group-hover:translate-y-0.5 transition-transform" 
              style={{ color: 'var(--text-muted)' }}
            />
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="start" 
          className="w-[400px]"
          style={{ 
            fontFamily: 'var(--font-secondary)',
            backgroundColor: 'white',
            border: '1px solid var(--border-light)',
            borderRadius: '12px',
            padding: '8px'
          }}
        >
          {/* Header */}
          <div className="px-3 py-2 mb-2">
            <p 
              className="text-xs"
              style={{ 
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-secondary)'
              }}
            >
              Seleccionar sociedad
            </p>
          </div>
          
          {/* Sociedades Activas */}
          {sociedades
            .filter(s => s.activa)
            .map((sociedad) => (
              <DropdownMenuItem
                key={sociedad.id}
                onClick={() => setSelectedSociedad(sociedad)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {/* Icono */}
                <div 
                  className="p-2 rounded-lg flex-shrink-0"
                  style={{ 
                    backgroundColor: selectedSociedad.id === sociedad.id 
                      ? '#EEF2FF' 
                      : '#F9FAFB'
                  }}
                >
                  <Building2 
                    className="w-5 h-5" 
                    style={{ 
                      color: selectedSociedad.id === sociedad.id 
                        ? 'var(--primary-700)' 
                        : 'var(--text-muted)'
                    }} 
                  />
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p 
                    className="text-sm truncate"
                    style={{ 
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-secondary)',
                      fontWeight: selectedSociedad.id === sociedad.id ? 600 : 400
                    }}
                  >
                    {sociedad.nombre}
                  </p>
                  <p 
                    className="text-xs"
                    style={{ 
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-secondary)'
                    }}
                  >
                    RUT: {sociedad.rut} • {sociedad.tipo}
                  </p>
                </div>
                
                {/* Check si está seleccionada */}
                {selectedSociedad.id === sociedad.id && (
                  <Check 
                    className="w-5 h-5 flex-shrink-0" 
                    style={{ color: 'var(--primary-700)' }}
                  />
                )}
              </DropdownMenuItem>
            ))}
          
          {/* Separator */}
          <DropdownMenuSeparator 
            style={{ 
              backgroundColor: 'var(--border-light)', 
              margin: '8px 0' 
            }} 
          />
          
          {/* Sociedades Inactivas */}
          {sociedades.some(s => !s.activa) && (
            <>
              <div className="px-3 py-2">
                <p 
                  className="text-xs"
                  style={{ 
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)'
                  }}
                >
                  Sociedades inactivas
                </p>
              </div>
              {sociedades
                .filter(s => !s.activa)
                .map((sociedad) => (
                  <DropdownMenuItem
                    key={sociedad.id}
                    onClick={() => setSelectedSociedad(sociedad)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors opacity-60"
                  >
                    {/* Mismo formato pero con opacity-60 */}
                  </DropdownMenuItem>
                ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</div>
```

**Medidas del Selector:**
- Button padding: `px-4 py-3` (16px horizontal, 12px vertical)
- Button border-radius: `rounded-xl` (12px)
- Icono container: `p-2` (8px padding)
- Icono size: `w-6 h-6` (24px)
- Dropdown width: `400px`
- Dropdown padding: `8px`
- Item padding: `px-3 py-3` (12px)

#### SECCIÓN 2: Buscador Global
```tsx
<div className="mb-6">
  <GlobalSearchBar
    value={searchQuery}
    onChange={onSearchChange}
    currentScope="dashboard"
    placeholder="Buscar en todo el repositorio..."
  />
</div>
```

#### SECCIÓN 3: Carpetas del Sistema
```tsx
<div className="mb-8">
  {/* Título de sección */}
  <h2 
    className="text-2xl mb-4"
    style={{ 
      color: 'var(--text-primary)', 
      fontFamily: 'var(--font-primary)',
      fontWeight: 600
    }}
  >
    Carpetas del Sistema
  </h2>
  
  {/* Grid de 2 cards */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Card: Documentos Societarios */}
    <div 
      className="bg-white rounded-xl p-6 border hover:shadow-lg transition-all cursor-pointer group"
      style={{ borderColor: 'var(--border-light)' }}
      onClick={() => onNavigate('societarios')}
    >
      {/* Header del card */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Icono */}
          <div 
            className="p-3 rounded-lg" 
            style={{ backgroundColor: '#EEF2FF' }}
          >
            <FileText 
              className="w-7 h-7" 
              style={{ color: 'var(--primary-700)' }} 
            />
          </div>
          
          {/* Info */}
          <div>
            <h3 
              className="text-xl mb-1"
              style={{ 
                color: 'var(--text-primary)', 
                fontFamily: 'var(--font-primary)',
                fontWeight: 600
              }}
            >
              Documentos Societarios
            </h3>
            <p 
              className="text-sm"
              style={{ 
                color: 'var(--text-muted)', 
                fontFamily: 'var(--font-secondary)'
              }}
            >
              Gestión tipo Google Drive
            </p>
          </div>
        </div>
        
        {/* Flecha (solo visible en hover) */}
        <ArrowRight 
          className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" 
          style={{ color: 'var(--primary-700)' }} 
        />
      </div>

      {/* Métricas - Grid de 3 */}
      <div className="grid grid-cols-3 gap-4">
        {/* Métrica 1: Total */}
        <div 
          className="p-3 rounded-lg" 
          style={{ backgroundColor: '#F9FAFB' }}
        >
          <p 
            className="text-xs mb-1" 
            style={{ 
              color: 'var(--text-muted)', 
              fontFamily: 'var(--font-secondary)' 
            }}
          >
            Total
          </p>
          <p 
            className="text-2xl" 
            style={{ 
              color: 'var(--text-primary)', 
              fontFamily: 'var(--font-primary)', 
              fontWeight: 600 
            }}
          >
            {repositoryStats.documentosSocietarios.totalDocuments}
          </p>
          <p 
            className="text-xs mt-1" 
            style={{ 
              color: 'var(--text-muted)', 
              fontFamily: 'var(--font-secondary)' 
            }}
          >
            documentos
          </p>
        </div>

        {/* Métrica 2: Carpetas */}
        <div 
          className="p-3 rounded-lg" 
          style={{ backgroundColor: '#F9FAFB' }}
        >
          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-secondary)' }}>
            Carpetas
          </p>
          <p className="text-2xl" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-primary)', fontWeight: 600 }}>
            3
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-secondary)' }}>
            organizadas
          </p>
        </div>

        {/* Métrica 3: Última modificación */}
        <div 
          className="p-3 rounded-lg" 
          style={{ backgroundColor: '#F9FAFB' }}
        >
          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-secondary)' }}>
            Última modificación
          </p>
          <p className="text-sm mt-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-secondary)', fontWeight: 500 }}>
            Hace 11 días
          </p>
        </div>
      </div>
    </div>

    {/* Card: Documentos Generados */}
    <div 
      className="bg-white rounded-xl p-6 border hover:shadow-lg transition-all cursor-pointer group"
      style={{ borderColor: 'var(--border-light)' }}
      onClick={() => onNavigate('generados')}
    >
      {/* Mismo formato pero con: */}
      {/* - Icono: Folder, color #3B82F6, background #DBEAFE */}
      {/* - Título: "Documentos Generados" */}
      {/* - Subtitle: "Estructura jerárquica fija" */}
      {/* - Métricas: Total, Juntas, Sociedades */}
    </div>
  </div>
</div>
```

**Medidas Cards del Sistema:**
- Card padding: `p-6` (24px)
- Card border-radius: `rounded-xl` (12px)
- Gap entre cards: `gap-6` (24px)
- Icono container: `p-3` (12px padding)
- Icono size: `w-7 h-7` (28px)
- Gap header: `gap-3` (12px)
- Métricas padding: `p-3` (12px)
- Métricas background: `#F9FAFB`
- Métricas border-radius: `rounded-lg` (8px)

#### SECCIÓN 4: Carpetas Personalizadas
```tsx
<div className="mb-8">
  <h2 
    className="text-2xl mb-4"
    style={{ 
      color: 'var(--text-primary)', 
      fontFamily: 'var(--font-primary)',
      fontWeight: 600
    }}
  >
    Carpetas Personalizadas
  </h2>

  {/* Card grande con gradiente */}
  <div 
    className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border hover:shadow-lg transition-all cursor-pointer group"
    style={{ borderColor: 'var(--border-light)' }}
    onClick={() => onNavigate('personalizadas')}
  >
    {/* Header */}
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-3">
        <div 
          className="p-3 rounded-lg" 
          style={{ backgroundColor: 'white' }}
        >
          <FolderOpen 
            className="w-7 h-7" 
            style={{ color: '#A855F7' }} 
          />
        </div>
        <div>
          <h3 
            className="text-xl mb-1"
            style={{ 
              color: 'var(--text-primary)', 
              fontFamily: 'var(--font-primary)',
              fontWeight: 600
            }}
          >
            Espacios de Trabajo Personalizados
          </h3>
          <p 
            className="text-sm"
            style={{ 
              color: 'var(--text-muted)', 
              fontFamily: 'var(--font-secondary)'
            }}
          >
            Organiza documentos, colabora con equipos y chatea con IA
          </p>
        </div>
      </div>
      <ArrowRight 
        className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" 
        style={{ color: '#A855F7' }} 
      />
    </div>

    {/* Resumen Estadístico - Grid de 4 */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Stat 1: Total Carpetas */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="p-2 rounded-lg" 
            style={{ backgroundColor: '#F3E8FF' }}
          >
            <FolderOpen 
              className="w-5 h-5" 
              style={{ color: '#A855F7' }} 
            />
          </div>
        </div>
        <p 
          className="text-2xl mb-1" 
          style={{ 
            color: 'var(--text-primary)', 
            fontFamily: 'var(--font-primary)', 
            fontWeight: 600 
          }}
        >
          {carpetasPersonalizadas.length}
        </p>
        <p 
          className="text-xs" 
          style={{ 
            color: 'var(--text-muted)', 
            fontFamily: 'var(--font-secondary)' 
          }}
        >
          Carpetas creadas
        </p>
      </div>

      {/* Stat 2: Total Enlaces */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="p-2 rounded-lg" 
            style={{ backgroundColor: '#DBEAFE' }}
          >
            <LinkIcon 
              className="w-5 h-5" 
              style={{ color: '#3B82F6' }} 
            />
          </div>
        </div>
        <p 
          className="text-2xl mb-1" 
          style={{ 
            color: 'var(--text-primary)', 
            fontFamily: 'var(--font-primary)', 
            fontWeight: 600 
          }}
        >
          {carpetasPersonalizadas.reduce((acc, c) => acc + c.enlaces.length, 0)}
        </p>
        <p 
          className="text-xs" 
          style={{ 
            color: 'var(--text-muted)', 
            fontFamily: 'var(--font-secondary)' 
          }}
        >
          Documentos enlazados
        </p>
      </div>

      {/* Stat 3: Chats IA */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="p-2 rounded-lg" 
            style={{ backgroundColor: '#FEF3C7' }}
          >
            <Eye 
              className="w-5 h-5" 
              style={{ color: '#F59E0B' }} 
            />
          </div>
        </div>
        <p 
          className="text-2xl mb-1" 
          style={{ 
            color: 'var(--text-primary)', 
            fontFamily: 'var(--font-primary)', 
            fontWeight: 600 
          }}
        >
          {carpetasPersonalizadas.length}
        </p>
        <p 
          className="text-xs" 
          style={{ 
            color: 'var(--text-muted)', 
            fontFamily: 'var(--font-secondary)' 
          }}
        >
          Chats IA disponibles
        </p>
      </div>

      {/* Stat 4: Usuarios con Acceso */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="p-2 rounded-lg" 
            style={{ backgroundColor: '#D1FAE5' }}
          >
            <Users 
              className="w-5 h-5" 
              style={{ color: '#10B981' }} 
            />
          </div>
        </div>
        <p 
          className="text-2xl mb-1" 
          style={{ 
            color: 'var(--text-primary)', 
            fontFamily: 'var(--font-primary)', 
            fontWeight: 600 
          }}
        >
          8
        </p>
        <p 
          className="text-xs" 
          style={{ 
            color: 'var(--text-muted)', 
            fontFamily: 'var(--font-secondary)' 
          }}
        >
          Usuarios con acceso
        </p>
      </div>
    </div>
  </div>
</div>
```

**Colores Stat Cards:**
1. Carpetas: `#F3E8FF` (purple) + `#A855F7`
2. Enlaces: `#DBEAFE` (blue) + `#3B82F6`
3. Chats IA: `#FEF3C7` (yellow) + `#F59E0B`
4. Usuarios: `#D1FAE5` (green) + `#10B981`

#### SECCIÓN 5: Estadísticas Generales
```tsx
<div className="mb-8">
  <h2 
    className="text-2xl mb-4"
    style={{ 
      color: 'var(--text-primary)', 
      fontFamily: 'var(--font-primary)',
      fontWeight: 600
    }}
  >
    Estadísticas Generales
  </h2>

  {/* Grid de 4 mini cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* Card 1: Total Documentos */}
    <div 
      className="bg-white rounded-xl p-6 border" 
      style={{ borderColor: 'var(--border-light)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div 
          className="p-3 rounded-lg" 
          style={{ backgroundColor: '#EEF2FF' }}
        >
          <FileText 
            className="w-6 h-6" 
            style={{ color: 'var(--primary-700)' }} 
          />
        </div>
        <div 
          className="flex items-center gap-1 text-sm" 
          style={{ color: '#10B981' }}
        >
          <TrendingUp className="w-4 h-4" />
          <span>+12%</span>
        </div>
      </div>
      <p 
        className="text-sm mb-1" 
        style={{ 
          color: 'var(--text-muted)', 
          fontFamily: 'var(--font-secondary)' 
        }}
      >
        Total Documentos
      </p>
      <p 
        className="text-3xl" 
        style={{ 
          color: 'var(--text-primary)', 
          fontFamily: 'var(--font-primary)', 
          fontWeight: 600 
        }}
      >
        {totalDocumentos}
      </p>
    </div>

    {/* Card 2: Total Carpetas */}
    <div 
      className="bg-white rounded-xl p-6 border" 
      style={{ borderColor: 'var(--border-light)' }}
    >
      {/* Icono: FolderOpen, #FEF3C7, #F59E0B */}
      {/* Badge: +3 (verde) */}
    </div>

    {/* Card 3: Espacio Ocupado */}
    <div 
      className="bg-white rounded-xl p-6 border" 
      style={{ borderColor: 'var(--border-light)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div 
          className="p-3 rounded-lg" 
          style={{ backgroundColor: '#DBEAFE' }}
        >
          <HardDrive 
            className="w-6 h-6" 
            style={{ color: '#3B82F6' }} 
          />
        </div>
        <div 
          className="text-sm" 
          style={{ color: 'var(--text-muted)' }}
        >
          {porcentajeEspacio.toFixed(0)}%
        </div>
      </div>
      <p 
        className="text-sm mb-1" 
        style={{ 
          color: 'var(--text-muted)', 
          fontFamily: 'var(--font-secondary)' 
        }}
      >
        Espacio Ocupado
      </p>
      <p 
        className="text-3xl" 
        style={{ 
          color: 'var(--text-primary)', 
          fontFamily: 'var(--font-primary)', 
          fontWeight: 600 
        }}
      >
        {espacioOcupado} GB
      </p>
      {/* Progress bar */}
      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
        <div 
          className="h-2 rounded-full transition-all" 
          style={{ 
            width: `${porcentajeEspacio}%`,
            backgroundColor: '#3B82F6'
          }}
        />
      </div>
    </div>

    {/* Card 4: Actividad Hoy */}
    <div 
      className="bg-white rounded-xl p-6 border" 
      style={{ borderColor: 'var(--border-light)' }}
    >
      {/* Icono: Users, #F3E8FF, #A855F7 */}
      {/* Valor: 48 acciones */}
    </div>
  </div>
</div>
```

#### SECCIÓN 6: Análisis y Gráficos
```tsx
<div className="mb-8">
  <h2 
    className="text-2xl mb-4"
    style={{ 
      color: 'var(--text-primary)', 
      fontFamily: 'var(--font-primary)',
      fontWeight: 600
    }}
  >
    Análisis y Gráficos
  </h2>

  {/* Row 1: 2 gráficos lado a lado */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
    {/* Gráfico 1: Documentos por Mes (BarChart) */}
    <div 
      className="bg-white rounded-xl p-6 border" 
      style={{ borderColor: 'var(--border-light)' }}
    >
      <h3 
        className="text-lg mb-4" 
        style={{ 
          color: 'var(--text-primary)', 
          fontFamily: 'var(--font-primary)', 
          fontWeight: 600 
        }}
      >
        Documentos por Mes
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={documentosPorMes}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="mes" 
            style={{ 
              fontSize: '12px', 
              fontFamily: 'var(--font-secondary)' 
            }}
            stroke="#9CA3AF"
          />
          <YAxis 
            style={{ 
              fontSize: '12px', 
              fontFamily: 'var(--font-secondary)' 
            }}
            stroke="#9CA3AF"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontFamily: 'var(--font-secondary)'
            }}
          />
          <Bar 
            dataKey="documentos" 
            fill="#3C28A4" 
            radius={[8, 8, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Gráfico 2: Documentos por Tipo (PieChart) */}
    <div 
      className="bg-white rounded-xl p-6 border" 
      style={{ borderColor: 'var(--border-light)' }}
    >
      <h3 
        className="text-lg mb-4" 
        style={{ 
          color: 'var(--text-primary)', 
          fontFamily: 'var(--font-primary)', 
          fontWeight: 600 
        }}
      >
        Documentos por Tipo
      </h3>
      <div className="flex items-center gap-6">
        {/* Pie chart */}
        <div className="flex-shrink-0">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={documentosPorTipo}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="valor"
              >
                {documentosPorTipo.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Leyenda */}
        <div className="flex-1 space-y-3">
          {documentosPorTipo.map((tipo, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: tipo.color }}
                />
                <span 
                  className="text-sm" 
                  style={{ fontFamily: 'var(--font-secondary)' }}
                >
                  {tipo.nombre}
                </span>
              </div>
              <span 
                className="text-sm" 
                style={{ 
                  color: 'var(--text-muted)', 
                  fontFamily: 'var(--font-secondary)' 
                }}
              >
                {tipo.valor}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>

  {/* Row 2: Gráfico de línea (full width) */}
  <div 
    className="bg-white rounded-xl p-6 border mb-6" 
    style={{ borderColor: 'var(--border-light)' }}
  >
    <h3 
      className="text-lg mb-4" 
      style={{ 
        color: 'var(--text-primary)', 
        fontFamily: 'var(--font-primary)', 
        fontWeight: 600 
      }}
    >
      Actividad Semanal
    </h3>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={actividadSemanal}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          dataKey="dia" 
          style={{ 
            fontSize: '12px', 
            fontFamily: 'var(--font-secondary)' 
          }}
          stroke="#9CA3AF"
        />
        <YAxis 
          style={{ 
            fontSize: '12px', 
            fontFamily: 'var(--font-secondary)' 
          }}
          stroke="#9CA3AF"
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            fontFamily: 'var(--font-secondary)'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="vistas" 
          stroke="#3C28A4" 
          strokeWidth={2}
          dot={{ fill: '#3C28A4', r: 4 }}
          name="Vistas"
        />
        <Line 
          type="monotone" 
          dataKey="descargas" 
          stroke="#10B981" 
          strokeWidth={2}
          dot={{ fill: '#10B981', r: 4 }}
          name="Descargas"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>

  {/* Row 3: 2 listas lado a lado */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Lista 1: Actividad Reciente */}
    <div 
      className="bg-white rounded-xl p-6 border" 
      style={{ borderColor: 'var(--border-light)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 
          className="text-lg" 
          style={{ 
            color: 'var(--text-primary)', 
            fontFamily: 'var(--font-primary)', 
            fontWeight: 600 
          }}
        >
          Actividad Reciente
        </h3>
        <Clock 
          className="w-5 h-5" 
          style={{ color: 'var(--text-muted)' }} 
        />
      </div>
      <div className="space-y-4">
        {actividadReciente.map((item) => (
          <div 
            key={item.id} 
            className="flex items-start gap-3 pb-3 border-b last:border-b-0" 
            style={{ borderColor: 'var(--border-light)' }}
          >
            <div 
              className="p-2 rounded-lg flex-shrink-0" 
              style={{ backgroundColor: '#F3F4F6' }}
            >
              <FileText 
                className="w-4 h-4" 
                style={{ color: 'var(--text-muted)' }} 
              />
            </div>
            <div className="flex-1 min-w-0">
              <p 
                className="text-sm" 
                style={{ 
                  color: 'var(--text-primary)', 
                  fontFamily: 'var(--font-secondary)', 
                  fontWeight: 500 
                }}
              >
                {item.accion}
              </p>
              <p 
                className="text-sm truncate" 
                style={{ 
                  color: 'var(--text-muted)', 
                  fontFamily: 'var(--font-secondary)' 
                }}
              >
                {item.nombre}
              </p>
              <p 
                className="text-xs mt-1" 
                style={{ 
                  color: 'var(--text-muted)', 
                  fontFamily: 'var(--font-secondary)' 
                }}
              >
                {item.usuario} • hace {item.tiempo}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Lista 2: Archivos Recientes */}
    <div 
      className="bg-white rounded-xl p-6 border" 
      style={{ borderColor: 'var(--border-light)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 
          className="text-lg" 
          style={{ 
            color: 'var(--text-primary)', 
            fontFamily: 'var(--font-primary)', 
            fontWeight: 600 
          }}
        >
          Archivos Recientes
        </h3>
        <button 
          onClick={() => onNavigate('societarios')}
          className="text-sm hover:underline"
          style={{ 
            color: 'var(--primary-700)', 
            fontFamily: 'var(--font-secondary)' 
          }}
        >
          Ver todos
        </button>
      </div>
      <div className="space-y-3">
        {archivosRecientes.map((archivo, index) => (
          <div 
            key={index} 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div 
              className="p-2 rounded-lg" 
              style={{ backgroundColor: '#FEE2E2' }}
            >
              <FileText 
                className="w-5 h-5" 
                style={{ color: '#DC2626' }} 
              />
            </div>
            <div className="flex-1 min-w-0">
              <p 
                className="text-sm truncate" 
                style={{ 
                  color: 'var(--text-primary)', 
                  fontFamily: 'var(--font-secondary)', 
                  fontWeight: 500 
                }}
              >
                {archivo.nombre}
              </p>
              <p 
                className="text-xs" 
                style={{ 
                  color: 'var(--text-muted)', 
                  fontFamily: 'var(--font-secondary)' 
                }}
              >
                {archivo.tamaño} • {archivo.fecha}
              </p>
            </div>
            <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <Download 
                className="w-4 h-4" 
                style={{ color: 'var(--text-muted)' }} 
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
```

### 📊 Datos de Gráficos
```typescript
// Documentos por mes
const documentosPorMes = [
  { mes: 'Jun', documentos: 12 },
  { mes: 'Jul', documentos: 18 },
  { mes: 'Ago', documentos: 24 },
  { mes: 'Sep', documentos: 32 },
  { mes: 'Oct', documentos: 28 },
  { mes: 'Nov', documentos: 23 }
];

// Documentos por tipo
const documentosPorTipo = [
  { nombre: 'Sociedades', valor: 45, color: '#3C28A4' },
  { nombre: 'Juntas', valor: 156, color: '#6366F1' },
  { nombre: 'Sucursales', valor: 28, color: '#8B5CF6' },
  { nombre: 'Directorio', valor: 89, color: '#A78BFA' },
];

// Actividad semanal
const actividadSemanal = [
  { dia: 'Lun', vistas: 45, descargas: 12 },
  { dia: 'Mar', vistas: 52, descargas: 18 },
  { dia: 'Mié', vistas: 38, descargas: 9 },
  { dia: 'Jue', vistas: 61, descargas: 24 },
  { dia: 'Vie', vistas: 48, descargas: 15 },
  { dia: 'Sáb', vistas: 12, descargas: 3 },
  { dia: 'Dom', vistas: 8, descargas: 2 },
];
```

---

## 3. DocumentosSocietarios

**⚠️ NOTA:** Este componente está documentado en detalle en los archivos siguientes ya que es extenso.

### Características Principales
- Vista estilo Google Drive
- Toggle Grid/List view
- Preview modal para documentos
- Acciones: Ver, Eliminar
- Búsqueda integrada
- Navegación por carpetas

Ver `DOCS_NUXT_INTERACTIONS.md` para detalles completos.

---

## 4. DocumentosGenerados

### Características Principales
- Estructura jerárquica fija (3 niveles)
- Carpetas expandibles/colapsables
- Iconos ChevronRight/ChevronDown
- No se pueden crear/eliminar carpetas
- Solo se pueden agregar documentos

Ver `DOCS_NUXT_INTERACTIONS.md` para detalles completos.

---

## 5. CarpetasPersonalizadas

### Características Principales
- Grid de cards de carpetas
- Métricas por carpeta (documentos, usuarios, última actividad)
- Click para ir a detalle
- Botón "Crear Nueva Carpeta"

Ver `DOCS_NUXT_INTERACTIONS.md` para detalles completos.

---

## 6. CarpetaDetailView

### Características Principales
- Header con nombre y descripción
- 3 tabs: Documentos Enlazados, Chat IA, Permisos
- Botón "Volver" para regresar a lista
- Chat IA funcional con mensajes

Ver `DOCS_NUXT_INTERACTIONS.md` para detalles completos.

---

## 7. GlobalSearchBar

### 📄 Archivo
`/components/repository/GlobalSearchBar.tsx`

### 🔧 Props
```typescript
interface GlobalSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  currentScope: 'dashboard' | 'societarios' | 'generados' | 'personalizadas';
  placeholder: string;
}
```

### 📐 Estructura
```tsx
<div className="relative">
  <Search 
    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" 
    style={{ color: 'var(--text-muted)' }}
  />
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border focus:outline-none focus:ring-2 transition-all"
    style={{ 
      borderColor: 'var(--border-light)',
      fontFamily: 'var(--font-secondary)'
    }}
  />
</div>
```

### 🎨 Estilos Focus
```css
focus:outline-none
focus:ring-2
focus:ring-color: #3C28A4 (morado PROBO)
```

---

## 8. PreviewModal

### 📄 Archivo
`/components/repository/PreviewModal.tsx`

### 🔧 Props
```typescript
interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    name: string;
    type: string;
    owner: string;
    dateModified: Date;
    size?: number;
  } | null;
}
```

### Características
- Modal overlay oscuro
- Contenido centrado
- Header con nombre y botón cerrar
- Preview simulado (placeholder)
- Footer con info del documento

Ver `DOCS_NUXT_INTERACTIONS.md` para detalles de implementación.

---

**Continúa en:** `DOCS_NUXT_STYLES.md` para estilos detallados

