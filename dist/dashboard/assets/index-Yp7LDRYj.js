import{f$ as t,bn as k,w as p,bw as D,b5 as C,B as F,de as b,j1 as $,jc as E,iQ as Q,js as B,jb as I,dy as d,gS as v,eB as K,j0 as f,hO as o,bl as M,bq as R,bm as U,dc as z,bp as V,bo as g,cU as W,aX as m,af as G,d3 as H,cP as X,eS as _}from"./index-B_AGHcrO.js";import"./manage-languages-dialog-b5v8KFfc.js";import"./login-form-CGWKU8pd.js";import"./channel-selector-BhAakg5b.js";import"./country-selector-L7X_QzwX.js";import"./customer-address-form-DqNTjNt0.js";import"./customer-selector-B_n-OysX.js";import"./history-entry-extensions-CSeLnUwO.js";import"./language-selector-Bi2fClqt.js";import"./product-variant-selector-BNfgcaRH.js";import"./role-selector-BI12FLyn.js";import"./seller-selector-9E0Wq4BR.js";import"./tax-category-selector-8QoEGXnN.js";import"./zone-selector-Z8GfA6LU.js";import{g as n}from"./graphql-tebVbQuc.js";import"./common-operations-BXXDpXpX.js";import"./use-job-queue-polling-DYnhd83K.js";import{D as J}from"./detail-page-button-CQHcUR3p.js";import{F as i}from"./form-field-wrapper-DKQgEdJJ.js";import{L as Y}from"./list-page-YCNcIxPK.js";import"./eye-D_mCSfep.js";const Z=n(`
  query StorefrontNewsList($options: StorefrontNewsListOptions) {
    storefrontNewsItems(options: $options) {
      items {
        id
        createdAt
        updatedAt
        title
        summary
        imageAsset {
          id
          name
          preview
        }
        sortOrder
        isPublished
      }
      totalItems
    }
  }
`),ee=n(`
  query StorefrontNewsDetail($id: ID!) {
    getStorefrontNewsItem(newsId: $id) {
      id
      createdAt
      updatedAt
      title
      summary
      imageAsset {
        id
        name
        preview
        source
        mimeType
        fileSize
        width
        height
      }
      ctaText
      ctaLink
      sortOrder
      isPublished
    }
  }
`),te=n(`
  mutation CreateStorefrontNews($input: CreateStorefrontNewsInput!) {
    createStorefrontNewsItem(input: $input) {
      id
      title
      summary
      ctaText
      ctaLink
      sortOrder
      isPublished
      imageAsset {
        id
        name
        preview
      }
    }
  }
`),se=n(`
  mutation UpdateStorefrontNews($id: ID!, $input: UpdateStorefrontNewsInput!) {
    updateStorefrontNewsItem(newsId: $id, input: $input) {
      id
      title
      summary
      ctaText
      ctaLink
      sortOrder
      isPublished
      imageAsset {
        id
        name
        preview
      }
    }
  }
`),q=n(`
  mutation DeleteStorefrontNews($id: ID!) {
    deleteStorefrontNewsItem(newsId: $id)
  }
`),P=n(`
  query AssetsForStorefrontNews($options: AssetListOptions) {
    assets(options: $options) {
      items {
        id
        name
        preview
        source
        mimeType
        fileSize
        width
        height
      }
      totalItems
    }
  }
`),re={path:"/storefront-news",navMenuItem:{sectionId:"marketing",id:"storefront-news",title:"Noticias",url:"/storefront-news"},loader:()=>({breadcrumb:"Noticias"}),component:a=>t.jsx(Y,{pageId:"storefront-news-list",title:"Noticias",listQuery:Z,deleteMutation:q,route:a,onSearchTermChange:r=>({title:{contains:r}}),customizeColumns:{imageAsset:{header:"Imagen",cell:({row:r})=>r.original.imageAsset?t.jsx(b,{src:r.original.imageAsset,alt:r.original.title,preset:"thumb",className:"h-10 w-10 rounded object-cover"}):null},title:{cell:({row:r})=>t.jsx(J,{id:r.original.id,label:r.original.title})},isPublished:{header:"Publicado",cell:({row:r})=>t.jsx(F,{variant:"secondary",children:r.original.isPublished?"Si":"No"})}},facetedFilters:{isPublished:{title:"Publicado",options:[{label:"Si",value:!0},{label:"No",value:!1}]}},defaultVisibility:{imageAsset:!0,title:!0,summary:!0,sortOrder:!0,isPublished:!0},defaultColumnOrder:["imageAsset","title","summary","sortOrder","isPublished"],defaultSort:[{id:"sortOrder",desc:!1}],children:t.jsx(k,{children:t.jsxs(p,{render:t.jsx(C,{to:"./new"}),children:[t.jsx(D,{className:"mr-2 h-4 w-4"}),"Crear noticia"]})})})},ae={path:"/storefront-news/$id",loader:()=>({breadcrumb:"Noticia"}),component:a=>t.jsx(ie,{route:a})};function ie({route:a}){const r=a.useParams(),l=r.id==="new",x=$(),c=E(),s=Q({defaultValues:{title:"",summary:"",imageAssetId:null,ctaText:"",ctaLink:"",sortOrder:0,isPublished:!0}}),h=B({control:s.control,name:"imageAssetId"}),u=I({queryKey:["storefront-news-detail",r.id],queryFn:()=>d.query(ee,{id:r.id}),enabled:!l}),L=I({queryKey:["storefront-news-asset",h],queryFn:()=>d.query(P,{options:{take:1,filter:{id:{eq:h}}}}),enabled:!!h});v.useEffect(()=>{const e=u.data?.getStorefrontNewsItem;e&&s.reset({title:e.title,summary:e.summary,imageAssetId:e.imageAsset?.id??null,ctaText:e.ctaText??"",ctaLink:e.ctaLink??"",sortOrder:e.sortOrder,isPublished:e.isPublished})},[u.data,s]);const T=v.useMemo(()=>K({listQuery:P,idKey:"id",labelKey:"name",placeholder:"Search assets...",buildSearchFilter:e=>({name:{contains:e}}),label:e=>t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx(b,{src:e,alt:e.name,preset:"thumb",className:"h-8 w-8 rounded object-cover"}),t.jsx("span",{children:e.name})]})}),[]),y=f({mutationFn:e=>d.mutate(te,{input:A(e)}),onSuccess:async e=>{o.success("Noticia creada correctamente"),await c.invalidateQueries({queryKey:["storefront-news-list"]}),await x({to:"/storefront-news/$id",params:{id:e.createStorefrontNewsItem.id}})},onError:e=>{o.error("Failed to create noticia",{description:e instanceof Error?e.message:"Unknown error"})}}),N=f({mutationFn:e=>d.mutate(se,{id:r.id,input:A(e)}),onSuccess:async e=>{o.success("Noticia actualizada correctamente"),s.reset({title:e.updateStorefrontNewsItem.title,summary:e.updateStorefrontNewsItem.summary,imageAssetId:e.updateStorefrontNewsItem.imageAsset?.id??null,ctaText:e.updateStorefrontNewsItem.ctaText??"",ctaLink:e.updateStorefrontNewsItem.ctaLink??"",sortOrder:e.updateStorefrontNewsItem.sortOrder,isPublished:e.updateStorefrontNewsItem.isPublished}),await c.invalidateQueries({queryKey:["storefront-news-detail",r.id]}),await c.invalidateQueries({queryKey:["storefront-news-list"]})},onError:e=>{o.error("Failed to update noticia",{description:e instanceof Error?e.message:"Unknown error"})}}),j=f({mutationFn:()=>d.mutate(q,{id:r.id}),onSuccess:async()=>{o.success("Noticia eliminada correctamente"),await c.invalidateQueries({queryKey:["storefront-news-list"]}),await x({to:"/storefront-news"})},onError:e=>{o.error("Failed to delete noticia",{description:e instanceof Error?e.message:"Unknown error"})}}),w=L.data?.assets.items[0]??u.data?.getStorefrontNewsItem?.imageAsset,S=y.isPending||N.isPending||j.isPending;return t.jsxs(M,{pageId:"storefront-news-detail",form:s,submitHandler:s.handleSubmit(e=>{l?y.mutate(e):N.mutate(e)}),children:[t.jsx(R,{children:l?"Nueva noticia":u.data?.getStorefrontNewsItem?.title??"Noticia"}),t.jsx(U,{children:t.jsxs(k,{children:[!l&&t.jsxs(p,{type:"button",variant:"destructive",disabled:S,onClick:()=>j.mutate(),children:[t.jsx(z,{className:"mr-2 h-4 w-4"}),"Delete"]}),t.jsx(p,{type:"submit",disabled:!s.formState.isDirty||S,children:l?"Create":"Update"})]})}),t.jsxs(V,{children:[t.jsx(g,{column:"side",blockId:"publication",title:"Estado",children:t.jsxs("div",{className:"space-y-6",children:[t.jsx(i,{control:s.control,name:"isPublished",label:"Visible en storefront",render:({field:e})=>t.jsx(W,{checked:e.value,onCheckedChange:e.onChange})}),t.jsx(i,{control:s.control,name:"sortOrder",label:"Orden",rules:{required:"Order is required"},render:({field:e})=>t.jsx(m,{type:"number",value:e.value??0,onChange:O=>e.onChange(Number(O.target.value))})})]})}),t.jsxs(g,{column:"main",blockId:"content",title:"Contenido",children:[t.jsxs(G,{children:[t.jsx(i,{control:s.control,name:"title",label:"Titulo",rules:{required:"Title is required"},render:({field:e})=>t.jsx(m,{...e})}),t.jsx(i,{control:s.control,name:"summary",label:"Resumen",rules:{required:"Summary is required"},render:({field:e})=>t.jsx(H,{...e,value:e.value??"",rows:4})}),t.jsx(i,{control:s.control,name:"ctaText",label:"Texto del boton",render:({field:e})=>t.jsx(m,{...e,value:e.value??""})}),t.jsx(i,{control:s.control,name:"ctaLink",label:"Enlace del boton",render:({field:e})=>t.jsx(m,{...e,value:e.value??"",type:"url"})})]}),t.jsx("div",{className:"space-y-6",children:t.jsx(i,{control:s.control,name:"imageAssetId",label:"Imagen",renderFormControl:!1,render:({field:e})=>t.jsx(X,{...e,value:e.value??void 0,config:T,selectorLabel:"Select image"})})})]}),w&&t.jsx(g,{column:"main",blockId:"preview",title:"Vista previa",children:t.jsxs("div",{className:"grid gap-4 md:grid-cols-[180px_1fr]",children:[t.jsx(b,{src:w,alt:s.watch("title")||w.name,preset:"medium",className:"aspect-video w-full rounded object-cover"}),t.jsxs("div",{className:"space-y-2",children:[t.jsx("h3",{className:"text-lg font-medium",children:s.watch("title")}),t.jsx("p",{className:"text-sm text-muted-foreground",children:s.watch("summary")}),s.watch("ctaText")&&t.jsx(p,{type:"button",variant:"secondary",render:t.jsx("a",{href:s.watch("ctaLink")||"#"}),children:s.watch("ctaText")})]})]})})]})]})}function A(a){return{title:a.title,summary:a.summary,imageAssetId:a.imageAssetId||null,ctaText:a.ctaText||null,ctaLink:a.ctaLink||null,sortOrder:Number(a.sortOrder??0),isPublished:!!a.isPublished}}_({routes:[re,ae]});
