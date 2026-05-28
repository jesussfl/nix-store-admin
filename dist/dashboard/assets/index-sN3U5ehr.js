import{f$ as t,bn as x,w as m,bw as h,b5 as D,j1 as w,jc as I,iQ as P,jb as $,dy as l,gS as q,j0 as u,hO as a,bl as F,bq as E,bm as v,dc as C,bp as Q,bo as S,af as k,aX as A,d3 as N,eS as M}from"./index-B_AGHcrO.js";import"./manage-languages-dialog-b5v8KFfc.js";import"./login-form-CGWKU8pd.js";import"./channel-selector-BhAakg5b.js";import"./country-selector-L7X_QzwX.js";import"./customer-address-form-DqNTjNt0.js";import"./customer-selector-B_n-OysX.js";import"./history-entry-extensions-CSeLnUwO.js";import"./language-selector-Bi2fClqt.js";import"./product-variant-selector-BNfgcaRH.js";import"./role-selector-BI12FLyn.js";import"./seller-selector-9E0Wq4BR.js";import"./tax-category-selector-8QoEGXnN.js";import"./zone-selector-Z8GfA6LU.js";import{g as r}from"./graphql-tebVbQuc.js";import"./common-operations-BXXDpXpX.js";import"./use-job-queue-polling-DYnhd83K.js";import{D as U}from"./detail-page-button-CQHcUR3p.js";import{F as j}from"./form-field-wrapper-DKQgEdJJ.js";import{L as B}from"./list-page-YCNcIxPK.js";import"./eye-D_mCSfep.js";const K=r(`
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
`),R=r(`
  query LoteDetail($id: ID!) {
    getLote(loteId: $id) {
      id
      createdAt
      updatedAt
      name
      description
    }
  }
`),T=r(`
  mutation CreateLote($input: CreateLoteInput!) {
    createLote(input: $input) {
      id
      name
      description
    }
  }
`),O=r(`
  mutation UpdateLote($id: ID!, $input: UpdateLoteInput!) {
    updateLote(loteId: $id, input: $input) {
      id
      name
      description
    }
  }
`),f=r(`
  mutation DeleteLote($id: ID!) {
    deleteLote(loteId: $id)
  }
`),V={path:"/lotes",navMenuItem:{sectionId:"catalog",id:"lotes",title:"Lotes",url:"/lotes"},loader:()=>({breadcrumb:"Lotes"}),component:s=>t.jsx(B,{pageId:"lote-list",title:"Lotes",listQuery:K,deleteMutation:f,route:s,onSearchTermChange:o=>({name:{contains:o}}),customizeColumns:{name:{cell:({row:o})=>t.jsx(U,{id:o.original.id,label:o.original.name})}},defaultVisibility:{name:!0,description:!0},defaultColumnOrder:["name","description"],defaultSort:[{id:"createdAt",desc:!0}],children:t.jsx(x,{children:t.jsxs(m,{render:t.jsx(D,{to:"./new"}),children:[t.jsx(h,{className:"mr-2 h-4 w-4"}),"Create lote"]})})})},z={path:"/lotes/$id",loader:()=>({breadcrumb:"Lote"}),component:s=>t.jsx(G,{route:s})};function G({route:s}){const o=s.useParams(),n=o.id==="new",p=w(),d=I(),i=P({defaultValues:{name:"",description:""}}),c=$({queryKey:["lote-detail",o.id],queryFn:()=>l.query(R,{id:o.id}),enabled:!n});q.useEffect(()=>{const e=c.data?.getLote;e&&i.reset({name:e.name,description:e.description??""})},[c.data,i]);const L=u({mutationFn:e=>l.mutate(T,{input:e}),onSuccess:async e=>{a.success("Lote created successfully"),i.reset(e.createLote),await d.invalidateQueries({queryKey:["lote-list"]}),await p({to:"/lotes/$id",params:{id:e.createLote.id}})},onError:e=>{a.error("Failed to create lote",{description:e instanceof Error?e.message:"Unknown error"})}}),g=u({mutationFn:e=>l.mutate(O,{id:o.id,input:e}),onSuccess:async e=>{a.success("Lote updated successfully"),i.reset(e.updateLote),await d.invalidateQueries({queryKey:["lote-detail",o.id]}),await d.invalidateQueries({queryKey:["lote-list"]})},onError:e=>{a.error("Failed to update lote",{description:e instanceof Error?e.message:"Unknown error"})}}),y=u({mutationFn:()=>l.mutate(f,{id:o.id}),onSuccess:async()=>{a.success("Lote deleted successfully"),await d.invalidateQueries({queryKey:["lote-list"]}),await p({to:"/lotes"})},onError:e=>{a.error("Failed to delete lote",{description:e instanceof Error?e.message:"Unknown error"})}}),b=L.isPending||g.isPending||y.isPending;return t.jsxs(F,{pageId:"lote-detail",form:i,submitHandler:i.handleSubmit(e=>{n?L.mutate(e):g.mutate(e)}),children:[t.jsx(E,{children:n?"New lote":c.data?.getLote?.name??"Lote"}),t.jsx(v,{children:t.jsxs(x,{children:[!n&&t.jsxs(m,{type:"button",variant:"destructive",disabled:b,onClick:()=>y.mutate(),children:[t.jsx(C,{className:"mr-2 h-4 w-4"}),"Delete"]}),t.jsx(m,{type:"submit",disabled:!i.formState.isDirty||b,children:n?"Create":"Update"})]})}),t.jsx(Q,{children:t.jsx(S,{column:"main",blockId:"main-form",title:"Lote details",children:t.jsxs(k,{children:[t.jsx(j,{control:i.control,name:"name",label:"Name",rules:{required:"Name is required"},render:({field:e})=>t.jsx(A,{...e})}),t.jsx(j,{control:i.control,name:"description",label:"Description",render:({field:e})=>t.jsx(N,{...e,value:e.value??""})})]})})})]})}M({routes:[V,z]});
