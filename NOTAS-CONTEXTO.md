# Contexto del proyecto Compresores

## Base del proyecto
- Proyecto original clonado desde `C:/tienda` hacia `C:/compresores`.
- Estructura principal:
  - `back`: backend Node/Mongo.
  - `panel`: panel administrador Vue.
  - `tienda`: aun no se rehace; primero se termina de ordenar el panel.
- El proyecto madre `C:/tienda` no se debe tocar.

## Objetivo funcional
- El panel administra contenido y catalogo tecnico para una futura web tipo Danair.
- No hay ecommerce ni ventas por ahora.
- No se usara Mercado Pago ni modulos de ventas/ingresos.
- El panel debe servir para cargar contenido y luego reflejarlo en la web publica.

## Decisiones ya tomadas
- Separacion entre:
  - `Marcas representativas`: contenido web institucional.
  - `Marcas de producto`: catalogo interno para llenar el select de marcas en productos.
- Categorias reflejan la estructura de Danair y se cargaron en base de datos.
- Productos se tratan como catalogo tecnico, no como ecommerce.
- Imagenes solo WebP y con validaciones de peso en los modulos relevantes.
- La ficha tecnica de productos se manejara con `URL` y/o `PDF`.
- No se usara tabla tecnica dinamica por categoria o marca, porque obligaria a tocar codigo cada vez que aparezca una ficha distinta.
- `Arriendo de Equipos` se resolvera como pagina de servicio + productos marcados con flag `arriendo`, no como subcatalogo manual dentro de servicios.

## Modulos del panel ya trabajados
- `Colaboradores`
  - filtro en vivo
  - paginacion a 5
  - reset de contrasena
  - roles Administrador / Inventariado
  - avatar WebP
  - validaciones visibles y correo valido
- `Proveedores`
  - interfaz unificada tipo lista + crear aparte
  - formulario compartido `ProveedorForm.vue`
  - validaciones visibles
  - telefono chileno en formato `+569...`
  - campos opcionales claramente marcados
- `Categorias`
  - lista + crear aparte
  - categorias y subcategorias cargadas
  - publicar/ocultar, eliminar, crear subcategoria
  - se decidio no tocar mas este modulo por ahora salvo necesidad real
- `Marcas representativas`
  - lista + crear aparte
  - edicion inline
  - eliminar con modal
  - orden persistente con subir/bajar
  - paginacion estilo colaboradores
  - extracto visualmente truncado en la tabla para no romper ancho
- `Marcas de producto`
  - lista + crear aparte
  - edicion inline
  - eliminar con modal
  - orden alfabetico
  - buscador en vivo
  - paginacion estilo colaboradores
- `Productos`
  - create/edit/index adaptados a catalogo tecnico
  - portada WebP
  - galeria separada
  - paginacion estilo colaboradores en index
  - formulario tecnico compartido `ProductoForm.vue`
  - ficha tecnica por URL y/o PDF
  - flag `Disponible para arriendo`
  - estado visible en listado
- `Servicios`
  - lista + crear aparte
  - formulario compartido `ServicioForm.vue`
  - sin CTA; quedaron solo campos utiles reales
  - SEO opcional
  - orden se maneja con subir/bajar en tabla, no con input numerico
  - paginacion de 3 por pagina

## Producto: modelo actual
Campos base actuales del producto:
- titulo
- categoria
- subcategoria
- marca
- serie
- modelo
- extracto
- descripcion
- ficha_tecnica
- ficha_pdf
- portada
- estado
- arriendo

Campos tecnicos soportados:
- tecnologia
- potencia
- presion
- caudal
- aplicacion
- industria
- orientacion
- material
- volumen
- pureza
- str_variedad

## Reglas actuales del formulario de producto
`ProductoForm.vue` ya fue adaptado para mostrar campos segun categoria.
Ejemplos:
- `Generadores de Nitrogeno`: tecnologia, pureza, caudal, presion.
- `Estanques / Acumuladores`: presion, orientacion, material, volumen, texto tecnico adicional.
- `Compresores`: tecnologia, potencia, presion, caudal.
- `Tratamiento Aire Comprimido`: campos tecnicos mas acotados.

Ademas:
- los campos no aplicables se limpian automaticamente
- se validan campos tecnicos relevantes segun categoria
- la ficha tecnica completa se resuelve con URL y/o PDF, no con formularios especiales por marca

## Flujo actual del producto
1. Crear producto con datos generales.
2. Subir portada WebP.
3. Opcionalmente definir:
   - `URL de ficha tecnica`
   - `PDF de ficha tecnica`
4. Cargar galeria si hace falta.
5. Si corresponde, marcar `Disponible para arriendo`.

## Como deberia verse despues en web publica
Producto:
- portada
- galeria
- extracto
- descripcion
- especificaciones generales
- boton `Ver ficha tecnica` si existe URL
- boton `Descargar ficha tecnica` si existe PDF
- bloque especial para arriendo si el producto esta marcado con `arriendo`

## Servicios cargables segun Danair
Servicios principales en modulo `Servicios`:
1. `Auditorias y Estudios`
2. `Redes de Aire Comprimido`
3. `Arriendo de Equipos`

Decision:
- `Servicio tecnico` no se mezcla ahi; ira en su modulo propio mas adelante.

## Categorias cargadas
Entre otras:
- Compresores de Tornillo Lubricados
- Compresores Oil-Free
- Compresores de Piston
- Tratamiento Aire Comprimido
- Estanques / Acumuladores
- Generadores de Nitrogeno
- Generadores de Oxigeno
- Turbo Compresores BOGE
- Monitoreo / Control
- Instrumentos de Medicion
- Repuestos, Insumos y Otros

## Marcas de producto sugeridas/cargables segun Danair
- BOGE
- SCR
- ANEST IWATA
- PARKER
- CS INSTRUMENTS
- INMATEC
- NITROSOURCE
- SCHULZ
- COMPAIR
- HERTZ

## Criterios visuales actuales del panel
- paginaciones unificadas al estilo de `Colaboradores`
- acciones CRUD en dropdown de 3 puntos cuando conviene
- `Acciones` como encabezado en tablas que tienen columna de acciones
- estados activos en verde, ocultos/desactivados en rojo
- botones `Cancelar` en vistas create/edit en rojo solido con texto blanco
- modales de confirmacion activos unificados con icono de advertencia y boton de cierre superior estilizado
- estructura visual base alineada al patron de `Colaboradores` en modulos activos
- titulo principal del modulo arriba y vista especifica en pestañas

## Perfil de usuario
- Existe vista `C:/compresores/panel/src/views/PerfilApp.vue`.
- Se accede desde dropdown del avatar en `TopNav.vue` y `Sidebar.vue`.
- Permite editar:
  - nombres
  - apellidos
  - email
  - avatar WebP
- `rol` queda solo lectura.
- Se mejoro visualmente con cabecera de perfil y avatar grande.
- Al guardar, actualiza nombre/avatar en header y sidebar sin recargar manualmente.

## Seguridad y backend relevantes
- `C:/compresores/back/controllers/usuarioController.js`
  - ahora un usuario normal solo puede ver/editar su propio perfil
  - administrador mantiene gestion completa de colaboradores
  - valida email duplicado al actualizar
  - rutas de avatar resueltas con paths absolutos
- `C:/compresores/back/routes/usuario.js`
  - uploads de usuarios con ruta absoluta
- uploads de ventas heredados ya fueron eliminados del proyecto (`facturas`, `ventas`, `comprobantes`, `pagos`, `mercadopago`)

## Proximo paso recomendado
- Revisar fino el modulo `Servicios` despues del cambio a subir/bajar por orden.
- Luego seguir con:
  - `Servicios tecnicos`
  - `Proyectos`
  - `Referencias`
- Despues recien avanzar con la web publica.
