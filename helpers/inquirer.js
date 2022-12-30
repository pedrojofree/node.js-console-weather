import inquirer from 'inquirer';
import colors from 'colors';

const questions = [
    {
        type: 'list',
        name: 'option',
        message: 'What do you want to do?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Search city.`
            },
            {
                value: 2,
                name: `${'2.'.green} Previous results.`
            },
            {
                value: 0,
                name: `${'0.'.green} Exit.`
            },
        ],
    }
]

const inquirerMenu = async() => {
    console.clear()
    console.log('=============================='.rainbow);
    console.log('    OpenWeather Console App'.blue);
    console.log('==============================\n'.rainbow);

    const opt = await inquirer.prompt(questions);

    return opt;

}

const pausa = async () => {
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Press ${'ENTER'.green} to continue`
        }
    ]
    console.log('\n');
    await inquirer.prompt(question)
}

const leerInput = async ( message ) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate ( value ){
                if (value.length === 0){
                    return 'Enter something'
                }
                return true;
            }
        }
    ];
    const {desc} = await inquirer.prompt(question)
    
    return desc;
}

const listarLugares = async ( lugares = [] ) => {

    const choices = lugares.map( (lugar, i) => {
        return {
            value: lugar.id,
            name: `${i + 1 + '. '}`.green  + `${lugar.nombre}`
        }
    });

    choices.unshift( {
        value: 0,
        name: '0.'.green + ' Cancel'
    })

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Select a specific place',
            choices
        }
    ]

    const { id } = await inquirer.prompt(preguntas)

    return id

}

export { inquirerMenu, pausa, leerInput, listarLugares };