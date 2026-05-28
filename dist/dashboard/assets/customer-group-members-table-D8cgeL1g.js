import{gS as a,iZ as x,jc as y,j0 as j,hO as o,bs as A,dy as N,dn as $,f$ as t,br as L,w as P,b5 as T,dm as D,d8 as F,fT as G}from"./index-BlS_QcK9.js";import{C as M}from"./customer-selector-C67GpGim.js";const n=G(`
    query CustomerGroupMemberList($id: ID!, $options: CustomerListOptions) {
        customerGroup(id: $id) {
            customers(options: $options) {
                items {
                    id
                    createdAt
                    updatedAt
                    firstName
                    lastName
                    emailAddress
                }
                totalItems
            }
        }
    }
`);function v({customerGroupId:r,canAddCustomers:u=!0}){const[d,l]=a.useState([]),[m,c]=a.useState(1),[g,p]=a.useState(10),[f,C]=a.useState([]),{_:i}=x(),S=y(),{mutate:b}=j({mutationFn:N.mutate($),onSuccess:()=>{o.success(i({id:"y3tQ/s"})),S.invalidateQueries({queryKey:[A,n]})},onError:()=>{o.error(i({id:"ZlA28n"}))}});return t.jsxs("div",{children:[t.jsx(L,{listQuery:D(n),transformVariables:e=>({...e,id:r}),page:m,itemsPerPage:g,sorting:d,columnFilters:f,onPageChange:(e,s,h)=>{c(s),p(h)},onSortChange:(e,s)=>{l(s)},onFilterChange:(e,s)=>{C(s)},onSearchTermChange:e=>({lastName:{contains:e},emailAddress:{contains:e}}),additionalColumns:{name:{header:"Name",cell:({row:e})=>{const s=`${e.original.firstName} ${e.original.lastName}`;return t.jsx(P,{render:t.jsx(T,{to:"/customers/$id",params:{id:e.original.id}}),variant:"ghost",children:s})}}},defaultColumnOrder:["name","emailAddress"],defaultVisibility:{id:!1,createdAt:!1,updatedAt:!1,firstName:!1,lastName:!1}}),u&&t.jsx(M,{onSelect:e=>{b({customerId:e.id,groupId:r})},label:t.jsx(F,{id:"IswRMs"})})]})}export{v as C};
