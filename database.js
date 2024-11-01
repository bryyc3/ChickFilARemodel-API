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
}//get all items available on menu

export async function getUserData(){
    const [user] = await pool.query(
        `SELECT * FROM user`
    )
    return user[0];
}//get all data associated with user 

export async function addPoints(itemName){
    const [userPts] = await pool.query(
        `SELECT points_acquired from user `
    )
    const [itemInfo] = await pool.query(
        `SELECT * from menu where item = ?`, itemName
    )

    let userPoints = userPts[0]
    const item = itemInfo[0]

    let newUserPoints = userPoints.points_acquired + item.points_worth
    
    if(newUserPoints >= 10000){
        const status = 'signature'
        await pool.query(
            `UPDATE user
             SET points_acquired = ?, status = ?`, [newUserPoints, status]
        )
    } else if(newUserPoints >= 5000){
        const status = 'red'
        await pool.query(
            `UPDATE user
             SET points_acquired = ?, status = ?`, [newUserPoints, status]
        )
    } else if(newUserPoints >= 1000){
        const status = 'silver'
        await pool.query(
            `UPDATE user
             SET points_acquired = ?, status = ?`, [newUserPoints, status]
        )
    } 
    else{
        await pool.query(
            `UPDATE user
             SET points_acquired = ?`, newUserPoints
        )
    }//update points and change status if point goal is reached  

    const [user] = await pool.query(
        `SELECT * FROM user`
    )
    return user[0]//return user so points change can be reflected in app
}

