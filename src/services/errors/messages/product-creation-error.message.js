export const generateProductErrorInfo = (product) => {
    return `Uno o mas propiedades estan incompletas o invalidas.
    Lista de propiedades requeridas:
     --> title: necesita ser un String, recibido por ${product.title}
     --> price: necesita ser un Number, recibido por ${product.price}
     `;
};