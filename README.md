# TP Final - Distribuidora con TypeScript y Prisma

Brian Iván Hollweg - DNI 33.769.071
Yanina Elizabeth Ovejero

Programación Backend - IPAP

Es la API del TP anterior pero pasada a TypeScript y usando Prisma en vez de escribir el SQL a mano.

## Cómo levantarlo

```bash
npm install
cp .env.example .env
```

En el `.env` hay que poner el usuario y la clave de MySQL (`DATABASE_URL` lo usa Prisma y `DB_HOST`, `DB_USER`, etc. el pool de la aplicación).

Para crear la base importamos `database.sql` (con XAMPP desde phpMyAdmin o con `mysql -u root -p < database.sql`).
Después:

```bash
npx prisma migrate resolve --applied 20261021142438_inicial
npx prisma generate
npm run start:dev
```

Queda andando en http://localhost:3000

También se puede crear la base con `npm run db:migrate` y `npm run db:seed`.

## Carpetas

Igual que el proyecto que vimos en clase:

- `prisma/schema.prisma` los modelos de la base
- `src/routes` las rutas (`categoriasRoutes.ts`, ...)
- `src/controllers` validan y responden (`consultar`, `ingresar`, `consultarDetalle`, `actualizar`, `actualizarParcial`, `eliminar`)
- `src/models` las consultas con Prisma
- `src/config/prisma.ts` la conexión: un pool de `mariadb` que se le pasa a `PrismaMariaDb`
- `src/middleware/errores.ts` el manejo de errores

Usa `morgan` para ver las peticiones en la consola y `cors`.

## Cambios en la base

- el email del empleado y el nombre de la compañía de envío no se pueden repetir
- un producto no puede estar dos veces en el mismo pedido
- precio, stock y cantidad no pueden ser negativos (CHECK)
- cuando se hace un pedido se descuenta el stock

El diagrama está en `esquema_relacional.jpg`.

## Endpoints

Todos tienen GET, GET por id, POST, PUT, PATCH y DELETE, y `/estadisticas/resumen`.

- `/categorias`
- `/proveedores` (`?nombre=`, `/:id/productos`)
- `/productos` (`?categoria=`, `?proveedor=`, `?precioMin=`, `?precioMax=`, `?enStock=true`, `PATCH /ajuste-precios`)
- `/empleados` (`?cargo=`)
- `/clientes` (`?ciudad=`, `?busqueda=`, `/:id/pedidos`)
- `/companias-envio`
- `/pedidos` (`?estado=`, `?clienteId=`, `?empleadoId=`)
- `/informes/ventas` (`?desde=` y `?hasta=`) es el informe con SQL puro

Ejemplo de pedido:

```json
{
  "numero_factura": "FAC-B-0001-00000106",
  "id_cliente": 2,
  "id_empleado": 3,
  "id_compania_envio": 1,
  "items": [
    { "id_producto": 1, "cantidad": 5 },
    { "id_producto": 9, "cantidad": 10 }
  ]
}
```

## Errores

Si hay un error de la base no se muestra, se devuelve un mensaje en JSON con 400, 404 o 500.

## Pruebas

Están en `casos_de_prueba.json`. Hay que correrlas en orden con la base recién importada.

Las respuestas del punto 3 están en `RESPUESTAS.md`.

## Capa de validación (express-validator)

Igual que en la Unidad 4:

- `src/utils/<recurso>ValidationSchema.ts`: el esquema de cada recurso (`checkSchema`). El `...PatchValidationSchema` es el mismo esquema con los campos opcionales (`camposOpcionales.ts`), para el PATCH. Los largos máximos salen de los `VarChar` de `schema.prisma`.
- `src/middleware/validaDatos.ts`: si `validationResult` trae errores responde **400** con `{ errors: [...] }`.
- En las rutas: `router.post('/', checkSchema(clienteValidationSchema, ['body']), validaDatos, controlador)`.
- Los controladores siguen con sus chequeos (ids, items del pedido, filtros) como segunda barrera.
