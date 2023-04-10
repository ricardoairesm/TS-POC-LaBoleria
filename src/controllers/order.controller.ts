import { db } from "../database/db.js";
import { Order, OrderEntity } from "../protocols.js";
import { Request, Response } from "express"
import { QueryResult } from "pg";
import errors from "../errors/index.js";




export async function createOrder(req: Request, res: Response){

    const order = req.body as Order;

    try {
        const existingCakeId = await db.query(`
        SELECT * FROM cakes WHERE id = $1
        `, [order.cakeId]);

        if (existingCakeId.rowCount < 1) throw errors.conflictError("The cake is a lie");

        const existingClientId = await db.query(`
        SELECT * FROM clients WHERE id = $1
        `, [order.clientId]);

        if (existingClientId.rowCount < 1) throw errors.conflictError("Client not found");

        await db.query(`
        INSERT INTO orders ("clientId", "cakeId", quantity, "totalPrice")
        VALUES ($1, $2, $3, $4)
      `, [order.clientId, order.cakeId, order.quantity, order.totalPrice]);

        res.sendStatus(201);

    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

export async function listOrders(req: Request, res: Response){

    const filter = req.query

    if (filter.date) {
        try {
            const orders = await db.query(`
            SELECT JSON_BUILD_OBJECT('id', clients.id, 'name', clients.name,'address',clients.address,'phone',clients.phone) AS client,
            JSON_BUILD_OBJECT('id', cakes.id, 'name', cakes.name,'price',cakes.price,'description',cakes.description,'image',cakes.image) AS cake,
            orders.quantity,orders."createdAt",orders."totalPrice"
            FROM orders 
            JOIN clients ON orders."clientId" = clients."id"
            JOIN cakes ON orders."cakeId" = cakes."id"
            WHERE DATE(orders."createdAt")=$1;
          `, [filter.date]);

            if (orders.rowCount < 1) throw errors.conflictError("Orders not found");
       
            return res.send(orders.rows).status(200);

        } catch (error) {
            console.log(error);
            res.status(500).send(error.message);
        }
    }

    try {
        const orders = await db.query(`
        SELECT JSON_BUILD_OBJECT('id', clients.id, 'name', clients.name,'address',clients.address,'phone',clients.phone) AS client,
        JSON_BUILD_OBJECT('id', cakes.id, 'name', cakes.name,'price',cakes.price,'description',cakes.description,'image',cakes.image) AS cake,
        orders.quantity,orders."createdAt",orders."totalPrice"
        FROM orders 
        JOIN clients ON orders."clientId" = clients."id"
        JOIN cakes ON orders."cakeId" = cakes."id"
      `);

        if (orders.rowCount < 1) throw errors.conflictError("Orders not found");


        return res.send(orders.rows).status(200);

    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}


export async function listOrdersById(req: Request, res: Response) {

    const { id } = req.params;

    try {
        const orders = await db.query(`
        SELECT JSON_BUILD_OBJECT('id', clients.id, 'name', clients.name,'address',clients.address,'phone',clients.phone) AS client,
        JSON_BUILD_OBJECT('id', cakes.id, 'name', cakes.name,'price',cakes.price,'description',cakes.description,'image',cakes.image) AS cake,
        orders.quantity,orders."createdAt",orders."totalPrice"
        FROM orders 
        JOIN clients ON orders."clientId" = clients."id"
        JOIN cakes ON orders."cakeId" = cakes."id"
        WHERE orders.id = $1;
      `, [id]);

        if (orders.rowCount < 1) throw errors.conflictError("Orders not found");

        return res.send(orders.rows).status(200);

    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}