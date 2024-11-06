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
    );
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
    );
    const [itemInfo] = await pool.query(
        `SELECT * from menu where item = ?`, itemName
    );

    let userPoints = userPts[0]
    const item = itemInfo[0]

    let newUserPoints = userPoints.points_acquired + item.points_worth
    
    if(newUserPoints >= 10000){
        const status = 'signature'
        await pool.query(
            `UPDATE user
             SET points_acquired = ?, status = ?`, [newUserPoints, status]
        );
        await pool.query(
            `INSERT INTO purchases (category)
             VALUES (?)`, item.category
        );
        await setMostPurchased();
    } else if(newUserPoints >= 5000){
        const status = 'red'
        await pool.query(
            `UPDATE user
             SET points_acquired = ?, status = ?`, [newUserPoints, status]
        );
    } else if(newUserPoints >= 1000){
        const status = 'silver'
        await pool.query(
            `UPDATE user
             SET points_acquired = ?, status = ?`, [newUserPoints, status]
        );
    } 
    else{
        await pool.query(
            `UPDATE user
             SET points_acquired = ?`, newUserPoints
        );
    }//update points and change status if point goal is reached  

    const [user] = await pool.query(
        `SELECT * FROM user`
    );
    return user[0]//return user so points change can be reflected in app
}

async function setMostPurchased(){
    const [purchases] = await pool.query(
        `SELECT * FROM purchases`
    );
    const mostPurchased = findModes(purchases)
    
    if(mostPurchased.length > 1){
        const max = mostPurchased.length
        const randomIndex = Math.floor(Math.random() *  max);
        await pool.query(
            `UPDATE user 
             SET most_purchased = ?`, mostPurchased[randomIndex]
        )
    }//if user purchases from multiple categories the same amount of times
    //choose a random category to set as their most purchased 
    else{
        await pool.query(
            `UPDATE user 
            SET most_purchased = ?`, mostPurchased[0]
        )
    }//set most purchased category if there is only
    //one category they purchase most

}//determine the most purchased categories 
//set users most purchased to the category

export async function generateReward(){
    const [userInfo] = await pool.query(
        `SELECT * FROM user`
    );

    const userData = userInfo[0]
    let possibleRewards


    if (userData.status === 'signature'){
         [possibleRewards] = await pool.query(
            `SELECT * FROM menu WHERE category = ?`, userData.most_purchased
        );
    }
    else{
        const status = "plebeian";
        [possibleRewards] = await pool.query(
            `SELECT * FROM menu WHERE status = ?`, status
        );
    }

    const max = possibleRewards.length
        const randomIndex = Math.floor(Math.random() *  max);
        await pool.query(
            `INSERT INTO rewards (item, picture) 
             VALUES (?, ?)`, [possibleRewards[randomIndex].item, 
                              possibleRewards[randomIndex].picture]
        );

    const [rewards] = await pool.query(
        `SELECT * FROM rewards`
    );
    return rewards;
}//simulate local operator sending reward to customer 


export async function getRewards(){
    const [rewards] = await pool.query(
        `SELECT * FROM rewards`
    );
    return rewards;
}

function findModes(arr) {

    // Create a frequency map
    const frequencyMap = {};
    arr.forEach(category => {
        frequencyMap[category.category] =
            (frequencyMap[category.category]|| 0) + 1;
    });

    let modes = [];
    let maxFrequency = 0;


    for (const category in frequencyMap) {
        const frequency = frequencyMap[category];
        if (frequency > maxFrequency) {
            maxFrequency = frequency;
            modes = [category];
        } else if (frequency === maxFrequency) {
            modes.push(category);
        }
    }

    return modes;
}//determine the categories that the user purchases most

