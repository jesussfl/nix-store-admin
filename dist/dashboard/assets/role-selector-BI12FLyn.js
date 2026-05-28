import{iZ as l,jb as r,f$ as p,bc as u,fT as d,dy as m}from"./index-B_AGHcrO.js";const y=d(`
    query Roles($options: RoleListOptions) {
        roles(options: $options) {
            items {
                id
                code
                description
            }
        }
    }
`);function q(o){const{value:t,onChange:i,multiple:n}=o,{_:s}=l(),{data:a}=r({queryKey:["roles"],queryFn:()=>m.query(y,{options:{take:100}}),select:e=>e.roles.items}),c=(a??[]).map(e=>({value:e.id,label:e.code,display:e.description?e.description:e.code}));return p.jsx(u,{value:t,onChange:i,multiple:n,items:c,placeholder:s({id:"h4pFju"}),searchPlaceholder:s({id:"jxxbqF"})})}export{q as R};
