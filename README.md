# Ferretería Litoral - Sistema de Gestión

Sistema completo de gestión empresarial para ferretería, desarrollado con HTML, CSS y JavaScript puro. Funciona completamente offline usando almacenamiento local del navegador.

## Características

### 📊 Dashboard
- Métricas en tiempo real (ventas, productos, gastos, ganancias)
- Gráficos de ventas por mes
- Alertas de productos con poco stock
- Resumen financiero

### 📦 Gestión de Inventario
- Registro completo de productos con SKU, precios y stock
- Categorización de productos
- Control de stock mínimo
- Búsqueda y filtrado avanzado
- Alertas automáticas de bajo stock

### 🛒 Gestión de Ventas
- Registro de ventas con múltiples productos
- Generación automática de números de factura
- Control de clientes
- Actualización automática de inventario
- Historial completo de ventas

### 💰 Control de Gastos
- Registro de gastos por categorías
- Seguimiento de recibos y facturas
- Reportes de gastos mensuales
- Control de flujo de efectivo

### 📈 Reportes y Análisis
- Reportes financieros detallados
- Análisis de productos más vendidos
- Reportes de inventario
- Exportación de datos

## Instalación

1. Descarga todos los archivos del proyecto
2. Abre `index.html` en tu navegador web
3. ¡Listo! La aplicación funciona completamente offline

## Archivos del Proyecto

```
ferreteria-litoral/
├── index.html          # Archivo principal de la aplicación
├── style.css          # Estilos y diseño
├── script.js          # Lógica principal de la aplicación
├── chart.js           # Sistema de gráficos personalizado
├── data.js            # Gestión de datos y ejemplos
└── README.md          # Este archivo
```

## Uso Básico

### Primer Inicio
1. Abre la aplicación en tu navegador
2. Haz clic en "Iniciar Sesión" en la pantalla de bienvenida
3. Serás dirigido al dashboard principal

### Cargar Datos de Ejemplo
Para probar la aplicación con datos de muestra:
1. Abre la consola del navegador (F12)
2. Ejecuta: `initializeSampleData()`
3. Los datos de ejemplo se cargarán automáticamente

### Gestión de Productos
1. Ve a la sección "Inventario"
2. Haz clic en "Agregar Producto"
3. Completa los campos requeridos
4. El producto se guardará automáticamente

### Registrar una Venta
1. Ve a la sección "Ventas"
2. Haz clic en "Nueva Venta"
3. Selecciona productos y cantidades
4. El stock se actualizará automáticamente

### Ver Reportes
1. Ve a la sección "Reportes"
2. Selecciona el período deseado
3. Los datos se actualizarán automáticamente

## Funciones Avanzadas

### Exportar/Importar Datos
```javascript
// Exportar todos los datos
exportData();

// Importar datos desde archivo
importData();

// Limpiar todos los datos
clearAllData();
```

### Generar Reportes
```javascript
// Reporte general
generateReport('general');

// Reporte de inventario
generateReport('inventory');

// Reporte de ventas
generateReport('sales');

// Reporte financiero
generateReport('financial');
```

### Personalización

#### Modificar Categorías
Las categorías por defecto se pueden modificar en `script.js`:
```javascript
this.categories = [
    { id: 1, name: 'Tu Categoría', description: 'Descripción' },
    // Agregar más categorías
];
```

#### Cambiar Colores
Los colores se pueden personalizar en `style.css`:
```css
:root {
    --primary-color: #2563eb;    /* Color principal */
    --success-color: #10b981;    /* Color de éxito */
    --warning-color: #f59e0b;    /* Color de advertencia */
    --danger-color: #ef4444;     /* Color de peligro */
}
```

## Almacenamiento de Datos

La aplicación utiliza `localStorage` del navegador para guardar:
- Productos y categorías
- Ventas y sus detalles
- Gastos registrados
- Configuraciones de usuario

Los datos persisten entre sesiones y sobreviven al cierre del navegador.

## Compatibilidad

### Navegadores Soportados
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

### Dispositivos
- Computadoras de escritorio
- Tablets
- Móviles (diseño responsivo)

## Seguridad

- Todos los datos se almacenan localmente
- No hay transmisión de datos a servidores externos
- Los datos están seguros mientras el navegador no se desinstale

## Backup y Recuperación

### Crear Respaldo
```javascript
exportData(); // Descarga archivo JSON con todos los datos
```

### Restaurar Respaldo
```javascript
importData(); // Selecciona archivo JSON para importar
```

### Respaldo Manual
Los datos también se pueden copiar manualmente desde:
- DevTools > Application > Local Storage

## Resolución de Problemas

### La aplicación no carga
1. Verifica que todos los archivos estén en la misma carpeta
2. Abre la consola del navegador para ver errores
3. Asegúrate de que JavaScript esté habilitado

### Los datos no se guardan
1. Verifica que el navegador permita localStorage
2. Libera espacio en el navegador si está lleno
3. Revisa que no estés en modo incógnito

### Rendimiento lento
1. Exporta los datos como respaldo
2. Ejecuta `clearAllData()` para limpiar
3. Importa solo los datos necesarios

## Desarrollo y Personalización

### Estructura del Código

#### script.js
- `DataManager`: Gestión de datos y localStorage
- `NotificationManager`: Sistema de notificaciones
- `FerreteriApp`: Lógica principal de la aplicación

#### chart.js
- `ChartManager`: Sistema de gráficos personalizado
- Soporta gráficos de barras, líneas y pastel
- Animaciones y efectos visuales

#### data.js
- `SampleDataManager`: Datos de ejemplo y utilidades
- Funciones de exportación/importación
- Generación de reportes

### Agregar Nuevas Funciones

Para agregar nuevas características:

1. **Nueva página**: Agrega HTML en `index.html` y CSS en `style.css`
2. **Nueva funcionalidad**: Extiende la clase `FerreteriApp` en `script.js`
3. **Nuevos datos**: Modifica `DataManager` para nuevos tipos de datos

### Contribuir

Para contribuir al proyecto:
1. Haz fork del repositorio
2. Crea una rama para tu función
3. Realiza cambios y pruebas
4. Envía un pull request

## Licencia

Este proyecto es de código abierto. Puedes usarlo, modificarlo y distribuirlo libremente para uso personal o comercial.

## Soporte

Para soporte técnico o preguntas:
- Revisa la documentación en este README
- Consulta los comentarios en el código
- Abre un issue en el repositorio

---

**Ferretería Litoral** - Sistema de Gestión Empresarial
Versión 1.0 - Desarrollado con HTML5, CSS3 y JavaScript ES6