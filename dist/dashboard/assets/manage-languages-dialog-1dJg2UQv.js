import{iz as Q,j6 as T,jc as I,gS as m,jb as Z,j0 as q,hO as x,dy as L,f$ as e,ah as _,aj as z,am as B,an as V,d8 as s,ak as X,b9 as F,S as y,b4 as N,he as Y,cG as H,I as W,cA as ee,cE as ae,cF as se,cB as ne,cD as te,al as le,w as R,fT as G}from"./index-bw38b3IZ.js";import{u as ie,L as w}from"./language-selector-BGVcVcyN.js";const de=G(`
    query GlobalSettingsLanguages {
        globalSettings {
            id
            availableLanguages
        }
    }
`),oe=G(`
    mutation UpdateGlobalSettingsLanguages($input: UpdateGlobalSettingsInput!) {
        updateGlobalSettings(input: $input) {
            __typename
            ... on GlobalSettings {
                id
                availableLanguages
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
`),re=G(`
    mutation UpdateChannelLanguages($input: UpdateChannelInput!) {
        updateChannel(input: $input) {
            __typename
            ... on Channel {
                id
                code
                defaultLanguageCode
                availableLanguageCodes
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
`);function me({open:g,onClose:j}){const{activeChannel:J}=Q(),{hasPermissions:i}=T(),u=I(),t=J,p=i(["ReadSettings"])||i(["ReadGlobalSettings"]),f=i(["UpdateSettings"])||i(["UpdateGlobalSettings"]),D=i(["ReadChannel"]),c=i(["UpdateChannel"]),[d,E]=m.useState([]),[o,C]=m.useState([]),[r,h]=m.useState(""),b=ie(o||[]),{data:l,isLoading:$,error:k}=Z({queryKey:["globalSettings","languages"],queryFn:()=>L.query(de),enabled:g&&p}),U=q({mutationFn:a=>L.mutate(oe,{input:a}),onSuccess:()=>{u.invalidateQueries({queryKey:["globalSettings"]}),u.invalidateQueries({queryKey:["getServerConfig"]}),x.success("Global language settings updated successfully")},onError:a=>{x.error(`Failed to update global settings: ${a.message}`)}}),O=q({mutationFn:a=>L.mutate(re,{input:a}),onSuccess:()=>{u.invalidateQueries({queryKey:["channels"]}),u.invalidateQueries({queryKey:["activeChannel"]}),x.success("Channel language settings updated successfully")},onError:a=>{x.error(`Failed to update channel settings: ${a.message}`)}});m.useEffect(()=>{g&&l&&E(l.globalSettings.availableLanguages||[]),g&&t&&(C(t.availableLanguageCodes||[]),h(t.defaultLanguageCode||""))},[g,l,t]);const A=a=>{E(a);const n=o.filter(v=>a.includes(v));C(n),a.includes(r)||h(n[0]||"")},K=a=>{C(a),a.includes(r)||h(a[0]||"")},M=async()=>{const a=[];if(f&&l){const n=l.globalSettings.availableLanguages||[];JSON.stringify(n.sort())!==JSON.stringify(d.sort())&&a.push(U.mutateAsync({availableLanguages:d}))}if(c&&t){const n=t.availableLanguageCodes||[],v=t.defaultLanguageCode||"";(JSON.stringify(n.sort())!==JSON.stringify(o.sort())||v!==r)&&a.push(O.mutateAsync({id:t.id,availableLanguageCodes:o,defaultLanguageCode:r}))}try{await Promise.all(a),j()}catch{}},P=()=>{if(l&&f){const a=l.globalSettings.availableLanguages||[];if(JSON.stringify(a.sort())!==JSON.stringify(d.sort()))return!0}if(t&&c){const a=t.availableLanguageCodes||[],n=t.defaultLanguageCode||"";return JSON.stringify(a.sort())!==JSON.stringify(o.sort())||n!==r}return!1},S=U.isPending||O.isPending;return e.jsx(_,{open:g,onOpenChange:j,children:e.jsxs(z,{className:"max-w-2xl max-h-[80vh] overflow-y-auto",children:[e.jsxs(B,{children:[e.jsx(V,{children:e.jsx(s,{id:"+KsEPl"})}),e.jsx(X,{children:e.jsx(s,{id:"TUn15d"})})]}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[e.jsx("h3",{className:"font-semibold",children:e.jsx(s,{id:"wCiE/8"})}),!p&&e.jsx(F,{className:"h-4 w-4 text-muted-foreground"})]}),p?$?e.jsx("div",{className:"text-sm text-muted-foreground",children:e.jsx(s,{id:"cZfFVY"})}):k?e.jsxs("div",{className:"flex items-center gap-2 p-3 bg-destructive/10 rounded-md",children:[e.jsx(y,{className:"h-4 w-4 text-destructive"}),e.jsx("span",{className:"text-sm text-destructive",children:e.jsx(s,{id:"tdu1lo"})})]}):e.jsxs("div",{className:"space-y-2",children:[e.jsx(N,{children:e.jsx(s,{id:"lZ1k+X"})}),e.jsx("div",{className:f?"":"pointer-events-none opacity-50",children:e.jsx(w,{value:d,onChange:A,multiple:!0,availableLanguageCodes:Y})}),e.jsx("p",{className:"text-xs text-muted-foreground",children:e.jsx(s,{id:"zYRRLp"})})]}):e.jsxs("div",{className:"flex items-center gap-2 p-3 bg-muted rounded-md",children:[e.jsx(y,{className:"h-4 w-4 text-muted-foreground"}),e.jsx("span",{className:"text-sm text-muted-foreground",children:e.jsx(s,{id:"yJyG7D"})})]})]}),e.jsx(H,{}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[e.jsxs("h3",{className:"font-semibold",children:[e.jsx(s,{id:"bZmZc2"})," -"," ",e.jsx(W,{code:t?.code})]}),!D&&e.jsx(F,{className:"h-4 w-4 text-muted-foreground"})]}),D?e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(N,{className:"text-sm font-medium",children:e.jsx(s,{id:"pLwWyo"})}),e.jsx("div",{className:c?"":"pointer-events-none opacity-50",children:e.jsx(w,{value:o,onChange:K,multiple:!0,availableLanguageCodes:d})}),d.length===0?e.jsx("p",{className:"text-xs text-muted-foreground",children:e.jsx(s,{id:"j2a7dU"})}):e.jsx("p",{className:"text-xs text-muted-foreground",children:e.jsx(s,{id:"F+Cfi2"})})]}),b.length>0&&e.jsxs("div",{children:[e.jsx(N,{className:"text-sm font-medium mb-2 block",children:e.jsx(s,{id:"TOFdm+"})}),e.jsxs(ee,{items:Object.fromEntries(b.map(({code:a,label:n})=>[a,`${n} (${a.toUpperCase()})`])),value:r,onValueChange:a=>{a!=null&&h(a)},disabled:!c,children:[e.jsx(ae,{className:"w-[200px]",children:e.jsx(se,{placeholder:"Select default language"})}),e.jsx(ne,{children:b.map(({code:a,label:n})=>e.jsxs(te,{value:a,children:[n," (",a.toUpperCase(),")"]},a))})]})]})]}):e.jsxs("div",{className:"flex items-center gap-2 p-3 bg-muted rounded-md",children:[e.jsx(y,{className:"h-4 w-4 text-muted-foreground"}),e.jsx("span",{className:"text-sm text-muted-foreground",children:e.jsx(s,{id:"eB+0qz"})})]})]})]}),e.jsxs(le,{children:[e.jsx(R,{variant:"outline",onClick:j,disabled:S,children:e.jsx(s,{id:"dEgA5A"})}),e.jsx(R,{onClick:M,disabled:!P()||S,children:S?e.jsx(s,{id:"XvjC4F"}):e.jsx(s,{id:"IUwGEM"})})]})]})})}export{me as M};
