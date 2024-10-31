import express from 'express';
//import cors from 'cors';
import { getMenuItems, getUserData, addPoints } from './database.js';

const app = express();

app.use(express.json());
/*app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));*/

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
    console.log(req.body)
    const userPointsAdded = await addPoints(item.itemName);
    console.log(userPointsAdded)
    res.json(userPointsAdded)
})

app.listen(8080, ()=>{
    console.log('Server running on port 8080');
})