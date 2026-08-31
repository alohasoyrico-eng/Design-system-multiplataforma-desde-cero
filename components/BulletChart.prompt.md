Real vs meta vs periodo anterior, por entidad — más denso que un gauge cuando hay muchas entidades que comparar contra presupuesto.

```jsx
<BulletChart rows={entities.map(e=>({label:e.name,value:e.actual,target:e.budget,prev:e.lastMonth}))} format={(v)=>'$'+v+'k'} />
```
