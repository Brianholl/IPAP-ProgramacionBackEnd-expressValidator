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
