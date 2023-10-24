import { randomUUID } from 'node:crypto'

//Aqui, uma classe é utilizada como database.
export class DatabaseMemory {
    #videos = new Map()

    //Aqui vai listar os videos do nosso banco de dados
    //Primeiro usamos o método .values()
    //Depois alteramos para .entries() pq ele vai trazer o id junto, porém vai trazer, nesse caso, separado
    list(search) {
        return Array.from(this.#videos.entries()).map((videoArray) => {
            //Aqui usamos o método .map para iterarmos no array
            //Depois pegamos o valor do primeiro valor que é o id e do segundo que é o objeto video
            const id = videoArray[0]
            const data = videoArray[1]

            //Retornamos em um novo objeto o id e o objeto video (utilizamos o operador spread - ... - para copiar os dados)
            return {
                id,
                ...data
            }
        })
        .filter(video => {
            if (search) {
                return video.title.includes(search)
            }

            //Quando retornamos TRUE, o método filter mantém o vídeo na lista
            //Se retornarmos false, o método filter retira o vídeo da lista
            return true
        })
    }
    
    create(video) {
        //Aqui voce cria um ID único universal
        const videoId = randomUUID()

        //Pelo .set ser um método de um Map, voce tem que colcoar um id e algo mais. Por isso criamos o id
        this.#videos.set(videoId, video)
    }

    //Aqui vai atualizar o video de um determinado id
    update(id, video) {
        this.#videos.set(id, video)
    }

    //Aqui vai deletar um video do banco de dados
    delete(id) {
        this.#videos.delete(id)
    }
}