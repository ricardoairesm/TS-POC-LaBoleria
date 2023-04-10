import { db } from "../database/db.js";
import urlSchema from "../schemas/urlSchema.js";
import { Cake } from "../protocols.js";
import { Request, Response } from "express";


export async function createCake(req : Request, res: Response) {
    
    const cake = req.body as Cake;
    const validData = (schema, data) => !schema.validate(data).error;

    try {
        const existingCake = await db.query(`
        SELECT * FROM cakes WHERE name = $1
        `, [cake.name]);

        if (existingCake.rowCount > 0) return res.sendStatus(409);

        if (!validData(urlSchema, cake.image)) {
            return res.sendStatus(422);
        }

        await db.query(`
        INSERT INTO cakes (name, price, description, image)
        VALUES ($1, $2, $3, $4)
      `, [cake.name, cake.price, cake.description, cake.image]);
        res.sendStatus(201);

    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}