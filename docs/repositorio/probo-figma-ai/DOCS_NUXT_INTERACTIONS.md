# 🖱️ DOCUMENTACIÓN INTERACCIONES - REPOSITORIO PROBO
## Guía Completa de Funcionalidades e Interacciones

---

## 📋 NAVEGACIÓN PRINCIPAL

### Sistema de Vistas
```typescript
type RepositoryView = 
  | 'dashboard'
  | 'societarios'
  | 'generados'
  | 'personalizadas'
  | 'carpeta-detail';
```

### Estado de Navegación
```typescript
const [currentView, setCurrentView] = useState<RepositoryView>('dashboard');
const [selectedCarpetaId, setSelectedCarpetaId] = useState<string | null>(null);
```

### Función handleNavigate
```typescript
function handleNavigate(view: RepositoryView, carpetaId?: string) {
  setCurrentView(view);
  if (carpetaId) {
    setSelectedCarpetaId(carpetaId);
  } else {
    setSelectedCarpetaId(null);
  }
}
```

### Flujos de Navegación

#### 1. Dashboard → Documentos Societarios
```typescript
// Click en card "Documentos Societarios"
onClick={() => onNavigate('societarios')}
```

#### 2. Dashboard → Documentos Generados
```typescript
// Click en card "Documentos Generados"
onClick={() => onNavigate('generados')}
```

#### 3. Dashboard → Carpetas Personalizadas
```typescript
// Click en card "Carpetas Personalizadas"
onClick={() => onNavigate('personalizadas')}
```

#### 4. Carpetas Personalizadas → Detalle
```typescript
// Click en una carpeta
onClick={() => onNavigate('carpeta-detail', carpeta.id)}
```

#### 5. Detalle → Volver a Lista
```typescript
// Click en botón "Volver"
onClick={() => onNavigate('personalizadas')}
```

#### 6. Tabs del Sidebar
```typescript
// Click en cualquier tab
onClick={() => handleNavigate(tab.id)}
// Cambia la vista directamente
```

---

## 🏢 SELECTOR DE SOCIEDAD

### Estado
```typescript
const [selectedSociedad, setSelectedSociedad] = useState<Sociedad>(sociedades[0]);
```

### Interacción

#### 1. Abrir Dropdown
```typescript
// Click en botón con la sociedad actual
<DropdownMenuTrigger>
  <button>...</button>
</DropdownMenuTrigger>
```

#### 2. Seleccionar Sociedad
```typescript
// Click en item del dropdown
onClick={() => setSelectedSociedad(sociedad)}
// El dropdown se cierra automáticamente
```

#### 3. Indicadores Visuales
```typescript
// Sociedad seleccionada:
- Fondo del icono: #EEF2FF (morado)
- Color del icono: var(--primary-700)
- Font weight: 600
- Check mark visible

// Sociedad no seleccionada:
- Fondo del icono: #F9FAFB (gris)
- Color del icono: var(--text-muted)
- Font weight: 400
- No check mark
```

#### 4. Sociedades Inactivas
```typescript
// Renderizado separado con:
- Opacity: 60%
- Sección separada con label "Sociedades inactivas"
```

### Efecto al Cambiar Sociedad
```typescript
// Al seleccionar una sociedad:
1. Se actualiza el estado selectedSociedad
2. El botón muestra la nueva sociedad
3. El dropdown se cierra
4. Los datos del dashboard reflejan la nueva sociedad (en producción)
```

---

## 🔍 BÚSQUEDA GLOBAL

### Estado
```typescript
const [searchQuery, setSearchQuery] = useState('');
```

### Interacción

#### 1. Escribir en el Input
```typescript
<input
  value={searchQuery}
  onChange={(e) => onSearchChange(e.target.value)}
/>
```

#### 2. Placeholder Dinámico
```typescript
const placeholders = {
  dashboard: "Buscar en todo el repositorio...",
  societarios: "Buscar en documentos societarios...",
  generados: "Buscar en documentos generados...",
  personalizadas: "Buscar en carpetas personalizadas..."
};
```

#### 3. Filtrado (Ejemplo para Societarios)
```typescript
const filteredDocuments = useMemo(() => {
  if (!searchQuery) return documentosSocietarios;
  
  return documentosSocietarios.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [searchQuery]);
```

#### 4. Visual Feedback
```typescript
// Focus en input:
- Border ring: 2px solid #3C28A4 (morado)
- Transición suave (150ms)
```

---

## 📄 DOCUMENTOS SOCIETARIOS

### Vista Principal

#### 1. Toggle Grid/List View
```typescript
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

// Botones
<button onClick={() => setViewMode('grid')}>
  <Grid className={viewMode === 'grid' ? 'text-primary' : 'text-muted'} />
</button>
<button onClick={() => setViewMode('list')}>
  <List className={viewMode === 'list' ? 'text-primary' : 'text-muted'} />
</button>
```

#### 2. Navegación por Carpetas
```typescript
const [currentFolder, setCurrentFolder] = useState<string | null>(null);

// Click en carpeta
const handleFolderClick = (folderId: string) => {
  setCurrentFolder(folderId);
};

// Breadcrumb para volver
const handleBackToRoot = () => {
  setCurrentFolder(null);
};
```

#### 3. Breadcrumb
```typescript
// Cuando estás en raíz:
<breadcrumb>
  <FolderOpen /> Documentos Societarios
</breadcrumb>

// Cuando estás en una carpeta:
<breadcrumb>
  <FolderOpen /> Documentos Societarios
  <ChevronRight />
  <button onClick={() => setCurrentFolder(null)}>Raíz</button>
  <ChevronRight />
  <span>{currentFolderName}</span>
</breadcrumb>
```

### Grid View

#### Estructura
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {documents.map(doc => (
    <div 
      className="bg-white rounded-xl p-4 border hover:shadow-md transition-all cursor-pointer"
      onClick={() => handleDocumentClick(doc)}
    >
      {/* Icono (Folder o FileText) */}
      {/* Nombre del documento */}
      {/* Metadata (owner, fecha, tamaño) */}
      {/* Botón de acciones (MoreVertical) */}
    </div>
  ))}
</div>
```

#### Interacciones
```typescript
// 1. Click en documento
const handleDocumentClick = (doc: Document) => {
  if (doc.type === 'folder') {
    setCurrentFolder(doc.id);
  } else {
    openPreviewModal(doc);
  }
};

// 2. Click en menú de opciones
const handleMenuClick = (e: React.MouseEvent, doc: Document) => {
  e.stopPropagation(); // Prevenir apertura de documento
  setSelectedDoc(doc);
  setMenuOpen(true);
};
```

### List View

#### Estructura
```tsx
<div className="bg-white rounded-xl border overflow-hidden">
  <table className="w-full">
    <thead>
      <tr className="bg-gray-50 border-b">
        <th>Nombre</th>
        <th>Propietario</th>
        <th>Última modificación</th>
        <th>Tamaño</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {documents.map(doc => (
        <tr 
          className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => handleDocumentClick(doc)}
        >
          {/* Celdas */}
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

### Acciones de Documentos

#### Menú de Opciones (Dropdown)
```typescript
// Items del menú:
const menuItems = [
  {
    icon: Eye,
    label: 'Vista previa',
    onClick: () => openPreviewModal(doc)
  },
  {
    icon: Download,
    label: 'Descargar',
    onClick: () => downloadDocument(doc)
  },
  {
    icon: Trash2,
    label: 'Eliminar',
    onClick: () => deleteDocument(doc),
    danger: true
  }
];
```

### Preview Modal

#### Estado
```typescript
const [previewModalOpen, setPreviewModalOpen] = useState(false);
const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
```

#### Abrir Modal
```typescript
const openPreviewModal = (doc: Document) => {
  setSelectedDocument(doc);
  setPreviewModalOpen(true);
};
```

#### Cerrar Modal
```typescript
const closePreviewModal = () => {
  setPreviewModalOpen(false);
  setSelectedDocument(null);
};
```

#### Estructura del Modal
```tsx
{previewModalOpen && (
  <div 
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    onClick={closePreviewModal}
  >
    <div 
      className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="p-6 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6" style={{ color: '#DC2626' }} />
          <div>
            <h3>{selectedDocument.name}</h3>
            <p className="text-sm text-muted">{formatSize(selectedDocument.size)}</p>
          </div>
        </div>
        <button onClick={closePreviewModal}>
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Body - Preview simulado */}
      <div className="p-6">
        <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: '#DC2626' }} />
            <p className="text-lg">Vista previa de documento</p>
            <p className="text-sm text-muted">{selectedDocument.name}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t bg-gray-50">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted">Propietario</p>
            <p>{selectedDocument.owner}</p>
          </div>
          <div>
            <p className="text-muted">Última modificación</p>
            <p>{formatDate(selectedDocument.dateModified)}</p>
          </div>
          <div>
            <p className="text-muted">Tamaño</p>
            <p>{formatSize(selectedDocument.size)}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
```

---

## 📂 DOCUMENTOS GENERADOS

### Estructura de 3 Niveles

```
Nivel 1: Categorías (Registros, Operaciones)
  └─ Nivel 2: Carpetas Principales (Sociedades, Juntas, etc.)
      └─ Nivel 3: Subcarpetas o Documentos
```

### Estado de Expansión
```typescript
const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
const [expandedCarpetas, setExpandedCarpetas] = useState<Set<string>>(new Set());
const [expandedSubcarpetas, setExpandedSubcarpetas] = useState<Set<string>>(new Set());
```

### Toggle de Expansión

#### Nivel 1 - Categoría
```typescript
const toggleCategoria = (categoriaId: string) => {
  setExpandedCategories(prev => {
    const next = new Set(prev);
    if (next.has(categoriaId)) {
      next.delete(categoriaId);
    } else {
      next.add(categoriaId);
    }
    return next;
  });
};
```

#### Nivel 2 - Carpeta Principal
```typescript
const toggleCarpeta = (carpetaId: string) => {
  setExpandedCarpetas(prev => {
    const next = new Set(prev);
    if (next.has(carpetaId)) {
      next.delete(carpetaId);
    } else {
      next.add(carpetaId);
    }
    return next;
  });
};
```

#### Nivel 3 - Subcarpeta
```typescript
const toggleSubcarpeta = (subcarpetaId: string) => {
  setExpandedSubcarpetas(prev => {
    const next = new Set(prev);
    if (next.has(subcarpetaId)) {
      next.delete(subcarpetaId);
    } else {
      next.add(subcarpetaId);
    }
    return next;
  });
};
```

### Renderizado de Item Expandible

```tsx
{/* Nivel 1 - Categoría */}
<div>
  <button 
    onClick={() => toggleCategoria(categoria.id)}
    className="flex items-center gap-2 w-full p-3 hover:bg-gray-50 transition-colors"
  >
    <ChevronRight 
      className={`w-5 h-5 transition-transform ${
        expandedCategories.has(categoria.id) ? 'rotate-90' : ''
      }`}
      style={{ color: 'var(--text-muted)' }}
    />
    <Folder className="w-5 h-5" style={{ color: '#3B82F6' }} />
    <span style={{ fontFamily: 'var(--font-secondary)', fontWeight: 500 }}>
      {categoria.nombre}
    </span>
  </button>

  {/* Contenido expandible */}
  {expandedCategories.has(categoria.id) && (
    <div className="ml-6 transition-all duration-200">
      {/* Nivel 2 - Carpetas */}
    </div>
  )}
</div>
```

### Caso Especial: Junta de Accionistas

Esta carpeta tiene estructura especial con `juntas` en vez de `subcarpetas`:

```tsx
{/* Nivel 2 - Junta de Accionistas */}
<div>
  <button onClick={() => toggleCarpeta('gen-juntas')}>
    <ChevronRight 
      className={`transition-transform ${
        expandedCarpetas.has('gen-juntas') ? 'rotate-90' : ''
      }`}
    />
    <Folder />
    <span>Junta de Accionistas</span>
  </button>

  {expandedCarpetas.has('gen-juntas') && (
    <div className="ml-6">
      {/* Nivel 3 - Juntas individuales */}
      {juntaAccionistas.juntas.map(junta => (
        <div key={junta.id}>
          <button onClick={() => toggleSubcarpeta(junta.id)}>
            <ChevronRight 
              className={`transition-transform ${
                expandedSubcarpetas.has(junta.id) ? 'rotate-90' : ''
              }`}
            />
            <Calendar className="w-4 h-4" style={{ color: '#F59E0B' }} />
            <span>{junta.nombre}</span>
          </button>

          {/* Nivel 4 - Documentos de la junta */}
          {expandedSubcarpetas.has(junta.id) && (
            <div className="ml-6">
              {junta.documentos.map(doc => (
                <div key={doc.id} className="flex items-center gap-2 p-2">
                  <FileText className="w-4 h-4" style={{ color: '#DC2626' }} />
                  <span>{doc.nombre}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )}
</div>
```

### Preview de Documentos
```typescript
// Click en documento
const handleDocumentoClick = (doc: DocumentoGeneradoItem) => {
  setSelectedDocument(doc);
  setPreviewModalOpen(true);
};
```

---

## 📁 CARPETAS PERSONALIZADAS

### Vista de Lista

#### Estructura Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {carpetasPersonalizadas.map(carpeta => (
    <div 
      key={carpeta.id}
      className="bg-white rounded-xl p-6 border hover:shadow-lg transition-all cursor-pointer"
      onClick={() => onNavigate('carpeta-detail', carpeta.id)}
    >
      {/* Header con icono */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-lg" style={{ backgroundColor: '#F3E8FF' }}>
          <FolderOpen className="w-7 h-7" style={{ color: '#A855F7' }} />
        </div>
        <div className="flex-1">
          <h3 style={{ 
            fontFamily: 'var(--font-primary)',
            fontWeight: 600,
            color: 'var(--text-primary)'
          }}>
            {carpeta.name}
          </h3>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
          <p className="text-xs text-muted">Documentos</p>
          <p className="text-2xl" style={{ fontFamily: 'var(--font-primary)', fontWeight: 600 }}>
            {carpeta.documentCount}
          </p>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
          <p className="text-xs text-muted">Última modificación</p>
          <p className="text-sm mt-2">{formatDate(carpeta.lastModified)}</p>
        </div>
      </div>
    </div>
  ))}
</div>
```

#### Botón Crear Nueva Carpeta
```tsx
<button
  onClick={() => setCreateModalOpen(true)}
  className="flex items-center gap-2 px-4 py-3 rounded-xl hover:shadow-md transition-all"
  style={{ 
    backgroundColor: 'var(--primary-700)',
    color: 'white',
    fontFamily: 'var(--font-secondary)',
    fontWeight: 500
  }}
>
  <Plus className="w-5 h-5" />
  <span>Nueva Carpeta</span>
</button>
```

---

## 🗂️ DETALLE DE CARPETA PERSONALIZADA

### Tabs
```typescript
const [activeTab, setActiveTab] = useState<'documentos' | 'chat' | 'permisos'>('documentos');

const tabs = [
  { id: 'documentos', label: 'Documentos Enlazados', icon: FileText },
  { id: 'chat', label: 'Chat IA', icon: MessageSquare },
  { id: 'permisos', label: 'Permisos', icon: Users }
];
```

### Estructura del Header
```tsx
<div className="bg-white border-b p-6">
  {/* Botón Volver */}
  <button 
    onClick={onBack}
    className="flex items-center gap-2 mb-4 text-sm hover:underline"
    style={{ color: 'var(--primary-700)' }}
  >
    <ArrowLeft className="w-4 h-4" />
    <span>Volver a Carpetas</span>
  </button>

  {/* Título y descripción */}
  <div className="flex items-start justify-between">
    <div className="flex items-center gap-4">
      <div className="p-4 rounded-xl" style={{ backgroundColor: '#F3E8FF' }}>
        <FolderOpen className="w-8 h-8" style={{ color: '#A855F7' }} />
      </div>
      <div>
        <h1 style={{ 
          fontFamily: 'var(--font-primary)',
          fontWeight: 600,
          fontSize: '28px'
        }}>
          {carpeta.name}
        </h1>
        <p style={{ 
          fontFamily: 'var(--font-secondary)',
          color: 'var(--text-muted)'
        }}>
          {carpeta.documentCount} documentos enlazados
        </p>
      </div>
    </div>

    {/* Acciones */}
    <div className="flex gap-2">
      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <Settings className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
      </button>
      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <Share2 className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
      </button>
    </div>
  </div>

  {/* Tabs */}
  <div className="flex gap-1 mt-6 border-b">
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`
          flex items-center gap-2 px-4 py-3 border-b-2 transition-all
          ${activeTab === tab.id 
            ? 'border-[#3C28A4]' 
            : 'border-transparent hover:bg-gray-50'
          }
        `}
      >
        <tab.icon 
          className="w-5 h-5" 
          style={{ 
            color: activeTab === tab.id ? '#3C28A4' : 'var(--text-muted)'
          }} 
        />
        <span style={{ 
          fontFamily: 'var(--font-secondary)',
          fontWeight: activeTab === tab.id ? 500 : 400,
          color: activeTab === tab.id ? '#3C28A4' : 'var(--text-muted)'
        }}>
          {tab.label}
        </span>
      </button>
    ))}
  </div>
</div>
```

### TAB 1: Documentos Enlazados

#### Lista de Enlaces
```tsx
<div className="space-y-3">
  {carpeta.enlaces.map(enlace => (
    <div 
      key={enlace.id}
      className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
    >
      {/* Icono según tipo */}
      <div className="p-2 rounded-lg" style={{ backgroundColor: '#FEE2E2' }}>
        <FileText className="w-5 h-5" style={{ color: '#DC2626' }} />
      </div>

      {/* Info del enlace */}
      <div className="flex-1 min-w-0">
        <p style={{ 
          fontFamily: 'var(--font-secondary)',
          fontWeight: 500,
          color: 'var(--text-primary)'
        }}>
          {enlace.nombre}
        </p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Origen: {enlace.origen}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Enlazado: {formatDate(enlace.fechaEnlace)}
        </p>
      </div>

      {/* Badge de tipo */}
      <div 
        className="px-3 py-1 rounded-full text-xs"
        style={{ 
          backgroundColor: enlace.tipo === 'societario' ? '#EEF2FF' : '#DBEAFE',
          color: enlace.tipo === 'societario' ? '#3C28A4' : '#3B82F6',
          fontFamily: 'var(--font-secondary)',
          fontWeight: 500
        }}
      >
        {enlace.tipo === 'societario' ? 'Societario' : 'Generado'}
      </div>

      {/* Acciones */}
      <button 
        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          handleRemoveEnlace(enlace.id);
        }}
      >
        <Trash2 className="w-4 h-4" style={{ color: '#DC2626' }} />
      </button>
    </div>
  ))}
</div>
```

#### Botón Agregar Enlace
```tsx
<button
  onClick={() => setAddEnlaceModalOpen(true)}
  className="flex items-center gap-2 px-4 py-3 rounded-xl border hover:bg-gray-50 transition-colors w-full justify-center"
  style={{ 
    borderColor: 'var(--border-light)',
    fontFamily: 'var(--font-secondary)',
    fontWeight: 500
  }}
>
  <Plus className="w-5 h-5" />
  <span>Agregar Documento</span>
</button>
```

### TAB 2: Chat IA

#### Estado del Chat
```typescript
const [messages, setMessages] = useState<ChatMessage[]>([
  {
    id: '1',
    role: 'assistant',
    content: '¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte con los documentos de esta carpeta?',
    timestamp: new Date()
  }
]);
const [inputMessage, setInputMessage] = useState('');
const [isTyping, setIsTyping] = useState(false);
```

#### Interfaz de Mensaje
```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
```

#### Enviar Mensaje
```typescript
const handleSendMessage = async () => {
  if (!inputMessage.trim()) return;

  // Agregar mensaje del usuario
  const userMessage: ChatMessage = {
    id: Date.now().toString(),
    role: 'user',
    content: inputMessage,
    timestamp: new Date()
  };
  setMessages(prev => [...prev, userMessage]);
  setInputMessage('');
  setIsTyping(true);

  // Simular respuesta (en producción sería API call)
  setTimeout(() => {
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'Esta es una respuesta simulada del asistente de IA.',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  }, 1500);
};
```

#### UI del Chat
```tsx
<div className="flex flex-col h-[600px]">
  {/* Área de mensajes */}
  <div className="flex-1 overflow-y-auto p-6 space-y-4">
    {messages.map(message => (
      <div 
        key={message.id}
        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`
            max-w-[70%] p-4 rounded-xl
            ${message.role === 'user'
              ? 'bg-[#3C28A4] text-white'
              : 'bg-gray-100 text-gray-900'
            }
          `}
          style={{ fontFamily: 'var(--font-secondary)' }}
        >
          <p>{message.content}</p>
          <p 
            className={`text-xs mt-2 ${
              message.role === 'user' ? 'text-purple-200' : 'text-gray-500'
            }`}
          >
            {formatDate(message.timestamp)}
          </p>
        </div>
      </div>
    ))}

    {/* Typing indicator */}
    {isTyping && (
      <div className="flex justify-start">
        <div className="bg-gray-100 p-4 rounded-xl">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    )}
  </div>

  {/* Input area */}
  <div className="p-4 border-t">
    <div className="flex gap-2">
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        placeholder="Escribe tu mensaje..."
        className="flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
        style={{ 
          borderColor: 'var(--border-light)',
          fontFamily: 'var(--font-secondary)'
        }}
      />
      <button
        onClick={handleSendMessage}
        disabled={!inputMessage.trim()}
        className="px-6 py-3 rounded-xl transition-all disabled:opacity-50"
        style={{ 
          backgroundColor: 'var(--primary-700)',
          color: 'white',
          fontFamily: 'var(--font-secondary)',
          fontWeight: 500
        }}
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  </div>
</div>
```

### TAB 3: Permisos

#### Lista de Usuarios con Acceso
```tsx
<div className="space-y-3">
  {usuariosConAcceso.map(usuario => (
    <div 
      key={usuario.id}
      className="flex items-center justify-between p-4 bg-white rounded-lg border"
    >
      {/* Avatar y nombre */}
      <div className="flex items-center gap-3">
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
            {usuario.iniciales}
          </span>
        </div>
        <div>
          <p style={{ 
            fontFamily: 'var(--font-secondary)',
            fontWeight: 500
          }}>
            {usuario.nombre}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {usuario.email}
          </p>
        </div>
      </div>

      {/* Rol/Permiso */}
      <div className="flex items-center gap-3">
        <select 
          value={usuario.rol}
          onChange={(e) => handleChangeRol(usuario.id, e.target.value)}
          className="px-3 py-2 rounded-lg border"
          style={{ 
            borderColor: 'var(--border-light)',
            fontFamily: 'var(--font-secondary)'
          }}
        >
          <option value="viewer">Lector</option>
          <option value="editor">Editor</option>
          <option value="admin">Administrador</option>
        </select>

        <button 
          onClick={() => handleRemoveUser(usuario.id)}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" style={{ color: '#DC2626' }} />
        </button>
      </div>
    </div>
  ))}
</div>
```

#### Botón Compartir
```tsx
<button
  onClick={() => setShareModalOpen(true)}
  className="flex items-center gap-2 px-4 py-3 rounded-xl hover:shadow-md transition-all"
  style={{ 
    backgroundColor: 'var(--primary-700)',
    color: 'white',
    fontFamily: 'var(--font-secondary)',
    fontWeight: 500
  }}
>
  <UserPlus className="w-5 h-5" />
  <span>Compartir Carpeta</span>
</button>
```

---

## ✅ CHECKLIST DE INTERACCIONES

Al implementar en Nuxt, verificar:

- [ ] Navegación entre vistas funciona
- [ ] Selector de sociedad funciona
- [ ] Búsqueda global filtra resultados
- [ ] Grid/List toggle funciona en Societarios
- [ ] Navegación por carpetas funciona
- [ ] Preview modal se abre y cierra
- [ ] Documentos Generados expanden/colapsan
- [ ] Chevrons rotan al expandir
- [ ] Estructura de Juntas funciona correctamente
- [ ] Cards de Carpetas Personalizadas son clickeables
- [ ] Navegación a detalle de carpeta funciona
- [ ] Tabs en detalle cambian contenido
- [ ] Chat IA envía y recibe mensajes
- [ ] Typing indicator funciona
- [ ] Lista de enlaces se muestra correctamente
- [ ] Permisos se pueden modificar
- [ ] Botón volver funciona
- [ ] Todas las animaciones funcionan
- [ ] Todos los hovers responden

---

**FIN DE LA DOCUMENTACIÓN COMPLETA** 🎉

Archivos creados:
1. ✅ DOCS_NUXT_REPOSITORY.md - Overview general
2. ✅ DOCS_NUXT_COMPONENTS.md - Componentes detallados
3. ✅ DOCS_NUXT_STYLES.md - Estilos y design system
4. ✅ DOCS_NUXT_ANIMATIONS.md - Animaciones y transiciones
5. ✅ DOCS_NUXT_DATA.md - Estructuras de datos
6. ✅ DOCS_NUXT_INTERACTIONS.md - Interacciones y funcionalidades

