import{iZ as r,jb as u,f$ as a,I as d,bc as p,fT as h,dy as m}from"./index-BlS_QcK9.js";const y=h(`
    query channels($options: ChannelListOptions) {
        channels(options: $options) {
            items {
                id
                code
            }
        }
    }
`);function C(n){const{value:t,onChange:o,multiple:l}=n,{_:s}=r(),{data:i}=u({queryKey:["channels"],queryFn:()=>m.query(y,{}),staleTime:1e3*60*5}),c=(i?.channels.items??[]).map(e=>({value:e.id,label:e.code,display:a.jsx(d,{code:e.code})}));return a.jsx(p,{value:t,onChange:o,multiple:l,items:c,placeholder:s({id:"Ce8q3L"}),searchPlaceholder:s({id:"PLeYjq"})})}export{C};
