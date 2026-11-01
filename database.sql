-- Base distribuidora_ipap - TP6 Prisma
-- Brian Iván Hollweg

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS distribuidora_ipap;
CREATE DATABASE distribuidora_ipap CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE distribuidora_ipap;

-- CreateTable
CREATE TABLE `categorias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(60) NOT NULL,
    `descripcion` VARCHAR(255) NULL,

    UNIQUE INDEX `categorias_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proveedores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_empresa` VARCHAR(100) NOT NULL,
    `contacto` VARCHAR(100) NOT NULL,
    `telefono` VARCHAR(30) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `direccion` VARCHAR(150) NOT NULL,
    `cuit` VARCHAR(20) NOT NULL,

    UNIQUE INDEX `proveedores_cuit_key`(`cuit`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` TEXT NULL,
    `precio` DECIMAL(10, 2) NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `id_categoria` INTEGER NOT NULL,
    `id_proveedor` INTEGER NOT NULL,

    INDEX `productos_id_categoria_idx`(`id_categoria`),
    INDEX `productos_id_proveedor_idx`(`id_proveedor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empleados` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `apellido` VARCHAR(50) NOT NULL,
    `dni` VARCHAR(20) NOT NULL,
    `cargo` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `telefono` VARCHAR(30) NOT NULL,
    `fecha_ingreso` DATE NOT NULL,

    UNIQUE INDEX `empleados_dni_key`(`dni`),
    UNIQUE INDEX `empleados_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clientes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `cuit_dni` VARCHAR(20) NOT NULL,
    `telefono` VARCHAR(30) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `direccion` VARCHAR(150) NOT NULL,
    `ciudad` VARCHAR(60) NOT NULL,

    UNIQUE INDEX `clientes_cuit_dni_key`(`cuit_dni`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `companias_envio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `telefono` VARCHAR(30) NOT NULL,
    `email` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `companias_envio_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pedidos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero_factura` VARCHAR(25) NOT NULL,
    `fecha` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `id_cliente` INTEGER NOT NULL,
    `id_empleado` INTEGER NOT NULL,
    `id_compania_envio` INTEGER NOT NULL,
    `estado` ENUM('Pendiente', 'Enviado', 'Entregado', 'Cancelado') NOT NULL DEFAULT 'Pendiente',
    `total` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,

    UNIQUE INDEX `pedidos_numero_factura_key`(`numero_factura`),
    INDEX `pedidos_id_cliente_idx`(`id_cliente`),
    INDEX `pedidos_id_empleado_idx`(`id_empleado`),
    INDEX `pedidos_id_compania_envio_idx`(`id_compania_envio`),
    INDEX `pedidos_fecha_idx`(`fecha`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pedidos_detalle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pedido` INTEGER NOT NULL,
    `id_producto` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `precio_unitario` DECIMAL(10, 2) NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,

    INDEX `pedidos_detalle_id_producto_idx`(`id_producto`),
    UNIQUE INDEX `pedidos_detalle_id_pedido_id_producto_key`(`id_pedido`, `id_producto`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `productos` ADD CONSTRAINT `fk_productos_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productos` ADD CONSTRAINT `fk_productos_proveedor` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedidos` ADD CONSTRAINT `fk_pedidos_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `clientes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedidos` ADD CONSTRAINT `fk_pedidos_empleado` FOREIGN KEY (`id_empleado`) REFERENCES `empleados`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedidos` ADD CONSTRAINT `fk_pedidos_compania` FOREIGN KEY (`id_compania_envio`) REFERENCES `companias_envio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedidos_detalle` ADD CONSTRAINT `fk_detalle_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedidos_detalle` ADD CONSTRAINT `fk_detalle_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- checks (prisma no los tiene en el schema)
ALTER TABLE `productos` ADD CONSTRAINT `chk_productos_precio` CHECK (`precio` >= 0),
                        ADD CONSTRAINT `chk_productos_stock` CHECK (`stock` >= 0);
ALTER TABLE `pedidos` ADD CONSTRAINT `chk_pedidos_total` CHECK (`total` >= 0);
ALTER TABLE `pedidos_detalle` ADD CONSTRAINT `chk_detalle_cantidad` CHECK (`cantidad` > 0),
                              ADD CONSTRAINT `chk_detalle_precio` CHECK (`precio_unitario` >= 0);

-- ==========================================================
-- DATOS DE PRUEBA (SEEDING)
-- ==========================================================

-- Categorías
INSERT INTO categorias (id, nombre, descripcion) VALUES
(1, 'Bebidas Sin Alcohol', 'Gaseosas, jugos, aguas minerales y saborizadas'),
(2, 'Bebidas Con Alcohol', 'Cervezas, vinos, aperitivos y licores'),
(3, 'Lácteos y Derivados', 'Leches, yogures, quesos y mantecas'),
(4, 'Almacén y Comestibles', 'Aceites, fideos, harinas, arroz y conservas'),
(5, 'Snacks y Golosinas', 'Galletitas, chocolates, alfajores y papas fritas');

-- Proveedores
INSERT INTO proveedores (id, nombre_empresa, contacto, telefono, email, direccion, cuit) VALUES
(1, 'Molinos Río de la Plata', 'Carlos Bianchi', '011-4321-0001', 'ventas@molinos.com.ar', 'Av. Leandro N. Alem 1110, CABA', '30-50012345-1'),
(2, 'Arcor S.A.I.C.', 'Mariana Ruiz', '0351-420-9000', 'comercial@arcor.com.ar', 'Av. Fulvio Pagani 487, Arroyito, Córdoba', '30-50223344-2'),
(3, 'Cervecería y Maltería Quilmes', 'Esteban Quito', '011-4349-1000', 'contacto@quilmes.com.ar', '12 de Octubre y Gran Canaria, Quilmes', '30-50119988-3'),
(4, 'Mastellone Hermanos S.A.', 'Laura Gómez', '0800-888-5324', 'ventas@laserenisima.com.ar', 'Almte. Brown 957, Gral. Rodríguez', '30-50334455-4'),
(5, 'Coca-Cola FEMSA Argentina', 'Gonzalo Morales', '011-4630-1500', 'distribucion@cocacola.com.ar', 'Amancio Alcorta 3570, CABA', '30-50445566-5');

-- Productos
INSERT INTO productos (id, nombre, descripcion, precio, stock, id_categoria, id_proveedor) VALUES
(1, 'Gaseosa Coca-Cola Original 2.25 L', 'Gaseosa cola botella retornable 2.25L pack x8', 2800.00, 150, 1, 5),
(2, 'Agua Mineral Villavicencio 2 L', 'Agua mineral natural sin gas', 1200.00, 200, 1, 5),
(3, 'Cerveza Quilmes Clásica 1 L', 'Cerveza rubia tradicional botella 1L', 2200.00, 120, 2, 3),
(4, 'Vino Malbec Cafayate 750 ml', 'Vino tinto cosecha seleccionada', 3900.00, 80, 2, 3),
(5, 'Leche Entera La Serenísima 1 L', 'Leche ultra pasterizada sachet 1L', 1450.00, 250, 3, 4),
(6, 'Queso Cremoso La Serenísima 1 kg', 'Queso cremoso trozado por kilo', 7800.00, 60, 3, 4),
(7, 'Aceite de Girasol Cocinero 1.5 L', 'Aceite comestible puro de girasol', 2400.00, 180, 4, 1),
(8, 'Fideos Tallarines Matarazzo 500 g', 'Fideos secos al huevo paquete 500g', 1350.00, 220, 4, 1),
(9, 'Galletitas Chocolinas 250 g', 'Galletitas dulces sabor chocolate', 1150.00, 300, 5, 2),
(10, 'Alfajor Bon o Bon Chocolate Blanco 40 g', 'Alfajor relleno con pasta de maní', 750.00, 400, 5, 2);

-- Empleados
INSERT INTO empleados (id, nombre, apellido, dni, cargo, email, telefono, fecha_ingreso) VALUES
(1, 'Martín', 'Palermo', '23111222', 'Gerente de Ventas', 'mpalermo@distribuidora.com', '011-5555-1001', '2021-03-01'),
(2, 'Román', 'Riquelme', '25333444', 'Preventista Mayorista', 'rriquelme@distribuidora.com', '011-5555-1002', '2022-06-15'),
(3, 'Guillermo', 'Barros', '24555666', 'Vendedor de Zona', 'gbarros@distribuidora.com', '011-5555-1003', '2023-01-10'),
(4, 'Marcelo', 'Delgado', '26777888', 'Administrativo de Facturación', 'mdelgado@distribuidora.com', '011-5555-1004', '2023-08-01');

-- Clientes
INSERT INTO clientes (id, nombre, cuit_dni, telefono, email, direccion, ciudad) VALUES
(1, 'Autoservicio San Cayetano', '30-71122334-9', '011-4765-8899', 'contacto@sancayetano.com.ar', 'Av. Mitre 2450', 'Avellaneda'),
(2, 'Kiosco El Sol', '20-33445566-7', '011-4201-3322', 'kioscoelsol@gmail.com', 'Calle 12 N° 580', 'La Plata'),
(3, 'Supermercado Central', '30-68990011-4', '011-4455-6677', 'administracion@supercentral.com', 'Belgrano 1230', 'Quilmes'),
(4, 'Restobar La Esquina', '30-75443322-1', '011-4822-9900', 'laesquina@restobar.com', 'Av. Santa Fe 3400', 'CABA'),
(5, 'Almacén Don Pepe', '27-29887766-3', '011-4999-1122', 'almacendonpepe@hotmail.com', 'Rivadavia 820', 'Morón');

-- Compañías de Envíos
INSERT INTO companias_envio (id, nombre, telefono, email) VALUES
(1, 'Expreso Cargas Argentinas', '0810-333-2274', 'info@cargasargentinas.com.ar'),
(2, 'Logística Urbana SRL', '011-4700-1122', 'envios@logisticaurbana.com'),
(3, 'Distribuciones Flash Express', '011-4900-8844', 'contacto@flashexpress.com.ar');

-- Pedidos (Facturación)
INSERT INTO pedidos (id, numero_factura, fecha, id_cliente, id_empleado, id_compania_envio, estado, total) VALUES
(1, 'FAC-A-0001-00000101', '2024-05-10 10:30:00', 1, 2, 1, 'Entregado', 43600.00),
(2, 'FAC-A-0001-00000102', '2024-05-12 11:15:00', 2, 3, 2, 'Entregado', 18850.00),
(3, 'FAC-A-0001-00000103', '2024-05-15 15:45:00', 3, 2, 1, 'Enviado', 87200.00),
(4, 'FAC-B-0001-00000104', '2024-05-18 09:20:00', 4, 3, 3, 'Pendiente', 35400.00),
(5, 'FAC-B-0001-00000105', '2024-05-20 16:10:00', 5, 2, 2, 'Pendiente', 25650.00);

-- Detalle de los Pedidos
-- el precio_unitario es el del momento de la venta, por eso no siempre coincide con el precio actual del producto
-- Pedido 1 (Total: 43600.00)
-- 10 Coca-Cola ($2800 = $28000) + 12 Fideos ($1300 = $15600)
INSERT INTO pedidos_detalle (id_pedido, id_producto, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 10, 2800.00, 28000.00),
(1, 8, 12, 1300.00, 15600.00);

-- Pedido 2 (Total: 18850.00)
-- 15 Galletitas Chocolinas ($1150 = $17250) + 2 Alfajores ($800 = $1600)
INSERT INTO pedidos_detalle (id_pedido, id_producto, cantidad, precio_unitario, subtotal) VALUES
(2, 9, 15, 1150.00, 17250.00),
(2, 10, 2, 800.00, 1600.00);

-- Pedido 3 (Total: 87200.00)
-- 20 Cervezas Quilmes ($2200 = $44000) + 8 Queso Cremoso ($5400 = $43200)
INSERT INTO pedidos_detalle (id_pedido, id_producto, cantidad, precio_unitario, subtotal) VALUES
(3, 3, 20, 2200.00, 44000.00),
(3, 6, 8, 5400.00, 43200.00);

-- Pedido 4 (Total: 35400.00)
-- 6 Vinos Malbec ($3900 = $23400) + 10 Aguas Minerales ($1200 = $12000)
INSERT INTO pedidos_detalle (id_pedido, id_producto, cantidad, precio_unitario, subtotal) VALUES
(4, 4, 6, 3900.00, 23400.00),
(4, 2, 10, 1200.00, 12000.00);

-- Pedido 5 (Total: 25650.00)
-- 10 Leches La Serenísima ($1450 = $14500) + 5 Aceites Cocinero ($2230 = $11150)
INSERT INTO pedidos_detalle (id_pedido, id_producto, cantidad, precio_unitario, subtotal) VALUES
(5, 5, 10, 1450.00, 14500.00),
(5, 7, 5, 2230.00, 11150.00);
