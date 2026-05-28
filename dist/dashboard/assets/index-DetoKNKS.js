import{f$ as t,bn as f,w as p,bw as D,b5 as w,j1 as I,jc as P,iQ as $,jb as q,dy as c,gS as F,j0 as m,hO as s,bl as E,bq as v,bm as C,dc as Q,bp as S,bo as k,af as A,aX as N,d3 as M,eS as U}from"./index-bw38b3IZ.js";import"./manage-languages-dialog-1dJg2UQv.js";import"./login-form-BH9kYlcU.js";import"./channel-selector-Cb6yO8Gr.js";import"./country-selector-vZGBQEsa.js";import"./customer-address-form-BBiY0HY1.js";import"./customer-selector-DgzOjjDs.js";import"./history-entry-extensions-mhmy4pm6.js";import"./language-selector-BGVcVcyN.js";import"./product-variant-selector-D-QwHoOM.js";import"./role-selector-BAY0QwuG.js";import"./seller-selector-7AdZPghF.js";import"./tax-category-selector-CT9d3TO9.js";import"./zone-selector-D0yzYDDf.js";import{g as d}from"./graphql-Bn_E6zUQ.js";import"./common-operations-BRsvt-G1.js";import"./use-job-queue-polling-bSsVNJx_.js";import{D as B}from"./detail-page-button-BkyejTHS.js";import{F as x}from"./form-field-wrapper-DvvwJwpE.js";import{L as K}from"./list-page-KgajnKML.js";import"./eye-D8w3OQ-u.js";const R=d(`
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
