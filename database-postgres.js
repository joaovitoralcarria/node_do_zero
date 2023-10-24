import { randomUUID } from 'node:crypto'
import { sql } from './db.js'

//Aqui, uma classe é utilizada como database.
export class DatabasePostgres {

    async list(search) {
        let videos

        //Essa operação é assíncrona, ou seja, demora um tempo para ocorrer
        //Portanto, precisamos colocar o async na função e colocar o await
        if (search) {
            videos = await sql`SELECT * FROM videos WHERE title ilike "%${search}%"`
        } else{
            videos = await sql`SELECT * FROM videos`
        }

        return videos
    }
    
    async create(video) {
        const videoId = randomUUID()
        const {title, description, duration} = video

        await sql`INSERT INTO videos (id, title, description, duration)
            VALUES (${videoId}, ${title}, ${description}, ${duration})
        `
    }

    //Aqui vai atualizar o video de um determinado id
    async update(id, video) {
        const {title, description, duration} = video

        await sql`UPDATE videos SET title = ${title}, description = ${description}, duration = ${duration}
            WHERE id = ${id}`;
    }

    //Aqui vai deletar um video do banco de dados
    async delete(id) {
        await sql`DELETE FROM videos
            WHERE id = ${id}`
    }
}