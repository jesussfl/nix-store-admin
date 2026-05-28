import{jb as c,f$ as s,cQ as l,cA as d,cE as m,cF as u,d8 as x,cB as p,cC as g,cD as j,fT as h,dy as C}from"./index-B_AGHcrO.js";const f=h(`
    query TaxCategories($options: TaxCategoryListOptions) {
        taxCategories(options: $options) {
            items {
                id
                name
                isDefault
            }
        }
    }
`);function y({value:t,onChange:i}){const{data:a,isLoading:n,isPending:r,status:S}=c({queryKey:["taxCategories"],staleTime:3e5,queryFn:()=>C.query(f,{options:{take:100}})});return n||r?s.jsx(l,{className:"h-10 w-full"}):s.jsxs(d,{items:a?Object.fromEntries(a.taxCategories.items.map(e=>[e.id,e.name])):{},value:t??"",onValueChange:e=>e&&i(e),children:[s.jsx(m,{children:s.jsx(u,{placeholder:s.jsx(x,{id:"LWiFS0"}),children:e=>a?.taxCategories.items.find(o=>o.id===e)?.name})}),s.jsx(p,{children:a&&s.jsx(g,{children:a?.taxCategories.items.map(e=>s.jsx(j,{value:e.id,children:e.name},e.id))})})]})}export{y as T};
