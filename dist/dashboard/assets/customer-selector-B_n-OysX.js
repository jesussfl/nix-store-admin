import{gS as r,iF as x,jb as p,f$ as e,by as h,bA as f,bw as j,d8 as n,w as N,bz as C,V as y,Y as g,_ as b,W as S,Z as v,fT as O,dy as T}from"./index-B_AGHcrO.js";const q=O(`
    query GetCustomers($options: CustomerListOptions) {
        customers(options: $options) {
            items {
                id
                firstName
                lastName
                emailAddress
            }
            totalItems
        }
    }
`);function w(t){const[i,o]=r.useState(!1),[l,m]=r.useState(""),a=x(l,300),{data:d,isLoading:c}=p({queryKey:["customers",a],queryFn:()=>T.query(q,{options:{sort:{lastName:"ASC"},filter:a?{firstName:{contains:a},lastName:{contains:a},emailAddress:{contains:a}}:void 0,filterOperator:a?"OR":void 0}}),staleTime:1e3*60}),u=s=>{m(s)};return e.jsxs(h,{open:i,onOpenChange:o,children:[e.jsxs(f,{render:e.jsx(N,{variant:"outline",size:"sm",type:"button",disabled:t.readOnly,className:"gap-2"}),children:[e.jsx(j,{className:"h-4 w-4"}),t.label??e.jsx(n,{id:"C0uyNO"})]}),e.jsx(C,{className:"p-0 w-[350px]",align:"start",children:e.jsxs(y,{shouldFilter:!1,children:[e.jsx(g,{placeholder:"Search customers...",onValueChange:u,className:"h-10 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"}),e.jsxs(b,{children:[e.jsx(S,{children:c?e.jsx(n,{id:"Z3FXyt"}):e.jsx(n,{id:"BLXWJv"})}),d?.customers.items.map(s=>e.jsxs(v,{onSelect:()=>{t.onSelect(s),o(!1)},className:"flex flex-col items-start",children:[e.jsxs("div",{className:"font-medium",children:[s.firstName," ",s.lastName]}),e.jsx("div",{className:"text-sm text-muted-foreground",children:s.emailAddress})]},s.id))]})]})})]})}export{w as C};
