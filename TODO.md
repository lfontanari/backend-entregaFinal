# Módulos de Testing para proyecto final

## Aspectos a incluir

- [x] Desde el router de /api/users, crear tres rutas:
  - [x] GET / deberá obtener todos los usuarios, éste sólo debe devolver los datos principales como nombre, correo, tipo de cuenta (rol)
  - [x] DELETE / deberá limpiar a todos los usuarios que no hayan tenido conexión en los últimos 2 días. (puedes hacer pruebas con los últimos 30 minutos, por ejemplo). Deberá enviarse un correo indicando al usuario que su cuenta ha sido eliminada por inactividad
- [x] Crear una vista para poder visualizar, modificar el rol y eliminar un usuario. Esta vista únicamente será accesible para el administrador del ecommerce
- [x] Modificar el endpoint que elimina productos, para que, en caso de que el producto pertenezca a un usuario premium, le envíe un correo indicándole que el producto fue eliminado. (OPCIONAL)
- [x] Finalizar las vistas pendientes para la realización de flujo completo de compra (SÓLO El MÍNIMO PARA COMPRAR). NO ES NECESARIO tener una estructura específica de vistas, sólo las que tú consideres necesarias para poder llevar a cabo el proceso de compra.
  - No es necesario desarrollar vistas para módulos que no influyan en el proceso de compra (Como vistas de usuarios premium para crear productos, o vistas de panel de admin para updates de productos, etc)
- [x] Realizar el despliegue de tu aplicativo en la plataforma de tu elección (Preferentemente Render, pues es la abarcada en el curso) y corroborar que se puede llevar a cabo un proceso de compra completo.
- [x] Arreglar titulo de las paginas (dice localhost en todas)
- [x] Fix de respuesta en json cuando no se encuentra la pagina

## Objetivos generales

- Completar el proyecto final

## Objetivos específicos

- Conseguir una experiencia de compra completa
- Cerrar detalles administrativos con los roles.

## Formato

- Link al repositorio sin node_modules
- Link del proyecto desplegado..

## Sugerencias

- Presta especial atención a las rúbricas de Proyecto final. ¡Es crucial para alcanzar la nota que esperas!
- Debido a la complejidad de frontend requerida para poder aplicar una pasarela de pago, el PF no evalúa la pasarela de pago.