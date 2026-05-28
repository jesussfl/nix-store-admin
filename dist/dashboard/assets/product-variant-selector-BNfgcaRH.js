import{gS as o,iF as i,jb as l,f$ as s,by as m,bA as p,bw as x,w as h,bz as f,V as j,Y as A,_ as V,W as b,X as g,Z as y,de as N,fT as C,dG as P,dy as S}from"./index-B_AGHcrO.js";const k=C(`
        query ProductVariantList($options: ProductVariantListOptions) {
            productVariants(options: $options) {
                items {
                    id
                    name
                    sku
                    featuredAsset {
                        ...Asset
                    }
                    price
                    priceWithTax
                    product {
                        featuredAsset {
                            ...Asset
                        }
                    }
                }
                totalItems
            }
        }
    `,[P]);function q({onProductVariantSelect:r}){const[n,d]=o.useState(""),[c,a]=o.useState(!1),t=i(n,500),{data:u}=l({queryKey:["productVariants",t],staleTime:1e3*60*5,enabled:t.length>0,queryFn:()=>S.query(k,{options:{take:10,filter:{name:{contains:t},sku:{contains:t}},filterOperator:"OR"}})});return s.jsxs(m,{open:c,onOpenChange:a,children:[s.jsxs(p,{render:s.jsx(h,{variant:"outline",role:"combobox",className:"w-full"}),children:["Add item to order",s.jsx(x,{className:"opacity-50"})]}),s.jsx(f,{className:"p-0",children:s.jsxs(j,{shouldFilter:!1,children:[s.jsx(A,{placeholder:"Add item to order...",className:"h-9",onValueChange:e=>d(e)}),s.jsxs(V,{children:[s.jsx(b,{children:"No products found."}),s.jsx(g,{children:u?.productVariants.items.map(e=>s.jsxs(y,{value:e.id,onSelect:()=>{r({productVariantId:e.id,productVariantName:e.name,sku:e.sku,productAsset:e.featuredAsset??e.product.featuredAsset??null,price:e.price,priceWithTax:e.priceWithTax}),a(!1)},className:"flex items-center gap-2 p-2",children:[e.featuredAsset&&s.jsx(N,{asset:e.featuredAsset,preset:"tiny",className:"size-8 rounded-md object-cover"}),s.jsxs("div",{className:"flex flex-col",children:[s.jsx("span",{className:"text-sm font-medium",children:e.name}),s.jsx("span",{className:"text-xs text-muted-foreground",children:e.sku})]})]},e.id))})]})]})})]})}export{q as P};
