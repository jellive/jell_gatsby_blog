"use strict";(()=>{var e={};e.id=662,e.ids=[662],e.modules={3388:e=>{e.exports=require("@as-integrations/next")},4652:e=>{e.exports=require("fs-extra")},1684:e=>{e.exports=require("graphql-tag")},3531:e=>{e.exports=require("gray-matter")},5600:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},3873:e=>{e.exports=require("path")},445:e=>{e.exports=import("@apollo/server")},9332:e=>{e.exports=import("glob")},6762:(e,t)=>{Object.defineProperty(t,"M",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},8269:(e,t,r)=>{r.a(e,async(e,o)=>{try{r.r(t),r.d(t,{config:()=>g,default:()=>d,routeModule:()=>p});var a=r(9947),n=r(2706),i=r(6762),s=r(1386),l=e([s]);s=(l.then?(await l)():l)[0];let d=(0,i.M)(s,"default"),g=(0,i.M)(s,"config"),p=new a.PagesAPIRouteModule({definition:{kind:n.A.PAGES_API,page:"/api/graphql",pathname:"/api/graphql",bundlePath:"",filename:""},userland:s});o()}catch(e){o(e)}})},304:(e,t,r)=>{r.a(e,async(e,o)=>{try{r.d(t,{z:()=>f});var a=r(4652),n=r.n(a),i=r(9332),s=r(3531),l=r.n(s),d=r(3873),g=r.n(d),p=e([i]);async function u(e,t){return e.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,(e,r,o)=>{if(console.log("Processing image path:",{original:o.trim(),postPath:t}),o.trim().startsWith("http"))return e;let a=o.trim().replace(/^\.?\/?(images\/)?/,""),n=t.split("/").slice(0,-1).join("/"),i=`/posts/${n}/images/${a}`;return console.log("Converted path:",i),`![${r}](${i})`})}function c(e){return null!==e&&"string"==typeof e.excerpt&&"string"==typeof e.fields?.slug&&"string"==typeof e.frontmatter?.date&&"string"==typeof e.frontmatter?.title&&Array.isArray(e.frontmatter?.tags)&&"string"==typeof e.rawMarkdownBody}async function f(){let e=g().join(process.cwd(),"_posts");try{if(!await n().pathExists(e))throw Error("_posts directory not found")}catch(e){return console.error("Error accessing _posts directory:",e),[]}let t=await (0,i.glob)("**/*.md",{cwd:e,absolute:!1,ignore:["node_modules/**",".next/**"],nodir:!0,dot:!1});return 0===t.length?(console.warn("No markdown files found in _posts directory"),[]):(await Promise.all(t.map(async t=>{let r=g().join(e,t);try{let e=await n().readFile(r,"utf8"),{data:o,content:a,excerpt:i}=l()(e),s=await u(a,t);return{excerpt:i||"",fields:{slug:t.replace(/\.md$/,"")},frontmatter:{date:function(e){try{return new Date(e).toISOString()}catch(t){return console.error("Date normalization error:",e,t),e}}(o.date),title:o.title,tags:o.tags||[],featuredImage:o.featuredImage||null,category:o.category||null},rawMarkdownBody:s}}catch(e){return console.error(`Error processing file ${r}:`,e),null}}))).filter(c).sort((e,t)=>{let r=new Date(e.frontmatter.date);return new Date(t.frontmatter.date).getTime()-r.getTime()})}i=(p.then?(await p)():p)[0],o()}catch(e){o(e)}})},1386:(e,t,r)=>{r.a(e,async(e,o)=>{try{r.r(t),r.d(t,{default:()=>p});var a=r(445),n=r(3388),i=r(1684),s=r(304),l=e([a,s]);[a,s]=l.then?(await l)():l;let d=(0,i.gql)`
  type PostFields {
    slug: String!
  }

  type PostFrontmatter {
    date: String!
    title: String!
    tags: [String!]!
    featuredImage: String
    category: String
  }

  type Post {
    id: String!
    excerpt(length: Int): String!
    fields: PostFields!
    frontmatter: PostFrontmatter!
    rawMarkdownBody: String!
  }

  type GroupEdge {
    node: Post!
  }

  type Group {
    fieldValue: String!
    totalCount: Int!
    edges: [GroupEdge!]!
  }

  type MarkdownRemark {
    edges: [GroupEdge!]!
    group: [Group!]!
  }

  type Query {
    allMarkdownRemark: MarkdownRemark!
  }
`,g=new a.ApolloServer({typeDefs:d,resolvers:{Query:{allMarkdownRemark:async()=>{try{let e=await (0,s.z)();console.log("Posts loaded:",e.length);let t=e.map(e=>({node:{id:e.fields.slug,excerpt:e.rawMarkdownBody.replace(/!\[.*?\]\(.*?\)/g,"").replace(/<[^>]*>/g,"").replace(/[#*`_~]/g,"").replace(/\n+/g," ").replace(/\s+/g," ").trim().slice(0,300)+"...",fields:e.fields,frontmatter:{...e.frontmatter,date:new Date(e.frontmatter.date).toISOString()},rawMarkdownBody:e.rawMarkdownBody}})),r=e.reduce((e,t)=>(t.frontmatter.tags.forEach(r=>{e[r]||(e[r]={fieldValue:r,totalCount:0,edges:[]}),e[r].totalCount++,e[r].edges.push({node:{id:t.fields.slug,excerpt:t.rawMarkdownBody.slice(0,200),fields:t.fields,frontmatter:{...t.frontmatter,date:new Date(t.frontmatter.date).toISOString()},rawMarkdownBody:t.rawMarkdownBody}})}),e),{}),o={edges:t,group:Object.values(r)};return console.log("GraphQL response:",{edgesCount:t.length,groupCount:Object.keys(r).length,samplePost:t[0]?.node.frontmatter}),o}catch(e){throw console.error("GraphQL resolver error:",e),e}}},Post:{excerpt:(e,t)=>t.length?e.excerpt.slice(0,t.length):e.excerpt}}}),p=(0,n.startServerAndCreateNextHandler)(g);o()}catch(e){o(e)}})},2706:(e,t)=>{Object.defineProperty(t,"A",{enumerable:!0,get:function(){return r}});var r=function(e){return e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE",e.IMAGE="IMAGE",e}({})},9947:(e,t,r)=>{e.exports=r(5600)}};var t=require("../../webpack-api-runtime.js");t.C(e);var r=t(t.s=8269);module.exports=r})();