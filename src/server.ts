import express from 'express';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(routes)
/*
GET: Buscar ou listar uma informação
POST
PUT
DELETE

Corpo - request.body
Route Params - request.params
Query Params - request.query

*/


app.listen(3333);