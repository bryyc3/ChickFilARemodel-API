import express from 'express';
import { getMenuItems, getUserData, addPoints, generateReward, getRewards, redeemReward } from './database.js';

const app = express();

app.use(express.json());


app.get('/menu-items', async (req, res) => {
    const menuItems = await getMenuItems();
    res.json(menuItems);
})

app.get('/user-data', async (req, res) => {
    const user = await getUserData();
    res.json(user);
})

app.post('/purchase', async (req, res) => {
    const item = req.body
    const userPointsAdded = await addPoints(item.itemName);
    res.json(userPointsAdded)
})

app.get('/rewards', async (req, res) =>{
    const rewards = await getRewards();
    res.json(rewards)
})

app.get('/send-reward', async (req, res) =>{
    const userRewards = await generateReward();
    res.json(userRewards)
})

app.post('/redeem-reward', async (req, res) =>{
    const rewardID = req.body;
    const rewards = await redeemReward(rewardID);
    res.json(rewards);
})


app.listen(8080, ()=>{
    console.log('Server running on port 8080');
})