import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import categoriasRoutes from './routes/categoriasRoutes.js';
import proveedoresRoutes from './routes/proveedoresRoutes.js';
import productosRoutes from './routes/productosRoutes.js';
import empleadosRoutes from './routes/empleadosRoutes.js';
import clientesRoutes from './routes/clientesRoutes.js';
import companiasEnvioRoutes from './routes/companiasEnvioRoutes.js';
import pedidosRoutes from './routes/pedidosRoutes.js';
import informesRoutes from './routes/informesRoutes.js';
import { manejoErrores, rutaNoEncontrada } from './middleware/errores.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API Distribuidora - TP6 TypeScript y Prisma',
    recursos: ['/categorias', '/proveedores', '/productos', '/empleados', '/clientes', '/companias-envio', '/pedidos', '/informes/ventas']
  });
});

app.use('/categorias', categoriasRoutes);
app.use('/proveedores', proveedoresRoutes);
app.use('/productos', productosRoutes);
app.use('/empleados', empleadosRoutes);
app.use('/clientes', clientesRoutes);
app.use('/companias-envio', companiasEnvioRoutes);
app.use('/pedidos', pedidosRoutes);
app.use('/informes', informesRoutes);

app.use(rutaNoEncontrada);
app.use(manejoErrores);

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
