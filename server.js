import express from 'express';
import cors from 'cors';
import { getMenuItems } from './database.js';

const app = express();

app.use(express.json());

app.get('/menu-items', async (req, res) =>{
    const menuItems = await getMenuItems();
    res.json(menuItems);
})
app.listen(8080, ()=>{
    console.log('Server running on port 8080');
})