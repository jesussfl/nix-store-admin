import{gS as r,jb as u,f$ as e,by as x,bA as h,bw as p,d8 as n,w as j,bz as f,V as y,cz as C,Y as g,_ as b,W as S,Z as v,fT as N,dy as q}from"./index-B_AGHcrO.js";const w=N(`
    query CountryList($options: CountryListOptions) {
        countries(options: $options) {
            items {
                id
                name
                code
            }
            totalItems
        }
    }
`);function T(t){const[i,o]=r.useState(!1),[a,l]=r.useState(""),{data:c,isLoading:d}=u({queryKey:["countries",a],queryFn:()=>q.query(w,{options:{sort:{name:"ASC"},filter:a?{name:{contains:a},code:{contains:a}}:void 0,filterOperator:a?"OR":void 0}}),staleTime:1e3*60*60}),m=s=>{l(s)};return e.jsxs(x,{open:i,onOpenChange:o,children:[e.jsxs(h,{render:e.jsx(j,{variant:"outline",size:"sm",type:"button",disabled:t.readOnly,className:"gap-2"}),children:[e.jsx(p,{className:"h-4 w-4"}),t.label??e.jsx(n,{id:"hJmVtD"})]}),e.jsx(f,{className:"p-0 w-[350px]",align:"start",children:e.jsxs(y,{shouldFilter:!1,children:[e.jsxs("div",{className:"flex items-center border-b px-3",children:[e.jsx(C,{className:"mr-2 h-4 w-4 shrink-0 opacity-50"}),e.jsx(g,{placeholder:"Search countries...",onValueChange:m,className:"h-10 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"})]}),e.jsxs(b,{children:[e.jsx(S,{children:d?e.jsx(n,{id:"Z3FXyt"}):e.jsx(n,{id:"Bj9qwi"})}),c?.countries.items.map(s=>e.jsxs(v,{onSelect:()=>{t.onSelect(s),o(!1)},className:"flex flex-col items-start",children:[e.jsx("div",{className:"font-medium",children:s.name}),e.jsx("div",{className:"text-sm text-muted-foreground",children:s.code})]},s.id))]})]})})]})}export{T as C};
