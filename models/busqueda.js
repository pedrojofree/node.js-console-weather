import axios from 'axios';
import fs from 'fs';

class Busquedas {

    historial = []; // Aqui se agregaran las busquedas realizadas.

    constructor() {
        this.leerDB()
    }

    //Peticiones HTTP -----------------------------------------
    async buscarCiudades ( lugar = '' ) {

        try {
            const instanciaAxiosCiudades = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: {
                    'access_token': process.env.MAPBOX_APIKEY,
                    'limit': 5
                }
            })
    
            const respuestaCiudades = await instanciaAxiosCiudades.get();
            return respuestaCiudades.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                long: lugar.center[0],
                lat: lugar.center[1]
            }))
        
        } catch (error) {
            console.error();
        }
        
    }

    async buscarClima ( lat, lon ) {
        const instanciaAxiosClima = axios.create({
            baseURL: `https://api.openweathermap.org/data/2.5/weather`,
            params: {
                lat,
                lon,
                'appid': process.env.OPENWEATHER_APIKEY,
                'units': 'metric'
            }
        })

        const respuestaClima = await instanciaAxiosClima.get();
        const { weather, main } = respuestaClima.data;

        return {
            desc: weather[0].description,
            temp_min: main.temp_min,
            temp_max: main.temp_max,
            temp: main.temp
        };
    }

    agregarAlHistorial ( lugar = {} ){
        if ( this.historial.includes( lugar.toLowerCase() )) {
            return
        }
        this.historial.unshift( lugar.toLowerCase() )

        this.guardarDB();
    }

    guardarDB ( ) {
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync('./db/data.json', JSON.stringify( payload ))
    }

    leerDB = () => {

        if ( !fs.existsSync ( './db/data.json' ) ) return

        const info = fs.readFileSync('./db/data.json', {encoding: 'utf-8'})
        const data = JSON.parse(info)

        this.historial = data.historial;

        // return tareasGuardadasArray;
    }
}

export { Busquedas };