import './app.css';
import App from './App.svelte';

const target = document.getElementById('app');

if (!target) {
  throw new Error('Elemento raíz #app no encontrado en el DOM');
}

// Instanciación del componente raíz
const app = new (App as any)({
  target,
});

export default app;
