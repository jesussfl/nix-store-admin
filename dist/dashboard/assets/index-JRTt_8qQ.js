import{f$ as t,bn as q,w as h,bw as D,b5 as C,B as F,de as x,j1 as $,jc as E,iQ as Q,js as B,jb as I,dy as c,gS as P,eB as K,j0 as f,hO as n,bl as M,bq as R,bm as U,dc as z,bp as V,bo as b,cU as W,aX as p,af as G,d3 as H,cP as X,eS as _}from"./index-BlS_QcK9.js";import"./manage-languages-dialog-CUd-24eS.js";import"./login-form-C_a8eK0o.js";import"./channel-selector-8zXW9sYj.js";import"./country-selector-yjrc1tCo.js";import"./customer-address-form-sl95KM0L.js";import"./customer-selector-C67GpGim.js";import"./history-entry-extensions-C22XIedX.js";import"./language-selector-e8_-ssqy.js";import"./product-variant-selector-BhFpAzPk.js";import"./role-selector-DMG7_4rk.js";import"./seller-selector-Pb9O_O-y.js";import"./tax-category-selector-Dgd1g9yX.js";import"./zone-selector-DL-XFdb_.js";import{g as l}from"./graphql-DjCmWByT.js";import"./common-operations-BQTlj_Xa.js";import"./use-job-queue-polling-Hftrz-9R.js";import{D as J}from"./detail-page-button-CuXvaS7N.js";import{F as o}from"./form-field-wrapper-DrbKpmKH.js";import{L as Y}from"./list-page-DmfrS-fu.js";import"./eye-ByZQopxq.js";const Z=l(`
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
`),ee=l(`
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
`),te=l(`
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
`),se=l(`
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
`),L=l(`
  mutation DeleteStorefrontNews($id: ID!) {
    deleteStorefrontNewsItem(newsId: $id)
  }
`),A=l(`
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
`),re={path:"/storefront-news",navMenuItem:{sectionId:"marketing",id:"storefront-news",title:"Noticias",url:"/storefront-news"},loader:()=>({breadcrumb:"Noticias"}),component:a=>t.jsx(Y,{pageId:"storefront-news-list",title:"Noticias",listQuery:Z,deleteMutation:L,route:a,onSearchTermChange:r=>({title:{contains:r}}),customizeColumns:{imageAsset:{header:"Imagen",cell:({row:r})=>r.original.imageAsset?t.jsx(x,{asset:r.original.imageAsset,alt:r.original.title,preset:"thumb",className:"h-10 w-10 rounded object-cover"}):null},title:{cell:({row:r})=>t.jsx(J,{id:r.original.id,label:r.original.title})},isPublished:{header:"Publicado",cell:({row:r})=>t.jsx(F,{variant:"secondary",children:r.original.isPublished?"Si":"No"})}},facetedFilters:{isPublished:{title:"Publicado",options:[{label:"Si",value:!0},{label:"No",value:!1}]}},defaultVisibility:{imageAsset:!0,title:!0,summary:!0,sortOrder:!0,isPublished:!0},defaultColumnOrder:["imageAsset","title","summary","sortOrder","isPublished"],defaultSort:[{id:"sortOrder",desc:!1}],children:t.jsx(q,{children:t.jsxs(h,{render:t.jsx(C,{to:"./new"}),children:[t.jsx(D,{className:"mr-2 h-4 w-4"}),"Crear noticia"]})})})},ae={path:"/storefront-news/$id",loader:()=>({breadcrumb:"Noticia"}),component:a=>t.jsx(ie,{route:a})};function ie({route:a}){const r=a.useParams(),d=r.id==="new",y=$(),u=E(),s=Q({defaultValues:{title:"",summary:"",imageAssetId:null,ctaText:"",ctaLink:"",sortOrder:0,isPublished:!0}}),g=B({control:s.control,name:"imageAssetId"}),m=I({queryKey:["storefront-news-detail",r.id],queryFn:()=>c.query(ee,{id:r.id}),enabled:!d}),T=I({queryKey:["storefront-news-asset",g],queryFn:()=>c.query(A,{options:{take:1,filter:{id:{eq:g}}}}),enabled:!!g});P.useEffect(()=>{const e=m.data?.getStorefrontNewsItem;e&&s.reset({title:e.title,summary:e.summary,imageAssetId:e.imageAsset?.id??null,ctaText:e.ctaText??"",ctaLink:e.ctaLink??"",sortOrder:e.sortOrder,isPublished:e.isPublished})},[m.data,s]);const O=P.useMemo(()=>K({listQuery:A,idKey:"id",labelKey:"name",placeholder:"Search assets...",buildSearchFilter:e=>({name:{contains:e}}),label:e=>t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx(x,{asset:e,alt:e.name,preset:"thumb",className:"h-8 w-8 rounded object-cover"}),t.jsx("span",{children:e.name})]})}),[]),j=f({mutationFn:e=>c.mutate(te,{input:k(e)}),onSuccess:async e=>{const i=e.createStorefrontNewsItem;n.success("Noticia creada correctamente"),await u.invalidateQueries({queryKey:["storefront-news-list"]}),await y({to:"/storefront-news/$id",params:{id:i.id}})},onError:e=>{n.error("Failed to create noticia",{description:e instanceof Error?e.message:"Unknown error"})}}),N=f({mutationFn:e=>c.mutate(se,{id:r.id,input:k(e)}),onSuccess:async e=>{const i=e.updateStorefrontNewsItem;n.success("Noticia actualizada correctamente"),s.reset({title:i.title,summary:i.summary,imageAssetId:i.imageAsset?.id??null,ctaText:i.ctaText??"",ctaLink:i.ctaLink??"",sortOrder:i.sortOrder,isPublished:i.isPublished}),await u.invalidateQueries({queryKey:["storefront-news-detail",r.id]}),await u.invalidateQueries({queryKey:["storefront-news-list"]})},onError:e=>{n.error("Failed to update noticia",{description:e instanceof Error?e.message:"Unknown error"})}}),S=f({mutationFn:()=>c.mutate(L,{id:r.id}),onSuccess:async()=>{n.success("Noticia eliminada correctamente"),await u.invalidateQueries({queryKey:["storefront-news-list"]}),await y({to:"/storefront-news"})},onError:e=>{n.error("Failed to delete noticia",{description:e instanceof Error?e.message:"Unknown error"})}}),w=T.data?.assets.items[0]??m.data?.getStorefrontNewsItem?.imageAsset,v=j.isPending||N.isPending||S.isPending;return t.jsxs(M,{pageId:"storefront-news-detail",form:s,submitHandler:s.handleSubmit(e=>{d?j.mutate(e):N.mutate(e)}),children:[t.jsx(R,{children:d?"Nueva noticia":m.data?.getStorefrontNewsItem?.title??"Noticia"}),t.jsx(U,{children:t.jsxs(q,{children:[!d&&t.jsxs(h,{type:"button",variant:"destructive",disabled:v,onClick:()=>S.mutate(),children:[t.jsx(z,{className:"mr-2 h-4 w-4"}),"Delete"]}),t.jsx(h,{type:"submit",disabled:!s.formState.isDirty||v,children:d?"Create":"Update"})]})}),t.jsxs(V,{children:[t.jsx(b,{column:"side",blockId:"publication",title:"Estado",children:t.jsxs("div",{className:"space-y-6",children:[t.jsx(o,{control:s.control,name:"isPublished",label:"Visible en storefront",render:({field:e})=>t.jsx(W,{checked:e.value,onCheckedChange:e.onChange})}),t.jsx(o,{control:s.control,name:"sortOrder",label:"Orden",rules:{required:"Order is required"},render:({field:e})=>t.jsx(p,{type:"number",value:e.value??0,onChange:i=>e.onChange(Number(i.target.value))})})]})}),t.jsxs(b,{column:"main",blockId:"content",title:"Contenido",children:[t.jsxs(G,{children:[t.jsx(o,{control:s.control,name:"title",label:"Titulo",rules:{required:"Title is required"},render:({field:e})=>t.jsx(p,{...e})}),t.jsx(o,{control:s.control,name:"summary",label:"Resumen",rules:{required:"Summary is required"},render:({field:e})=>t.jsx(H,{...e,value:e.value??"",rows:4})}),t.jsx(o,{control:s.control,name:"ctaText",label:"Texto del boton",render:({field:e})=>t.jsx(p,{...e,value:e.value??""})}),t.jsx(o,{control:s.control,name:"ctaLink",label:"Enlace del boton",render:({field:e})=>t.jsx(p,{...e,value:e.value??"",type:"url"})})]}),t.jsx("div",{className:"space-y-6",children:t.jsx(o,{control:s.control,name:"imageAssetId",label:"Imagen",renderFormControl:!1,render:({field:e})=>t.jsx(X,{...e,value:e.value??void 0,config:O,selectorLabel:"Select image"})})})]}),w&&t.jsx(b,{column:"main",blockId:"preview",title:"Vista previa",children:t.jsxs("div",{className:"grid gap-4 md:grid-cols-[180px_1fr]",children:[t.jsx(x,{asset:w,alt:s.watch("title")||w.name,preset:"medium",className:"aspect-video w-full rounded object-cover"}),t.jsxs("div",{className:"space-y-2",children:[t.jsx("h3",{className:"text-lg font-medium",children:s.watch("title")}),t.jsx("p",{className:"text-sm text-muted-foreground",children:s.watch("summary")}),s.watch("ctaText")&&t.jsx(h,{type:"button",variant:"secondary",render:t.jsx("a",{href:s.watch("ctaLink")||"#"}),children:s.watch("ctaText")})]})]})})]})]})}function k(a){return{title:a.title,summary:a.summary,imageAssetId:a.imageAssetId||null,ctaText:a.ctaText||null,ctaLink:a.ctaLink||null,sortOrder:Number(a.sortOrder??0),isPublished:!!a.isPublished}}_({routes:[re,ae]});
