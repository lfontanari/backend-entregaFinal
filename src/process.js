import { Command } from 'commander';

const program = new Command();

program
    .option('-d', 'Variable para debug', false)  // variable, descripcion y valor por defecto
    .option('-p <port>' , 'Puerto del servidor', 8080)
    .option('--mode <mode>', 'Modo de trabajo', 'develop') 
    
    .requiredOption('-u <user>', 'Usuario que va a utilizar el aplicativo.', 'No se ha declarado un usuario.')
    //RequireOption usa un mensaje por defecto si no está presente la opción.
    
    .option('--test', 'Variable para correr los test', false);
   
program.parse(); //Parsea los comandos y valida si son correctos.
/* 
console.log("Options: ", program.opts());
console.log("Modo Options: ", program.opts().mode);
console.log("Remaining arguments: ", program.args);
*/
export default program;