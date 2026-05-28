import{f$ as t,bn as f,w as p,bw as D,b5 as w,j1 as I,jc as P,iQ as $,jb as q,dy as c,gS as F,j0 as m,hO as s,bl as E,bq as v,bm as C,dc as Q,bp as S,bo as k,af as A,aX as N,d3 as M,eS as U}from"./index-BlS_QcK9.js";import"./manage-languages-dialog-CUd-24eS.js";import"./login-form-C_a8eK0o.js";import"./channel-selector-8zXW9sYj.js";import"./country-selector-yjrc1tCo.js";import"./customer-address-form-sl95KM0L.js";import"./customer-selector-C67GpGim.js";import"./history-entry-extensions-C22XIedX.js";import"./language-selector-e8_-ssqy.js";import"./product-variant-selector-BhFpAzPk.js";import"./role-selector-DMG7_4rk.js";import"./seller-selector-Pb9O_O-y.js";import"./tax-category-selector-Dgd1g9yX.js";import"./zone-selector-DL-XFdb_.js";import{g as d}from"./graphql-DjCmWByT.js";import"./common-operations-BQTlj_Xa.js";import"./use-job-queue-polling-Hftrz-9R.js";import{D as B}from"./detail-page-button-CuXvaS7N.js";import{F as x}from"./form-field-wrapper-DrbKpmKH.js";import{L as K}from"./list-page-DmfrS-fu.js";import"./eye-ByZQopxq.js";const R=d(`
  query LoteList($options: LoteListOptions) {
    allLotes(options: $options) {
      items {
        id
        createdAt
        updatedAt
        name
        description
      }
      totalItems
    }
  }
`),T=d(`
  query LoteDetail($id: ID!) {
    getLote(loteId: $id) {
      id
      createdAt
      updatedAt
      name
      description
    }
  }
`),O=d(`
  mutation CreateLote($input: CreateLoteInput!) {
    createLote(input: $input) {
      id
      name
      description
    }
  }
`),V=d(`
  mutation UpdateLote($id: ID!, $input: UpdateLoteInput!) {
    updateLote(loteId: $id, input: $input) {
      id
      name
      description
    }
  }
`),h=d(`
  mutation DeleteLote($id: ID!) {
    deleteLote(loteId: $id)
  }
`),z={path:"/lotes",navMenuItem:{sectionId:"catalog",id:"lotes",title:"Lotes",url:"/lotes"},loader:()=>({breadcrumb:"Lotes"}),component:n=>t.jsx(K,{pageId:"lote-list",title:"Lotes",listQuery:R,deleteMutation:h,route:n,onSearchTermChange:o=>({name:{contains:o}}),customizeColumns:{name:{cell:({row:o})=>t.jsx(B,{id:o.original.id,label:o.original.name})}},defaultVisibility:{name:!0,description:!0},defaultColumnOrder:["name","description"],defaultSort:[{id:"createdAt",desc:!0}],children:t.jsx(f,{children:t.jsxs(p,{render:t.jsx(w,{to:"./new"}),children:[t.jsx(D,{className:"mr-2 h-4 w-4"}),"Create lote"]})})})},G={path:"/lotes/$id",loader:()=>({breadcrumb:"Lote"}),component:n=>t.jsx(H,{route:n})};function H({route:n}){const o=n.useParams(),r=o.id==="new",L=I(),l=P(),i=$({defaultValues:{name:"",description:""}}),u=q({queryKey:["lote-detail",o.id],queryFn:()=>c.query(T,{id:o.id}),enabled:!r});F.useEffect(()=>{const e=u.data?.getLote;e&&i.reset({name:e.name,description:e.description??""})},[u.data,i]);const g=m({mutationFn:e=>c.mutate(O,{input:e}),onSuccess:async e=>{const a=e.createLote;s.success("Lote created successfully"),i.reset({name:a.name,description:a.description??""}),await l.invalidateQueries({queryKey:["lote-list"]}),await L({to:"/lotes/$id",params:{id:a.id}})},onError:e=>{s.error("Failed to create lote",{description:e instanceof Error?e.message:"Unknown error"})}}),y=m({mutationFn:e=>c.mutate(V,{id:o.id,input:e}),onSuccess:async e=>{const a=e.updateLote;s.success("Lote updated successfully"),i.reset({name:a.name,description:a.description??""}),await l.invalidateQueries({queryKey:["lote-detail",o.id]}),await l.invalidateQueries({queryKey:["lote-list"]})},onError:e=>{s.error("Failed to update lote",{description:e instanceof Error?e.message:"Unknown error"})}}),b=m({mutationFn:()=>c.mutate(h,{id:o.id}),onSuccess:async()=>{s.success("Lote deleted successfully"),await l.invalidateQueries({queryKey:["lote-list"]}),await L({to:"/lotes"})},onError:e=>{s.error("Failed to delete lote",{description:e instanceof Error?e.message:"Unknown error"})}}),j=g.isPending||y.isPending||b.isPending;return t.jsxs(E,{pageId:"lote-detail",form:i,submitHandler:i.handleSubmit(e=>{r?g.mutate(e):y.mutate(e)}),children:[t.jsx(v,{children:r?"New lote":u.data?.getLote?.name??"Lote"}),t.jsx(C,{children:t.jsxs(f,{children:[!r&&t.jsxs(p,{type:"button",variant:"destructive",disabled:j,onClick:()=>b.mutate(),children:[t.jsx(Q,{className:"mr-2 h-4 w-4"}),"Delete"]}),t.jsx(p,{type:"submit",disabled:!i.formState.isDirty||j,children:r?"Create":"Update"})]})}),t.jsx(S,{children:t.jsx(k,{column:"main",blockId:"main-form",title:"Lote details",children:t.jsxs(A,{children:[t.jsx(x,{control:i.control,name:"name",label:"Name",rules:{required:"Name is required"},render:({field:e})=>t.jsx(N,{...e})}),t.jsx(x,{control:i.control,name:"description",label:"Description",render:({field:e})=>t.jsx(M,{...e,value:e.value??""})})]})})})]})}U({routes:[z,G]});
