import{jb as c,f$ as s,cQ as l,cA as d,cE as m,cF as u,d8 as p,cB as h,cC as j,cD as x,fT as f,dy as S}from"./index-B_AGHcrO.js";const y=f(`
    query Zones($options: ZoneListOptions) {
        zones(options: $options) {
            items {
                id
                name
            }
        }
    }
`);function q({value:t,onChange:i}){const{data:n,isLoading:a,isPending:o}=c({queryKey:["zones"],staleTime:3e5,queryFn:()=>S.query(y,{options:{take:100}})});return a||o?s.jsx(l,{className:"h-10 w-full"}):s.jsxs(d,{items:n?Object.fromEntries(n.zones.items.map(e=>[e.id,e.name])):{},value:t??"",onValueChange:e=>e&&i(e),children:[s.jsx(m,{children:s.jsx(u,{placeholder:s.jsx(p,{id:"p3M+0h"}),children:e=>n?.zones.items.find(r=>r.id===e)?.name})}),s.jsx(h,{children:n&&s.jsx(j,{children:n?.zones.items.map(e=>s.jsx(x,{value:e.id,children:e.name},e.id))})})]})}export{q as Z};
