# Punto 3 - Prisma híbrido

Brian Iván Hollweg y Yanina Elizabeth Ovejero

## 3.1

`$queryRaw` se usa para consultas que traen datos, o sea los SELECT. Devuelve un array con las filas.

`$executeRaw` se usa para modificar datos (UPDATE, INSERT, DELETE). No devuelve filas, devuelve un número con la cantidad de filas que cambiaron.

En el proyecto usé `$queryRaw` para el informe de ventas y `$executeRaw` para subir los precios de una categoría (`PATCH /productos/ajuste-precios`), que devuelve cuántos productos se actualizaron.

## 3.2

Cuando se escribe `` prisma.$queryRaw`SELECT * FROM clientes WHERE id = ${id}` `` Prisma no pega el valor dentro del texto, lo manda aparte como parámetro (como los `?` que usábamos con mysql2). Entonces aunque el usuario mande algo como `1 OR 1=1` la base lo toma como un dato y no como parte de la consulta.

Si concatenamos strings el valor queda metido en el SQL, y alguien puede cambiar la consulta y por ejemplo traer todos los datos o borrar una tabla. Eso es la inyección SQL.

## 3.3

Usaría SQL puro cuando la consulta es muy complicada para hacerla con Prisma, por ejemplo informes que juntan varias tablas, agrupan por mes, calculan porcentajes o usan funciones de ventana. También para updates de muchas filas a la vez o cuando hace falta que una consulta sea más rápida. Para el CRUD normal conviene Prisma.

## 3.4

La ruta es `GET /informes/ventas?desde=2024-05-01&hasta=2024-05-31`.

Muestra lo vendido por cada categoría con el porcentaje del total, y lo vendido por mes. No cuenta los pedidos cancelados. El código está en `src/models/informesModels.ts`.
