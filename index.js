import {inquirerMenu, leerInput, pausa, listarLugares} from './helpers/inquirer.js';
import { Busquedas } from './models/busqueda.js'
import * as dotenv from 'dotenv'
dotenv.config();


const main = async () => {
    
    


    let opt = '';
    const busquedas = new Busquedas()
    do {
        opt = await inquirerMenu();

        switch (opt.option) {

            case 1:
            // Peticiones HTTP -------------------------------------

                //Pedir input 
                const lugarABuscar = await leerInput('Ciudad: ');

                //Buscar lugares segun input
                const lugaresEncontrados = await busquedas.buscarCiudades(lugarABuscar);

                //Mostrar lugares y pedir seleccionar el especifico
                const idLugarSeleccionado = await listarLugares(lugaresEncontrados);
                if ( idLugarSeleccionado === 0 ) continue;

                const lugarSeleccionado = lugaresEncontrados.find( l => l.id === idLugarSeleccionado)
                
                //Guardar en DB
                busquedas.agregarAlHistorial( lugarSeleccionado.nombre )
                
                //Buscar los datos de clima
                const climaEncontrado = await busquedas.buscarClima(lugarSeleccionado.lat, lugarSeleccionado.long)

                //Mostrar resultados
                console.clear()
                console.log(`\nInformation about the city\n`.green);
                console.log(`City: ${lugarSeleccionado.nombre}`.blue);
                console.log(`Longitude: ${lugarSeleccionado.long}`);
                console.log(`Latitude: ${lugarSeleccionado.lat}`);
                console.log(`Weather: ${climaEncontrado.temp} °C`.blue);
                console.log(`Weather Max: ${climaEncontrado.temp_max} °C`);
                console.log(`Weather Min: ${climaEncontrado.temp_min} °C`);
                console.log(`Description: ${climaEncontrado.desc}`.blue);

                break;
        
            case 2:
            //Mostrar historial ---------------------------------------
            busquedas.historial.forEach( (lugar, i) => {
                console.log(`${i + 1 + '. '}`.green  + `${lugar}`.toUpperCase())
            })
                
        }

        await pausa();
    } while (opt.option !== 0);
    
}

main()