import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import { z } from 'zod';

import { renderer, AddTodo, Item } from './components.js';
import * as dynamodb from './dynamodb.js';

interface Todo {
  title: string
  id: string
}

const duration = Number(process.env.EXPIRE_IN_SEC || '300');

const app = new Hono();

app.get('*', renderer);

app.get('/', async (c) => {
  const todos = await dynamodb.all<Todo>();
  return c.render(
    <div>
      <AddTodo />
      {todos.map((todo) => {
        return <Item title={todo.title} id={todo.id} />;
      })}
      <div id="todo"></div>
    </div>,
  );
});

app.post(
  '/todo',
  zValidator(
    'form',
    z.object({
      title: z.string().min(1),
    }),
  ),
  async (c) => {
    const { title } = c.req.valid('form');
    const id = crypto.randomUUID();
    await dynamodb.put({title, id, expire: Math.floor(new Date().getTime() / 1000 + duration)});
    return c.html(<Item title={title} id={id} />);
  },
);

app.delete('/todo/:id', async (c) => {
  const id = c.req.param('id');
  await dynamodb.deleteItem(id);
  c.status(200);
  return c.body(null);
});

export const handler = handle(app);
