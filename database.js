import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

export async function getMenuItems(){
    const [items] = await pool.query(
        `SELECT * FROM menu`
    )
    return items;
}

export async function getUserData(){
    const [user] = await pool.query(
        `SELECT * FROM user`
    )
    return user[0];
}

export async function addPoints(itemName){
    const [userPoints] = await pool.query(
        `SELECT points_acquired from user `
    )
    const [itemPoints] = await pool.query(
        `SELECT points_worth from menu where item = ?`, itemName
    )
    const newUserPoints = userPoints[0].points_acquired + itemPoints[0].points_worth
    await pool.query(
        `UPDATE user
         SET points_acquired = ?`, newUserPoints
    )

    const [user] = await pool.query(
        `SELECT * FROM user`
    )
    return user[0]
}

