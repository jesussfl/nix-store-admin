import{ep as S,iZ as b,jb as R,jc as D,j0 as o,dy as t,hO as h,i_ as f,f$ as e,a3 as q,B as d,d8 as a,w as x,aq as A,aB as E,aD as M,ar as v,at as j,bl as C,bq as L,bp as P,aT as I,ac as N,fT as c,eg as Q}from"./index-bw38b3IZ.js";import{P as z}from"./payload-dialog-BwoFoDRU.js";const J=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polygon",{points:"10 8 16 12 10 16 10 8",key:"1cimsy"}]],B=S("CirclePlay",J),F=c(`
    query ScheduledTasks {
        scheduledTasks {
            id
            description
            schedule
            scheduleDescription
            lastExecutedAt
            nextExecutionAt
            isRunning
            lastResult
            enabled
        }
    }
`),K=c(`
    mutation UpdateScheduledTask($input: UpdateScheduledTaskInput!) {
        updateScheduledTask(input: $input) {
            id
            enabled
        }
    }
`),O=c(`
    mutation RunScheduledTask($id: String!) {
        runScheduledTask(id: $id) {
            success
        }
    }
`);function $(){const{_:i}=b(),{data:l}=R({queryKey:["scheduledTasks"],queryFn:()=>t.query(F)}),r=D(),{mutate:p}=o({mutationFn:t.mutate(K),onSuccess:s=>{u()}}),u=()=>{r.invalidateQueries({queryKey:["scheduledTasks"]})},{mutate:m}=o({mutationFn:t.mutate(O),onSuccess:s=>{s.runScheduledTask.success?(h.success(i({id:"96xJ48"})),r.invalidateQueries({queryKey:["scheduledTasks"]})):h.error(i({id:"DzhRjJ"}))}}),{formatDate:g,formatRelativeDate:y}=f(),k={year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"},n=Q(),T=[n.accessor("id",{header:i({id:"S0kLOH"}),cell:({getValue:s})=>e.jsx(q,{value:s(),children:e.jsx("span",{className:"font-mono",children:s()})})}),n.accessor("description",{header:i({id:"Nu4oKW"})}),n.accessor("enabled",{header:i({id:"RxzN1M"}),cell:({row:s})=>s.original.enabled?e.jsx(d,{variant:"success",children:e.jsx(a,{id:"RxzN1M"})}):e.jsx(d,{variant:"secondary",children:e.jsx(a,{id:"E/QGRL"})})}),n.accessor("schedule",{header:i({id:"pIxz4h"})}),n.accessor("scheduleDescription",{header:i({id:"gmB6oO"})}),n.accessor("lastExecutedAt",{header:i({id:"RhpMfE"}),cell:({row:s})=>s.original.lastExecutedAt?e.jsx("div",{title:s.original.lastExecutedAt,children:y(s.original.lastExecutedAt)}):e.jsx(a,{id:"qqeAJM"})}),n.accessor("nextExecutionAt",{header:i({id:"WwKMiy"}),cell:({row:s})=>s.original.nextExecutionAt?g(s.original.nextExecutionAt,k):e.jsx(a,{id:"qqeAJM"})}),n.accessor("isRunning",{header:i({id:"RiQMUh"}),cell:({row:s})=>s.original.isRunning?e.jsx(d,{variant:"success",children:e.jsx(a,{id:"RiQMUh"})}):e.jsx(d,{variant:"secondary",children:e.jsx(a,{id:"LXcUnJ"})})}),n.accessor("lastResult",{header:i({id:"ikhZzI"}),cell:({row:s})=>s.original.lastResult?e.jsx(z,{payload:s.original.lastResult,title:e.jsx(a,{id:"bDEHSp"}),description:e.jsx(a,{id:"swNxZp"}),trigger:e.jsx(x,{size:"sm",variant:"secondary",children:e.jsx(a,{id:"xwytAA"})})}):e.jsx("div",{className:"text-muted-foreground",children:e.jsx(a,{id:"YTKVwL"})})}),n.display({id:"actions",header:i({id:"7L01XJ"}),cell:({row:s})=>e.jsxs(A,{children:[e.jsx(E,{render:e.jsx(x,{variant:"ghost",size:"icon"}),children:e.jsx(M,{})}),e.jsxs(v,{children:[s.original.enabled&&e.jsxs(j,{onClick:()=>m({id:s.original.id}),children:[e.jsx(B,{className:"w-4 h-4"}),e.jsx(a,{id:"3JjdaA"})]}),e.jsx(j,{onClick:()=>p({input:{id:s.original.id,enabled:!s.original.enabled}}),children:s.original.enabled?e.jsx(a,{id:"cO9+2L"}):e.jsx(a,{id:"PaQ3df"})})]})]})})];return e.jsxs(C,{pageId:"scheduled-tasks-list",children:[e.jsx(L,{children:e.jsx(a,{id:"8OiyFS"})}),e.jsx(P,{children:e.jsx(I,{blockId:"list-table",children:e.jsx(N,{onRefresh:u,columns:T,data:l?.scheduledTasks??[],totalItems:l?.scheduledTasks?.length??0,defaultColumnVisibility:{schedule:!1}})})})]})}export{$ as component};
