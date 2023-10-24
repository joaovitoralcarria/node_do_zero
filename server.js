/*

                    NESTE CASO CRIAMOS UM SERVIDOR USANDO O NODE. TEMOS EXPLICACOES IMPORTANTES AQUI

//Criamos um arquivo package.json com o comando npm init -y:
    //Esse arquivo é de configurações do projeto
    //Nele, adicionamos o "type": "module", para poder rodar a aplicação com o comando: node server.js

//Se eu rodar minha aplicacao com o comando: node --watch server.js, ele vai atualizar automático quando eu mudar o código
//Criamos um "dev" e passamos o comando e rodamos a aplicacao com o comando: npm run dev


//Aqui a gente chama a função createServer para criar um servidor que pode ser acessado de um navegador
import { createServer } from 'node:http'

//A gente cria o servidor chamando createServer e passa uma função como parâmetro
//Request -> ele trás a requisicao dos dados para a API
//Response -> é o objeto utilizado para devolver uma resposta para quem chama a API
const server = createServer((request, response) => {
    //Esse método write() ele vai escrever no nosso servidor
    response.write('Hello World')

    //Esse método end() finaliza o processo quando roda, por isso a página fica em branco
    return response.end()
})

//A nossa função retorna um método listen. Esse método pode ser chamado, passando uma PORTA (3333)
//A PORTA é onde a aplicação vai rodar, se tivermos mais de uma aplicação rodando, podemos ter diferentes portas
server.listen(3333)

*/

import { fastify } from 'fastify'
//import { DatabaseMemory } from './database-memory.js'
import { DatabasePostgres } from './database-postgres.js'

//Criamos o servidor
const server = fastify()

//Criamos o nosso banco de dados
//const Database = new DatabaseMemory()

const Database = new DatabasePostgres()

//Temos diversos métodos HTTP: GET, POST, PUT, DELETE

//Aqui o post vai acessar a rota videos e vai criar um video
//Quando temos rotas iguais, ele sempre chama o do método GET. Neste caso, não conseguimos testar as rotas no navegador
server.post('/videos', async (request, reply) => {
    const { title, description, duration } = request.body

    await Database.create({
        //Quando os nomes são iguais, eu posso deixar apenas 1 nome sem os 2 pontos
        title: title,
        description: description,
        duration: duration,
    })

    //A gente passou o request e o reply e o reply devolve algo da API
    //Aqui, a gente retornou, pelo reply, um status 201 que é o status usado para indicar quando algo foi criado
    //Por fim, utilizamos o .send para mostrar se ocorreu tudo certo
    return reply.status(201).send()
})

//Aqui o get vai pegar o video que foi criado
//Podemos ter o recurso (/videos) porém a rota do POST e do GET são totalmente diferentes
server.get('/videos', async (request, reply) => {
    const search = request.query.search
    //Listamos os vídeos
    const videos = await Database.list()
    //Retornamos o status. Não precisava colocar o status(200) pq ele é padrão
    //Quando vamos apenas listar algo, podemos retornar diretamente essa lista
    return reply.status(200).send(videos)
})

//Aqui, o put que é pra atualizar, voce tem que passar a rota e o id do video. O id do video é passado dessa forma
server.put('/videos/:id', async (request, reply) => {
    //Dentro de .params eu consigo acessar todo os parametros que vem dentro de id
    const videoId = request.params.id
    const { title, description, duration} = request.body

    await Database.update(videoId, {
        title: title,
        description: description,
        duration: duration,
    })

    //204 -> Resposta que teve sucesso mas nao tem conteudo na resposta
    return reply.status(204).send()
})

//Aqui a gente deleta e tem que passar o id do que queremos deletar também
server.delete('/videos/:id', async (request, reply) => {
    const videoId = request.params.id

    await Database.delete(videoId)

    return reply.status(204).send()
})

//Aqui a gente passa a porta do nosso servidor criado anteriormente
server.listen({
    port: process.env.PORT ?? 3333,
})